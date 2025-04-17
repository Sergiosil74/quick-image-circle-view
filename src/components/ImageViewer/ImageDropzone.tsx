
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Image } from "./ImageViewer";

interface ImageDropzoneProps {
  onImagesLoaded: (images: Image[]) => void;
}

export const ImageDropzone = ({ onImagesLoaded }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(
    (files: FileList) => {
      setIsLoading(true);
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      // Sort files by name (assuming they are numbered)
      imageFiles.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      const loadedImages: Image[] = [];
      let loadedCount = 0;

      imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            loadedImages.push({
              id: index,
              url: e.target.result as string,
              name: file.name,
            });

            loadedCount++;
            if (loadedCount === imageFiles.length) {
              onImagesLoaded(loadedImages);
              setIsLoading(false);
              setIsDragging(false);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [onImagesLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
      setIsDragging(false);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary/50"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`p-4 rounded-full ${
            isDragging ? "bg-primary/20" : "bg-gray-100"
          }`}
        >
          <Upload
            size={40}
            className={isDragging ? "text-primary" : "text-gray-400"}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">
            {isLoading ? "Loading images..." : "Drop your image files here"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            or{" "}
            <label
              htmlFor="file-input"
              className="text-primary hover:text-primary/80 cursor-pointer"
            >
              browse
            </label>{" "}
            to select files
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports: JPG, PNG, GIF, WEBP
          </p>
        </div>
      </div>
    </div>
  );
};
