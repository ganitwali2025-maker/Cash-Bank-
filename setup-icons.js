const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#5A0000"/>
  <text x="256" y="310" font-family="Arial" font-weight="bold" font-size="200" fill="#D4AF37" text-anchor="middle">UBS</text>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'pwa-192x192.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'pwa-512x512.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-512x512.svg'), svgContent);

console.log('✅ PWA Icons generated successfully in public/icons/');
