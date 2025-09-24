"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CropperImage from "./CropperImage";
import SimpleImageCrop from "./SimpleImageCrop";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 4/3,
  outputWidth = 1200,
  outputHeight = 900,
}: ImageCropModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSimpleCrop, setUseSimpleCrop] = useState(false);

  useEffect(() => {
    // Check if we're on the client side and if Cropper.js is available
    if (typeof window !== 'undefined') {
      try {
        import('cropperjs').then(() => {
          setUseSimpleCrop(false);
        }).catch(() => {
          setUseSimpleCrop(true);
        });
      } catch (error) {
        setUseSimpleCrop(true);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleCrop = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      await onCropComplete(blob);
      onClose();
    } catch (error) {
      console.error("Error processing cropped image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (useSimpleCrop) {
    return (
      <SimpleImageCrop
        src={imageUrl}
        onCropComplete={handleCrop}
        onClose={onClose}
        aspectRatio={aspectRatio}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - transparent */}
      <div 
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-3xl max-h-[72vh] w-full mx-4 overflow-hidden border-2 border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-base font-semibold text-gray-900">
            Crop Image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="mb-2 text-xs text-gray-600">
            <p>Drag to move the image, use the handles to resize the crop area.</p>
            <p>The area inside the dotted line will be visible in your listing.</p>
          </div>
          
          <CropperImage
            src={imageUrl}
            aspect={aspectRatio}
            outputWidth={outputWidth}
            outputHeight={outputHeight}
            onCropped={handleCrop}
            className="w-full"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
