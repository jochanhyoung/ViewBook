// src/lib/image.ts
// 이미지 업로드 처리: EXIF 제거, 리사이즈, 매직 바이트 검사

const MAX_DIM = 1024;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type MimeType = 'image/jpeg' | 'image/png' | 'image/webp';
const ALLOWED_MIME: MimeType[] = ['image/jpeg', 'image/png', 'image/webp'];

// 매직 바이트 시그니처 검사
async function checkMagicBytes(buffer: ArrayBuffer): Promise<boolean> {
  const bytes = new Uint8Array(buffer.slice(0, 12));

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return true;

  // WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return true;

  return false;
}

export async function processImage(file: File): Promise<Blob> {
  // 1. MIME 타입 검사
  if (!ALLOWED_MIME.includes(file.type as MimeType)) {
    throw new Error('unsupported_mime_type');
  }

  // 2. 파일 크기 검사
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('file_too_large');
  }

  // 3. 매직 바이트 검사
  const buffer = await file.arrayBuffer();
  const valid = await checkMagicBytes(buffer);
  if (!valid) {
    throw new Error('invalid_magic_bytes');
  }

  // 4. Canvas를 이용해 EXIF 제거 + 리사이즈 (canvas.toBlob이 EXIF를 자동 제거)
  const img = await createImageBitmap(file);
  const { width: origW, height: origH } = img;

  let targetW = origW;
  let targetH = origH;

  if (origW > MAX_DIM || origH > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / origW, MAX_DIM / origH);
    targetW = Math.floor(origW * ratio);
    targetH = Math.floor(origH * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas_context_unavailable');
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // 5. 압축 (2MB 초과 시 재압축)
  let quality = 0.85;
  let blob = await canvasToBlob(canvas, 'image/jpeg', quality);

  while (blob.size > 2 * 1024 * 1024 && quality > 0.4) {
    quality -= 0.2;
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }

  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('toBlob failed'));
      },
      type,
      quality
    );
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/jpeg;base64,XXXX → XXXX
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
