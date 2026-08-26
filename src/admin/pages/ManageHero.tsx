import { useEffect, useState } from 'react';
import { apiFetch, getToken } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface Slide { id: number; url: string; title: string; subtitle: string; sort_order: number; active: boolean; }
const EMPTY: Omit<Slide,'id'> = { url:'', title:'', subtitle:'', sort_order:0, active:true };

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

  const openNew = () => { setEditing(null); setForm({ url:'', title:'', subtitle:'', sort_order: slides.length, active: true }); setModal(true); };
  const openEdit = (s: Slide) => { setEditing(s); setForm({ url: s.url, title: s.title, subtitle: s.subtitle, sort_order: s.sort_order, active: s.active }); setModal(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setForm({ ...form, url: data.url });
    } catch { setMsg('Erro no upload'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { sort_order, ...rest } = form;
        await apiFetch(`/hero/${editing.id}`, { method: 'PUT', body: JSON.stringify(rest) });
      } else {
        await apiFetch('/hero', { method: 'POST', body: JSON.stringify(form) });
      }
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

  const moveSlide = async (id: number, direction: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const current = slides[idx];
    const target = slides[targetIdx];
    const currentNewOrder = target.sort_order;
    const targetNewOrder = current.sort_order;
    await Promise.all([
      apiFetch(`/hero/${current.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: currentNewOrder }) }),
      apiFetch(`/hero/${target.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: targetNewOrder }) }),
    ]);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>Banners do Hero</h2><p>Gerencie os slides do carrossel principal do site. Use as setas para definir a ordem.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Slide</button>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div className="admin-items-list">
        {slides.map((s, idx) => (
          <div key={s.id} className="admin-item-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 4, minWidth: 28 }}>
              <button
                className="admin-btn ghost small"
                onClick={() => moveSlide(s.id, 'up')}
                disabled={idx === 0}
                style={{ padding: '2px 4px', fontSize: 11, opacity: idx === 0 ? 0.25 : 1, cursor: idx === 0 ? 'default' : 'pointer' }}
                title="Mover para cima"
              >&#9650;</button>
              <button
                className="admin-btn ghost small"
                onClick={() => moveSlide(s.id, 'down')}
                disabled={idx === slides.length - 1}
                style={{ padding: '2px 4px', fontSize: 11, opacity: idx === slides.length - 1 ? 0.25 : 1, cursor: idx === slides.length - 1 ? 'default' : 'pointer' }}
                title="Mover para baixo"
              >&#9660;</button>
            </div>
            <img src={s.url} alt={s.title} className="admin-item-thumb" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            <div className="admin-item-info">
              <strong>{s.title}</strong>
              <span>{s.subtitle}</span>
            </div>
            <span className={`admin-badge ${s.active ? 'green' : 'red'}`}>{s.active ? 'Ativo' : 'Inativo'}</span>
            <div className="admin-item-actions">
              <button className="admin-btn ghost small" onClick={() => openEdit(s)}>Editar</button>
              <button className="admin-btn danger small" onClick={() => remove(s.id)}>&#128465;</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Editar Slide' : 'Novo Slide'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>&times;</button>
            </div>
            <div className="admin-form">
              <div className="admin-field">
                <label>URL da Imagem</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                  <label className="admin-btn secondary small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    {uploading ? 'Enviando...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.url && <img src={form.url} alt="preview" style={{ marginTop: 8, borderRadius: 8, maxHeight: 120, objectFit: 'cover' }} onError={() => {}} />}
              </div>
              <div className="admin-field"><label>Titulo</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-field"><label>Subtitulo</label><textarea value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
              <div className="admin-field">
                <label>Ativo</label>
                <select value={form.active ? '1' : '0'} onChange={e => setForm({ ...form, active: e.target.value === '1' })}>
                  <option value={1}>Sim</option>
                  <option value={0}>Nao</option>
                </select>
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
