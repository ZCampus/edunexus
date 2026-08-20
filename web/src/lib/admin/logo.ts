const MAX_BYTES = 2 * 1024 * 1024;
const SIZE = 256;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export function fileToLogoDataUrl(file: File): Promise<string> {
  if (!ALLOWED.has(file.type) || file.size > MAX_BYTES) {
    return Promise.reject(new Error("INVALID_LOGO"));
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("INVALID_LOGO"));
        return;
      }
      const side = Math.min(image.width, image.height);
      const sx = (image.width - side) / 2;
      const sy = (image.height - side) / 2;
      ctx.drawImage(image, sx, sy, side, side, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("INVALID_LOGO"));
    };
    image.src = objectUrl;
  });
}
