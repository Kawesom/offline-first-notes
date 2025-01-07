/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.html","./src/**/*.{html,js,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

