self.addEventListener('message', async (event: MessageEvent) => {
  const { file, maxWidth = 1920, quality = 0.8 } = event.data;

  try {
    // เช็คการรองรับ OffscreenCanvas
    if (typeof OffscreenCanvas === 'undefined') {
      throw new Error('OffscreenCanvas is not supported in this browser.');
    }

    // 1. สร้าง ImageBitmap
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    // 2. คำนวณขนาดใหม่ให้สมส่วน
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // 3. วาดรูปลง OffscreenCanvas
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get 2D context from OffscreenCanvas');
    }

    ctx.drawImage(bitmap, 0, 0, width, height);

    // 4. แปลงเป็นไฟล์ เพื่อบีบอัด
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: quality
    });

    // 5. ส่งไฟล์กลับ
    self.postMessage({ status: 'success', blob: compressedBlob });
    
    // คืนหน่วยความจำ
    bitmap.close();

  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message });
  }
});
