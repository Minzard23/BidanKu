// This adapter is installed only for an explicitly enabled UI preview build.
// No requests leave the browser. Fictional data resets when the page is reloaded.
const nextDate = new Date(); nextDate.setDate(nextDate.getDate()+3);while([0,6].includes(nextDate.getDay()))nextDate.setDate(nextDate.getDate()+1);
const data = {
 '/booking':[{id:101,jenis:'kunjungan',tanggal:nextDate.toISOString().slice(0,10),jam:'09:00:00',keluhan:'Contoh kunjungan pemeriksaan rutin.',status:'dikonfirmasi'},{id:100,jenis:'kunjungan',tanggal:'2026-10-23',jam:'10:00:00',keluhan:'Contoh riwayat kunjungan.',status:'selesai'}],
 '/artikel':[{id:1,judul:'Menyiapkan kunjungan pertama Bunda',nama_bidan:'Tim BidanKu · Contoh',konten:'Ini adalah contoh tampilan artikel. Bunda dapat menuliskan pertanyaan yang ingin dibahas dan melihat jadwal kunjungan melalui menu Jadwal kunjungan. Konten klinis akan diisi oleh bidan.'},{id:2,judul:'Mengenal ruang layanan BidanKu',nama_bidan:'Tim BidanKu · Contoh',konten:'Dalam aplikasi ini, Bunda dapat menjadwalkan kunjungan, menyimpan catatan kehamilan, dan membuka ruang konsultasi. Data pada preview ini hanya ilustrasi, bukan rekam medis atau layanan aktif.'}],
 '/kehamilan':[], '/obat':[{id:1,nama:'Produk contoh A',harga:15000,stok:12},{id:2,nama:'Produk contoh B',harga:22000,stok:8}], '/pesanan':[], '/pesanan/metode':{transfer:true}, '/input-harian':[],
 '/profil':{profil:{nama:'Bunda Maya',email:'maya@example.test',tanggal_lahir:'',alamat:'',golongan_darah:'',riwayat_penyakit:'',alergi:'',no_hp:''}},
 '/konsultasi/9001':[{id:1,pengirim_id:2,pesan:'Selamat datang di preview ruang konsultasi. Pesan di sini hanya simulasi dan tidak dikirim ke bidan.'}]
};
export default async function previewAdapter(config){
 const method=config.method?.toLowerCase()||'get';const url=config.url;let body=config.data;try{body=typeof body==='string'?JSON.parse(body):body}catch{body={}}
 function fail(message){throw Object.assign(new Error(message),{response:{status:400,data:{message}},config})}
 let result;
 if(url.startsWith('/auth/'))fail('Ini preview UI. Gunakan tombol “Coba sebagai Bunda Maya” tanpa email atau kata sandi.');
 const bookings=data['/booking'];
 const staff=JSON.parse(localStorage.getItem('bidanku-preview-user')||'{}').role==='bidan';
 const feeGate=(pid)=>bookings.find(b=>{
  const start=Date.parse(b.tanggal.slice(0,10)+'T'+b.jam.slice(0,5)+':00+07:00');
  return Number(pid)===Number(b.pasien_id||9001) && b.jenis==='konsultasi_online'&&b.status==='dikonfirmasi'&&b.biaya_diterima===25000&&Date.now()>=start&&Date.now()<start+3600000;
 });
 if(url==='/booking/instruksi') result={instruksi:'Simulasi. Gunakan referensi DEMO-25000. Tidak ada transfer uang asli.'};
 else if(url==='/booking/pasien')result=staff?[{id:9001,nama:'Bunda Maya'}]:[];
 else if(url==='/konsultasi'&&method==='get')result=staff?[{pasien_id:9001,nama:'Bunda Maya'}]:[];
 else if(url.startsWith('/konsultasi/')||url==='/konsultasi'){
  const pid=method==='post'?(staff?body.pasien_id:9001):url.split('/').at(-1);
  const booking=feeGate(pid);if(!booking)fail('Belum ada sesi berbayar aktif pada jam ini.');
  if(url.includes('/sesi/'))result={berakhir:new Date(Date.parse(booking.tanggal.slice(0,10)+'T'+booking.jam.slice(0,5)+':00+07:00')+3600000).toISOString()};
  else if(method==='get')result=data['/konsultasi/9001'];
  else {data['/konsultasi/9001'].push({id:Date.now(),pengirim_id:staff?2:9001,pesan:body.pesan});result={message:'Pesan simulasi tersimpan.'}}
 }
 else if(/^\/booking\/\d+\/(referensi|verifikasi|status)$/.test(url)){
  const b=bookings.find(b=>b.id===Number(url.split('/')[2]));if(!b)fail('Booking tidak ditemukan.');
  if(url.endsWith('/referensi')){if(staff||!body.referensi?.trim())fail('Isi referensi pembayaran.');b.referensi_konsultasi=body.referensi}
  if(url.endsWith('/verifikasi')){if(!staff||!b.referensi_konsultasi)fail('Referensi belum tersedia.');b.biaya_diterima=25000;b.status='dikonfirmasi'}
  if(url.endsWith('/status')){if(!staff)fail('Akses ditolak.');b.status=body.status}result={message:'Tersimpan.'}
 }
 else  if(method==='get'){result=data[url]??[]}
 else if(method==='post'&&url==='/booking'){const item={...body,id:Date.now(),pasien_id:staff?body.pasien_id:9001,status:staff?'dikonfirmasi':'menunggu'};data[url]=[item,...data[url]];result={message:'Simulasi booking dibuat.',bookingId:item.id}}
 else if(method==='post'&&url==='/konsultasi'){data['/konsultasi/9001'].push({id:Date.now(),pengirim_id:9001,pesan:body.pesan});result={message:'Pesan simulasi disimpan.'}}
 else if(method==='put'&&url==='/profil'){const {foto_baru,...profil}=body;profil.foto_profil=foto_baru||profil.foto_profil||'';data['/profil']={profil};result={nama:profil.nama,foto_profil:profil.foto_profil}}
 else if(method==='post' && url==='/pesanan'){
  const prior=data[url].find(o=>o.checkout_key===body.checkout_key);
  if(prior)result={id_pesanan:prior.id};
  else {
   const items=body.items.map(i=>{const product=data['/obat'].find(o=>o.id===i.obat_id);if(!product || i.jumlah<1 || i.jumlah>product.stok)fail('Stok contoh tidak cukup.');return {...i,nama:product.nama,subtotal:product.harga*i.jumlah}});
   items.forEach(i=>data['/obat'].find(o=>o.id===i.obat_id).stok-=i.jumlah);
   const id=200+data[url].length;data[url].unshift({id,items,total_harga:items.reduce((v,i)=>v+i.subtotal,0),status:'menunggu_konfirmasi',metode_bayar:body.metode_bayar,checkout_key:body.checkout_key,instruksi_transfer:body.metode_bayar==='transfer'?'Simulasi saja. Masukkan nomor referensi contoh, misalnya DEMO-001.':''});result={id_pesanan:id}
  }
 }
 else if(method==='post' && /^\/pesanan\/\d+\/pembayaran$/.test(url)){
  const order=data['/pesanan'].find(o=>o.id===Number(url.split('/')[2]));
  if(!order || order.metode_bayar!=='transfer')fail('Pesanan tidak tersedia.');
  order.referensi_bayar=body.referensi;result={message:'Referensi simulasi disimpan.'}
 }
 else if(method==='post' && url==='/kehamilan'){
  const date=new Date(body.hpht);if(!Number.isFinite(+date))fail('Pilih tanggal HPHT.');date.setUTCDate(date.getUTCDate()+280);
  data[url].unshift({...body,id:Date.now(),status:'hamil',hpl:date.toISOString().slice(0,10)});result={message:'Tersimpan.'}
 }
 else {fail('Fitur ini memerlukan backend asli. Preview hanya menampilkan antarmukanya.')}
 return {data:JSON.parse(JSON.stringify(result)),status:200,statusText:'OK',headers:{},config};
}
