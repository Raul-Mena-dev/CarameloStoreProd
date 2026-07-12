"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/types/database";
import { cn } from "@/lib/utils";

const ROTATION_INTERVAL = 5_000;

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasMultiple = banners.length > 1;

  const show = useCallback((index: number) => {
    setCurrent((index + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (!hasMultiple || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => show(current + 1), ROTATION_INTERVAL);
    return () => window.clearInterval(interval);
  }, [current, hasMultiple, paused, show]);

  if (!banners.length) {
    return <BannerSlide />;
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Promociones"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div aria-live="polite">
        <BannerSlide banner={banners[current]} position={current + 1} total={banners.length} />
      </div>

      {hasMultiple && <>
        <button type="button" aria-label="Banner anterior" onClick={() => show(current - 1)} className="focus-ring absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-gold md:left-7">
          <ArrowLeft size={20}/>
        </button>
        <button type="button" aria-label="Banner siguiente" onClick={() => show(current + 1)} className="focus-ring absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-gold md:right-7">
          <ArrowRight size={20}/>
        </button>
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Seleccionar promoción">
          {banners.map((banner, index) => <button key={banner.id} type="button" role="tab" aria-selected={current === index} aria-label={`Mostrar promoción ${index + 1}: ${banner.title}`} onClick={() => show(index)} className={cn("focus-ring h-2.5 rounded-full transition-all", current === index ? "w-8 bg-gold" : "w-2.5 bg-white/70 hover:bg-white")}/>) }
        </div>
      </>}
    </section>
  );
}

function BannerSlide({ banner, position = 1, total = 1 }: { banner?: Banner; position?: number; total?: number }) {
  return (
    <div className="relative flex h-[620px] items-center overflow-hidden rounded-[2.5rem] bg-cherry p-8 text-white sm:h-[570px] md:h-[520px] md:p-16" aria-label={banner ? `${banner.title}, promoción ${position} de ${total}` : undefined}>
      {banner?.image_url && <Image src={banner.image_url} alt="" fill priority={position === 1} className="object-cover opacity-30" sizes="(max-width: 1180px) 100vw, 1180px"/>}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center md:mx-0 md:text-left">
        <span className="badge bg-gold text-ink">Un antojo muy feliz</span>
        <h1 className="mt-5 line-clamp-3 text-4xl font-black leading-[.95] sm:text-5xl md:text-7xl">{banner?.title ?? "Dulces para celebrar lo cotidiano"}</h1>
        <p className="mt-6 line-clamp-3 max-w-xl text-base text-white/85 sm:text-lg">{banner?.subtitle ?? "Chocolates, gomitas y clásicos mexicanos seleccionados para compartir, regalar o consentirte."}</p>
        <Link href={banner?.button_url ?? "/productos"} className="btn-secondary mt-8">{banner?.button_text ?? "Ver todos los dulces"}<ArrowRight className="ml-2"/></Link>
      </div>
    </div>
  );
}
