const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

async function main() {
  console.log('--- Generating Brand Assets ---');

  const logosDir = path.resolve(__dirname, '../logos');
  const publicBrandDir = path.resolve(__dirname, '../public/brand');
  const srcAppDir = path.resolve(__dirname, '../src/app');
  const publicDir = path.resolve(__dirname, '../public');

  if (!fs.existsSync(publicBrandDir)) {
    fs.mkdirSync(publicBrandDir, { recursive: true });
  }

  // 1. Copie octet par octet des fichiers WebP sources
  const copyMap = [
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Principal-Baseline.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-logo.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Principal-Baseline.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-logo-baseline.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Principal.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-logo-principal.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-White.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-logo-white.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Icon.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-favicon.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Icon.webp'),
      dest: path.join(publicBrandDir, 'memoire-vive-icon.webp'),
    },
    {
      src: path.join(logosDir, 'Memoire-Vive-Logo-Icon.webp'),
      dest: path.join(srcAppDir, 'icon.webp'),
    },
  ];

  for (const item of copyMap) {
    fs.copyFileSync(item.src, item.dest);
    console.log(`Copied ${path.basename(item.src)} -> ${path.relative(path.resolve(__dirname, '..'), item.dest)}`);
  }

  // 2. Génération des PNGs haute fidélité avec Chrome (Lanczos / Canvas de haute qualité)
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const iconBuffer = fs.readFileSync(path.join(logosDir, 'Memoire-Vive-Logo-Icon.webp'));
  const iconBase64 = iconBuffer.toString('base64');
  const iconDataUri = `data:image/webp;base64,${iconBase64}`;

  // Fonction pour rasteriser l'icône dans un canvas à la taille souhaitée
  async function renderIconPng(size) {
    return await page.evaluate(
      async ({ dataUri, targetSize }) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetSize;
            canvas.height = targetSize;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Conserver le ratio tout en centrant dans le carré
            const aspect = img.width / img.height;
            let drawW = targetSize;
            let drawH = targetSize;
            let drawX = 0;
            let drawY = 0;

            if (aspect > 1) {
              drawH = targetSize / aspect;
              drawY = (targetSize - drawH) / 2;
            } else if (aspect < 1) {
              drawW = targetSize * aspect;
              drawX = (targetSize - drawW) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            const pngDataUrl = canvas.toDataURL('image/png');
            resolve(pngDataUrl.split(',')[1]);
          };
          img.onerror = reject;
          img.src = dataUri;
        });
      },
      { dataUri: iconDataUri, targetSize: size }
    );
  }

  // Génération des tailles clés
  const sizes = [16, 32, 48, 180, 192, 256, 512];
  const pngBuffers = {};

  for (const s of sizes) {
    const base64 = await renderIconPng(s);
    pngBuffers[s] = Buffer.from(base64, 'base64');
  }

  await browser.close();

  // Écriture des fichiers PNG
  fs.writeFileSync(path.join(srcAppDir, 'icon.png'), pngBuffers[192]);
  console.log('Saved src/app/icon.png (192x192)');

  fs.writeFileSync(path.join(srcAppDir, 'apple-icon.png'), pngBuffers[180]);
  console.log('Saved src/app/apple-icon.png (180x180)');

  fs.writeFileSync(path.join(publicBrandDir, 'memoire-vive-icon.png'), pngBuffers[512]);
  console.log('Saved public/brand/memoire-vive-icon.png (512x512)');

  fs.writeFileSync(path.join(publicBrandDir, 'memoire-vive-icon-32.png'), pngBuffers[32]);
  fs.writeFileSync(path.join(publicBrandDir, 'memoire-vive-icon-16.png'), pngBuffers[16]);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), pngBuffers[180]);

  // 3. Génération d'un fichier .ico multi-résolution valide (16x16, 32x32, 48x48)
  function createIcoFile(entries) {
    // entries: [{ size, buffer }]
    const numImages = entries.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    let offset = headerSize + numImages * dirEntrySize;

    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // ICO type
    header.writeUInt16LE(numImages, 4);

    const dirEntries = [];
    const imageBuffers = [];

    for (const entry of entries) {
      const dir = Buffer.alloc(dirEntrySize);
      const s = entry.size >= 256 ? 0 : entry.size;
      dir.writeUInt8(s, 0); // Width
      dir.writeUInt8(s, 1); // Height
      dir.writeUInt8(0, 2); // Color palette
      dir.writeUInt8(0, 3); // Reserved
      dir.writeUInt16LE(1, 4); // Color planes
      dir.writeUInt16LE(32, 6); // Bits per pixel
      dir.writeUInt32LE(entry.buffer.length, 8); // Size of image data
      dir.writeUInt32LE(offset, 12); // Offset to image data

      dirEntries.push(dir);
      imageBuffers.push(entry.buffer);
      offset += entry.buffer.length;
    }

    return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  }

  const icoBuffer = createIcoFile([
    { size: 16, buffer: pngBuffers[16] },
    { size: 32, buffer: pngBuffers[32] },
    { size: 48, buffer: pngBuffers[48] },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Saved public/favicon.ico (Multi-size: 16, 32, 48)');

  fs.writeFileSync(path.join(srcAppDir, 'favicon.ico'), icoBuffer);
  console.log('Saved src/app/favicon.ico (Multi-size: 16, 32, 48)');

  console.log('--- Brand Assets Generated Successfully ---');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
