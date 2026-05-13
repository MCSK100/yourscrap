export default function Loader({ message = 'Eco-Server Waking Up...' }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <p className="text-base font-medium text-slate-900">{message}</p>
      <p className="mt-2 text-sm text-slate-500">Please hang on while the platform wakes up.</p>
    </div>
  );
}
