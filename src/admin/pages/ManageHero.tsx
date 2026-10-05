import { useEffect, useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, MouseSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { apiFetch, getToken } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface Slide { id: number; url: string; title: string; subtitle: string; video_url?: string; sort_order: number; active: boolean; }
const EMPTY: Omit<Slide,'id'> = { url:'', title:'', subtitle:'', video_url:'', sort_order:0, active:true };

const SortableRow = ({ slide, onEdit, onRemove }: { slide: Slide; onEdit: (s: Slide) => void; onRemove: (id: number) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`admin-item-row${isDragging ? ' dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <span className="admin-item-grip" aria-hidden="true">⋮⋮</span>
      <img src={slide.url} alt={slide.title} className="admin-item-thumb" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
      <div className="admin-item-info">
        <strong>{slide.title}</strong>
        <span>{slide.subtitle}</span>
      </div>
      <span className={`admin-badge ${slide.active ? 'green' : 'red'}`}>{slide.active ? 'Ativo' : 'Inativo'}</span>
      {slide.video_url && <span className="admin-badge" title={slide.video_url.split('?')[0].toLowerCase().endsWith('.gif') ? 'GIF animado' : 'Vídeo'}>🎬</span>}
      <div className="admin-item-actions">
        <button className="admin-btn ghost small" onClick={() => onEdit(slide)}>Editar</button>
        <button className="admin-btn danger small" onClick={() => onRemove(slide.id)}>&#128465;</button>
      </div>
    </div>
  );
};

export const ManageHero = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState<Omit<Slide,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = async () => setSlides(await apiFetch('/hero/all'));

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ url:'', title:'', subtitle:'', video_url:'', sort_order: slides.length, active: true }); setModal(true); };
  const openEdit = (s: Slide) => { setEditing(s); setForm({ url: s.url, title: s.title, subtitle: s.subtitle, video_url: s.video_url || '', sort_order: s.sort_order, active: s.active }); setModal(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setMsg(`Erro no upload: ${data.error || `HTTP ${res.status}`}`);
        return;
      }
      setForm(f => ({ ...f, url: data.url }));
    } catch { setMsg('Erro no upload — verifique sua conexão e tente novamente.'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setMsg(`Erro no upload do vídeo: ${data.error || `HTTP ${res.status}`}`);
        return;
      }
      setForm(f => ({ ...f, video_url: data.url }));
    } catch { setMsg('Erro no upload do vídeo — verifique sua conexão e tente novamente.'); }
    finally { setUploadingVideo(false); e.target.value = ''; }
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

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const prev = slides;
    const oldIndex = prev.findIndex(s => s.id === active.id);
    const newIndex = prev.findIndex(s => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, sort_order: i }));
    setSlides(next);
    try {
      await apiFetch('/hero/reorder', { method: 'PUT', body: JSON.stringify({ order: next.map(s => s.id) }) });
    } catch (e) {
      setSlides(prev);
      setMsg(`Erro ao salvar a ordem: ${e instanceof Error ? e.message : 'tente novamente'}`);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>Banners do Hero</h2><p>Gerencie os slides do carrossel principal do site. Arraste os slides para definir a ordem.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Slide</button>
      </div>

      {msg && <div className={`admin-alert ${msg.includes('Erro') ? 'red' : 'success'}`}>{msg}</div>}

      <div className="admin-items-list">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map(s => (
              <SortableRow key={s.id} slide={s} onEdit={openEdit} onRemove={remove} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Editar Slide' : 'Novo Slide'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>&times;</button>
            </div>
            <div className="admin-form">
              {msg && <div className={`admin-alert ${msg.includes('Erro') ? 'red' : 'success'}`} style={{ marginBottom: 12 }}>{msg}</div>}
              <div className="admin-field">
                <label>URL da Imagem</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                  <label className="admin-btn secondary small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    {uploading ? 'Enviando...' : 'Upload'}
                    <input type="file" accept="image/*,.gif,.png,.jpg,.jpeg,.webp" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.url && <img src={form.url} alt="preview" style={{ marginTop: 8, borderRadius: 8, maxHeight: 120, objectFit: 'cover' }} onError={() => {}} />}
              </div>
              <div className="admin-field">
                <label>Vídeo (opcional — apenas desktop)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.video_url || ''} onChange={e => setForm({ ...form, video_url: e.target.value })} placeholder="https://... ou faça upload" style={{ flex: 1 }} />
                  <label className="admin-btn secondary small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    {uploadingVideo ? 'Enviando...' : 'Upload Vídeo'}
                    <input type="file" accept="video/mp4,video/webm,video/ogg,image/gif,.gif,.mp4,.webm,.ogv" onChange={handleVideoUpload} style={{ display: 'none' }} />
                  </label>
                  {form.video_url && (
                    <button className="admin-btn danger small" onClick={() => setForm({ ...form, video_url: '' })} title="Remover vídeo">✕</button>
                  )}
                </div>
                {form.video_url && (
                  form.video_url.split('?')[0].toLowerCase().endsWith('.gif')
                    ? <img src={form.video_url} alt="preview gif" style={{ marginTop: 8, borderRadius: 8, maxHeight: 120, width: '100%', objectFit: 'cover' }} />
                    : <video src={form.video_url} controls style={{ marginTop: 8, borderRadius: 8, maxHeight: 120, width: '100%', objectFit: 'cover' }} />
                )}
                <small style={{ color: 'var(--adm-text2)', fontSize: 11 }}>
                  Formatos: MP4, WebM, OGG ou GIF. Aparece apenas no desktop (no mobile entra a imagem do slide acima como fallback).
                </small>
              </div>
              <div className="admin-field"><label>Titulo</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-field"><label>Subtitulo</label><textarea value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
              <div className="admin-field">
                <label>Ativo</label>
                <select value={form.active ? '1' : '0'} onChange={e => setForm({ ...form, active: e.target.value === '1' })}>
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
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
