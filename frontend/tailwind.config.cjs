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
                    DEFAULT: '#1b4332', // Dark Green (Tayacoins Brand)
                    light: '#2d6a4f',
                    dark: '#081c15',
                },
                secondary: {
                    DEFAULT: '#40916c', // Medium Green
                    light: '#74c69d',
                    dark: '#2d6a4f',
                },
                bronze: {
                    DEFAULT: '#9d5c0d', // Brownish/Bronze for secondary buttons
                    light: '#b07d48',
                    dark: '#78350f',
                },
                surface: '#ffffff',
                background: '#f8fafc',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
