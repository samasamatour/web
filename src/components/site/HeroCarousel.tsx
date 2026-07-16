'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type HeroSlide = {
  imageUrl: string;
  packageName: string;
  location: string;
};

type Props = {
  slides: HeroSlide[];
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  locale: string;
  waLabel: string;
};

export function HeroCarousel({
  slides,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  locale,
  waLabel,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 400);
    },
    [current, isAnimating]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] shadow-2xl" style={{ minHeight: '90vh' }}>
      {/* ── Background slides ─────────────────────────────── */}
      {slides.map((slide, i) => (
        <div
          key={slide.imageUrl}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.packageName}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Multi-layer dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>
      ))}

      {/* ── Decorative glowing orbs ───────────────────────── */}
      <div className="pointer-events-none absolute -left-24 -top-24 z-10 h-96 w-96 rounded-full bg-brand-primary opacity-10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 z-10 h-96 w-96 rounded-full bg-brand-secondary opacity-10 blur-[100px]" />

      {/* ── Main content ──────────────────────────────────── */}
      <div className="relative z-20 flex min-h-[90vh] flex-col items-center justify-center px-6 py-28 text-center text-white md:px-12">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
          {locale === 'id'
            ? 'Spesialis Corporate Outing Indonesia'
            : 'Indonesia Corporate Outing Specialists'}
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl text-balance leading-tight">
          {heading}
        </h1>

        {/* Subheading */}
        {subheading && (
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/80 md:text-xl">
            {subheading}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-base font-bold text-brand-dark shadow-lg shadow-brand-primary/30 transition-all hover:-translate-y-1 hover:brightness-110 hover:shadow-xl"
          >
            {ctaLabel}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
          <Link
            href="https://wa.me/6282236037774"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            {waLabel}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 flex justify-center">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      {/* ── Bottom controls bar ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-6 pb-6 md:px-10">
        {/* Current slide info */}
        <div className="hidden rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-md md:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {locale === 'id' ? 'Destinasi' : 'Destination'}
          </p>
          <p className="mt-0.5 text-sm font-bold text-white">
            {slides[current]?.packageName}
          </p>
          <p className="text-xs text-white/60">{slides[current]?.location}</p>
        </div>

        {/* Dot indicators + progress */}
        <div className="flex flex-col items-end gap-3">
          {/* Progress bar for current slide */}
          <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/20">
            <div
              key={current}
              className="h-full rounded-full bg-brand-primary"
              style={{
                animation: 'progress-bar 5s linear forwards',
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'h-2.5 w-8 bg-brand-primary'
                    : 'h-2.5 w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframe for the progress bar */}
      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
