import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <p className="text-5xl font-bold text-brand-dark">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-brand-dark">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you requested is not available.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/en" className="rounded-md border px-4 py-2 text-sm font-semibold">
            Go to English Home
          </Link>
          <Link href="/id" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
            Ke Beranda ID
          </Link>
        </div>
      </div>
    </div>
  );
}
