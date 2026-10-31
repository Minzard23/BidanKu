import { useState } from 'react';

// Format tanggal konsisten pakai zona waktu Jakarta, biar "hari ini" selalu akurat
// buat user di Indonesia, berapa pun zona waktu komputer mereka.
const formatJakarta = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' });

export default function VisitCalendar({ value, onChange }) {
  const hariIni = formatJakarta.format(new Date());

  // Bulan yang lagi ditampilin di kalender. Defaultnya ikut `value` (kalau ada),
  // atau hari ini. Fungsi di dalam useState cuma dijalanin sekali (lazy init).
  const [bulanAktif, setBulanAktif] = useState(
    () => new Date((value || hariIni).slice(0, 7) + '-01T12:00:00')
  );

  const tahun = bulanAktif.getFullYear();
  const bulan = bulanAktif.getMonth();

  // Senin dianggap hari pertama (bukan Minggu), jadi geser offset-nya.
  const offsetHariKosong = (bulanAktif.getDay() + 6) % 7;
  const jumlahHariDalamBulan = new Date(tahun, bulan + 1, 0).getDate();

  function bulanSebelumnya() {
    setBulanAktif(new Date(tahun, bulan - 1, 1, 12));
  }
  function bulanBerikutnya() {
    setBulanAktif(new Date(tahun, bulan + 1, 1, 12));
  }

  const bisaMundur = formatJakarta.format(bulanAktif).slice(0, 7) > hariIni.slice(0, 7);

  return (
    <fieldset className="border border-stone-200 rounded-xl p-4">
      <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
        Tanggal Kunjungan
      </legend>

      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          disabled={!bisaMundur}
          onClick={bulanSebelumnya}
          className="text-teal-700 disabled:text-stone-300 disabled:cursor-not-allowed px-2 py-1 text-lg"
        >
          ‹
        </button>
        <strong className="text-sm text-slate-700">
          {bulanAktif.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </strong>
        <button type="button" onClick={bulanBerikutnya} className="text-teal-700 px-2 py-1 text-lg">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((hari) => (
          <small key={hari} className="text-xs text-slate-400 font-medium py-1">
            {hari}
          </small>
        ))}

        {/* Kotak kosong buat ngisi hari sebelum tanggal 1 */}
        {Array.from({ length: offsetHariKosong }, (_, i) => (
          <span key={`kosong-${i}`} />
        ))}

        {Array.from({ length: jumlahHariDalamBulan }, (_, i) => {
          const tanggal = i + 1;
          const dateObj = new Date(tahun, bulan, tanggal, 12);
          const iso = `${tahun}-${String(bulan + 1).padStart(2, '0')}-${String(tanggal).padStart(2, '0')}`;
          const sudahLewat = iso < hariIni;
          const akhirPekan = [0, 6].includes(dateObj.getDay());
          const terpilih = iso === value;

          return (
            <button
              key={iso}
              type="button"
              disabled={sudahLewat || akhirPekan}
              aria-label={dateObj.toLocaleDateString('id-ID', { dateStyle: 'full' })}
              aria-pressed={terpilih}
              onClick={() => onChange(iso)}
              className={`text-sm py-1.5 rounded-lg transition
                ${terpilih ? 'bg-teal-700 text-white font-semibold' : 'hover:bg-stone-100 text-slate-700'}
                ${(sudahLewat || akhirPekan) ? 'text-stone-300 cursor-not-allowed hover:bg-transparent' : ''}`}
            >
              {tanggal}
            </button>
          );
        })}
      </div>

      <small className="block text-xs text-slate-400 mt-3">
        {value
          ? `Dipilih: ${new Date(value + 'T12:00:00').toLocaleDateString('id-ID', { dateStyle: 'full' })}`
          : 'Pilih tanggal di kalender. Sabtu dan Minggu tutup.'}
      </small>
    </fieldset>
  );
}
