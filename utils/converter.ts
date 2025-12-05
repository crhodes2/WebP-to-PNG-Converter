/**
 * Converts a WebP file to a PNG Blob using HTML5 Canvas.
 */
export const convertWebPToPng = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.includes('webp') && !file.name.toLowerCase().endsWith('.webp')) {
      // If it's not strictly webp mimetype, check extension, or try anyway if image
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up memory
      URL.revokeObjectURL(url);

      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Convert to PNG Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Conversion yielded empty blob'));
          }
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Triggers a browser download for a given Blob or URL.
 */
export const downloadBlob = (blobOrUrl: Blob | string, filename: string) => {
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    if (typeof blobOrUrl !== 'string') {
      URL.revokeObjectURL(url);
    }
  }, 100);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
