export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold shadow-soft transition ${
      type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
    }`}>
      {message}
    </div>
  );
}
