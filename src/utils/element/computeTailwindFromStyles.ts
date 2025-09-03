/*
  webbuilderv2/src/utils/element/computeTailwindFromStyles.ts

  Refactored helper to compute a conservative set of Tailwind v4 utility
  classes from inline style values.

  Key changes:
  - Preserve CSS variable references (e.g. `var(--foo)`) as-is so emitted
    arbitrary classes reference the same variable.
  - Improved sanitization for arbitrary values:
    - Removes characters that break class parsing (`[` and `]`) and newlines.
    - When the value contains whitespace or quotes, it is emitted quoted
      inside the Tailwind brackets (e.g. `bg-['rgb(255 0 0 / 0.5)']`) which
      preserves the original formatting safely.
    - Keeps hex colors and simple tokens unquoted for readability.
  - Centralized helpers for normalization / sanitization and a small set of
    conservative mappings for common CSS properties.
*/

import type { CSSProperties } from "react";

/**
 * Detects whether a string is a CSS variable reference of the form:
 *   var(--some-name)
 * Allows optional whitespace inside the parentheses.
 */
const isCssVar = (val: string): boolean =>
  /^var\(\s*--[a-zA-Z0-9\-_]+\s*\)$/.test(val.trim());

/**
 * Clean a raw string value by removing newlines and any bracket characters
 * that would break Tailwind class tokenization.
 */
const basicClean = (val: string): string =>
  String(val)
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .trim();

/**
 * Produce a safe string to insert inside Tailwind's arbitrary-value brackets.
 *
 * Rules:
 * - If value is a CSS variable (e.g. `var(--foo)`) return it unchanged after
 *   a light clean. This preserves the variable reference and avoids quoting.
 * - If the cleaned value contains whitespace or any quote characters, return
 *   a single-quoted version where single-quotes are escaped (e.g.
 *   `'rgb(255 0 0 / 0.5)'`) because Tailwind supports quoting inside brackets.
 * - Otherwise return the cleaned value verbatim (for hex colors, numbers, etc).
 */
function sanitizeForArbitrary(raw: string | number): string {
  const asStr = String(raw);
  // remove problematic characters / normalize whitespace first
  const cleaned = basicClean(asStr);

  if (cleaned.length === 0) return "";

  // Keep CSS variable references as-is (safe after basicClean)
  if (isCssVar(cleaned)) return cleaned;

  // If it contains whitespace or quotes, wrap in single quotes (escape inner ')
  const containsWhitespace = /\s/.test(cleaned);
  const containsSingleQuote = /'/.test(cleaned);
  const containsDoubleQuote = /"/.test(cleaned);

  if (containsWhitespace || containsSingleQuote || containsDoubleQuote) {
    // escape single quotes inside the value
    const escaped = cleaned.replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  // Otherwise return the cleaned token (hex colors, identifiers, numbers)
  return cleaned;
}

const pushIf = (arr: string[], cls?: string | false | null) => {
  if (!cls) return;
  const n = String(cls).trim();
  if (n.length) arr.push(n);
};

/**
 * Compute Tailwind classes from a partial CSSProperties object.
 * Returns a space-separated string of classes.
 */
export function computeTailwindFromStyles(
  styles: Partial<CSSProperties> | undefined,
): string {
  if (!styles) return "";

  const classes: string[] = [];

  const pushArbitrary = (prefix: string, raw: unknown) => {
    if (raw === undefined || raw === null || raw === "") return;

    let normalized: string;
    if (typeof raw === "number") {
      // Most numeric uses in this UI imply pixels
      normalized = `${raw}px`;
    } else {
      normalized = String(raw);
    }

    const safe = sanitizeForArbitrary(normalized);
    if (!safe) return;
    classes.push(`${prefix}-[${safe}]`);
  };

  // Size
  if (styles.width !== undefined && styles.width !== null) {
    if (styles.width === "auto") classes.push("w-auto");
    else pushArbitrary("w", styles.width);
  }
  if (styles.height !== undefined && styles.height !== null) {
    if (styles.height === "auto") classes.push("h-auto");
    else pushArbitrary("h", styles.height);
  }

  // Background & text color
  if (styles.backgroundColor) {
    pushIf(classes, `bg-[${sanitizeForArbitrary(styles.backgroundColor)}]`);
  }
  if (styles.color) {
    pushIf(classes, `text-[${sanitizeForArbitrary(styles.color)}]`);
  }

  // Border radius
  if (styles.borderRadius !== undefined && styles.borderRadius !== null) {
    const val =
      typeof styles.borderRadius === "number"
        ? `${styles.borderRadius}px`
        : String(styles.borderRadius);
    pushIf(classes, `rounded-[${sanitizeForArbitrary(val)}]`);
  }

  // Border width & color
  if (styles.borderWidth !== undefined && styles.borderWidth !== null) {
    const val =
      typeof styles.borderWidth === "number"
        ? `${styles.borderWidth}px`
        : String(styles.borderWidth);
    pushIf(classes, `border-[${sanitizeForArbitrary(val)}]`);
  }
  if (styles.borderColor) {
    pushIf(classes, `border-[${sanitizeForArbitrary(styles.borderColor)}]`);
  }

  // Opacity
  if (styles.opacity !== undefined && styles.opacity !== null) {
    const raw = styles.opacity;
    let normalized: string;
    if (typeof raw === "number") {
      if (raw > 1 && raw <= 100) normalized = String(raw / 100);
      else normalized = String(raw);
    } else {
      normalized = String(raw);
    }
    pushIf(classes, `opacity-[${sanitizeForArbitrary(normalized)}]`);
  }

  // Spacing: padding / margin
  if (styles.padding !== undefined && styles.padding !== null)
    pushArbitrary("p", styles.padding);
  if (styles.paddingTop !== undefined && styles.paddingTop !== null)
    pushArbitrary("pt", styles.paddingTop);
  if (styles.paddingBottom !== undefined && styles.paddingBottom !== null)
    pushArbitrary("pb", styles.paddingBottom);
  if (styles.paddingLeft !== undefined && styles.paddingLeft !== null)
    pushArbitrary("pl", styles.paddingLeft);
  if (styles.paddingRight !== undefined && styles.paddingRight !== null)
    pushArbitrary("pr", styles.paddingRight);

  if (styles.margin !== undefined && styles.margin !== null)
    pushArbitrary("m", styles.margin);
  if (styles.marginTop !== undefined && styles.marginTop !== null)
    pushArbitrary("mt", styles.marginTop);
  if (styles.marginBottom !== undefined && styles.marginBottom !== null)
    pushArbitrary("mb", styles.marginBottom);
  if (styles.marginLeft !== undefined && styles.marginLeft !== null)
    pushArbitrary("ml", styles.marginLeft);
  if (styles.marginRight !== undefined && styles.marginRight !== null)
    pushArbitrary("mr", styles.marginRight);

  // Display
  if (styles.display) {
    const d = String(styles.display).trim();
    if (d === "flex") classes.push("flex");
    else if (d === "grid") classes.push("grid");
    else if (d === "none") classes.push("hidden");
    else if (d === "inline-block") classes.push("inline-block");
    else if (d === "block") classes.push("block");
    else pushIf(classes, `block`);
  }

  // Flex direction
  const fd = (styles as any).flexDirection;
  if (fd) {
    const s = String(fd).trim();
    if (s === "column") classes.push("flex-col");
    else if (s === "column-reverse") classes.push("flex-col-reverse");
    else if (s === "row") classes.push("flex-row");
    else if (s === "row-reverse") classes.push("flex-row-reverse");
    else pushIf(classes, `flex-[${sanitizeForArbitrary(s)}]`);
  }

  // Justify / Align items
  const jc = (styles as any).justifyContent;
  if (jc) {
    const v = String(jc).trim();
    if (v === "center") classes.push("justify-center");
    else if (v === "flex-start" || v === "start") classes.push("justify-start");
    else if (v === "flex-end" || v === "end") classes.push("justify-end");
    else if (v === "space-between") classes.push("justify-between");
    else if (v === "space-around") classes.push("justify-around");
    else if (v === "space-evenly") classes.push("justify-evenly");
    else pushIf(classes, `justify-[${sanitizeForArbitrary(v)}]`);
  }
  const ai = (styles as any).alignItems;
  if (ai) {
    const v = String(ai).trim();
    if (v === "center") classes.push("items-center");
    else if (v === "flex-start" || v === "start") classes.push("items-start");
    else if (v === "flex-end" || v === "end") classes.push("items-end");
    else if (v === "stretch") classes.push("items-stretch");
    else pushIf(classes, `items-[${sanitizeForArbitrary(v)}]`);
  }

  // Gap
  if ((styles as any).gap !== undefined && (styles as any).gap !== null)
    pushArbitrary("gap", (styles as any).gap);
  if ((styles as any).rowGap !== undefined && (styles as any).rowGap !== null)
    pushArbitrary("row-gap", (styles as any).rowGap);
  if (
    (styles as any).columnGap !== undefined &&
    (styles as any).columnGap !== null
  )
    pushArbitrary("col-gap", (styles as any).columnGap);

  // Typography mappings
  if (styles.fontSize !== undefined && styles.fontSize !== null) {
    pushArbitrary("text", styles.fontSize);
  }

  // Font weight
  if (styles.fontWeight !== undefined && styles.fontWeight !== null) {
    const fw = styles.fontWeight;
    if (typeof fw === "number") {
      if (fw === 100) classes.push("font-thin");
      else if (fw === 200) classes.push("font-extralight");
      else if (fw === 300) classes.push("font-light");
      else if (fw === 400) classes.push("font-normal");
      else if (fw === 500) classes.push("font-medium");
      else if (fw === 600) classes.push("font-semibold");
      else if (fw === 700) classes.push("font-bold");
      else if (fw === 800) classes.push("font-extrabold");
      else if (fw === 900) classes.push("font-black");
      else pushIf(classes, `font-[${sanitizeForArbitrary(String(fw))}]`);
    } else {
      const s = String(fw).trim();
      if (s === "normal" || s === "400") classes.push("font-normal");
      else if (s === "bold" || s === "700") classes.push("font-bold");
      else pushIf(classes, `font-[${sanitizeForArbitrary(s)}]`);
    }
  }

  // Line-height -> leading-[...]
  if (styles.lineHeight !== undefined && styles.lineHeight !== null) {
    pushArbitrary("leading", styles.lineHeight);
  }

  // Letter-spacing -> tracking-[...]
  if (styles.letterSpacing !== undefined && styles.letterSpacing !== null) {
    pushArbitrary("tracking", styles.letterSpacing);
  }

  // Text align
  if (styles.textAlign) {
    const ta = String(styles.textAlign).trim();
    if (ta === "center") classes.push("text-center");
    else if (ta === "right") classes.push("text-right");
    else if (ta === "left") classes.push("text-left");
    else if (ta === "justify") classes.push("text-justify");
    else if (ta === "start") classes.push("text-left");
    else if (ta === "end") classes.push("text-right");
    else pushIf(classes, `text-[${sanitizeForArbitrary(ta)}]`);
  }

  // Text transform
  if (styles.textTransform) {
    const tt = String(styles.textTransform).trim();
    if (tt === "uppercase") classes.push("uppercase");
    else if (tt === "lowercase") classes.push("lowercase");
    else if (tt === "capitalize") classes.push("capitalize");
    else if (tt === "none") classes.push("normal-case");
    else pushIf(classes, `uppercase`);
  }

  // Text decoration
  if (styles.textDecoration) {
    const td = String(styles.textDecoration).trim();
    if (td === "underline") classes.push("underline");
    else if (td === "overline") classes.push("overline");
    else if (td === "line-through" || td === "lineThrough")
      classes.push("line-through");
    else if (td === "none") classes.push("no-underline");
    else pushIf(classes, `underline`);
  }

  // Font style
  if (styles.fontStyle) {
    const fs = String(styles.fontStyle).trim();
    if (fs === "italic" || fs === "oblique") classes.push("italic");
    else if (fs === "normal") {
      /* no-op */
    } else pushIf(classes, `italic`);
  }

  // Font family
  if (styles.fontFamily) {
    const ffRaw = String(styles.fontFamily).trim();
    // If it's an exact var(...) preserve it
    if (isCssVar(ffRaw)) {
      pushIf(classes, `font-[${sanitizeForArbitrary(ffRaw)}]`);
    } else {
      // prefer named utility if it matches (e.g. 'serif'/'sans-serif'), otherwise arbitrary
      if (/serif/i.test(ffRaw)) classes.push("serif");
      else if (/sans/i.test(ffRaw)) classes.push("sans");
      else if (/monospace/i.test(ffRaw)) classes.push("mono");
      else pushIf(classes, `font-[${sanitizeForArbitrary(ffRaw)}]`);
    }
  }

  // z-index
  if (styles.zIndex !== undefined && styles.zIndex !== null) {
    classes.push(`z-[${String(styles.zIndex)}]`);
  }

  // Offsets
  if (styles.top !== undefined && styles.top !== null)
    pushArbitrary("top", styles.top);
  if (styles.bottom !== undefined && styles.bottom !== null)
    pushArbitrary("bottom", styles.bottom);
  if (styles.left !== undefined && styles.left !== null)
    pushArbitrary("left", styles.left);
  if (styles.right !== undefined && styles.right !== null)
    pushArbitrary("right", styles.right);

  return classes.join(" ").trim();
}

export default computeTailwindFromStyles;
