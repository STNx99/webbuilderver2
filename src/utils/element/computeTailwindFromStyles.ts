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
  - Optimized with lodash for cleaner property access and conditional logic.
*/

import type { CSSProperties } from "react";
import { get, isUndefined, isNull, isString, isNumber, includes } from "lodash";

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
 * Check if a value is effectively empty/undefined for our purposes
 */
const isEmptyValue = (val: unknown): boolean =>
  isUndefined(val) || isNull(val) || val === "";

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
 * Create lookup maps for common CSS property values to Tailwind classes
 */
const DISPLAY_MAP = {
  flex: "flex",
  grid: "grid",
  none: "hidden",
  "inline-block": "inline-block",
  block: "block",
} as const;

const FLEX_DIRECTION_MAP = {
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
} as const;

const JUSTIFY_CONTENT_MAP = {
  center: "justify-center",
  "flex-start": "justify-start",
  start: "justify-start",
  "flex-end": "justify-end",
  end: "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
} as const;

const ALIGN_ITEMS_MAP = {
  center: "items-center",
  "flex-start": "items-start",
  start: "items-start",
  "flex-end": "items-end",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const TEXT_ALIGN_MAP = {
  center: "text-center",
  right: "text-right",
  left: "text-left",
  justify: "text-justify",
  start: "text-left",
  end: "text-right",
} as const;

const TEXT_TRANSFORM_MAP = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  none: "normal-case",
} as const;

const TEXT_DECORATION_MAP = {
  underline: "underline",
  overline: "overline",
  "line-through": "line-through",
  lineThrough: "line-through",
  none: "no-underline",
} as const;

const FONT_WEIGHT_MAP = {
  100: "font-thin",
  200: "font-extralight",
  300: "font-light",
  400: "font-normal",
  500: "font-medium",
  600: "font-semibold",
  700: "font-bold",
  800: "font-extrabold",
  900: "font-black",
} as const;

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
    if (isEmptyValue(raw)) return;

    let normalized: string;
    if (isNumber(raw)) {
      // Most numeric uses in this UI imply pixels
      normalized = `${raw}px`;
    } else {
      normalized = String(raw);
    }

    const safe = sanitizeForArbitrary(normalized);
    if (!safe) return;
    classes.push(`${prefix}-[${safe}]`);
  };

  /**
   * Get a mapped class or fallback to arbitrary value
   */
  const getMappedClass = (
    value: unknown,
    map: Record<string, string>,
    prefix: string,
  ): string | undefined => {
    if (isEmptyValue(value)) return undefined;

    const strValue = String(value).trim();
    const mappedClass = get(map, strValue);

    return (
      mappedClass ||
      (prefix ? `${prefix}-[${sanitizeForArbitrary(strValue)}]` : undefined)
    );
  };

  // Size
  const width = get(styles, "width");
  if (!isEmptyValue(width)) {
    width === "auto" ? classes.push("w-auto") : pushArbitrary("w", width);
  }

  const height = get(styles, "height");
  if (!isEmptyValue(height)) {
    height === "auto" ? classes.push("h-auto") : pushArbitrary("h", height);
  }

  // Background & text color
  const bgColor = get(styles, "backgroundColor");
  if (bgColor) {
    pushIf(classes, `bg-[${sanitizeForArbitrary(bgColor)}]`);
  }

  const color = get(styles, "color");
  if (color) {
    pushIf(classes, `text-[${sanitizeForArbitrary(color)}]`);
  }

  // Border radius
  const borderRadius = get(styles, "borderRadius");
  if (!isEmptyValue(borderRadius)) {
    const val = isNumber(borderRadius)
      ? `${borderRadius}px`
      : String(borderRadius);
    pushIf(classes, `rounded-[${sanitizeForArbitrary(val)}]`);
  }

  // Border width & color
  const borderWidth = get(styles, "borderWidth");
  if (!isEmptyValue(borderWidth)) {
    const val = isNumber(borderWidth)
      ? `${borderWidth}px`
      : String(borderWidth);
    pushIf(classes, `border-[${sanitizeForArbitrary(val)}]`);
  }

  const borderColor = get(styles, "borderColor");
  if (borderColor) {
    pushIf(classes, `border-[${sanitizeForArbitrary(borderColor)}]`);
  }

  // Opacity
  const opacity = get(styles, "opacity");
  if (!isEmptyValue(opacity)) {
    let normalized: string;
    if (isNumber(opacity)) {
      normalized =
        opacity > 1 && opacity <= 100 ? String(opacity / 100) : String(opacity);
    } else {
      normalized = String(opacity);
    }
    pushIf(classes, `opacity-[${sanitizeForArbitrary(normalized)}]`);
  }

  // Spacing: padding / margin
  const spacingProps = [
    "padding",
    "paddingTop",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "margin",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
  ];

  const spacingPrefixes = {
    padding: "p",
    paddingTop: "pt",
    paddingBottom: "pb",
    paddingLeft: "pl",
    paddingRight: "pr",
    margin: "m",
    marginTop: "mt",
    marginBottom: "mb",
    marginLeft: "ml",
    marginRight: "mr",
  };

  spacingProps.forEach((prop) => {
    const value = get(styles, prop);
    if (!isEmptyValue(value)) {
      const prefix = get(spacingPrefixes, prop);
      pushArbitrary(prefix, value);
    }
  });

  // Display
  const display = get(styles, "display");
  if (display) {
    const displayClass = get(DISPLAY_MAP, String(display).trim());
    displayClass ? classes.push(displayClass) : pushIf(classes, "block");
  }

  // Flex direction
  const flexDirection = get(styles, "flexDirection");
  if (flexDirection) {
    const flexClass = getMappedClass(flexDirection, FLEX_DIRECTION_MAP, "flex");
    if (flexClass) classes.push(flexClass);
  }

  // Justify / Align items
  const justifyContent = get(styles, "justifyContent");
  if (justifyContent) {
    const justifyClass = getMappedClass(
      justifyContent,
      JUSTIFY_CONTENT_MAP,
      "justify",
    );
    if (justifyClass) classes.push(justifyClass);
  }

  const alignItems = get(styles, "alignItems");
  if (alignItems) {
    const alignClass = getMappedClass(alignItems, ALIGN_ITEMS_MAP, "items");
    if (alignClass) classes.push(alignClass);
  }

  // Gap properties
  const gapProps = ["gap", "rowGap", "columnGap"];
  const gapPrefixes = { gap: "gap", rowGap: "row-gap", columnGap: "col-gap" };

  gapProps.forEach((prop) => {
    const value = get(styles, prop);
    if (!isEmptyValue(value)) {
      const prefix = get(gapPrefixes, prop);
      pushArbitrary(prefix, value);
    }
  });

  // Typography mappings
  const fontSize = get(styles, "fontSize");
  if (!isEmptyValue(fontSize)) {
    pushArbitrary("text", fontSize);
  }

  // Font weight
  const fontWeight = get(styles, "fontWeight");
  if (!isEmptyValue(fontWeight)) {
    if (isNumber(fontWeight)) {
      const weightClass = get(FONT_WEIGHT_MAP, fontWeight);
      weightClass
        ? classes.push(weightClass)
        : pushIf(classes, `font-[${sanitizeForArbitrary(String(fontWeight))}]`);
    } else {
      const weightStr = String(fontWeight).trim();
      if (includes(["normal", "400"], weightStr)) classes.push("font-normal");
      else if (includes(["bold", "700"], weightStr)) classes.push("font-bold");
      else pushIf(classes, `font-[${sanitizeForArbitrary(weightStr)}]`);
    }
  }

  // Line-height -> leading-[...]
  const lineHeight = get(styles, "lineHeight");
  if (!isEmptyValue(lineHeight)) {
    pushArbitrary("leading", lineHeight);
  }

  // Letter-spacing -> tracking-[...]
  const letterSpacing = get(styles, "letterSpacing");
  if (!isEmptyValue(letterSpacing)) {
    pushArbitrary("tracking", letterSpacing);
  }

  // Text align
  const textAlign = get(styles, "textAlign");
  if (textAlign) {
    const alignClass = getMappedClass(textAlign, TEXT_ALIGN_MAP, "text");
    if (alignClass) classes.push(alignClass);
  }

  // Text transform
  const textTransform = get(styles, "textTransform");
  if (textTransform) {
    const transformClass = getMappedClass(
      textTransform,
      TEXT_TRANSFORM_MAP,
      "",
    );
    if (transformClass) classes.push(transformClass);
  }

  // Text decoration
  const textDecoration = get(styles, "textDecoration");
  if (textDecoration) {
    const decorationClass = getMappedClass(
      textDecoration,
      TEXT_DECORATION_MAP,
      "",
    );
    if (decorationClass) classes.push(decorationClass);
  }

  // Font style
  const fontStyle = get(styles, "fontStyle");
  if (fontStyle) {
    const styleStr = String(fontStyle).trim();
    if (includes(["italic", "oblique"], styleStr)) classes.push("italic");
    // normal is no-op
  }

  // Font family
  const fontFamily = get(styles, "fontFamily");
  if (fontFamily) {
    const ffRaw = String(fontFamily).trim();
    if (isCssVar(ffRaw)) {
      pushIf(classes, `font-[${sanitizeForArbitrary(ffRaw)}]`);
    } else {
      if (/serif/i.test(ffRaw)) classes.push("serif");
      else if (/sans/i.test(ffRaw)) classes.push("sans");
      else if (/monospace/i.test(ffRaw)) classes.push("mono");
      else pushIf(classes, `font-[${sanitizeForArbitrary(ffRaw)}]`);
    }
  }

  // z-index
  const zIndex = get(styles, "zIndex");
  if (!isEmptyValue(zIndex)) {
    classes.push(`z-[${String(zIndex)}]`);
  }

  // Position offsets
  const offsetProps = ["top", "bottom", "left", "right"];
  offsetProps.forEach((prop) => {
    const value = get(styles, prop);
    if (!isEmptyValue(value)) {
      pushArbitrary(prop, value);
    }
  });

  return classes.join(" ").trim();
}

export default computeTailwindFromStyles;
