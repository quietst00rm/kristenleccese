import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const DARK_BG = '#0A0A0A';
const GOLD_ACCENT = '#D4AF37';

async function generateOGImage() {
  const inputPath = path.join(__dirname, '../public/images/Kristen-Leccese-Amazon-Expert-Consultant.png');
  const outputPath = path.join(__dirname, '../public/images/og-image.png');

  // Load and resize the portrait photo to fit on the left side
  // Original is 1765x2173, we want to fit it in roughly 400px wide area on left
  const photoHeight = OG_HEIGHT - 60; // Leave some padding
  const photoWidth = Math.round(photoHeight * (1765 / 2173)); // Maintain aspect ratio

  const resizedPhoto = await sharp(inputPath)
    .resize(photoWidth, photoHeight, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 0 } })
    .toBuffer();

  // Create SVG text overlay for the right side
  const svgText = `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&amp;family=Inter:wght@400;500&amp;display=swap');
        </style>
      </defs>

      <!-- Name -->
      <text x="${photoWidth + 80}" y="220"
            font-family="Georgia, 'Playfair Display', serif"
            font-size="56"
            font-weight="600"
            fill="white">
        KRISTEN
      </text>
      <text x="${photoWidth + 80}" y="290"
            font-family="Georgia, 'Playfair Display', serif"
            font-size="56"
            font-weight="600"
            fill="white">
        LECCESE
      </text>

      <!-- Gold accent line -->
      <rect x="${photoWidth + 80}" y="320" width="120" height="3" fill="${GOLD_ACCENT}"/>

      <!-- Tagline -->
      <text x="${photoWidth + 80}" y="380"
            font-family="Arial, 'Inter', sans-serif"
            font-size="24"
            font-weight="500"
            fill="#CCCCCC">
        Amazon Strategic
      </text>
      <text x="${photoWidth + 80}" y="415"
            font-family="Arial, 'Inter', sans-serif"
            font-size="24"
            font-weight="500"
            fill="#CCCCCC">
        Compliance Consultant
      </text>

      <!-- Subtle expertise note -->
      <text x="${photoWidth + 80}" y="480"
            font-family="Arial, 'Inter', sans-serif"
            font-size="16"
            font-weight="400"
            fill="#888888">
        Diagnostic Expertise Since 2013
      </text>
    </svg>
  `;

  // Create the final composite image
  await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 }
    }
  })
    .composite([
      // Photo on the left with some padding
      {
        input: resizedPhoto,
        left: 40,
        top: 30
      },
      // Text overlay
      {
        input: Buffer.from(svgText),
        left: 0,
        top: 0
      }
    ])
    .png()
    .toFile(outputPath);

  console.log(`OG image created successfully at: ${outputPath}`);
  console.log(`Dimensions: ${OG_WIDTH}x${OG_HEIGHT}`);
}

generateOGImage().catch(console.error);
