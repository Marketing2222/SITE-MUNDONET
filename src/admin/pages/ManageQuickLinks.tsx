import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface QL { id:number; title:string; description:string; url:string; button_text:string; icon_type:string; sort_order:number; active:number; card_bg:string; icon_bg:string; icon_color:string; title_color:string; title_font_size:string; desc_color:string; desc_font_size:string; btn_color:string; }
const EMPTY = { title:'', description:'', url:'', button_text:'', icon_type:'user', sort_order:0, active:1, card_bg:'', icon_bg:'', icon_color:'', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'' };

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="admin-field" style={{ flex: 1 }}>
    <label>{label}</label>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)} style={{ height: 36, width: 50 }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Ex: #2563EB" style={{ flex: 1 }} />
    </div>
  </div>
);

export const ManageQuickLinks = () => {
  const [items, setItems] = useState<QL[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<QL|null>(null);
  const [form, setForm] = useState<Omit<QL,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => setItems(await apiFetch('/quicklinks/all'));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (q: QL) => { setEditing(q); setForm({...q}); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await apiFetch(`/quicklinks/${editing.id}`, { method:'PUT', body: JSON.stringify(form) });
      else await apiFetch('/quicklinks', { method:'POST', body: JSON.stringify(form) });
      setMsg('Salvo!'); setModal(false); load();
    } catch (e:unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  const remove = async (id:number) => {
    if (!confirm('Remover?')) return;
    await apiFetch(`/quicklinks/${id}`, { method:'DELETE' });
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>🔗 Links Rápidos</h2><p>Cards de acesso rápido da seção de suporte.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Link</button>
      </div>
      {msg && <div className="admin-alert success">{msg}</div>}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Título</th><th>Botão</th><th>URL</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {items.map(q => (
              <tr key={q.id}>
                <td><strong>{q.title}</strong><br/><small style={{color:'var(--adm-text2)'}}>{q.description}</small></td>
                <td>{q.button_text}</td>
                <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}><a href={q.url} target="_blank" rel="noreferrer" style={{color:'var(--adm-accent)'}}>{q.url}</a></td>
                <td><span className={`admin-badge ${q.active ? 'green' : 'red'}`}>{q.active ? 'Ativo' : 'Inativo'}</span></td>
                <td><div style={{display:'flex',gap:6}}>
                  <button className="admin-btn ghost small" onClick={()=>openEdit(q)}>✏️</button>
                  <button className="admin-btn danger small" onClick={()=>remove(q.id)}>🗑️</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Editar Link' : 'Novo Link'}</h3>
              <button className="admin-modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="admin-form">
              <div className="admin-field"><label>Título</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
              <div className="admin-field"><label>Descrição</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="admin-field"><label>URL de destino</label><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." /></div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Texto do botão</label><input value={form.button_text} onChange={e=>setForm({...form,button_text:e.target.value})} /></div>
                <div className="admin-field"><label>Tipo ícone</label>
                  <select value={form.icon_type} onChange={e=>setForm({...form,icon_type:e.target.value})}>
                    <option value="user">👤 Usuário</option>
                    <option value="document">📄 Documento</option>
                    <option value="chat">💬 Chat</option>
                    <option value="speed">⚡ Velocímetro</option>
                    <option value="star">⭐ Estrela</option>
                    <option value="globe">🌐 Globo</option>
                    <option value="shield">🛡️ Escudo</option>
                    <option value="phone">📞 Telefone</option>
                    <option value="mail">✉️ Email</option>
                    <option value="clock">🕐 Relógio</option>
                    <option value="download">⬇️ Download</option>
                    <option value="gift">🎁 Presente</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Ordem</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
                <div className="admin-field"><label>Status</label>
                  <select value={form.active} onChange={e=>setForm({...form,active:+e.target.value})}>
                    <option value={1}>Ativo</option><option value={0}>Inativo</option>
                  </select>
                </div>
              </div>

              <h3 style={{ borderBottom:'1px solid var(--adm-border)', paddingBottom:10, marginBottom:20, marginTop:30 }}>🎨 Personalização do Card</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                <ColorField label="Fundo do Card" value={form.card_bg} onChange={v=>setForm({...form,card_bg:v})} />
                <ColorField label="Fundo do Ícone" value={form.icon_bg} onChange={v=>setForm({...form,icon_bg:v})} />
                <ColorField label="Cor do Ícone" value={form.icon_color} onChange={v=>setForm({...form,icon_color:v})} />
                <ColorField label="Cor do Título" value={form.title_color} onChange={v=>setForm({...form,title_color:v})} />
                <ColorField label="Cor da Descrição" value={form.desc_color} onChange={v=>setForm({...form,desc_color:v})} />
                <ColorField label="Cor do Botão" value={form.btn_color} onChange={v=>setForm({...form,btn_color:v})} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginTop:12 }}>
                <div className="admin-field">
                  <label>Tamanho do Título (ex: 20px)</label>
                  <input type="text" value={form.title_font_size} onChange={e=>setForm({...form,title_font_size:e.target.value})} placeholder="20px" />
                </div>
                <div className="admin-field">
                  <label>Tamanho da Descrição (ex: 14px)</label>
                  <input type="text" value={form.desc_font_size} onChange={e=>setForm({...form,desc_font_size:e.target.value})} placeholder="14px" />
                </div>
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
export default ManageQuickLinks;
