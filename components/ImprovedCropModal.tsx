"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatio?: number;
  onCrop: (croppedDataUrl: string) => void;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenCropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImprovedCropModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  aspectRatio = 1, 
  onCrop 
}: CropModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentHandle, setCurrentHandle] = useState<string | null>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const cropSelectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [naturalCropData, setNaturalCropData] = useState<CropData>({ x: 0, y: 0, width: 0, height: 0 });
  const [screenCropData, setScreenCropData] = useState<ScreenCropData>({ x: 0, y: 0, width: 0, height: 0 });
  const [scaleFactor, setScaleFactor] = useState(1);
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState<ScreenCropData>({ x: 0, y: 0, width: 0, height: 0 });

  // Calculate scale factor between natural and screen dimensions
  const calculateScaleFactor = useCallback(() => {
    if (!imageRef.current || !imageLoaded) return;
    
    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    if (displayWidth === 0 || displayHeight === 0) return;
    
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Calculate scale factor (average of both dimensions for object-fit: contain)
    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;
    const newScaleFactor = (scaleX + scaleY) / 2;
    
    setScaleFactor(newScaleFactor);
  }, [imageLoaded]);

  // Initialize crop selection
  const initializeCropSelection = useCallback(() => {
    if (!imageRef.current || !imageLoaded) return;
    
    const img = imageRef.current;
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Start with a centered crop area
    const cropWidth = Math.min(containerWidth * 0.8, containerHeight * aspectRatio * 0.8);
    const cropHeight = cropWidth / aspectRatio;
    
    const x = (containerWidth - cropWidth) / 2;
    const y = (containerHeight - cropHeight) / 2;
    
    const newScreenCrop = {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, containerWidth - x),
      height: Math.min(cropHeight, containerHeight - y),
    };
    
    setScreenCropData(newScreenCrop);
    
    // Convert to natural coordinates using current scale factor
    const s = scaleFactor || 1;
    setNaturalCropData({
      x: Math.round(newScreenCrop.x * s),
      y: Math.round(newScreenCrop.y * s),
      width: Math.round(newScreenCrop.width * s),
      height: Math.round(newScreenCrop.height * s),
    });
  }, [imageLoaded, aspectRatio]);

  // Update masks around crop selection
  const updateMasks = useCallback(() => {
    if (!cropSelectionRef.current || !containerRef.current) return;
    
    const overlayRect = containerRef.current.getBoundingClientRect();
    const selRect = cropSelectionRef.current.getBoundingClientRect();
    
    const top = selRect.top - overlayRect.top;
    const left = selRect.left - overlayRect.left;
    const right = overlayRect.right - selRect.right;
    const bottom = overlayRect.bottom - selRect.bottom;
    
    // Update mask styles
    const masks = document.querySelectorAll('.crop-mask');
    masks.forEach((mask, index) => {
      const maskEl = mask as HTMLElement;
      switch (index) {
        case 0: // top
          maskEl.style.top = '0px';
          maskEl.style.left = '0px';
          maskEl.style.right = '0px';
          maskEl.style.height = `${Math.max(0, top)}px`;
          break;
        case 1: // bottom
          maskEl.style.bottom = '0px';
          maskEl.style.left = '0px';
          maskEl.style.right = '0px';
          maskEl.style.height = `${Math.max(0, bottom)}px`;
          break;
        case 2: // left
          maskEl.style.top = `${Math.max(0, top)}px`;
          maskEl.style.bottom = `${Math.max(0, bottom)}px`;
          maskEl.style.left = '0px';
          maskEl.style.width = `${Math.max(0, left)}px`;
          break;
        case 3: // right
          maskEl.style.top = `${Math.max(0, top)}px`;
          maskEl.style.bottom = `${Math.max(0, bottom)}px`;
          maskEl.style.right = '0px';
          maskEl.style.width = `${Math.max(0, right)}px`;
          break;
      }
    });
  }, []);

  // Position crop selection from screen coordinates
  const positionSelectionFromScreen = useCallback((cropData?: ScreenCropData) => {
    if (!cropSelectionRef.current) return;
    
    const sel = cropSelectionRef.current;
    const data = cropData || screenCropData;
    sel.style.left = `${data.x}px`;
    sel.style.top = `${data.y}px`;
    sel.style.width = `${data.width}px`;
    sel.style.height = `${data.height}px`;
    
    updateMasks();
  }, [screenCropData, updateMasks]);

  // Handle mouse down for starting crop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageLoaded) return;
    
    const target = e.target as HTMLElement;
    const handle = target.closest('.resize-handle');
    
    if (handle) {
      setIsResizing(true);
      setCurrentHandle(handle.getAttribute('data-handle'));
    } else {
      const rect = cropSelectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const inside = 
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (inside) {
        setIsDragging(true);
      } else {
        // Start new crop selection
        setIsResizing(true);
        setCurrentHandle('se');
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        
        const x = Math.max(0, Math.min(e.clientX - containerRect.left, containerRect.width));
        const y = Math.max(0, Math.min(e.clientY - containerRect.top, containerRect.height));
        
        const newCrop = { x, y, width: 1, height: 1 };
        setScreenCropData(newCrop);
        positionSelectionFromScreen(newCrop);
      }
    }
    
    setInitialMouse({ x: e.clientX, y: e.clientY });
    setInitialCrop({ ...screenCropData });
    e.preventDefault();
  }, [imageLoaded, screenCropData, positionSelectionFromScreen]);

  // Handle mouse move for updating crop
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!imageLoaded || (!isDragging && !isResizing)) return;
    
    if (isDragging) {
      const dx = e.clientX - initialMouse.x;
      const dy = e.clientY - initialMouse.y;
      
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const newX = Math.max(0, Math.min(initialCrop.x + dx, containerRect.width - initialCrop.width));
      const newY = Math.max(0, Math.min(initialCrop.y + dy, containerRect.height - initialCrop.height));
      
      const newScreenCrop = {
        x: newX,
        y: newY,
        width: initialCrop.width,
        height: initialCrop.height,
      };
      
      setScreenCropData(newScreenCrop);
      
      // Update natural crop data immediately
      const s = scaleFactor || 1;
      setNaturalCropData({
        x: Math.round(newScreenCrop.x * s),
        y: Math.round(newScreenCrop.y * s),
        width: Math.round(newScreenCrop.width * s),
        height: Math.round(newScreenCrop.height * s),
      });
    } else if (isResizing && currentHandle) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const mx = Math.max(0, Math.min(e.clientX - containerRect.left, containerRect.width));
      const my = Math.max(0, Math.min(e.clientY - containerRect.top, containerRect.height));
      
      let { x, y, width, height } = initialCrop;
      const right = x + width;
      const bottom = y + height;
      
      // Apply aspect ratio if locked
      const applyRatio = (nx: number, ny: number, nw: number, nh: number) => {
        if (!aspectRatioLocked) return { nx, ny, nw, nh };
        
        if (nw / nh > aspectRatio) {
          nw = nh * aspectRatio;
        } else {
          nh = nw / aspectRatio;
        }
        
        return { nx, ny, nw, nh };
      };
      
      let newScreenCrop: ScreenCropData;
      
      switch (currentHandle) {
        case 'nw': {
          let nx = Math.min(mx, right - 1);
          let ny = Math.min(my, bottom - 1);
          let nw = right - nx;
          let nh = bottom - ny;
          ({ nx, ny, nw, nh } = applyRatio(nx, ny, nw, nh));
          newScreenCrop = {
            x: Math.max(0, nx),
            y: Math.max(0, ny),
            width: Math.max(1, Math.min(containerRect.width - nx, nw)),
            height: Math.max(1, Math.min(containerRect.height - ny, nh)),
          };
          break;
        }
        case 'ne': {
          let nx = x;
          let ny = Math.min(my, bottom - 1);
          let nw = Math.max(1, Math.min(containerRect.width - x, mx - x));
          let nh = bottom - ny;
          ({ nx, ny, nw, nh } = applyRatio(nx, ny, nw, nh));
          newScreenCrop = {
            x: nx,
            y: Math.max(0, ny),
            width: nw,
            height: Math.max(1, Math.min(containerRect.height - ny, nh)),
          };
          break;
        }
        case 'sw': {
          let nx = Math.min(mx, right - 1);
          let ny = y;
          let nw = right - nx;
          let nh = Math.max(1, Math.min(containerRect.height - y, my - y));
          ({ nx, ny, nw, nh } = applyRatio(nx, ny, nw, nh));
          newScreenCrop = {
            x: Math.max(0, nx),
            y: ny,
            width: Math.max(1, Math.min(containerRect.width - nx, nw)),
            height: nh,
          };
          break;
        }
        case 'se':
        default: {
          let nx = x;
          let ny = y;
          let nw = Math.max(1, Math.min(containerRect.width - x, mx - x));
          let nh = Math.max(1, Math.min(containerRect.height - y, my - y));
          ({ nx, ny, nw, nh } = applyRatio(nx, ny, nw, nh));
          newScreenCrop = {
            x: nx,
            y: ny,
            width: nw,
            height: nh,
          };
          break;
        }
      }
      
      setScreenCropData(newScreenCrop);
      
      // Update natural crop data immediately
      const s = scaleFactor || 1;
      setNaturalCropData({
        x: Math.round(newScreenCrop.x * s),
        y: Math.round(newScreenCrop.y * s),
        width: Math.round(newScreenCrop.width * s),
        height: Math.round(newScreenCrop.height * s),
      });
      
      positionSelectionFromScreen(newScreenCrop);
    }
  }, [imageLoaded, isDragging, isResizing, currentHandle, initialMouse, initialCrop, aspectRatioLocked, aspectRatio, scaleFactor, positionSelectionFromScreen]);

  // Handle mouse up for ending crop
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setCurrentHandle(null);
  }, []);

  // Apply crop and return data URL
  const applyCrop = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y, width, height } = naturalCropData;
    
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    
    // For circular crops (aspect ratio 1)
    if (aspectRatio === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
      ctx.clip();
    }
    
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    
    if (aspectRatio === 1) {
      ctx.restore();
    }
    
    const dataUrl = canvas.toDataURL('image/png', 0.92);
    onCrop(dataUrl);
    onClose();
  }, [naturalCropData, aspectRatio, onCrop, onClose]);

  // Reset crop selection
  const resetCropSelection = useCallback(() => {
    initializeCropSelection();
  }, [initializeCropSelection]);

  // Effects
  useEffect(() => {
    if (isOpen && imageLoaded) {
      calculateScaleFactor();
    }
  }, [isOpen, imageLoaded, calculateScaleFactor]);

  useEffect(() => {
    if (isOpen && imageLoaded && scaleFactor > 0) {
      initializeCropSelection();
    }
  }, [isOpen, imageLoaded, scaleFactor, initializeCropSelection]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isOpen, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isOpen && screenCropData.width > 0) {
      positionSelectionFromScreen();
    }
  }, [isOpen, screenCropData, positionSelectionFromScreen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {aspectRatio === 1 ? 'Crop Profile Picture' : 'Crop Image'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={aspectRatioLocked}
              onChange={(e) => setAspectRatioLocked(e.target.checked)}
              className="rounded"
            />
            <span>Lock aspect ratio ({aspectRatio === 1 ? '1:1' : aspectRatio.toFixed(2)})</span>
          </label>
        </div>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" ref={containerRef}>
          <div className="relative">
            <Image
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              width={800}
              height={600}
              className="max-w-full h-auto"
              onLoad={() => setImageLoaded(true)}
              style={{ display: 'block', margin: '0 auto' }}
            />
            
            {imageLoaded && (
              <div className="absolute inset-0 cursor-crosshair" onMouseDown={handleMouseDown}>
                <div
                  ref={cropSelectionRef}
                  className="absolute border-2 border-blue-500 shadow-lg"
                  style={{
                    left: `${screenCropData.x}px`,
                    top: `${screenCropData.y}px`,
                    width: `${screenCropData.width}px`,
                    height: `${screenCropData.height}px`,
                  }}
                >
                  {/* Resize handles */}
                  <div className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize" data-handle="nw" style={{ top: '-6px', left: '-6px' }} />
                  <div className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize" data-handle="ne" style={{ top: '-6px', right: '-6px' }} />
                  <div className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize" data-handle="sw" style={{ bottom: '-6px', left: '-6px' }} />
                  <div className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize" data-handle="se" style={{ bottom: '-6px', right: '-6px' }} />
                </div>
                
                {/* Masks */}
                <div className="crop-mask absolute bg-black bg-opacity-50 pointer-events-none" />
                <div className="crop-mask absolute bg-black bg-opacity-50 pointer-events-none" />
                <div className="crop-mask absolute bg-black bg-opacity-50 pointer-events-none" />
                <div className="crop-mask absolute bg-black bg-opacity-50 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={resetCropSelection}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={applyCrop}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Crop
            </button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
