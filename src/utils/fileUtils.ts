
/**
 * Utility functions for handling files
 */

/**
 * Reads a file as a data URL
 * @param file The file to read
 * @returns A promise that resolves with the data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Reads multiple files as data URLs
 * @param files The files to read
 * @returns A promise that resolves with an array of { name, url } objects
 */
export const readFilesAsDataURLs = async (files: File[]): Promise<Array<{ name: string, url: string, id: number }>> => {
  const results = await Promise.all(
    files.map((file, index) => 
      readFileAsDataURL(file).then(url => ({
        name: file.name,
        url,
        id: index
      }))
    )
  );
  return results;
};

/**
 * Sorts files by name using natural sort (1, 2, 10 instead of 1, 10, 2)
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

/**
 * Gets a file extension from a filename
 * @param filename The filename to extract the extension from
 * @returns The extension (without the dot) or an empty string
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Checks if a file is an image
 * @param file The file to check
 * @returns true if the file is an image, false otherwise
 */
export const isImageFile = (file: File): boolean => {
  // Check by MIME type first
  if (file.type.startsWith('image/')) {
    return true;
  }
  
  // Fallback to extension check
  const extension = getFileExtension(file.name);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];
  return imageExtensions.includes(extension);
};
