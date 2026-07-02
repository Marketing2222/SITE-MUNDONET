import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface Slide { id: number; url: string; title: string; subtitle: string; sort_order: number; active: number; }
const EMPTY: Omit<Slide,'id'> = { url:'', title:'', subtitle:'', sort_order:0, active:1 };

export const ManageHero = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState<Omit<Slide,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => setSlides(await apiFetch('/hero/all'));

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s: Slide) => { setEditing(s); setForm({ url: s.url, title: s.title, subtitle: s.subtitle, sort_order: s.sort_order, active: s.active }); setModal(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm({ ...form, url: data.url });
    } catch { setMsg('Erro no upload'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await apiFetch(`/hero/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) });
      else await apiFetch('/hero', { method: 'POST', body: JSON.stringify(form) });
      setMsg('Salvo com sucesso!');
      setModal(false);
      load();
    } catch (e: unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Remover este slide?')) return;
    await apiFetch(`/hero/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>🖼️ Banners do Hero</h2><p>Gerencie os slides do carrossel principal do site.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Slide</button>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div className="admin-items-list">
        {slides.map(s => (
          <div key={s.id} className="admin-item-row">
            <img src={s.url} alt={s.title} className="admin-item-thumb" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            <div className="admin-item-info">
              <strong>{s.title}</strong>
              <span>{s.subtitle}</span>
            </div>
            <span className={`admin-badge ${s.active ? 'green' : 'red'}`}>{s.active ? 'Ativo' : 'Inativo'}</span>
            <div className="admin-item-actions">
              <button className="admin-btn ghost small" onClick={() => openEdit(s)}>✏️ Editar</button>
              <button className="admin-btn danger small" onClick={() => remove(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Editar Slide' : 'Novo Slide'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="admin-form">
              <div className="admin-field">
                <label>URL da Imagem</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                  <label className="admin-btn secondary small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    {uploading ? 'Enviando...' : '📁 Upload'}
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.url && <img src={form.url} alt="preview" style={{ marginTop: 8, borderRadius: 8, maxHeight: 120, objectFit: 'cover' }} onError={() => {}} />}
              </div>
              <div className="admin-field"><label>Título</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-field"><label>Subtítulo</label><textarea value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Ordem</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} /></div>
                <div className="admin-field"><label>Ativo</label><select value={form.active} onChange={e => setForm({ ...form, active: +e.target.value })}><option value={1}>Sim</option><option value={0}>Não</option></select></div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageHero;
