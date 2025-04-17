
import { useState } from "react";
import { ImageViewer } from "@/components/ImageViewer/ImageViewer";
import { ImageDropzone } from "@/components/ImageDropzone";
import { Image } from "@/components/ImageViewer/ImageViewer";
import { Button } from "@/components/ui/button";
import { getDemoImages } from "@/components/DemoImages";

const Index = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [viewerMode, setViewerMode] = useState(false);

  const handleImagesLoaded = (loadedImages: Image[]) => {
    setImages(loadedImages);
    if (loadedImages.length > 0) {
      setViewerMode(true);
    }
  };

  const closeViewer = () => {
    setViewerMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!viewerMode ? (
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Image Circle Viewer</h1>
            <p className="text-gray-600 mb-8 text-center">
              Drop your images or select them from your computer to view them in a circular gallery.
            </p>
            
            <ImageDropzone onImagesLoaded={handleImagesLoaded} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Or try with sample images</p>
              <Button
                variant="outline"
                onClick={() => {
                  setImages(getDemoImages());
                  setViewerMode(true);
                }}
              >
                Load Demo Images
              </Button>
            </div>
            
            <div className="mt-8">
              <div className="text-center text-sm text-gray-500">
                <h2 className="font-medium text-gray-700 mb-4 text-lg">Instructions:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                  <div className="bg-white p-3 rounded shadow-sm flex items-start">
                    <div className="mr-2 mt-0.5 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 13l-5 5-5-5M17 6l-5 5-5-5"/>
                      </svg>
                    </div>
                    <div>Use mouse wheel to zoom in/out</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-start">
                    <div className="mr-2 mt-0.5 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 9l7 7 7-7"/>
                      </svg>
                    </div>
                    <div>Drag left/right to navigate</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-start">
                    <div className="mr-2 mt-0.5 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                    <div>Use arrow keys to navigate</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-start">
                    <div className="mr-2 mt-0.5 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                    <div>Download current image</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-medium">Image Viewer ({images.length} images)</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={closeViewer} size="sm" className="text-white border-white/30 hover:bg-white/10">
                Exit Viewer
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ImageViewer images={images} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
