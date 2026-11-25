import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processAssets() {
  if (!fs.existsSync('public/scarves')) {
    fs.mkdirSync('public/scarves', { recursive: true });
  }

  const cards = [
    { id: 'florave', left: 43, top: 36, width: 288, height: 288 },
    { id: 'sylvea', left: 43, top: 439, width: 288, height: 287 },
    { id: 'florielle', left: 43, top: 770, width: 288, height: 287 },
    { id: 'naturea', left: 43, top: 1172, width: 288, height: 287 },
  ];

  for (const card of cards) {
    const outputPathWebp = path.join('public/scarves', `${card.id}.webp`);
    await sharp('reference/4ModuleDesignandName.jpeg')
      .extract({ left: card.left, top: card.top, width: card.width, height: card.height })
      .webp({ quality: 95 })
      .toFile(outputPathWebp);
    console.log(`Saved ${outputPathWebp}`);

    const outputPathJpg = path.join('public/scarves', `${card.id}.jpg`);
    await sharp('reference/4ModuleDesignandName.jpeg')
      .extract({ left: card.left, top: card.top, width: card.width, height: card.height })
      .jpeg({ quality: 95 })
      .toFile(outputPathJpg);
    console.log(`Saved ${outputPathJpg}`);
  }
}

processAssets().catch(console.error);
