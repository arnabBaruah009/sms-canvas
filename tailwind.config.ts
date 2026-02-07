import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
      },
      backgroundImage: {
        "polka-dots": "radial-gradient(#d1d5db 1px, transparent 1px)",
        "logo-gradient": "linear-gradient(to right, #4ca775, #cad6b7)",
      },
      backgroundSize: {
        "20": "20px 20px",
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        mukta: ["Mukta", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        DMSans: ["DM Sans", "sans-serif"],
        Yeseva: ["Yeseva One", "serif"],
        Manrope: ["Manrope", "serif"],
        Parkinsans: ["Parkinsans", "serif"],
      },
    },
  },
  plugins: [nextui(), require("tailwind-scrollbar-hide")],
};

export default config;
