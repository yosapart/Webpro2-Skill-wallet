self.addEventListener('message', async (event: MessageEvent) => {
  const { file, maxWidth = 1920, quality = 0.8 } = event.data;

  try {
    // Check if OffscreenCanvas is supported
    if (typeof OffscreenCanvas === 'undefined') {
      throw new Error('OffscreenCanvas is not supported in this browser.');
    }

    // 1. Create an ImageBitmap from the file (very fast, done off-main-thread)
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    // 2. Calculate new dimensions maintaining aspect ratio
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // 3. Create OffscreenCanvas and draw
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get 2D context from OffscreenCanvas');
    }

    ctx.drawImage(bitmap, 0, 0, width, height);

    // 4. Convert to compressed WebP Blob
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: quality
    });

    // 5. Send back to main thread
    self.postMessage({ status: 'success', blob: compressedBlob });
    
    // Clean up memory
    bitmap.close();

  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message });
  }
});
