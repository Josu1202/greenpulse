const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateProfileImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("La imagen debe ser JPG, PNG o WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`La imagen no debe superar ${MAX_IMAGE_SIZE_MB} MB.`);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  validateProfileImage(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("No se pudo procesar la imagen."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("No se pudo leer la imagen seleccionada."));
    };

    reader.readAsDataURL(file);
  });
}