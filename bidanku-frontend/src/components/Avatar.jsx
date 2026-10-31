import { API_BASE } from '../api/axios';
export default function Avatar({ nama, foto, size = 36 }) {
  const inisial = nama
    ?.split(' ')
    .map((kata) => kata[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  if (foto) {
    return (
      <img
        src={`${API_BASE}${foto}`}
        alt={nama}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-teal-700 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
    >
      {inisial}
    </div>
  );
}
