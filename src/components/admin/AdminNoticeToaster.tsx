'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';

const DEFAULT_MESSAGE: Record<string, string> = {
  success: 'Perubahan berhasil disimpan.',
  updated: 'Data berhasil diperbarui.',
  created: 'Data baru berhasil dibuat.',
  deleted: 'Data berhasil dihapus.',
  error: 'Terjadi kesalahan saat menyimpan.',
};

export function AdminNoticeToaster() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef<string>('');

  useEffect(() => {
    const notice = searchParams.get('notice');
    if (!notice) {
      return;
    }

    const message = searchParams.get('message') || DEFAULT_MESSAGE[notice] || 'Perubahan berhasil diproses.';
    const marker = `${pathname}?${searchParams.toString()}`;

    if (handledRef.current === marker) {
      return;
    }

    if (notice === 'error') {
      toast.error(message);
    } else {
      toast.success(message);
    }

    handledRef.current = marker;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('notice');
    nextParams.delete('message');

    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return <Toaster richColors closeButton position="top-right" />;
}
