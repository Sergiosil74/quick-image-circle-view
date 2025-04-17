
import { useState, useEffect, useRef, MouseEvent, WheelEvent, TouchEvent } from "react";
import { ImageControls } from "./ImageControls";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingIndicator from "@/components/LoadingIndicator";

// Touch handling helper functions
const getTouchDistance = (touches: React.TouchList): number => {
  if (touches.length < 2) return 0;
  
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  
  return Math.sqrt(dx * dx + dy * dy);
};

const getTouchCenter = (touches: React.TouchList): { x: number, y: number } => {
  if (touches.length < 2) {
    return { x: touches[0]?.clientX || 0, y: touches[0]?.clientY || 0 };
  }
  
  const x = (touches[0].clientX + touches[1].clientX) / 2;
  const y = (touches[0].clientY + touches[1].clientY) / 2;
  
  return { x, y };
};

export interface Image {
  id: number;
  url: string;
  name: string;
}

export interface ImageViewerProps {
  images: Image[];
}

export const ImageViewer = ({ images }: ImageViewerProps) => {
  // Loading state for preloaded images
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);
  const [dragDelta, setDragDelta] = useState(0); // Track horizontal drag distance
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Preload images
  useEffect(() => {
    if (images.length === 0) return;
    
    const preloadAllImages = async () => {
      try {
        const imgPromises = images.map((image) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = image.url;
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.error(`Failed to load image: ${image.url}`);
              resolve(img); // Resolve anyway to avoid blocking
            };
          });
        });
        
        const loadedImages = await Promise.all(imgPromises);
        console.log(`Preloaded ${loadedImages.length} images`);
        setPreloadedImages(loadedImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadAllImages();
  }, [images]);

  // Next and previous navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetZoom();
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    resetZoom();
  };

  // Download current image
  const downloadImage = () => {
    const currentImage = images[currentIndex];
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage.url;
    // Try to preserve original filename
    const filename = currentImage.name || `image-${currentImage.id}.jpg`;
    link.download = filename.includes('.') ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mouse drag handling
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragDelta(0); // Reset drag delta on start
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    
    if (scale > 1) {
      // When zoomed in, drag moves the image
      setPosition({
        x: position.x + deltaX,
        y: position.y + (e.clientY - dragStart.y)
      });
    } else {
      // When at normal zoom, track horizontal drag for image navigation
      setDragDelta(dragDelta + deltaX);
      
      // Navigate to next/previous image when drag exceeds threshold
      const dragThreshold = 50; // Adjust this value as needed
      
      if (Math.abs(dragDelta) > dragThreshold) {
        if (dragDelta > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
        // Reset drag delta after navigation
        setDragDelta(0);
      }
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragDelta(0); // Reset drag delta on release
  };

  // Touch handling for mobile devices
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - for dragging
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setDragDelta(0); // Reset drag delta on start
    } else if (e.touches.length === 2) {
      // Two touches - for pinch zooming
      setTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent screen scrolling

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      
      if (scale > 1) {
        // When zoomed in, drag moves the image
        setPosition({
          x: position.x + deltaX,
          y: position.y + (touch.clientY - dragStart.y)
        });
      } else {
        // When at normal zoom, track drag for image navigation
        setDragDelta(dragDelta + deltaX);
        
        // Navigate when drag exceeds threshold
        const dragThreshold = 50; // Lower threshold for touch
        
        if (Math.abs(dragDelta) > dragThreshold) {
          if (dragDelta > 0) {
            goToPrevious();
          } else {
            goToNext();
          }
          // Reset after navigation
          setDragDelta(0);
        }
      }
      
      setDragStart({ x: touch.clientX, y: touch.clientY });
    } 
    else if (e.touches.length === 2) {
      // Handle pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const touchCenter = getTouchCenter(e.touches);
      
      if (touchDistance > 0) {
        const delta = (currentDistance - touchDistance) / 100;
        
        setScale(prevScale => {
          const newScale = Math.max(1, Math.min(5, prevScale + delta));
          
          // Adjust position to zoom toward center of pinch
          if (delta !== 0 && newScale !== prevScale && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setPosition(prev => ({
              x: prev.x - (touchCenter.x - rect.width / 2) * 0.05 * delta,
              y: prev.y - (touchCenter.y - rect.height / 2) * 0.05 * delta
            }));
          }
          
          return newScale;
        });
      }
      
      setTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
    setDragDelta(0); // Reset drag delta on release
  };

  // Zoom with mouse wheel
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    // Calculate zoom factor based on wheel direction
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    
    // Get cursor position relative to image for zoom targeting
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    
    setScale((prevScale) => {
      // Limit scale between 1 (no zoom) and 5 (max zoom)
      const newScale = Math.max(1, Math.min(5, prevScale + delta));
      
      // Only adjust position if we're zooming in and scale is changing
      if (delta > 0 && newScale !== prevScale && newScale > 1) {
        // Adjust position to zoom toward cursor position
        setPosition(prev => ({
          x: prev.x - (cursorX - rect.width / 2) * 0.05,
          y: prev.y - (cursorY - rect.height / 2) * 0.05
        }));
      }
      
      // If zooming out to 1, reset position
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      
      return newScale;
    });
  };

  // Reset zoom and position
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "Escape") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-black flex items-center justify-center cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {isLoading && <LoadingIndicator />}
        
        {!isLoading && images.length === 0 && (
          <div className="text-white text-center p-8">
            <p className="text-xl">No images to display</p>
            <p className="text-gray-400 mt-2">Please upload some images to view</p>
          </div>
        )}
        {!isLoading && images.length > 0 && (
          <div
            ref={imageRef}
            className="transition-transform duration-200 cursor-move"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              touchAction: "none", // Prevents touch scrolling
            }}
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].name}
              className={cn(
                "max-h-[calc(100vh-120px)] max-w-[calc(100vw-40px)] select-none",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              draggable={false}
            />
          </div>
        )}

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-opacity opacity-60 hover:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-opacity opacity-60 hover:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Image counter indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <ImageControls
        totalImages={images.length}
        currentIndex={currentIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onDownload={downloadImage}
        onReset={resetZoom}
      />
    </div>
  );
};
