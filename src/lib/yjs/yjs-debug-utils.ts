/**
 * Yjs Debugging Utilities
 *
 * Helper functions to diagnose and monitor Yjs collaboration issues.
 */

import * as Y from "yjs";
import { EditorElement } from "@/types/global.type";

export interface YjsDebugInfo {
  docState: {
    hasElementsJson: boolean;
    elementsCount: number;
    elementsJsonLength: number;
    rawElementsJson: string;
  };
  providerState: {
    connected: boolean;
    synched: boolean;
    wsReadyState: number | null;
    wsUrl: string | null;
  };
  updateHistory: {
    timestamp: number;
    origin: string;
    elementsCount: number;
  }[];
}

export class YjsDebugger {
  private updateHistory: Array<{
    timestamp: number;
    origin: string;
    elementsCount: number;
  }> = [];
  private maxHistorySize = 50;

  constructor(
    private doc: Y.Doc,
    private provider?: any,
  ) {
    this.setupLogging();
  }

  /**
   * Set up comprehensive logging for all Yjs events
   */
  private setupLogging() {
    this.doc.on("update", (update: Uint8Array, origin: any) => {
      try {
        const yElementsText = this.doc.getText("elementsJson");
        const elementsJson = yElementsText.toString();
        const elements: EditorElement[] = elementsJson
          ? JSON.parse(elementsJson)
          : [];

        this.updateHistory.push({
          timestamp: Date.now(),
          origin: this.stringifyOrigin(origin),
          elementsCount: elements.length,
        });

        if (this.updateHistory.length > this.maxHistorySize) {
          this.updateHistory.shift();
        }

        console.log(
          `[YjsDebug] 📝 Doc updated | Origin: ${this.stringifyOrigin(origin)} | Elements: ${elements.length}`,
        );
      } catch (err) {
        console.error("[YjsDebug] Error processing update:", err);
      }
    });

    this.doc.on("destroy", () => {
      console.log("[YjsDebug] 🗑️ Document destroyed");
    });
  }

  /**
   * Convert origin to readable string
   */
  private stringifyOrigin(origin: any): string {
    if (origin === null || origin === undefined) return "unknown";
    if (typeof origin === "string") return origin;
    if (typeof origin === "object") return "provider-instance";
    return String(origin);
  }

  /**
   * Get current state of Yjs document
   */
  public getDocState() {
    try {
      const yElementsText = this.doc.getText("elementsJson");
      const elementsJson = yElementsText.toString();
      const elements: EditorElement[] = elementsJson
        ? JSON.parse(elementsJson)
        : [];

      return {
        hasElementsJson: yElementsText.length > 0,
        elementsCount: elements.length,
        elementsJsonLength: yElementsText.length,
        rawElementsJson: elementsJson.substring(0, 200) + "...",
      };
    } catch (err) {
      return {
        hasElementsJson: false,
        elementsCount: 0,
        elementsJsonLength: 0,
        rawElementsJson: "",
        error: String(err),
      };
    }
  }

  /**
   * Get provider connection state
   */
  public getProviderState() {
    if (!this.provider) {
      return {
        connected: false,
        synched: false,
        wsReadyState: null,
        wsUrl: null,
        error: "No provider attached",
      };
    }

    return {
      connected: this.provider.connected || false,
      synched: this.provider.synched || false,
      wsReadyState: this.provider.ws?.readyState || null,
      wsUrl: this.provider.url || null,
    };
  }

  /**
   * Get full debug info
   */
  public getDebugInfo(): YjsDebugInfo {
    return {
      docState: this.getDocState(),
      providerState: this.getProviderState(),
      updateHistory: [...this.updateHistory].slice(-10), // Last 10 updates
    };
  }

  /**
   * Print comprehensive debug report to console
   */
  public printDebugReport() {
    const info = this.getDebugInfo();

    console.group("🔍 Yjs Debug Report");

    console.group("📄 Document State");
    console.table(info.docState);
    console.groupEnd();

    console.group("🔌 Provider State");
    console.table(info.providerState);
    console.groupEnd();

    console.group("📜 Recent Updates (last 10)");
    console.table(info.updateHistory);
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * Test if updates are flowing correctly
   */
  public async testUpdateFlow(): Promise<{
    success: boolean;
    messages: string[];
  }> {
    const messages: string[] = [];
    const testElements: EditorElement[] = [
      {
        id: "test-" + Date.now(),
        type: "Section",
        name: "Test Section",
        styles: {},
        parentId: "",
        pageId: "",
        elements: [],
      } as unknown as EditorElement,
    ];

    try {
      // Clear history
      this.updateHistory = [];

      // Perform test update
      Y.transact(
        this.doc,
        () => {
          const yElementsText = this.doc.getText("elementsJson");
          yElementsText.delete(0, yElementsText.length);
          yElementsText.insert(0, JSON.stringify(testElements));
        },
        "test-update",
      );

      // Wait for update to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if update was recorded
      const testUpdate = this.updateHistory.find(
        (u) => u.origin === "test-update",
      );

      if (!testUpdate) {
        messages.push("❌ Test update was not recorded in history");
        return { success: false, messages };
      }

      messages.push("✅ Test update was recorded");

      if (testUpdate.elementsCount !== 1) {
        messages.push(`⚠️ Expected 1 element, got ${testUpdate.elementsCount}`);
      } else {
        messages.push("✅ Element count is correct");
      }

      // Check provider state
      const providerState = this.getProviderState();
      if (!providerState.connected) {
        messages.push("⚠️ Provider is not connected");
      } else {
        messages.push("✅ Provider is connected");
      }

      if (!providerState.synched) {
        messages.push("⚠️ Provider is not synched");
      } else {
        messages.push("✅ Provider is synched");
      }

      messages.push("✅ All tests passed");
      return { success: true, messages };
    } catch (err) {
      messages.push(`❌ Test failed: ${err}`);
      return { success: false, messages };
    }
  }

  /**
   * Monitor for stalled updates (no updates for extended period)
   */
  public startStalledUpdateMonitor(thresholdMs = 60000) {
    let lastUpdateTime = Date.now();

    this.doc.on("update", () => {
      lastUpdateTime = Date.now();
    });

    const checkInterval = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate > thresholdMs) {
        console.warn(
          `[YjsDebug] ⚠️ No updates received for ${Math.round(timeSinceLastUpdate / 1000)}s`,
        );
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }

  /**
   * Compare local doc state with expected elements
   */
  public compareElements(expectedElements: EditorElement[]): {
    match: boolean;
    differences: string[];
  } {
    const differences: string[] = [];

    try {
      const yElementsText = this.doc.getText("elementsJson");
      const elementsJson = yElementsText.toString();
      const actualElements: EditorElement[] = elementsJson
        ? JSON.parse(elementsJson)
        : [];

      if (actualElements.length !== expectedElements.length) {
        differences.push(
          `Count mismatch: actual=${actualElements.length}, expected=${expectedElements.length}`,
        );
      }

      // Compare IDs
      const actualIds = new Set(actualElements.map((e) => e.id));
      const expectedIds = new Set(expectedElements.map((e) => e.id));

      expectedIds.forEach((id) => {
        if (!actualIds.has(id)) {
          differences.push(`Missing element: ${id}`);
        }
      });

      actualIds.forEach((id) => {
        if (!expectedIds.has(id)) {
          differences.push(`Extra element: ${id}`);
        }
      });

      return {
        match: differences.length === 0,
        differences,
      };
    } catch (err) {
      differences.push(`Error comparing: ${err}`);
      return { match: false, differences };
    }
  }

  /**
   * Get statistics about update frequency
   */
  public getUpdateStats() {
    if (this.updateHistory.length === 0) {
      return {
        totalUpdates: 0,
        averageInterval: 0,
        minInterval: 0,
        maxInterval: 0,
        byOrigin: {},
      };
    }

    const intervals: number[] = [];
    for (let i = 1; i < this.updateHistory.length; i++) {
      intervals.push(
        this.updateHistory[i].timestamp - this.updateHistory[i - 1].timestamp,
      );
    }

    const byOrigin: Record<string, number> = {};
    this.updateHistory.forEach((update) => {
      byOrigin[update.origin] = (byOrigin[update.origin] || 0) + 1;
    });

    return {
      totalUpdates: this.updateHistory.length,
      averageInterval:
        intervals.reduce((a, b) => a + b, 0) / intervals.length || 0,
      minInterval: Math.min(...intervals) || 0,
      maxInterval: Math.max(...intervals) || 0,
      byOrigin,
    };
  }

  /**
   * Export debug info as JSON
   */
  public exportDebugInfo() {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        debugInfo: this.getDebugInfo(),
        updateStats: this.getUpdateStats(),
      },
      null,
      2,
    );
  }
}

/**
 * Quick debug helper - attach to window for console access
 */
export function attachYjsDebugger(
  doc: Y.Doc,
  provider?: any,
  windowKey = "yjsDebug",
) {
  const yjsDebugger = new YjsDebugger(doc, provider);

  if (typeof window !== "undefined") {
    (window as any)[windowKey] = yjsDebugger;
    console.log(
      `[YjsDebug] Debugger attached to window.${windowKey}. Try:`,
      `\n  ${windowKey}.printDebugReport()`,
      `\n  ${windowKey}.testUpdateFlow()`,
      `\n  ${windowKey}.getUpdateStats()`,
    );
  }

  return yjsDebugger;
}

/**
 * Create a simple update logger
 */
export function createUpdateLogger(doc: Y.Doc, prefix = "[YjsUpdate]") {
  doc.on("update", (update: Uint8Array, origin: any) => {
    try {
      const yElementsText = doc.getText("elementsJson");
      const elementsJson = yElementsText.toString();
      const elements: EditorElement[] = elementsJson
        ? JSON.parse(elementsJson)
        : [];

      const originStr =
        typeof origin === "string"
          ? origin
          : origin === null
            ? "unknown"
            : "provider";

      console.log(
        `${prefix} Origin: ${originStr} | Elements: ${elements.length} | Time: ${new Date().toISOString()}`,
      );
    } catch (err) {
      console.error(`${prefix} Error:`, err);
    }
  });
}
