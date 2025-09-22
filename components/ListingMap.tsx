"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type Props = {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  height?: number; // px
  disableDefaultUI?: boolean;
  companyName?: string;
  address?: string;
};

export default function ListingMap({
  lat = -27.4698,
  lng = 153.0251,
  zoom = 14,
  className,
  height = 384,
  disableDefaultUI = false,
  companyName = "Company Location",
  address,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // init after the loader script attaches google.maps.importLibrary
    async function init() {
      if (initializedRef.current) return;
      if (typeof window === "undefined" || !(window as any).google?.maps?.importLibrary) return;

      const { Map } = (await (google.maps as any).importLibrary("maps")) as google.maps.MapsLibrary;

      const map = new Map(mapDivRef.current as HTMLDivElement, {
        center: { lat, lng },
        zoom,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined,
        disableDefaultUI,
      });

      // Add marker for the company location
      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: companyName,
        label: {
          text: companyName,
          color: "#1f2937",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      // Add info window with company details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900 text-sm">${companyName}</h3>
            ${address ? `<p class="text-xs text-gray-600 mt-1">${address}</p>` : ''}
          </div>
        `,
      });

      // Show info window on marker click
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: companyName,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      initializedRef.current = true;
    }

    // try to init in case the loader is already present
    init();

    // also listen for the loader finishing later
    const readyCheck = setInterval(init, 100);
    return () => clearInterval(readyCheck);
  }, [lat, lng, zoom, disableDefaultUI, companyName, address]);

  // Height must be explicit like the sample CSS
  const style = { height: `${height}px`, width: "100%" };

  return (
    <>
      {/* Google Maps importLibrary bootstrap (official snippet) */}
      <Script id="gmaps-loader" strategy="afterInteractive">
        {`
          (g=>{
            var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;
            b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,
            u=()=>h||(h=new Promise(async(f,n)=>{
              await (a=m.createElement("script"));
              e.set("libraries",[...r]+"");
              for(k in g) e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()), g[k]);
              e.set("callback", c+".maps."+q);
              a.src = "https://maps."+c+"apis.com/maps/api/js?"+e;
              d[q]=f;
              a.onerror=()=>h=n(Error(p+" could not load."));
              a.nonce=m.querySelector("script[nonce]")?.nonce||"";
              m.head.append(a)
            }));
            d[l]?console.warn(p+" only loads once. Ignoring:", g)
                 : d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))
          })({
            key: "${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}",
            v: "weekly"
          });
        `}
      </Script>

      <div
        ref={mapDivRef}
        className={className}
        style={style}
        aria-label="Google Map of listing location"
      />
    </>
  );
}
