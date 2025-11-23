# Auto-Reconnect on Mouse Move Feature

## Overview
This feature automatically attempts to reconnect when a user moves their mouse, handling server-side disconnections gracefully. When the server disconnects a user (idle timeout, session expiration, etc.), the connection will be re-established the next time the user interacts with the canvas.

## Problem Solved
- Server disconnects idle users after a timeout period
- User continues trying to edit but connection is lost
- Without reconnection, user must manually refresh or wait for automatic reconnection
- **Solution**: Auto-reconnect triggers on mouse movement, providing seamless experience

## Implementation Details

### Hook Changes (`src/hooks/realtime/use-yjs-collab-v2.ts`)

#### New State & Refs
```typescript
const lastReconnectAttemptRef = useRef<number>(0);
const RECONNECT_COOLDOWN_MS = 3000; // Prevents connection spam
```

#### New Function: `attemptReconnect()`
```typescript
const attemptReconnect = useCallback(async () => {
  const now = Date.now();
  const provider = providerRef.current;

  if (!provider) return;
  if (provider.connected) return; // Already connected

  const timeSinceLastAttempt = now - lastReconnectAttemptRef.current;
  if (timeSinceLastAttempt < RECONNECT_COOLDOWN_MS) {
    return; // Cooldown active, skip
  }

  lastReconnectAttemptRef.current = now;

  try {
    if (enableDebug) {
      console.log("[useYjsCollabV2] Attempting reconnect on mouse move");
    }
    await provider.reconnect();
  } catch (err) {
    if (enableDebug) {
      console.log("[useYjsCollabV2] Reconnect attempt failed:", err);
    }
  }
}, [enableDebug]);
```

#### Enhanced Mouse Move Handler
```typescript
const handleMouseMove = (event: MouseEvent) => {
  const provider = providerRef.current;
  if (!provider?.awareness || !canvasRef.current) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Update cursor position for other users
  provider.awareness.setLocalStateField("cursor", { x, y });

  // Attempt reconnect if disconnected
  if (!provider.connected) {
    attemptReconnect();
  }
};
```

### Provider Changes (`src/lib/yjs/yjs-provider-v2.ts`)

#### New Public Methods

**`reconnect()`**
```typescript
public async reconnect(): Promise<void> {
  // Gracefully disconnect first
  this.disconnect();

  // Reset reconnection state for immediate retry
  this.reconnectAttempts = 0;
  if (this.reconnectTimeout) {
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = null;
  }

  // Reconnect immediately
  await this.connect();
}
```

**`isConnected()`**
```typescript
public isConnected(): boolean {
  return this.connected;
}
```

**`isSynced()`**
```typescript
public isSynced(): boolean {
  return this.synched;
}
```

## Connection Flow

### Normal Operation
```
User moves mouse
    ↓
handleMouseMove() triggered
    ↓
provider.connected === true
    ↓
Skip reconnect attempt, just update cursor
```

### After Server Disconnect
```
User moves mouse
    ↓
handleMouseMove() triggered
    ↓
provider.connected === false
    ↓
attemptReconnect() called
    ↓
Check RECONNECT_COOLDOWN_MS (3 seconds)
    ↓
provider.reconnect() called
    ↓
disconnect() →