import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f5b76",
          accent: "#f59e0b",
        },
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;

