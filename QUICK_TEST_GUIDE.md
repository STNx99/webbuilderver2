# Yjs Update Fix - Quick Test Guide

## 30-Second Verification

### Setup
1. Start your local server and realtime WebSocket server
2. Open editor in Chrome/Firefox
3. Open same page in **two browser tabs** (Tab A and Tab B)

### Test
1. **Tab A**: Add a new Section element (drag from sidebar)
2. **Tab B**: Watch for element to appear within 1-2 seconds
3. **Tab A Console**: Look for these logs:
   ```
   [useYjsCollab] ElementStore callback: updating Yjs doc with X elements
   [YjsProvider] 📤 Sending update with X elements to server
   ```
4. **Tab B Console**: Look for these logs:
   ```
   [YjsProvider] 📥 Processing update from other client
   [useYjsCollab] handleUpdate received X elements
   ```

**✅ If you see both sets of logs and element appears in Tab B → FIX IS WORKING**

---

## Full Test Sequence (5 minutes)

### 1. Initial Connection Check
```
Tab A: Open editor
Tab B: Open same page
```
**Expected Console Logs:**
- `[YjsProvider] ✅ WebSocket opened`
- `[YjsProvider] ✅ Received SYNC message with N elements`
- Both tabs should show same elements

### 2. Add Element Test
```
Tab A: Drag a Section from sidebar
```
**Expected:**
- Element appears in Tab A immediately
- Tab B updates within 1-2 seconds
- Console shows callback and send logs

### 3. Edit Properties Test
```
Tab A: Change element text/color/size
```
**Expected:**
- Changes visible in Tab A instantly
- Tab B shows changes within 1-2 seconds
- Same console logs as Test 2

### 4. Delete Element Test
```
Tab A: Right-click element → Delete
```
**Expected:**
- Element disappears from Tab A
- Element disappears from Tab B within 1-2 seconds
- Console shows update logs

### 5. Multiple Elements Test
```
Tab A: Add 3-5 elements rapidly
```
**Expected:**
- All elements appear in Tab B
- None are dropped
- No infinite loops

### 6. Undo/Redo Test
```
Tab A: Make change, then Ctrl+Z (Cmd+Z on Mac)
```
**Expected:**
- Element/change reverts in Tab A
- Tab B reverts within 1-2 seconds

---

## Console Log Cheat Sheet

### ✅ Good Signs (Working)
```
[useYjsCollab] ElementStore callback: updating Yjs doc with X elements
[YjsProvider] 📤 Sending update with X elements to server
[YjsProvider] 📥 Processing update from other client
[useYjsCollab] handleUpdate received X elements
```

### ❌ Bad Signs (Not Working)
```
No ElementStore callback logs when editing
No 📤 Sending update logs
No 📥 Processing update logs on receiving tab
```

### ⚠️ Warning Signs (Investigating)
```
[YjsProvider] Skipping update - not synced yet
[YjsProvider] Skipping update - remote update in progress
[YjsProvider] Skipping update - empty elements
```
These are usually temporary and normal. If persistent, check WebSocket connection.

---

## Debugging Checklist

If updates aren't syncing, check these in order:

### 1. WebSocket Connected?
```javascript
// In browser console
// Look for logs:
[YjsProvider] ✅ WebSocket opened
// If not present, server isn't responding
```

### 2. Initial Sync Received?
```javascript
// Look for:
[YjsProvider] ✅ Received SYNC message with N elements
// If not present, wait 2-3 seconds or check server
```

### 3. EditCallback Connected?
```javascript
// Make an edit, look for:
[useYjsCollab] ElementStore callback: updating Yjs doc
// If not present, connection effect didn't run
// Check if roomId is valid
// Check if provider initialized
```

### 4. Update Sent?
```javascript
// Look for:
[YjsProvider] 📤 Sending update with X elements to server
// If not present, handleDocUpdate skipped
// Check origin value (should be "elementStore")
```

### 5. Remote Received?
```javascript
// On other tab, look for:
[YjsProvider] 📥 Processing update from other client
// If not present, server didn't forward
// Check server logs
```

---

## Common Issues & Quick Fixes

| Issue | Console Logs | Fix |
|-------|--------------|-----|
| Elements don't sync | No callback logs | Wait for sync, check roomId |
| Infinite loops | Messages keep repeating | Check origin checking in provider |
| Very slow updates | Logs appear but delayed | Check network, IndexedDB |
| Empty state after sync | "empty elements" log | Check initial sync message |
| Only first client sees changes | No remote 📥 logs | Check server forwarding |

---

## Enable Debug Mode (Advanced)

For more detailed diagnostics:

### 1. Modify Hook Call
```typescript
const collab = useYjsCollab({
  roomId: pageId,
  enableDebug: true,  // ← Add this line
});
```

### 2. Use Debug Tools
```javascript
// In browser console after enabling debug mode:
yjsDebug.printDebugReport()          // Full report
yjsDebug.testUpdateFlow()             // Test pipeline
yjsDebug.getUpdateStats()             // Update frequency
yjsDebug.getDebugInfo()               // Current state
```

### 3. Interpret Output
- **docState.elementsCount** should match your editor
- **providerState.synched** should be true
- **providerState.connected** should be true
- **updateHistory** should show recent changes

---

## What Was Fixed

### Before
- Edit element → No update to other clients ❌
- Only initial sync worked ❌
- WebSocket silent after connection ❌

### After
- Edit element → Instant sync to other clients ✅
- All edits work real-time ✅
- WebSocket sends updates for every change ✅

### Why
- Connected ElementStore callback to Yjs provider
- Fixed origin tracking for updates
- Ensured local edits trigger WebSocket sends

---

## Files Modified

1. **`src/hooks/realtime/use-yjs-collab.ts`**
   - Connected ElementStore callback (line ~350)
   - Removed old debouncing logic
   - Added debug support

2. **`src/lib/yjs/yjs-provider.ts`**
   - Fixed origin checking (line ~426)
   - Added consistent origin markers
   - Better logging

3. **`src/lib/yjs/yjs-debug-utils.ts`** (NEW)
   - Debugging utilities
   - Update monitoring
   - Performance stats

---

## Success Criteria

✅ **Fix is working if:**
- [ ] Two tabs open same page
- [ ] Edit in Tab A appears in Tab B within 2 seconds
- [ ] Console shows ElementStore callback logs
- [ ] Console shows send/receive update logs
- [ ] No errors in browser console
- [ ] Works for add, edit, and delete operations

✅ **Ready for production if:**
- [ ] All above tests pass
- [ ] Tested with 10+ simultaneous edits
- [ ] Tested reconnection (kill network, restore)
- [ ] Tested with empty initial state
- [ ] Server logs show forwarding messages
- [ ] No performance degradation

---

## Next Steps

1. **Test Now**: Open two tabs and follow "30-Second Verification"
2. **Debug if Needed**: Check console logs against "Console Log Cheat Sheet"
3. **Run Full Test**: Go through "Full Test Sequence" if basic test works
4. **Enable Monitoring**: Use debug mode if seeing unexpected behavior
5. **Deploy**: Once all tests pass, deploy to staging then production

---

## Support

If still having issues:

1. Check `YJS_UPDATE_FIX.md` for detailed technical explanation
2. Check `YJS_UPDATE_PIPELINE_FIX.md` for comprehensive guide
3. Check `WEBSOCKET_TROUBLESHOOTING.md` for connection issues
4. Review server logs for message handling errors
5. Check browser DevTools Network tab for WebSocket messages
