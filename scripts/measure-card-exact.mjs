import sharp from 'sharp';

async function measureCards() {
  const image = sharp('reference/4ModuleDesignandName.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's inspect along Y=160 (middle of first card), Y=580 (card 2), Y=910 (card 3), Y=1310 (card 4)
  const ySamples = [160, 580, 910, 1310];

  for (const y of ySamples) {
    let startX = -1;
    let endX = -1;
    for (let x = 0; x < 500; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const isCard = (r > 30 || g > 30 || b > 30);
      if (isCard && startX === -1) {
        startX = x;
      }
      if (!isCard && startX !== -1 && endX === -1) {
        endX = x;
      }
    }
    console.log(`At Y=${y}: startX=${startX}, endX=${endX}, cardWidth=${endX - startX}`);
  }
}

measureCards();
