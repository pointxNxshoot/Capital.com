import RealestateGallery from "@/components/RealestateGallery";

const sampleImages = [
  { 
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop&crop=center", 
    alt: "Modern house exterior with clean lines" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop&crop=center", 
    alt: "Spacious living room with large windows" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop&crop=center", 
    alt: "Modern kitchen with island" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600566753086-5f2a82149b82?w=1200&h=675&fit=crop&crop=center", 
    alt: "Master bedroom with ensuite" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=675&fit=crop&crop=center", 
    alt: "Outdoor patio area" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop&crop=center", 
    alt: "Dining room with modern fixtures" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=675&fit=crop&crop=center", 
    alt: "Home office space" 
  },
  { 
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=675&fit=crop&crop=center", 
    alt: "Garden view from inside" 
  }
];

export default function GalleryDemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Property Gallery Demo
          </h1>
          <p className="text-gray-600">
            Professional image slider with navigation arrows, keyboard controls, and thumbnail sync
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <RealestateGallery images={sampleImages} />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>Navigation arrows:</strong> Click prev/next buttons or use keyboard arrows</li>
            <li>• <strong>Thumbnail sync:</strong> Click any thumbnail to jump to that image</li>
            <li>• <strong>Responsive design:</strong> Adapts to different screen sizes</li>
            <li>• <strong>Lazy loading:</strong> Images load as needed for better performance</li>
            <li>• <strong>Fixed aspect ratios:</strong> 16:9 for hero, 4:3 for thumbnails</li>
            <li>• <strong>Accessibility:</strong> Screen reader friendly with proper ARIA labels</li>
            <li>• <strong>Object-cover:</strong> Images are cropped consistently without stretching</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
