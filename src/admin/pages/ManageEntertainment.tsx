import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface App {
  id:number; name:string; icon:string; logo_url:string; banner_url:string; description:string; link_url:string;
  sort_order:number; active:boolean;
}
const EMPTY = { name:'', icon:'🎬', logo_url:'', banner_url:'', description:'', link_url:'', sort_order:0, active:true };

const UploadBtn = ({ value, onChange }: { value:string; onChange:(url:string)=>void }) => {
  const [uploading, setUploading] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('image', file);
    try {
      setUploading(true);
      const token = localStorage.getItem('mundonet_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:fd,
      });
      const d = await res.json();
      if (d.url) onChange(d.url);
    } catch { alert('Erro no upload'); }
    finally { setUploading(false); }
  };
  return (
    <div>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder="https://..." style={{ flex:1, minWidth:180 }} />
        <label className="admin-btn ghost small" style={{ cursor:'pointer', whiteSpace:'nowrap' }}>
          {uploading ? '⏳...' : '📷 Upload'}
          <input type="file" accept="image/*" style={{ display:'none' }} onChange={handle} />
        </label>
      </div>
      {value && <img src={value} alt="" style={{ height:40, borderRadius:6, marginTop:6, objectFit:'contain', display:'block' }} />}
    </div>
  );
};

export const ManageEntertainment = () => {
  const [items, setItems] = useState<App[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<App|null>(null);
  const [form, setForm] = useState<Omit<App,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await apiFetch('/entertainment/all'));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (e: App) => { setEditing(e); setForm({...e}); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await apiFetch(`/entertainment/${editing.id}`, { method:'PUT', body: JSON.stringify(form) });
      else await apiFetch('/entertainment', { method:'POST', body: JSON.stringify(form) });
      setModal(false); load();
    } finally { setSaving(false); }
  };

  const remove = async (id:number) => {
    if (!confirm('Remover?')) return;
    await apiFetch(`/entertainment/${id}`, { method:'DELETE' });
    load();
  };

  const move = async (id:number, dir:-1|1) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx], b = items[target];
    await apiFetch(`/entertainment/${a.id}`, { method:'PUT', body: JSON.stringify({ ...a, sort_order: b.sort_order }) });
    await apiFetch(`/entertainment/${b.id}`, { method:'PUT', body: JSON.stringify({ ...b, sort_order: a.sort_order }) });
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>🎬 Aplicativos do Carrossel</h2><p>Banners e logos exibidos na seção de entretenimento.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Aplicativo</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Ordem</th><th>Banner</th><th>Logo</th><th>Nome</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id}>
                <td>
                  <div style={{display:'flex',flexDirection:'column',gap:2,alignItems:'center'}}>
                    <button className="admin-btn ghost" style={{padding:'2px 6px',fontSize:'0.7rem',lineHeight:1}} disabled={idx===0} onClick={()=>move(it.id,-1)}>▲</button>
                    <span style={{fontSize:'0.8rem',color:'var(--adm-text2)'}}>{it.sort_order}</span>
                    <button className="admin-btn ghost" style={{padding:'2px 6px',fontSize:'0.7rem',lineHeight:1}} disabled={idx===items.length-1} onClick={()=>move(it.id,1)}>▼</button>
                  </div>
                </td>
                <td>{it.banner_url ? <img src={it.banner_url} alt="" style={{height:48,borderRadius:6,objectFit:'cover',minWidth:80}} /> : <span style={{fontSize:'1.3rem'}}>{it.icon}</span>}</td>
                <td>{it.logo_url ? <img src={it.logo_url} alt="" style={{height:32,borderRadius:4}} /> : <span style={{fontSize:'1rem',opacity:0.4}}>—</span>}</td>
                <td><strong>{it.name}</strong></td>
                <td><span className={`admin-badge ${it.active ? 'green' : 'red'}`}>{it.active ? 'Ativo' : 'Inativo'}</span></td>
                <td><div style={{display:'flex',gap:6}}>
                  <button className="admin-btn ghost small" onClick={()=>openEdit(it)}>✏️</button>
                  <button className="admin-btn danger small" onClick={()=>remove(it.id)}>🗑️</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="admin-modal" style={{maxWidth:560}}>
            <div className="admin-modal-header">
              <h3>{editing?'Editar Aplicativo':'Novo Aplicativo'}</h3>
              <button className="admin-modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="admin-form" style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="admin-field">
                <label>Nome do Aplicativo</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Deezer" />
              </div>
              <div className="admin-field">
                <label>Imagem do Banner (imagem de fundo do card)</label>
                <UploadBtn value={form.banner_url} onChange={url=>setForm({...form,banner_url:url})} />
                <small style={{color:'var(--adm-text2)',marginTop:4,display:'block'}}>Imagem retangular que aparece como fundo do card. Proporção recomendada: 3:4.</small>
              </div>
              <div className="admin-field">
                <label>Logo do Aplicativo (sobreposta ao banner)</label>
                <UploadBtn value={form.logo_url} onChange={url=>setForm({...form,logo_url:url})} />
                <small style={{color:'var(--adm-text2)',marginTop:4,display:'block'}}>Logo que aparece na parte inferior do card, sobre o gradiente.</small>
              </div>
              <div className="admin-field">
                <label>Descrição (tooltip ao passar o mouse)</label>
                <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Ex: Onde a música ganha vida" />
              </div>
              <div className="admin-field">
                <label>Link (ao clicar no card)</label>
                <input value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})} placeholder="https://..." />
              </div>
              <div className="admin-field">
                <label>Ícone (emoji, fallback)</label>
                <input value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} style={{fontSize:'1.3rem'}} />
              </div>
              <div className="admin-field">
                <label>Status</label>
                <select value={form.active ? 1 : 0} onChange={e=>setForm({...form,active:e.target.value==='1'})}>
                  <option value={1}>Ativo</option><option value={0}>Inativo</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn ghost" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="admin-btn primary" onClick={save} disabled={saving}>{saving?'Salvando...':'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageEntertainment;