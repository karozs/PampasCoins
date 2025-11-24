/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb', // Darker blue for better contrast
                    light: '#60a5fa',
                    dark: '#1e40af',
                },
                secondary: {
                    DEFAULT: '#16a34a', // Darker green for better contrast
                    light: '#4ade80',
                    dark: '#15803d',
                },
                bronze: {
                    DEFAULT: '#d97706', // Darker bronze/amber
                    light: '#fcd34d',
                    dark: '#b45309',
                },
            },
        },
    },
    plugins: [],
}
