"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;                 // image URL or object URL
  aspect?: number;             // e.g., 4/3, 16/9, 1/1 (default: free)
  outputWidth?: number;        // final width (default: natural crop)
  outputHeight?: number;       // final height (default: natural crop)
  onCropped?: (blob: Blob) => void;  // callback with cropped Blob
  className?: string;
};

export default function CropperImage({
  src,
  aspect,
  outputWidth,
  outputHeight,
  onCropped,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showZoomSlider, setShowZoomSlider] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !imgRef.current || !canvasRef.current) return;
    drawImage();
  }, [isClient, src, rotation, scale, position]);

  const drawImage = () => {
    if (!imgRef.current || !canvasRef.current) return;
    
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fixed canvas size based on aspect ratio (60% of original)
      const baseWidth = 360; // 600 * 0.6
      const canvasWidth = baseWidth;
      const canvasHeight = aspect ? baseWidth / aspect : baseWidth;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Draw image
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2 + position.x, -img.height / 2 + position.y);
      ctx.restore();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  async function handleCrop() {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const blob = await canvasToBlob(canvasRef.current, "image/jpeg", 0.9);
      onCropped?.(blob);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setRotation(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  function rotate(deg: number) {
    setRotation(prev => prev + deg);
  }

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const toggleZoomSlider = () => {
    setShowZoomSlider(prev => !prev);
  };

  if (!isClient) {
    return (
      <div className={className}>
        <div
          className="border rounded relative bg-gray-50"
          style={{ minHeight: 400, display: "grid", placeItems: "center" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading cropper...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="border rounded relative bg-gray-50 flex items-center justify-center"
        style={{ minHeight: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop source"
          className="hidden"
          onLoad={drawImage}
        />
        <canvas
          ref={canvasRef}
          className="cursor-move border-2 border-dashed border-white rounded"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            width: '360px', 
            height: aspect ? `${360 / aspect}px` : '360px',
            aspectRatio: aspect ? `${aspect}` : '1'
          }}
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
        <button 
          type="button" 
          onClick={() => rotate(-90)} 
          className="px-3 py-1.5 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        >
          Rotate -90°
        </button>
        <button 
          type="button" 
          onClick={() => rotate(90)}  
          className="px-3 py-1.5 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        >
          Rotate +90°
        </button>
        <button 
          type="button" 
          onClick={toggleZoomSlider}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            showZoomSlider 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Zoom
        </button>
        <button 
          type="button" 
          onClick={reset} 
          className="px-3 py-1.5 text-sm rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleCrop}
          disabled={busy}
          className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {busy ? "Cropping…" : "Apply Crop"}
        </button>
      </div>

      {/* Zoom Slider */}
      {showZoomSlider && (
        <div className="mt-2 px-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium min-w-[50px]">Zoom:</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={handleZoomChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((scale - 0.1) / (3 - 0.1)) * 100}%, #e5e7eb ${((scale - 0.1) / (3 - 0.1)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span className="font-medium text-blue-600">{Math.round(scale * 100)}%</span>
                <span>300%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), type, quality));
}
