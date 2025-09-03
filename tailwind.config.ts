import type { Config } from "tailwindcss";

const config: Config & {
  safelist?: Array<
    | string
    | RegExp
    | { pattern: RegExp; variants?: string[] }
    | { pattern: RegExp }
  >;
} = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Safelist reactive / dynamic classes that may be composed at runtime
  // This keeps responsive prefixes (sm:, md:, lg:, etc.) and common pseudo variants
  // from being purged when class strings are constructed dynamically.
  safelist: [
    {
      // keep classes like: sm:w-full, md:text-lg, lg:py-8, etc.
      pattern: /^(sm|md|lg|xl|2xl):[a-z0-9-/:]+$/,
    },
    {
      // keep common state variants composed dynamically: hover:bg-red-500, focus:ring, active:scale-95
      pattern: /^(hover|focus|active|disabled):[a-z0-9-/:]+$/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
