import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Instrument Sans", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      backgroundImage: {
        "page-gradient":
          "linear-gradient(rgb(189, 215, 255) 0%, rgb(255, 255, 255) 39.45%)",
        "cta-gradient":
          "linear-gradient(rgb(0, 68, 185) 5.5%, rgb(0, 116, 236) 35%, rgb(78, 177, 255) 65%, rgb(173, 217, 255) 95%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        navy: "#002259",
        background: "#F7F7F9",
        element: "#EFF4F9",
        element2: "#E9F3FF",
        highlight: "#2670DC",
        success: "#0DDE53",
        skeleton: "#EFF4F9",
        toolbar: "#CBE2FC",
        blue: {
          100: "#E9F3FF",
          150: "#D7E7FE",
          200: "#D3E8FF",
          300: "#BDD7FF",
          500: "#79ADF8",
          600: "#155DFC",
          700: "#2670DC",
          900: "#0042AB",
        },
        neutral: {
          50: "#F7F7F9",
          100: "#FFFFFF",
          200: "#F4F9FF",
          300: "#E0E8F2",
          400: "#D1D9E6",
          500: "#8F9FB8",
          550: "#798AA6",
          600: "#777F8B",
          700: "#5F6B7C",
          800: "#3F4A61",
          900: "#002259",
        },
      },
      boxShadow: {
        card: "rgba(255,255,255,0.75) -4px -4px 6px inset, rgba(255,255,255,0.75) 4px 4px 6px inset",
        search:
          "rgba(235,243,255,0.75) -2px -2px 4px inset, rgba(235,243,255,0.75) 2px 2px 4px inset",
      },
      borderRadius: {
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
export default config
