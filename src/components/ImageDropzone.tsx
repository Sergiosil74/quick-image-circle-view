
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Image } from "./ImageViewer/ImageViewer";
import { sortFilesByName, readFilesAsDataURLs } from "@/utils/fileUtils";

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

  // Show a loading message during file processing
  const [processingMessage, setProcessingMessage] = useState("");
  
  const processFiles = useCallback(
    async (files: FileList) => {
      setIsLoading(true);
      setProcessingMessage("Processing images...");
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Sort files by name (assuming they are numbered)
      const sortedFiles = sortFilesByName(imageFiles);
      console.log(`Processing ${sortedFiles.length} images`);
      setProcessingMessage(`Processing ${sortedFiles.length} images...`);

      // Load all images in parallel using the utility function
      try {
        const loadedImages = await readFilesAsDataURLs(sortedFiles);
        onImagesLoaded(loadedImages);
        console.log(`Successfully loaded ${loadedImages.length} images`);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setIsLoading(false);
        setIsDragging(false);
      }
    },
    [onImagesLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files).catch(err => {
          console.error("Error processing dropped files:", err);
          setIsLoading(false);
        });
      }
      setIsDragging(false);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files).catch(err => {
          console.error("Error processing selected files:", err);
          setIsLoading(false);
        });
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
      
      <input
        type="file"
        id="directory-input"
        // @ts-ignore - These attributes exist in browsers but TypeScript doesn't know about them
        webkitdirectory="true" 
        directory="true"
        multiple
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
            {isLoading ? processingMessage || "Loading images..." : "Drop your image files here"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            <label
              htmlFor="file-input"
              className="text-primary hover:text-primary/80 cursor-pointer mr-1"
            >
              Select files
            </label>{" "}
            or{" "}
            <label
              htmlFor="directory-input"
              className="text-primary hover:text-primary/80 cursor-pointer ml-1"
            >
              choose a folder
            </label>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports: JPG, PNG, GIF, WEBP
          </p>
        </div>
      </div>
    </div>
  );
};
