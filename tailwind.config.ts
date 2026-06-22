import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef9ee",
          100: "#fdf0d5",
          200: "#f9dda9",
          300: "#f5c473",
          400: "#f0a13b",
          500: "#ec8516",
          600: "#dd6a0c",
          700: "#b74f0d",
          800: "#923f12",
          900: "#763512",
          950: "#401907",
        },
        sage: {
          50: "#f4f7f0",
          100: "#e6eddd",
          200: "#cddbbe",
          300: "#abc398",
          400: "#82a86e",
          500: "#638c50",
          600: "#4d6e3d",
          700: "#3d5732",
          800: "#334629",
          900: "#2b3b24",
          950: "#141f11",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
