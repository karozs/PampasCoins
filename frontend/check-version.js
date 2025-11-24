try {
    const pkg = require('tailwindcss/package.json');
    console.log('Tailwind version:', pkg.version);
} catch (e) {
    console.error('Error loading tailwindcss/package.json:', e);
}
