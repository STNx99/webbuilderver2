# Yjs Migration Testing Guide

## Overview

You've successfully migrated from `use-collab-v2` to a Yjs-based implementation with `use-yjs-collab`. This guide helps you test and verify the migration is working correctly.

## Quick Testing Checklist

### 1. Connection & Sync
- [ ] Open editor, check console for `[useYjsCollab] Initializing for room: <roomId>`
- [ ] Wait for `[useYjsCollab] Provider synced: true`
- [ ] Verify toast shows "Live collaboration connected"
- [ ] Check Network tab > WebSocket: connection shows as `101 Switching Protocols`

### 2. Element Loading
- [ ] Verify elements load from server: `[useYjsCollab] handleSync received X elements`
- [ ] Elements appear in editor canvas
- [ ] IndexedDB cache works: `[useYjsCollab] IndexedDB synced`
- [ ] Closing and reopening editor still shows elements (from cache)

### 3. Element Updates (Local → Server)
- [ ] Edit an element (move, resize, change text)
- [ ] Check console: `[useYjsCollab] Sending update with X elements`
- [ ] Verify update debounced (not spamming, roughly 300ms)
- [ ] In Network tab, see WebSocket message with updated elements

### 4. Multi-User Collaboration
- [ ] Open editor in TWO browser tabs/windows
- [ ] Edit element in Tab 1
- [ ] Verify Tab 2 receives update: `[useYjsCollab] handleUpdate received X elements`
- [ ] Element updates appear in Tab 2 within ~500ms
- [ ] No infinite loops or spam in console

### 5. Mouse Tracking & Selection
- [ ] Move mouse over elements in Tab 1
- [ ] Check if Tab 2 shows remote cursor (depends on UI implementation)
- [ ] Select element in Tab 1
- [ ] Tab 2 should show selection from other user

### 6. Offline Mode
- [ ] Stop WebSocket server or disconnect WiFi
- [ ] Try to edit elements - should still work locally
- [ ] Check console for reconnect attempts
- [ ] Restore connection - elements should sync

### 7. Provider Status Changes
Watch console for these logs in sequence:

```
[useYjsCollab] Initializing for room: <roomId>
[YjsProvider] Attempting connection to: <wsUrl>
[useYjsCollab] Provider status: connecting
[useYjsCollab] Provider status: connected
[useYjsCollab] Provider synced: true
[useYjsCollab] handleSync received X elements
```

## Common Issues & Solutions

### Issue: Connection Spam (Reconnecting Every 3 Seconds)

**Cause**: useEffect dependencies triggering recreation

**Check**:
```javascript
// Console logs show repeated:
[YjsProvider] Attempting connection to: <wsUrl>
[useYjsCollab] Cleaning up
```

**Fix**: Dependencies are now stable. Should not happen.

**If still occurs**:
- Check browser console for errors
- Verify `roomId` is not changing
- Ensure `getToken()` returns a valid token

### Issue: Elements Not Loading

**Cause**: Sync message not received or parsing failed

**Check logs**:
- [ ] `[useYjsCollab] Provider synced: true` appears?
- [ ] `[useYjsCollab] handleSync received` with > 0 elements?
- [ ] Any parse errors in console?

**Debug**:
```javascript
// In browser console
const provider = window.__yjs_provider; // if you expose it
const ydoc = provider?.doc;
const elementsText = ydoc?.getText("elementsJson");
console.log("Elements from Yjs:", elementsText?.toString());
```

### Issue: Elements Not Syncing to Other Users

**Cause**: Update message not being sent or received

**Check logs**:
- [ ] `[useYjsCollab] Sending update with` appears when you edit?
- [ ] Debounce working (not every keystroke, batched)?
- [ ] Network tab shows WebSocket message with type "update"?

**Test**:
1. Tab 1: Edit element
2. Check console in Tab 1: `[useYjsCollab] Sending update`
3. Check console in Tab 2: `[useYjsCollab] handleUpdate received`
4. If Tab 2 doesn't see update, check server logs

### Issue: Debouncing Not Working

**Symptoms**: Console shows `[useYjsCollab] Sending update` on every keystroke

**Check**: Default debounce is 300ms, throttle is 500ms

**Test rapid edits**:
```javascript
// Should batch updates, not send 10 per second
// Wait 300ms after last edit to see update sent
```

**Solution**: If throttle too aggressive, adjust in useEditor call:
```typescript
const collab = useYjsCollab({
  roomId: pageId || "",
  // ... other options
  debounceMs: 200,  // Reduce to 200ms
  throttleMs: 300,  // Reduce to 300ms
});
```

## Performance Monitoring

### Network Activity
In DevTools Network tab, filter by WebSocket:

**Good pattern**:
- Initial connection
- Single "sync" message with all elements
- Updates batched every 300ms (not continuous)
- Mouse/selection updates less frequent

**Bad pattern**:
- Repeated connection/disconnection
- Thousands of update messages
- Messages with empty elements array

### Memory Usage
- Yjs adds ~2-5MB for typical documents
- IndexedDB cache adds data size to storage
- Monitor in DevTools > Memory

### CPU Usage
- Should be minimal when idle
- Spike when receiving updates (expected)
- Watch for excessive re-renders (React DevTools Profiler)

## Testing Multi-User Scenarios

### Scenario 1: Simultaneous Edits
1. Tab 1 & 2 open same document
2. Both start editing different elements
3. Expected: Both changes merge correctly, no data loss
4. Check: No console errors about invalid state

### Scenario 2: Rapid Updates
1. Tab 1: Move element, resize, rotate, change text rapidly
2. Expected: Tab 2 shows smooth updates, not jumpy
3. Check: Debouncing working (batched updates)

### Scenario 3: Network Interruption
1. Tab 1: Make edits
2. Kill network (dev tools > Network > Offline)
3. Continue editing (should work offline)
4. Restore network
5. Expected: Changes sync when reconnected

### Scenario 4: Browser Tab Visibility
1. Tab 1: Making edits, visible
2. Tab 2: Same document, switch to invisible
3. Switch Tab 2 back to visible
4. Expected: Updates still sync correctly

## Benchmarking

### Baseline Metrics to Capture

Run these tests and note baseline:

```
Time to sync after connection: ______ms
Time to receive remote update: ______ms  
Memory usage on load: ______MB
Update frequency (edits/sec): ______
```

Compare after optimization.

### Load Testing

Test with larger documents:

```javascript
// Approximate element counts
- Small: 10-50 elements
- Medium: 50-200 elements
- Large: 200-500 elements
- Huge: 500+ elements

// For each, test:
// - Time to initial sync
// - Update latency
// - Memory usage
// - CPU during sync
```

## Browser DevTools Tricks

### Monitor Yjs Document
```javascript
// In console, watch Yjs document
const ydoc = provider.doc;
ydoc.on("update", () => {
  console.log("Yjs update fired");
  console.log("Elements:", ydoc.getText("elementsJson").toString());
});
```

### Watch Network Messages
```javascript
// In console, log all WebSocket messages
const originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
  console.log("Sending:", JSON.parse(data));
  return originalSend.call(this, data);
};
```

### Profile Sync Performance
```javascript
// Measure sync time
console.time("sync");
provider.on("synced", () => {
  console.timeEnd("sync");
});
```

## Regression Testing

After migration production for first 24 hours
4. Gather metrics on real usage
5. Optimize if needed based on data
6. Document any custom tweaks made
