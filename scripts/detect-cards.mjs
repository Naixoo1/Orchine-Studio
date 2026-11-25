import sharp from 'sharp';
import fs from 'fs';

// Let's analyze pixel luminance / find card regions or define boxes
// The cards on the left have light background pixels compared to the pure black background (#000000)

async function findBoxes() {
  const image = sharp('reference/4ModuleDesignandName.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  
  // Left half is where cards are: x from 0 to 450
  // Let's find rows where there's bright content in x in [50, 250]
  const rowHasContent = [];
  for (let y = 0; y < height; y++) {
    let brightCount = 0;
    for (let x = 40; x < 300; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 40 || g > 40 || b > 40) {
        brightCount++;
      }
    }
    rowHasContent.push(brightCount > 30);
  }

  // Find contiguous ranges of true
  const ranges = [];
  let inRange = false;
  let start = 0;
  for (let y = 0; y < height; y++) {
    if (rowHasContent[y] && !inRange) {
      inRange = true;
      start = y;
    } else if (!rowHasContent[y] && inRange) {
      inRange = false;
      if (y - start > 50) {
        ranges.push({ top: start, bottom: y, height: y - start });
      }
    }
  }
  if (inRange) {
    ranges.push({ top: start, bottom: height, height: height - start });
  }

  console.log('Detected Y ranges for cards:', ranges);

  // Now for each Y range, find X bounds
  const cards = [];
  for (let i = 0; i < ranges.length; i++) {
    const { top, bottom } = ranges[i];
    let minX = width, maxX = 0;
    for (let y = top; y < bottom; y++) {
      for (let x = 10; x < 500; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r > 30 || g > 30 || b > 30) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    cards.push({ left: minX, top, width: maxX - minX, height: bottom - top });
  }

  console.log('Detected cards:', cards);
}

findBoxes();
