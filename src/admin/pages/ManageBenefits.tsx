import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface Benefit { id:number; title:string; description:string; icon_type:string; sort_order:number; active:number; icon_bg:string; icon_color:string; title_color:string; desc_color:string; }
const EMPTY = { title:'', description:'', icon_type:'star', sort_order:0, active:1, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' };

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="admin-field" style={{ flex: 1 }}>
    <label>{label}</label>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)} style={{ height: 36, width: 50 }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Ex: #2563EB" style={{ flex: 1 }} />
    </div>
  </div>
);

export const ManageBenefits = () => {
  const [items, setItems] = useState<Benefit[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Benefit|null>(null);
  const [form, setForm] = useState<Omit<Benefit,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => setItems(await apiFetch('/benefits/all'));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (b: Benefit) => { setEditing(b); setForm({...b}); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await apiFetch(`/benefits/${editing.id}`, { method:'PUT', body: JSON.stringify(form) });
      else await apiFetch('/benefits', { method:'POST', body: JSON.stringify(form) });
      setMsg('Salvo!'); setModal(false); load();
    } catch (e:unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  const remove = async (id:number) => {
    if (!confirm('Remover?')) return;
    await apiFetch(`/benefits/${id}`, { method:'DELETE' });
    load();
  };

  const move = async (id:number, dir:-1|1) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx], b = items[target];
    await apiFetch(`/benefits/${a.id}`, { method:'PUT', body: JSON.stringify({ ...a, sort_order: b.sort_order }) });
    await apiFetch(`/benefits/${b.id}`, { method:'PUT', body: JSON.stringify({ ...b, sort_order: a.sort_order }) });
    load();
  };

  return (
    <div>
      {msg && <div className="admin-alert success">{msg}</div>}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Benefício</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Título</th><th>Ícone</th><th>Ordem</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {items.map((b, idx) => (
              <tr key={b.id}>
                <td><strong>{b.title}</strong><br/><small style={{color:'var(--adm-text2)'}}>{b.description}</small></td>
                <td>{b.icon_type}</td>
                <td>{b.sort_order}</td>
                <td><span className={`admin-badge ${b.active ? 'green' : 'red'}`}>{b.active ? 'Ativo' : 'Inativo'}</span></td>
                <td><div style={{display:'flex',gap:6}}>
                  <button className="admin-btn ghost" style={{padding:'2px 6px',fontSize:'0.7rem',lineHeight:1}} disabled={idx===0} onClick={()=>move(b.id,-1)}>▲</button>
                  <button className="admin-btn ghost" style={{padding:'2px 6px',fontSize:'0.7rem',lineHeight:1}} disabled={idx===items.length-1} onClick={()=>move(b.id,1)}>▼</button>
                  <button className="admin-btn ghost small" onClick={()=>openEdit(b)}>✏️</button>
                  <button className="admin-btn danger small" onClick={()=>remove(b.id)}>🗑️</button>
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
              <h3>{editing ? 'Editar Benefício' : 'Novo Benefício'}</h3>
              <button className="admin-modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="admin-form">
              <div className="admin-field"><label>Título</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
              <div className="admin-field"><label>Descrição</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Tipo ícone</label>
                  <select value={form.icon_type} onChange={e=>setForm({...form,icon_type:e.target.value})}>
                    <option value="star">⭐ Estrela</option>
                    <option value="speed">⚡ Velocímetro</option>
                    <option value="clock">🕐 Relógio</option>
                    <option value="globe">🌐 Globo</option>
                    <option value="download">⬇️ Download</option>
                    <option value="chat">💬 Chat</option>
                    <option value="shield">🛡️ Escudo</option>
                    <option value="gift">🎁 Presente</option>
                    <option value="user">👤 Usuário</option>
                    <option value="document">📄 Documento</option>
                    <option value="phone">📞 Telefone</option>
                    <option value="mail">✉️ Email</option>
                    <option value="wifi">📶 Wi-Fi</option>
                    <option value="dollar">💲 Cifrão</option>
                    <option value="signal">📡 Torre de Sinal</option>
                    <option value="wrench">🔧 Ferramenta</option>
                    <option value="gear">⚙️ Engrenagem</option>
                    <option value="gamepad">🎮 Controle</option>
                    <option value="router">📡 Roteador</option>
                    <option value="chip">💻 Tecnologia</option>
                    <option value="handshake">🤝 Mãos Dadas</option>
                    <option value="heart">❤️ Coração</option>
                  </select>
                </div>
                <div className="admin-field"><label>Ordem</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Status</label>
                  <select value={form.active} onChange={e=>setForm({...form,active:+e.target.value})}>
                    <option value={1}>Ativo</option><option value={0}>Inativo</option>
                  </select>
                </div>
              </div>
              <h3 style={{ borderBottom:'1px solid var(--adm-border)', paddingBottom:10, marginBottom:20, marginTop:30 }}>🎨 Personalização do Card</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                <ColorField label="Fundo do Ícone" value={form.icon_bg} onChange={v=>setForm({...form,icon_bg:v})} />
                <ColorField label="Cor do Ícone" value={form.icon_color} onChange={v=>setForm({...form,icon_color:v})} />
                <ColorField label="Cor do Título" value={form.title_color} onChange={v=>setForm({...form,title_color:v})} />
                <ColorField label="Cor da Descrição" value={form.desc_color} onChange={v=>setForm({...form,desc_color:v})} />
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
export default ManageBenefits;