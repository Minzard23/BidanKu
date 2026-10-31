import { Link } from 'react-router-dom';

const fitur = [
  { judul: 'Booking Kunjungan', desc: 'Jadwalkan kunjungan atau konsultasi online kapan saja.' },
  { judul: 'Pantau Kehamilan', desc: 'HPL otomatis terhitung, riwayat berat badan & pemeriksaan tersimpan rapi.' },
  { judul: 'Konsultasi Langsung', desc: 'Chat langsung dengan bidan untuk pertanyaan seputar kehamilan.' },
  { judul: 'Pesan Obat', desc: 'Pesan vitamin & obat yang direkomendasikan tanpa perlu datang dulu.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo-bidanku.png" alt="BidanKu" className="h-9 w-9 rounded-full object-cover" />
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="text-sm font-medium text-teal-700 px-4 py-2 hover:underline">Masuk</Link>
          <Link to="/register" className="text-sm font-medium bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800">Daftar</Link>
        </div>
      </nav>

      <section className="relative h-[420px] bg-teal-900 overflow-hidden">
        <img src="/hero-klinik.png" alt="Klinik BidanKu" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/85 via-teal-900/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto h-full flex flex-col justify-end px-6 pb-12 text-white">
          <h1 className="text-4xl font-bold leading-tight max-w-xl">
            Pendampingan kehamilan & kesehatan ibu, dalam satu tempat.
          </h1>
          <p className="text-teal-100 mt-3 max-w-md">
            Praktik Bidan Lilis — booking kunjungan, konsultasi, dan pantau kehamilan dari genggaman tangan.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/register" className="bg-white text-teal-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-stone-100">
              Daftar Sekarang
            </Link>
            <Link to="/login" className="border border-white/50 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10">
              Masuk
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-teal-800 mb-8 text-center">Semua yang kamu butuhkan, dalam satu aplikasi</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fitur.map((f) => (
            <div key={f.judul} className="card">
              <h3 className="font-semibold text-teal-800 mb-1">{f.judul}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-400 text-center mt-14 mb-4 tracking-wide">BEKERJASAMA DENGAN</p>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <img src="/logo-kemenkes.png" style={{ height: 44 }} alt="Kemenkes" />
          <img src="/logo-dinkes-bandung.jpg" style={{ height: 52, borderRadius: 8 }} alt="Dinkes Kab. Bandung" />
          <img src="/logo%20kabupaten%20bandung.jpg" style={{ height: 52, borderRadius: 8 }} alt="Kabupaten Bandung" />
          <img src="/logo-ibi.png" style={{ height: 52, borderRadius: 8 }} alt="IBI" />
        </div>
      </section>

      <footer className="text-center text-sm text-slate-400 py-8 border-t border-stone-200">
        BidanKu — Praktik Bidan Lilis
      </footer>
    </div>
  );
}
