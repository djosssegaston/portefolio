export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-6">
      <span className="sr-only">Chargement de l’espace d’administration…</span>
      <div className="space-y-3">
        <div className="h-7 w-52 animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 motion-reduce:animate-none"
          >
            <div className="h-3 w-24 rounded-full bg-slate-100" />
            <div className="mt-4 h-7 w-16 rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white motion-reduce:animate-none" />
    </div>
  );
}
