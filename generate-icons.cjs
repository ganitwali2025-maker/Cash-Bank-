const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join('C:\\Users\\lr690\\.gemini\\antigravity\\brain\\52504738-6171-4f84-9052-ceba2963222c', 'media__1784876536273.png');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [16, 32, 48, 64, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024];

async function generate() {
    try {
        console.log("Loading image...");
        const image = sharp(inputImagePath);
        const metadata = await image.metadata();

        // 1. Remove white background and find bounding box of the FULL image
        const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        
        let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
        let hasPixels = false;
        
        // Threshold for white
        const threshold = 240;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            
            if (r > threshold && g > threshold && b > threshold) {
                // Make transparent
                data[i+3] = 0;
            } else {
                // Found non-transparent pixel
                const x = (i / 4) % info.width;
                const y = Math.floor((i / 4) / info.width);
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                hasPixels = true;
            }
        }

        if (!hasPixels) throw new Error("No image content found after removing white background.");

        const boxWidth = maxX - minX + 1;
        const boxHeight = maxY - minY + 1;
        
        const croppedTransparentBuffer = await sharp(data, {
            raw: { width: info.width, height: info.height, channels: 4 }
        })
        .extract({ left: minX, top: minY, width: boxWidth, height: boxHeight })
        .png()
        .toBuffer();

        console.log("Extracted bounding box:", boxWidth, "x", boxHeight);

        // 2. Generate icons with padding
        for (const size of sizes) {
            const logoSize = Math.floor(size * 0.90); // 10% padding so it fills nicely
            
            const resizedLogo = await sharp(croppedTransparentBuffer)
                .resize(logoSize, logoSize, { fit: 'inside' })
                .png()
                .toBuffer();

            const finalImage = sharp({
                create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
            }).composite([{ input: resizedLogo, gravity: 'center' }]).png();

            if (size === 16) await finalImage.toFile(path.join(outputDir, '..', 'favicon.ico'));
            else if (size === 180) await finalImage.toFile(path.join(outputDir, 'apple-touch-icon.png'));
            
            await finalImage.toFile(path.join(outputDir, `icon-${size}x${size}.png`));
            
            if (size === 192) await finalImage.toFile(path.join(outputDir, `pwa-192x192.png`));
            if (size === 512) {
                await finalImage.toFile(path.join(outputDir, `pwa-512x512.png`));
                await sharp({
                    create: { width: size, height: size, channels: 4, background: '#FFF8F3' }
                }).composite([{ input: resizedLogo, gravity: 'center' }]).png().toFile(path.join(outputDir, `maskable-icon-512x512.png`));
            }
            console.log(`Generated ${size}x${size}`);
        }

        console.log("Icon generation complete!");

    } catch (e) {
        console.error("Error generating icons:", e);
    }
}

generate();
