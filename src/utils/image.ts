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

/* ------------------------------------------------------------------ */
/* Compresión de imágenes para los reportes                            */
/* Reduce el tamaño antes de guardar en IndexedDB (base64), para que   */
/* fotos grandes no inflen la base de datos local.                     */
/* ------------------------------------------------------------------ */

export interface CompressImageOptions {
  // Lado máximo (ancho o alto) en píxeles tras el redimensionado.
  maxDimension?: number;
  // Calidad JPEG de salida (0-1).
  quality?: number;
  // Tamaño máximo del archivo de entrada, en MB.
  maxInputMb?: number;
}

function validateImageType(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("La imagen debe ser JPG, PNG o WEBP.");
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
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

function compressDataUrl(
  dataUrl: string,
  maxDimension: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const { width, height } = image;
      const escala = Math.min(1, maxDimension / Math.max(width, height));

      const nuevoAncho = Math.round(width * escala);
      const nuevoAlto = Math.round(height * escala);

      const canvas = document.createElement("canvas");
      canvas.width = nuevoAncho;
      canvas.height = nuevoAlto;

      const context = canvas.getContext("2d");

      if (!context) {
        // Si no hay canvas disponible, devolvemos el original sin comprimir.
        resolve(dataUrl);
        return;
      }

      context.drawImage(image, 0, 0, nuevoAncho, nuevoAlto);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    image.onerror = () => {
      reject(new Error("No se pudo procesar la imagen."));
    };

    image.src = dataUrl;
  });
}

// Lee, valida, redimensiona y comprime una imagen, devolviendo un data URL.
// Pensada para las imágenes de los reportes (no toca la lógica del perfil).
export async function fileToCompressedDataUrl(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const { maxDimension = 1280, quality = 0.8, maxInputMb = 10 } = options;

  validateImageType(file);

  if (file.size > maxInputMb * 1024 * 1024) {
    throw new Error(`La imagen no debe superar ${maxInputMb} MB.`);
  }

  const dataUrl = await readFileAsDataUrl(file);

  // En entornos sin DOM (por seguridad) devolvemos el original.
  if (typeof document === "undefined") {
    return dataUrl;
  }

  return compressDataUrl(dataUrl, maxDimension, quality);
}
