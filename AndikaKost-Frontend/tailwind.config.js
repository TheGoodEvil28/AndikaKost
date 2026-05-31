/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "ui-base": ["var(--ui-font-base, 16px)", { lineHeight: "var(--ui-line-base, 24px)" }],
        "ui-lg": ["var(--ui-font-lg, 18px)", { lineHeight: "var(--ui-line-lg, 28px)" }],
        "ui-xl": ["var(--ui-font-xl, 20px)", { lineHeight: "var(--ui-line-xl, 30px)" }]
      }
    }
  },
  plugins: []
};
