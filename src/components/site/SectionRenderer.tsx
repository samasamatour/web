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

export function SectionRenderer({
  section,
}: {
  section: {
    sectionType: string;
    content: Record<string, unknown>;
  };
}) {
  const heading = readText(section.content, 'heading');
  const body = readText(section.content, 'body');
  const subheading = readText(section.content, 'subheading');
  const ctaLabel = readText(section.content, 'ctaLabel');
  const ctaHref = readText(section.content, 'ctaHref');
  const items = readItems(section.content);

  if (section.sectionType === 'hero') {
    return (
      <section className="rounded-2xl bg-gradient-to-br from-brand-dark to-brand-primary px-6 py-14 text-white md:px-12">
        <h1 className="max-w-4xl text-3xl font-bold md:text-5xl">{heading}</h1>
        {subheading ? <p className="mt-4 max-w-3xl text-lg text-white/90">{subheading}</p> : null}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="mt-8 inline-block rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-dark"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </section>
    );
  }

  if (section.sectionType === 'feature-list') {
    return (
      <section className="rounded-2xl border bg-white p-6 md:p-8">
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-lg bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'cta') {
    return (
      <section className="rounded-2xl bg-brand-light px-6 py-10">
        {heading ? <h2 className="text-2xl font-bold text-brand-dark">{heading}</h2> : null}
        {body ? <p className="mt-3 max-w-3xl whitespace-pre-line text-muted-foreground">{body}</p> : null}
        {ctaLabel && ctaHref ? (
          <Link href={ctaHref} className="mt-6 inline-block rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white">
            {ctaLabel}
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-white px-6 py-10">
      {heading ? <h2 className="text-2xl font-bold text-brand-dark">{heading}</h2> : null}
      {body ? <p className="mt-3 whitespace-pre-line text-muted-foreground">{body}</p> : null}
    </section>
  );
}
