
import { Download, RotateCcw, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ImageControlsProps {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  onDownload: () => void;
  onReset: () => void;
}

export const ImageControls = ({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  onDownload,
  onReset,
}: ImageControlsProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
          className="h-8 w-8 rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30"
          aria-label="Previous image"
        >
          <span className="sr-only">Previous</span>
          <span className="text-lg">‹</span>
        </Button>

        <span className="text-sm">
          {currentIndex + 1} / {totalImages}
        </span>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNext}
          className="h-8 w-8 rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30"
          aria-label="Next image"
        >
          <span className="sr-only">Next</span>
          <span className="text-lg">›</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onReset}
          className="h-8 w-8 rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30"
          aria-label="Reset zoom"
        >
          <RotateCcw size={16} />
          <span className="sr-only">Reset zoom</span>
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={onDownload}
          className="h-8 w-8 rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30"
          aria-label="Download image"
        >
          <Download size={16} />
          <span className="sr-only">Download</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/instructions')}
          className="h-8 w-8 rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30"
          aria-label="View instructions"
        >
          <Info size={16} />
          <span className="sr-only">Instructions</span>
        </Button>
      </div>
    </div>
  );
};
