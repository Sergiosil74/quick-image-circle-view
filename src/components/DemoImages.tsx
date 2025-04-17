
import { Image } from "@/components/ImageViewer/ImageViewer";

// This component includes demo images for testing the viewer when no images are uploaded
export const getDemoImages = (): Image[] => {
  return [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&auto=format&fit=crop",
      name: "image-01.jpg"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&auto=format&fit=crop",
      name: "image-02.jpg"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop",
      name: "image-03.jpg"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1671315573983-5b1c45e823d7?w=800&auto=format&fit=crop",
      name: "image-04.jpg"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800&auto=format&fit=crop",
      name: "image-05.jpg"
    },
  ];
};
