
import { ArrowLeftRight, MousePointer, Download, ZoomIn, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Instructions = () => {
  const navigate = useNavigate();
  const instructions = [
    {
      icon: <MousePointer size={20} />,
      title: "Drag to Navigate",
      description: "Click and drag left or right to cycle through images",
    },
    {
      icon: <ZoomIn size={20} />,
      title: "Zoom",
      description: "Use mouse wheel to zoom in and out of images",
    },
    {
      icon: <ArrowLeftRight size={20} />,
      title: "Keyboard Navigation",
      description: "Use arrow keys to navigate between images",
    },
    {
      icon: <Download size={20} />,
      title: "Download",
      description: "Save the current image to your device",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        Back to Viewer
      </Button>
      <h2 className="text-xl font-bold mb-6 text-center">How to Use the Image Viewer</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instructions.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              {item.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
