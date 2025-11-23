# Reconnection Guide - Yjs V2 Collaboration

## Overview

The Yjs V2 provider includes comprehensive reconnection handling for scenarios where:
- Server disconnects idle users after inactivity
- Network connection drops temporarily
- User manually triggers reconnection
- WebSocket connection closes unexpectedly

## Reconnection Features

### 1. Automatic Reconnection

The provider automatically attempts to reconnect when the WebSocket connection drops:

```typescript
// Built-in exponential backoff
- 1st attempt: 3 seconds
- 2nd attempt: 6 seconds
- 3rd attempt: 12 seconds
- ...
- Max interval: 30 seconds
```

The reconnection happens automatically without user intervention.

### 2. Manual Reconnection

Trigger reconnection manually from your UI:

```typescript
const { reconnect, isConnected } = useYjsCollabV2({
  pageId: "page-123",
  projectId: "project-456",
  // ... other options
});

// Manually reconnect
const handleReconnect = async () => {
  try {
    await reconnect();
    console.log("Reconnected successfully");
  } catch (err) {
    console.error("Failed to reconnect:", err);
  }
};
```

### 3. Connection Status Callbacks

Monitor connection status changes with callbacks:

```typescript
const { isConnected, roomState } = useYjsCollabV2({
  pageId: "page-123",
  projectId: "project-456",
  
  // Called when connection is established or re-established
  onReconnect: () => {
    console.log("Reconnected to collaboration session");
    showNotification("Back online", "success");
  },
  
  // Called when connection is lost
  onDisconnect: () => {
    console.log("Disconnected from collaboration session");
    showNotification("Connection lost", "warning");
  },
  
  // Other callbacks
  onSync: () => {
    console.log("Initial sync complete");
  },
  
  onError: (error) => {
    console.error("Collaboration error:", error);
    showNotification(error.message, "error");
  },
});
```

## Usage Examples

### Example 1: Reconnect Button

```typescript
import { useYjsCollabV2 } from "@/hooks/realtime/use-yjs-collab-v2";

export function EditorWithReconnect() {
  const { 
    isConnected, 
    roomState, 
    reconnect,
    error 
  } = useYjsCollabV2({
    pageId: "page-123",
    projectId: "project-456",
    onDisconnect: () => {
      console.log("Lost connection");
    },
  });

  return (
    <div>
      <div className="status">
        {isConnected ? (
          <span className="connected">✓ Connected</span>
        ) : (
          <span className="disconnected">✗ Disconnected</span>
        )}
      </div>

      {!isConnected && error && (
        <div className="error-message">
          {error}
          <button onClick={() => reconnect()}>Retry</button>
        </div>
      )}

      <div className="editor">
        {/* Editor content */}
      </div>
    </div>
  );
}
```

### Example 2: Auto-Reconnect UI

```typescript
import { useEffect, useState } from "react";
import { useYjsCollabV2 } from "@/hooks/realtime/use-yjs-collab-v2";

export function EditorWithAutoReconnect() {
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [showReconnectMessage, setShowReconnectMessage] = useState(false);

  const { 
    isConnected, 
    reconnect,
    onDisconnect = () => {},
    onReconnect = () => {},
  } = useYjsCollabV2({
    pageId: "page-123",
    projectId: "project-456",
    
    onDisconnect: () => {
      setShowReconnectMessage(true);
      setReconnectAttempt(0);
    },
    
    onReconnect: () => {
      setShowReconnectMessage(false);
      setReconnectAttempt(0);
    },
    
    onError: (error) => {
      console.error("Collab error:", error);
    },
  });

  useEffect(() => {
    if (!isConnected && showReconnectMessage) {
      const timer = setTimeout(async () => {
        try {
          setReconnectAttempt((prev) => prev + 1);
          await reconnect();
        } catch (err) {
          console.error("Reconnect failed, will retry...");
        }
      }, 3000 * (reconnectAttempt + 1)); // Exponential backoff display

      return () => clearTimeout(timer);
    }
  }, [isConnected, showReconnectMessage, reconnectAttempt]);

  return (
    <div>
      {showReconnectMessage && (
        <div className="reconnect-banner">
          <p>Connection lost. Attempting to reconnect...</p>
          {reconnectAttempt > 0 && <p>Attempt {reconnectAttempt}</p>}
        </div>
      )}

      <div className="editor">
        {/* Editor content */}
      </div>
    </div>
  );
}
```

### Example 3: Provider-Level Status

```typescript
import { useYjsCollabV2 } from "@/hooks/realtime/use-yjs-collab-v2";

export function CollaborationStatus() {
  const { 
    isConnected, 
    isSynced, 
    roomState, 
    provider,
    error 
  } = useYjsCollabV2({
    pageId: "page-123",
    projectId: "project-456",
  });

  // Check provider connection status directly
  const providerConnected = provider?.isConnected?.();
  const providerSynced = provider?.isSynced?.();

  return (
    <div className="status-panel">
      <div>
        <strong>Room State:</strong> {roomState}
      </div>
      <div>
        <strong>Is Connected:</strong> {isConnected ? "Yes" : "No"}
      </div>
      <div>
        <strong>Is Synced:</strong> {isSynced ? "Yes" : "No"}
      </div>
      <div>
        <strong>Provider Connected:</strong> {providerConnected ? "Yes" : "No"}
      </div>
      <div>
        <strong>Provider Synced:</strong> {providerSynced ? "Yes" : "No"}
      </div>
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
```

## Reconnection Flow

```
User Session
    ↓
Server idle timeout / Network drop / Manual disconnect
    ↓
Automatic Reconnection Starts
    ├─ Attempt 1 (3s delay)
    ├─ Attempt 2 (6s delay)
    ├─ Attempt 3 (12s delay)
    ├─ ... (exponential backoff up to 30s)
    └─ Max 30s interval
    ↓
Connection Restored
    ├─ Token refreshed
    ├─ WebSocket reconnected
    ├─ onReconnect() callback fired
    ├─ Awareness state restored
    ├─ Initial sync triggered
    └─ isSynced = true
    ↓
Session Ready
```

## Provider Methods

The provider exposes connection status methods:

```typescript
const provider = providerRef.current;

// Check if connected
if (provider?.isConnected?.()) {
  console.log("Provider is connected");
}

// Check if synced
if (provider?.isSynced?.()) {
  console.log("Provider is synced and ready");
}

// Manually reconnect
await provider?.reconnect?.();

// Disconnect cleanly
provider?.disconnect?.();

// Cleanup on unmount
provider?.destroy?.();
```

## Server-Side Disconnect Handling

When your server implements disconnect logic:

```typescript
// Example: Server disconnects idle users after 5 minutes
const IDLE_TIMEOUT = 5 * 60 * 1000;

// Server should send userDisconnect message
{
  type: "userDisconnect",
  userId: "user-123",
  timestamp: Date.now()
}

// Provider automatically cleans up disconnected user from awareness
```

## Best Practices

### 1. Always Show Connection Status

```typescript
<div className={isConnected ? "status-ok" : "status-error"}>
  {isConnected ? "Connected" : "Disconnected"}
</div>
```

### 2. Handle Reconnection Gracefully

```typescript
onDisconnect: () => {
  // Save drafts to local storage
  saveDraftsLocally();
  // Show offline banner
  setIsOffline(true);
},

onReconnect: () => {
  // Sync any unsaved changes
  syncDrafts();
  // Hide offline banner
  setIsOffline(false);
},
```

### 3. Provide Manual Reconnect Option

```typescript
{!isConnected && (
  <button onClick={() => reconnect()}>
    Reconnect
  </button>
)}
```

### 4. Monitor Error States

```typescript
onError: (error) => {
  // Log error for debugging
  logToSentry(error);
  
  // Show user-friendly message
  showNotification(
    "Collaboration error: " + error.message,
    "error"
  );
  
  // Trigger manual reconnect after delay
  setTimeout(() => reconnect(), 5000);
},
```

### 5. Lock UI During Reconnection

```typescript
const [isReconnecting, setIsReconnecting] = useState(false);

const handleReconnect = async () => {
  setIsReconnecting(true);
  try {
    await reconnect();
  } finally {
    setIsReconnecting(false);
  }
};

// Disable editor during reconnection
<Editor disabled={isReconnecting} />
```

## Troubleshooting

### Connection Won't Establish

1. Check WebSocket URL: `wsUrl` parameter
2. Verify server is running
3. Check network connectivity
4. Review browser console for errors
5. Check token validity with `onError` callback

### Reconnection Failing

1. Check token refresh is working
2. Verify server session still valid
3. Look for "Request timeout" errors
4. Check rate limiting isn't blocking

### Awareness State Lost on Reconnect

1. Awareness state is automatically restored from provider
2. Mouse cursors sync from `handleMouseMove`
3. Selection state syncs from awareness

### Silent Disconnections

Enable debug mode to see connection logs:

```typescript
const { ... } = useYjsCollabV2({
  pageId: "page-123",
  projectId: "project-456",
  enableDebug: true, // Adds console logs
});
```

## Performance Considerations

- Reconnection uses exponential backoff to avoid server overload
- Maximum 30 second interval between attempts
- Token refresh happens every 4 minutes
- Awareness polling every 150ms (configurable)
- Requests have 30 second timeout

## Security

- Tokens are refreshed on each reconnection
- Old tokens are discarded after reconnection
- Awareness state is user-scoped
- All messages validated server-side