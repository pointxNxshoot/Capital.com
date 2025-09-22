// Image processing utilities for consistent aspect ratios and quality

export const ASPECT_RATIOS = {
  SQUARE: 1,
  CARD: 4/3,        // 4:3 for company cards
  HERO: 16/9,       // 16:9 for hero images
  THUMBNAIL: 1,     // 1:1 for thumbnails
} as const

export const IMAGE_PRESETS = {
  THUMBNAIL: { width: 300, height: 300, quality: 0.8 },
  CARD: { width: 1200, height: 900, quality: 0.9 },      // 4:3
  HERO: { width: 1920, height: 1080, quality: 0.95 },    // 16:9
  DISPLAY: { width: 1600, height: 1200, quality: 0.95 }, // 4:3 high-res
  FULLSCREEN: { width: 2400, height: 1800, quality: 1.0 }, // 4:3 ultra high-res
} as const

export const MIN_DIMENSIONS = {
  WIDTH: 400,
  HEIGHT: 300,
  MIN_PIXELS: 120000, // 400x300 minimum
}

export interface ImagePreset {
  width: number
  height: number
  quality: number
  aspectRatio: number
}

export interface ProcessedImage {
  thumbnail: string
  card: string
  hero: string
  display: string
  fullscreen: string
  original: string
}

export function validateImageDimensions(file: File, customMinDimensions?: { width: number; height: number }): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      const pixels = width * height
      
      // Use custom minimum dimensions if provided, otherwise use default
      const minWidth = customMinDimensions?.width || MIN_DIMENSIONS.WIDTH
      const minHeight = customMinDimensions?.height || MIN_DIMENSIONS.HEIGHT
      const minPixels = customMinDimensions ? (customMinDimensions.width * customMinDimensions.height) : MIN_DIMENSIONS.MIN_PIXELS
      
      if (width < minWidth || height < minHeight) {
        resolve({
          valid: false,
          error: `Image too small. Minimum size: ${minWidth}x${minHeight}px. Your image: ${width}x${height}px`
        })
        return
      }
      
      if (pixels < minPixels) {
        resolve({
          valid: false,
          error: `Image has too few pixels. Minimum: ${minPixels.toLocaleString()} pixels. Your image: ${pixels.toLocaleString()} pixels`
        })
        return
      }
      
      resolve({ valid: true })
    }
    img.onerror = () => resolve({ valid: false, error: 'Invalid image file' })
    img.src = URL.createObjectURL(file)
  })
}

export function calculateCropArea(
  sourceWidth: number,
  sourceHeight: number,
  targetAspectRatio: number
): { x: number; y: number; width: number; height: number } {
  const sourceAspect = sourceWidth / sourceHeight
  
  let cropWidth = sourceWidth
  let cropHeight = sourceHeight
  let cropX = 0
  let cropY = 0
  
  if (sourceAspect > targetAspectRatio) {
    // Source is wider than target - crop width
    cropWidth = sourceHeight * targetAspectRatio
    cropX = (sourceWidth - cropWidth) / 2
  } else if (sourceAspect < targetAspectRatio) {
    // Source is taller than target - crop height
    cropHeight = sourceWidth / targetAspectRatio
    cropY = (sourceHeight - cropHeight) / 2
  }
  
  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight }
}

export function processImageToPreset(
  file: File,
  preset: ImagePreset
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Set canvas size to target dimensions
        canvas.width = preset.width
        canvas.height = preset.height
        
        // Calculate crop area for the target aspect ratio
        const crop = calculateCropArea(img.width, img.height, preset.aspectRatio)
        
        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Draw the cropped and scaled image
        ctx.drawImage(
          img,
          crop.x, crop.y, crop.width, crop.height,
          0, 0, preset.width, preset.height
        )
        
        // Convert to data URL with specified quality
        const dataUrl = canvas.toDataURL('image/jpeg', preset.quality)
        console.log('Processed image preset:', preset, 'Data URL length:', dataUrl.length)
        resolve(dataUrl)
      } catch (error) {
        console.error('Error processing image:', error)
        // Fallback to original image if canvas processing fails
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read file'))
        reader.readAsDataURL(file)
      }
    }
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = URL.createObjectURL(file)
  })
}

export async function processImageToAllPresets(file: File, customMinDimensions?: { width: number; height: number }): Promise<ProcessedImage> {
  try {
    // Validate image first
    const validation = await validateImageDimensions(file, customMinDimensions)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    // Process to all presets
    const [thumbnail, card, hero, display, fullscreen, original] = await Promise.all([
      processImageToPreset(file, {
        ...IMAGE_PRESETS.THUMBNAIL,
        aspectRatio: ASPECT_RATIOS.SQUARE
      }),
      processImageToPreset(file, {
        ...IMAGE_PRESETS.CARD,
        aspectRatio: ASPECT_RATIOS.CARD
      }),
      processImageToPreset(file, {
        ...IMAGE_PRESETS.HERO,
        aspectRatio: ASPECT_RATIOS.HERO
      }),
      processImageToPreset(file, {
        ...IMAGE_PRESETS.DISPLAY,
        aspectRatio: ASPECT_RATIOS.CARD
      }),
      processImageToPreset(file, {
        ...IMAGE_PRESETS.FULLSCREEN,
        aspectRatio: ASPECT_RATIOS.CARD
      }),
      // Original as fallback
      new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    ])
    
    const result = {
      thumbnail,
      card,
      hero,
      display,
      fullscreen,
      original
    }
    
    console.log('Processed image result:', {
      thumbnail: result.thumbnail.substring(0, 50) + '...',
      card: result.card.substring(0, 50) + '...',
      hero: result.hero.substring(0, 50) + '...',
      display: result.display.substring(0, 50) + '...',
      fullscreen: result.fullscreen.substring(0, 50) + '...',
      original: result.original.substring(0, 50) + '...'
    })
    
    return result
  } catch (error) {
    throw error
  }
}

export function getBestImageForContainer(
  processedImage: ProcessedImage,
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number = ASPECT_RATIOS.CARD
): string {
  const containerAspect = containerWidth / containerHeight
  
  // For square containers, use square images
  if (Math.abs(containerAspect - ASPECT_RATIOS.SQUARE) < 0.1) {
    return processedImage.thumbnail
  }
  
  // For wide containers (16:9), use hero images
  if (Math.abs(containerAspect - ASPECT_RATIOS.HERO) < 0.1) {
    return processedImage.hero
  }
  
  // For card containers (4:3), use card images
  if (Math.abs(containerAspect - ASPECT_RATIOS.CARD) < 0.1) {
    return processedImage.card
  }
  
  // For very large containers, use fullscreen
  if (containerWidth > 1600) {
    return processedImage.fullscreen
  }
  
  // For large containers, use display
  if (containerWidth > 800) {
    return processedImage.display
  }
  
  // Default to card
  return processedImage.card
}
