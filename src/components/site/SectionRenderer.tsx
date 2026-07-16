import Link from 'next/link';

function readText(content: Record<string, unknown>, key: string): string {
  const value = content[key];
  return typeof value === 'string' ? value : '';
}

function readItems(content: Record<string, unknown>): string[] {
  const value = content.items;
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

const trustIcons = [
  // Document/itinerary icon
  <svg key="doc" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  // Team/users icon
  <svg key="team" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  // Award/star icon
  <svg key="award" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  // Settings/customize icon
  <svg key="settings" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
];

const trustTitles = [
  'Itinerary Lengkap',
  'Team Building Fokus',
  'Support Profesional',
  'Kustom Fleksibel',
];

const trustTitlesEn = [
  'Complete Itinerary',
  'Team-Focused Programs',
  'Professional Support',
  'Fully Customizable',
];

export function SectionRenderer({
  section,
  locale,
}: {
  section: {
    sectionType: string;
    content: Record<string, unknown>;
  };
  locale?: string;
}) {
  const heading = readText(section.content, 'heading');
  const body = readText(section.content, 'body');
  const subheading = readText(section.content, 'subheading');
  const ctaLabel = readText(section.content, 'ctaLabel');
  const ctaHref = readText(section.content, 'ctaHref');
  const items = readItems(section.content);
  const isId = locale === 'id';

  // ─── HERO ────────────────────────────────────────────────────────────
  if (section.sectionType === 'hero') {
    return (
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-dark via-[#0f2744] to-slate-900 px-6 py-28 text-center text-white shadow-2xl md:px-12 md:py-40 lg:py-48">
        {/* Glowing orb accents */}
        <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-brand-primary opacity-[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-brand-accent opacity-[0.10] blur-[100px]" />
        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Pill badge */}
          <div className="mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            {isId ? 'Spesialis Corporate Outing Indonesia' : 'Indonesia Corporate Outing Specialists'}
          </div>

          <h1 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl text-balance">
            {heading}
          </h1>

          {subheading && (
            <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/75 md:text-xl">
              {subheading}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="shine-hover inline-flex items-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/40"
              >
                {ctaLabel}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            )}
            <Link
              href="https://wa.me/6282236037774"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              {isId ? 'Konsultasi WhatsApp' : 'WhatsApp Consult'}
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-fade-in-up delay-500 mt-16 flex justify-center">
            <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1">
              <div className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── FEATURE LIST / TRUST POINTS ─────────────────────────────────────
  if (section.sectionType === 'feature-list') {
    const titles = isId ? trustTitles : trustTitlesEn;
    return (
      <section className="rounded-3xl bg-brand-dark px-6 py-14 text-white md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {isId ? 'Mengapa Pilih ' : 'Why Choose '}
              <span className="text-gradient">{isId ? 'Kami?' : 'Us?'}</span>
            </h2>
            <p className="mt-3 text-white/60">
              {isId
                ? 'Layanan profesional untuk program outing perusahaan yang berkesan'
                : 'Professional service for meaningful corporate outing programs'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-brand-primary/40 hover:bg-white/10"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary transition-colors group-hover:bg-brand-primary/25">
                  {trustIcons[index % trustIcons.length]}
                </div>
                <h3 className="mb-2 text-base font-bold text-white">
                  {titles[index] || item.split(' ').slice(0, 3).join(' ')}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── CTA ─────────────────────────────────────────────────────────────
  if (section.sectionType === 'cta') {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-orange-500 to-brand-secondary px-6 py-16 text-center text-white shadow-xl md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          {heading && (
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl text-balance">{heading}</h2>
          )}
          {body && (
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">{body}</p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="shine-hover inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-dark shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                {ctaLabel}
              </Link>
            )}
          </div>
          <p className="mt-5 text-sm text-white/70">
            {isId ? '⚡ Respon cepat dalam jam kerja' : '⚡ Quick response during business hours'}
          </p>
        </div>
      </section>
    );
  }

  // ─── TEXT / ABOUT ─────────────────────────────────────────────────────
  return (
    <section className="rounded-3xl border border-slate-100 bg-white px-6 py-12 shadow-sm md:py-16 md:px-12">
      {heading && (
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">{heading}</h2>
      )}
      {body && (
        <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-600">{body}</p>
      )}
    </section>
  );
}
