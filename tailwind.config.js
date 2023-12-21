/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-black',
    'bg-gray-200',
    'bg-red-500',
    'bg-blue-500',
    'border-blue-500',
    'border-red-500'
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}