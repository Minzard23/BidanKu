import {useState} from 'react';
import api from '../api/axios';
export default function ConsultPayment({booking:b,staff,instructions,onUpdate}){
 const [ref,setRef]=useState(b.referensi_konsultasi||''),[message,note]=useState(''),[busy,wait]=useState(false);
 if(b.jenis!=='konsultasi_online')return null;
 async function send(e){e.preventDefault();wait(true);try{await api.post('/booking/'+b.id+'/'+(staff?'verifikasi':'referensi'),{referensi:ref});await onUpdate();note(staff?'Dana terverifikasi.':'Referensi terkirim. Tunggu verifikasi bidan.')}catch(e){note(e.response?.data?.message||'Gagal menyimpan.')}finally{wait(false)}}
 return <section className="preview-box"><strong>Konsultasi online · Rp25.000 / 60 menit</strong>{Number(b.biaya_diterima)===25000?<p>Lunas. Sesi mengikuti tanggal dan jam yang tercantum.</p>:['menunggu','dikonfirmasi'].includes(b.status)?<form onSubmit={send}>{staff?<><p>Referensi: {b.referensi_konsultasi||'Belum dikirim'}</p>{b.referensi_konsultasi&&<button className="button" disabled={busy}>Saya sudah memeriksa penerimaan Rp25.000</button>}</>:<><p>{instructions}</p><label>Referensi pembayaran<input className="input-field" required minLength={3} maxLength={100} value={ref} onChange={e=>setRef(e.target.value)}/></label><button disabled={busy} className="button button-outline">Kirim referensi</button></>}</form>:<p>Booking ditutup.</p>}{message&&<p role="status">{message}</p>}</section>
}
