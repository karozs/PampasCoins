/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Andean Color Palette - Inspired by traditional textiles
                'rojo-andino': {
                    DEFAULT: '#DC2626',
                    light: '#F87171',
                    dark: '#991B1B',
                },
                'naranja-inca': {
                    DEFAULT: '#EA580C',
                    light: '#FB923C',
                    dark: '#C2410C',
                },
                'amarillo-sol': {
                    DEFAULT: '#F59E0B',
                    light: '#FCD34D',
                    dark: '#D97706',
                },
                'verde-puna': {
                    DEFAULT: '#059669',
                    light: '#34D399',
                    dark: '#047857',
                },
                'azul-lago': {
                    DEFAULT: '#0284C7',
                    light: '#38BDF8',
                    dark: '#0369A1',
                },
                'purpura-mistico': {
                    DEFAULT: '#7C3AED',
                    light: '#A78BFA',
                    dark: '#6D28D9',
                },
                'terracota': {
                    DEFAULT: '#C2410C',
                    light: '#FB923C',
                    dark: '#9A3412',
                },

                // Semantic colors using Andean palette
                primary: {
                    DEFAULT: '#0284C7', // Azul Lago
                    light: '#38BDF8',
                    dark: '#0369A1',
                },
                secondary: {
                    DEFAULT: '#DC2626', // Rojo Andino
                    light: '#F87171',
                    dark: '#991B1B',
                },
                accent: {
                    DEFAULT: '#F59E0B', // Amarillo Sol
                    light: '#FCD34D',
                    dark: '#D97706',
                },
                bronze: {
                    DEFAULT: '#EA580C', // Naranja Inca
                    light: '#FB923C',
                    dark: '#C2410C',
                },
            },
            backgroundImage: {
                'andean-gradient': 'linear-gradient(135deg, #0284C7 0%, #7C3AED 50%, #DC2626 100%)',
                'andean-warm': 'linear-gradient(135deg, #EA580C 0%, #F59E0B 50%, #DC2626 100%)',
                'andean-cool': 'linear-gradient(135deg, #059669 0%, #0284C7 50%, #7C3AED 100%)',
            },
        },
    },
    plugins: [],
}

