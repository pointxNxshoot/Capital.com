"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export type GalleryImage = { src: string; alt?: string };

export default function RealestateGallery({ images }: { images: GalleryImage[] }) {
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="aspect-[16/9] relative overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative">
        {/* Navigation arrows (Hooked via Navigation module) */}
        <button 
          aria-label="Previous image" 
          className="re-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full bg-black/50 text-white w-10 h-10 hover:bg-black/70 focus:outline-none transition-colors"
        >
          ‹
        </button>
        <button 
          aria-label="Next image" 
          className="re-next absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full bg-black/50 text-white w-10 h-10 hover:bg-black/70 focus:outline-none transition-colors"
        >
          ›
        </button>

        <div className="aspect-[16/9] relative overflow-hidden rounded-xl">
          <Swiper
            modules={[Navigation, Thumbs, Keyboard, A11y]}
            navigation={{ nextEl: ".re-next", prevEl: ".re-prev" }}  // <- Navigation in use
            keyboard={{ enabled: true }}
            thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
            spaceBetween={0}
            slidesPerView={1}
            loop={images.length > 1}
            a11y={{ enabled: true }}
            className="h-full w-full"
          >
            {images.map((im, i) => (
              <SwiperSlide key={i}>
                <div className="absolute inset-0">
                  {/* Use Next/Image for perf; object-cover to keep framing */}
                  <Image
                    src={im.src}
                    alt={im.alt ?? `Property image ${i + 1}`}
                    fill
                    className="object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* THUMB STRIP */}
      {images.length > 1 && (
        <div className="mt-3">
          <Swiper
            modules={[Navigation, Thumbs, Keyboard, A11y]}
            onSwiper={setThumbs}
            watchSlidesProgress
            spaceBetween={8}
            slidesPerView={5}
            breakpoints={{ 
              640: { slidesPerView: 6 }, 
              1024: { slidesPerView: 8 } 
            }}
            className="select-none"
          >
            {images.map((im, i) => (
              <SwiperSlide key={`t-${i}`}>
                <div className="aspect-[4/3] relative overflow-hidden rounded-lg border border-black/10 cursor-pointer hover:border-black/20 transition-colors">
                  <Image
                    src={im.src}
                    alt={im.alt ?? `Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
