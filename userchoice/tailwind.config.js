/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.{html}',     // Ensure all templates are included
    './theme/templates/**/*.{html}', // Include the Tailwind theme templates
    '../../**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

