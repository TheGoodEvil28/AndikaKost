/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "ui-base": ["16px", { lineHeight: "24px" }],
        "ui-lg": ["18px", { lineHeight: "28px" }]
      }
    }
  },
  plugins: []
};

