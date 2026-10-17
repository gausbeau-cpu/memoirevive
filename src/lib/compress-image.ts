// =========================================================================
// Compression d'image côté client (navigateur)
// Redimensionne à 2400px max (plus grand côté) et compresse en JPEG 0.85
// Réduit drastiquement le temps d'upload sur mobile à Ouagadougou
// =========================================================================

export async function compressImage(file: File): Promise<File> {
  // Si ce n'est pas une image ou si l'API Image n'est pas supportée, on renvoie tel quel
  if (!file.type.startsWith("image/") || typeof window === "undefined") {
    return file;
  }

  // Ne pas compresser les SVG ou GIF animés
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIMENSION = 2400;
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback si canvas 2d indisponible
          resolve(file);
          return;
        }

        // Fond blanc si transparence PNG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Conserver le nom d'origine avec extension .jpg
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const compressedFile = new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // Si le compressé est paradoxalement plus gros que l'original, garder l'original
            if (compressedFile.size < file.size) {
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.85
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
