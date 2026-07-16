'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AdminActionProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const onSubmit = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
        return;
      }

      if (target.method.toLowerCase() !== 'post') {
        return;
      }

      setIsSaving(true);
    };

    document.addEventListener('submit', onSubmit, true);
    return () => {
      document.removeEventListener('submit', onSubmit, true);
    };
  }, []);

  useEffect(() => {
    if (!isSaving) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsSaving(false);
    }, 15000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSaving]);

  useEffect(() => {
    setIsSaving(false);
  }, [pathname, searchParams]);

  if (!isSaving) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[70] rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        Menyimpan perubahan...
      </div>
    </div>
  );
}
