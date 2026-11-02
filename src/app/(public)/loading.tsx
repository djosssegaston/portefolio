export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement de la page…</span>

      <div
        aria-hidden="true"
        className="relative overflow-hidden bg-[#05070f] pb-24 pt-28 sm:pb-28 sm:pt-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_20%_10%,rgba(37,99,235,0.22),transparent_65%),radial-gradient(ellipse_45%_45%_at_85%_35%,rgba(34,211,238,0.14),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-32 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
          <div className="mt-7 space-y-4">
            <div className="h-12 w-[min(34rem,85%)] animate-pulse rounded-2xl bg-white/10 motion-reduce:animate-none sm:h-16" />
            <div className="h-12 w-[min(24rem,65%)] animate-pulse rounded-2xl bg-white/[0.07] motion-reduce:animate-none sm:h-16" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-[min(38rem,90%)] animate-pulse rounded-full bg-white/[0.06] motion-reduce:animate-none" />
            <div className="h-4 w-[min(30rem,70%)] animate-pulse rounded-full bg-white/[0.06] motion-reduce:animate-none" />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 h-4 w-40 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="surface h-64 animate-pulse p-6 motion-reduce:animate-none"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="mt-6 h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-5/6 rounded-full bg-slate-100" />
                <div className="mt-8 h-3 w-24 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
