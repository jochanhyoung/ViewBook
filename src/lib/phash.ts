// src/lib/phash.ts
// 간단한 pHash 구현 (DCT 기반 64-bit perceptual hash)

const HASH_SIZE = 8; // 8x8 = 64 bit

export async function computePhash(blob: Blob): Promise<string> {
  // 1. 32x32 그레이스케일로 축소
  const img = await createImageBitmap(blob, { resizeWidth: 32, resizeHeight: 32 });
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, 32, 32);
  const pixels = imageData.data;

  // 그레이스케일 변환 (32x32)
  const gray: number[] = [];
  for (let i = 0; i < 32 * 32; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    gray.push(0.299 * r + 0.587 * g + 0.114 * b);
  }

  // 2. DCT 적용 (단순화된 2D DCT)
  const dct = computeDCT(gray, 32);

  // 3. 좌상단 HASH_SIZE x HASH_SIZE 블록의 DC 계수 추출 (DC 제외)
  const low: number[] = [];
  for (let y = 0; y < HASH_SIZE; y++) {
    for (let x = 0; x < HASH_SIZE; x++) {
      if (x === 0 && y === 0) continue; // DC 성분 제외
      low.push(dct[y * 32 + x]);
    }
  }

  // 4. 평균 계산
  const avg = low.reduce((a, b) => a + b, 0) / low.length;

  // 5. 비트 생성
  let hash = BigInt(0);
  for (let i = 0; i < low.length && i < 64; i++) {
    if (low[i] > avg) {
      hash |= BigInt(1) << BigInt(i);
    }
  }

  return hash.toString(16).padStart(16, '0');
}

function computeDCT(pixels: number[], size: number): number[] {
  const result: number[] = new Array(size * size).fill(0);
  for (let u = 0; u < size; u++) {
    for (let v = 0; v < size; v++) {
      let sum = 0;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          sum +=
            pixels[y * size + x] *
            Math.cos(((2 * x + 1) * u * Math.PI) / (2 * size)) *
            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * size));
        }
      }
      const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
      const cv = v === 0 ? 1 / Math.sqrt(2) : 1;
      result[v * size + u] = (2 / size) * cu * cv * sum;
    }
  }
  return result;
}

export function hammingDistance(a: string, b: string): number {
  const ha = BigInt('0x' + a);
  const hb = BigInt('0x' + b);
  let xor = ha ^ hb;
  let dist = 0;
  while (xor > BigInt(0)) {
    dist += Number(xor & BigInt(1));
    xor >>= BigInt(1);
  }
  return dist;
}
