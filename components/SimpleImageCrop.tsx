"use client";

import { useState, useRef } from "react";
import { X, RotateCcw, RotateCw, Crop } from "lucide-react";

interface SimpleImageCropProps {
  src: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export default function SimpleImageCrop({
  src,
  onCropComplete,
  onClose,
  aspectRatio = 4/3
}: SimpleImageCropProps) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (imgRef.current && canvasRef.current) {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size based on aspect ratio
        const canvasWidth = 400;
        const canvasHeight = canvasWidth / aspectRatio;
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

  const handleCrop = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const rotateLeft = () => {
    setRotation(rotation - 90);
  };

  const rotateRight = () => {
    setRotation(rotation + 90);
  };

  const reset = () => {
    setRotation(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - transparent */}
      <div 
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-xl w-full mx-4 overflow-hidden border-2 border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Crop Image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            <p>Drag to move the image, use the controls below to adjust.</p>
          </div>
          
          <div className="relative border rounded-lg overflow-hidden bg-gray-50" style={{ aspectRatio: aspectRatio }}>
            <img
              ref={imgRef}
              src={src}
              alt="Crop source"
              className="hidden"
              onLoad={handleImageLoad}
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button 
              type="button" 
              onClick={rotateLeft}
              className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Rotate Left
            </button>
            <button 
              type="button" 
              onClick={rotateRight}
              className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Rotate Right
            </button>
            <button 
              type="button" 
              onClick={reset}
              className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleCrop}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Crop className="h-4 w-4" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
