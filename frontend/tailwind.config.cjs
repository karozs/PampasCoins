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
                    DEFAULT: '#1e293b', // Slate 800 - Formal Dark
                    light: '#334155',   // Slate 700
                    dark: '#0f172a',    // Slate 900
                },
                secondary: {
                    DEFAULT: '#3b82f6', // Blue 500 - Modern Tech
                    light: '#60a5fa',   // Blue 400
                    dark: '#2563eb',    // Blue 600
                },
                bronze: {
                    DEFAULT: '#f59e0b', // Amber 500 - Accent
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                surface: '#ffffff',
                background: '#f1f5f9', // Slate 100
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
