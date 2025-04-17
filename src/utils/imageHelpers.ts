
/**
 * Preloads an array of images and returns a promise that resolves when all images are loaded
 * @param urls Array of image URLs to preload
 * @returns Promise that resolves with array of HTMLImageElement objects
 */
export const preloadImages = (urls: string[]): Promise<HTMLImageElement[]> => {
  const imagePromises = urls.map((url) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });
  });

  return Promise.all(imagePromises);
};

/**
 * Converts a File object to a data URL
 * @param file File object to convert
 * @returns Promise that resolves with the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Sorts files by name, handling numeric sequences correctly
 * @param files Array of files to sort
 * @returns Sorted array of files
 */
export const sortFilesByName = (files: File[]): File[] => {
  return [...files].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};
