import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface Plan {
  id: number; name: string; speed: string; price: string; highlight: string;
  highlight_icon: string; button_text: string; whatsapp_msg: string;
  included_apps: {name:string;color:string;textColor:string;abbr:string;icon_url?:string;description?:string}[];
  bonus_app: {name:string;color:string;textColor:string;abbr:string;icon_url?:string;description?:string};
  bonus_apps?: {name:string;color:string;textColor:string;abbr:string;icon_url?:string;description?:string}[];
  enable_bonus?: boolean;
  badges?: {text:string;icon_url?:string;icon_emoji?:string;bg_color?:string;text_color?:string}[];
  details: string[]; enable_details?: boolean; popular: boolean; active: boolean; sort_order: number;
  card_bg_color?: string; card_text_color?: string; button_bg_color?: string;
  button_text_color?: string; plan_font?: string; label_included?: string;
  label_bonus?: string; label_details?: string; label_price_period?: string; modal_price_text?: string;
  accent_color?: string;
  modal_label_color?: string;
}

const EMPTY_PLAN: Omit<Plan, 'id'> = {
  name: '', speed: '', price: '', highlight: '', highlight_icon: '📶',
  button_text: 'EU QUERO!', whatsapp_msg: 'Olá, gostaria de saber mais sobre o plano.',
  included_apps: [], bonus_app: {name:'',color:'#111827',textColor:'#fff',abbr:''}, bonus_apps: [],
  enable_bonus: true, badges: [],
  details: [], enable_details: true, popular: false, active: true, sort_order: 0,
  card_bg_color: '', card_text_color: '', button_bg_color: '',
  button_text_color: '', plan_font: '', label_included: 'Incluso no plano:',
  label_bonus: 'Na assinatura, adicione mais um benefício:', label_details: 'Mais detalhes do plano',
  label_price_period: 'por mês', modal_price_text: 'Preço mensal:', accent_color: '#7c3aed', modal_label_color: '#374151'
};

interface LibraryApp {
  id: number; name: string; color: string; textColor: string; abbr: string; icon_url?: string; description?: string;
}

export const ManagePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan,'id'>>(EMPTY_PLAN);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [editingDetailIdx, setEditingDetailIdx] = useState<number | null>(null);
  const [newApp, setNewApp] = useState({name:'',color:'#6B21A8',textColor:'#fff',abbr:'',icon_url:'',description:''});
  const [editingAppIdx, setEditingAppIdx] = useState<number | null>(null);
  const [newBonus, setNewBonus] = useState({name:'',color:'#111827',textColor:'#fff',abbr:'',icon_url:'',description:''});
  const [editingBonusIdx, setEditingBonusIdx] = useState<number | null>(null);
  const [newBadge, setNewBadge] = useState({text:'',icon_url:'',icon_emoji:'',bg_color:'#00C853',text_color:'#ffffff'});
  const [appLibrary, setAppLibrary] = useState<LibraryApp[]>([]);

  const load = async () => setPlans(await apiFetch('/plans/all'));
  const loadLibrary = async () => { try { setAppLibrary(await apiFetch('/app-library')); } catch { /* silently fail */ } };
  useEffect(() => { load(); loadLibrary(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY_PLAN); setModal(true); setMsg(''); };
  const openEdit = (p: Plan) => { 
    const pEdit = { ...p };
    if (!pEdit.bonus_apps) {
      pEdit.bonus_apps = p.bonus_app && (p.bonus_app.name || p.bonus_app.abbr) ? [p.bonus_app] : [];
    }
    if (pEdit.enable_bonus === undefined) {
      pEdit.enable_bonus = pEdit.bonus_apps.length > 0 || (p.bonus_app && (p.bonus_app.abbr || p.bonus_app.icon_url)) ? true : false;
    }
    if (!pEdit.badges) pEdit.badges = [];
    setEditing(pEdit); 
    setForm(pEdit); 
    setModal(true); 
    setMsg(''); 
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await apiFetch(`/plans/${editing.id}`, { method:'PUT', body: JSON.stringify(form) });
      else await apiFetch('/plans', { method:'POST', body: JSON.stringify(form) });
      setMsg('Plano salvo!'); setModal(false); load();
    } catch (e: unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Excluir este plano?')) return;
    await apiFetch(`/plans/${id}`, { method:'DELETE' });
    load();
  };

  const reorder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === plans.length - 1) return;
    
    setSaving(true);
    const newPlans = [...plans];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
    
    setPlans(newPlans);
    try {
      await Promise.all(newPlans.map((p, i) => apiFetch(`/plans/${p.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...p, sort_order: i })
      })));
    } catch (e) {
      alert('Erro ao reordenar');
      load();
    } finally {
      setSaving(false);
    }
  };

  const addDetail = () => {
    if (!newDetail.trim()) return;
    if (editingDetailIdx !== null) {
      setForm(f => { const d = [...f.details]; d[editingDetailIdx] = newDetail.trim(); return { ...f, details: d }; });
      setEditingDetailIdx(null);
    } else {
      setForm(f => ({ ...f, details: [...f.details, newDetail.trim()] }));
    }
    setNewDetail('');
  };
  const removeDetail = (i: number) => setForm(f => ({ ...f, details: f.details.filter((_,j)=>j!==i) }));
  const editDetail = (i: number) => { setNewDetail(form.details[i]); setEditingDetailIdx(i); };
  const moveDetail = (i: number, dir: 'left' | 'right') => {
    setForm(f => {
      const d = [...f.details];
      const target = dir === 'left' ? i - 1 : i + 1;
      if (target < 0 || target >= d.length) return f;
      [d[i], d[target]] = [d[target], d[i]];
      return { ...f, details: d };
    });
  };

  const saveToLibrary = async (app: {name:string;color:string;textColor:string;abbr:string;icon_url?:string;description?:string}) => {
    const exists = appLibrary.find(a => a.name.toLowerCase() === app.name.toLowerCase());
    if (exists) {
      await apiFetch(`/app-library/${exists.id}`, { method:'PUT', body: JSON.stringify(app) });
    } else {
      await apiFetch('/app-library', { method:'POST', body: JSON.stringify(app) });
    }
    loadLibrary();
  };

  const selectFromLibrary = (libApp: LibraryApp, target: 'included' | 'bonus') => {
    const appData = { name: libApp.name, color: libApp.color, textColor: libApp.textColor, abbr: libApp.abbr, icon_url: libApp.icon_url || '', description: libApp.description || '' };
    if (target === 'included') {
      setForm(f => ({ ...f, included_apps: [...f.included_apps, appData] }));
    } else {
      setForm(f => ({ ...f, bonus_apps: [...(f.bonus_apps || []), appData] }));
    }
  };

  const addApp = () => {
    if (!newApp.name) return;
    const appToAdd = { ...newApp, abbr: newApp.abbr || newApp.name.substring(0, 2).toUpperCase() };
    if (editingAppIdx !== null) {
      setForm(f => { const apps = [...f.included_apps]; apps[editingAppIdx] = appToAdd; return { ...f, included_apps: apps }; });
      setEditingAppIdx(null);
    } else {
      setForm(f => ({ ...f, included_apps: [...f.included_apps, appToAdd] }));
    }
    saveToLibrary(appToAdd);
    setNewApp({name:'',color:'#6B21A8',textColor:'#fff',abbr:'',icon_url:'',description:''});
  };
  const removeApp = (i: number) => setForm(f => ({ ...f, included_apps: f.included_apps.filter((_,j)=>j!==i) }));
  const editApp = (i: number) => { setNewApp(form.included_apps[i]); setEditingAppIdx(i); };
  const moveApp = (i: number, dir: 'left' | 'right') => {
    setForm(f => {
      const apps = [...f.included_apps];
      const target = dir === 'left' ? i - 1 : i + 1;
      if (target < 0 || target >= apps.length) return f;
      [apps[i], apps[target]] = [apps[target], apps[i]];
      return { ...f, included_apps: apps };
    });
  };

  const addBonus = () => {
    if (!newBonus.name) return;
    const appToAdd = { ...newBonus, abbr: newBonus.abbr || newBonus.name.substring(0, 2).toUpperCase() };
    if (editingBonusIdx !== null) {
      setForm(f => { const apps = [...(f.bonus_apps || [])]; apps[editingBonusIdx] = appToAdd; return { ...f, bonus_apps: apps }; });
      setEditingBonusIdx(null);
    } else {
      setForm(f => ({ ...f, bonus_apps: [...(f.bonus_apps || []), appToAdd] }));
    }
    saveToLibrary(appToAdd);
    setNewBonus({name:'',color:'#111827',textColor:'#fff',abbr:'',icon_url:'',description:''});
  };
  const removeBonus = (i: number) => setForm(f => ({ ...f, bonus_apps: (f.bonus_apps || []).filter((_,j)=>j!==i) }));
  const editBonus = (i: number) => { setNewBonus((form.bonus_apps || [])[i]); setEditingBonusIdx(i); };
  const moveBonus = (i: number, dir: 'left' | 'right') => {
    setForm(f => {
      const apps = [...(f.bonus_apps || [])];
      const target = dir === 'left' ? i - 1 : i + 1;
      if (target < 0 || target >= apps.length) return f;
      [apps[i], apps[target]] = [apps[target], apps[i]];
      return { ...f, bonus_apps: apps };
    });
  };

  const addBadge = () => {
    if (!newBadge.text) return;
    setForm(f => ({ ...f, badges: [...(f.badges || []), { ...newBadge }] }));
    setNewBadge({text:'',icon_url:'',icon_emoji:'',bg_color:'#00C853',text_color:'#ffffff'});
  };
  const removeBadge = (i: number) => setForm(f => ({ ...f, badges: (f.badges || []).filter((_,j)=>j!==i) }));
  const moveBadge = (i: number, dir: 'left' | 'right') => {
    setForm(f => {
      const badges = [...(f.badges || [])];
      const target = dir === 'left' ? i - 1 : i + 1;
      if (target < 0 || target >= badges.length) return f;
      [badges[i], badges[target]] = [badges[target], badges[i]];
      return { ...f, badges };
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'newApp' | 'bonusApp' | 'newBadge') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        if (target === 'newApp') setNewApp(n => ({ ...n, icon_url: data.url }));
        else if (target === 'newBadge') setNewBadge(n => ({ ...n, icon_url: data.url }));
        else if (target === 'bonusApp') setNewBonus(n => ({ ...n, icon_url: data.url }));
        else setForm(f => ({ ...f, bonus_app: { ...f.bonus_app, icon_url: data.url } }));
      }
    } catch (err) {
      alert('Erro no upload');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>📦 Planos de Internet</h2><p>Gerencie preços, velocidades e benefícios dos planos.</p></div>
        <button className="admin-btn primary" onClick={openNew}>+ Novo Plano</button>
      </div>

      {msg && !modal && <div className="admin-alert success">{msg}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr>
            <th>Plano</th><th>Velocidade</th><th>Preço</th><th>Popular</th><th>Status</th><th>Ações</th>
          </tr></thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.speed} Mbps</td>
                <td>R$ {p.price}</td>
                <td>{p.popular ? <span className="admin-badge purple">⭐ Sim</span> : '—'}</td>
                <td><span className={`admin-badge ${p.active ? 'green' : 'red'}`}>{p.active ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="admin-btn ghost small" onClick={() => reorder(i, 'up')} disabled={i === 0 || saving}>⬆️</button>
                    <button className="admin-btn ghost small" onClick={() => reorder(i, 'down')} disabled={i === plans.length - 1 || saving}>⬇️</button>
                    <button className="admin-btn ghost small" onClick={() => openEdit(p)}>✏️ Editar</button>
                    <button className="admin-btn danger small" onClick={() => remove(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? `Editar: ${editing.name}` : 'Novo Plano'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {msg && <div className="admin-alert error">{msg}</div>}
            <div className="admin-form">
              <div className="admin-form-row">
                <div className="admin-field"><label>Nome do Plano</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: 700 MEGA" /></div>
                <div className="admin-field"><label>Velocidade</label><input value={form.speed} onChange={e=>setForm({...form,speed:e.target.value})} placeholder="Ex: 700" /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Preço (R$)</label><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Ex: 89,90" /></div>
                <div className="admin-field"><label>Ícone destaque</label><input value={form.highlight_icon} onChange={e=>setForm({...form,highlight_icon:e.target.value})} placeholder="Ex: 📡" /></div>
              </div>
              <div className="admin-field"><label>Texto destaque</label><input value={form.highlight} onChange={e=>setForm({...form,highlight:e.target.value})} placeholder="Ex: Vários dispositivos conectados" /></div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Texto do botão</label><input value={form.button_text} onChange={e=>setForm({...form,button_text:e.target.value})} /></div>
                <div className="admin-field"><label>Mensagem WhatsApp</label><input value={form.whatsapp_msg} onChange={e=>setForm({...form,whatsapp_msg:e.target.value})} /></div>
              </div>

              {/* Badges do Pop-up */}
              <div className="admin-field">
                <label>Chips de destaque (Pop-up) <span style={{fontSize:'0.78rem',color:'#888',fontWeight:'normal'}}>— aparecem no topo do pop-up, estilo pílula</span></label>
                <div className="tags-list">
                  {(form.badges || []).map((b,i) => (
                    <div key={i} className="tag-chip" style={{borderLeft:`3px solid ${b.bg_color}`, alignItems:'center'}}>
                      <span style={{marginRight:4}}>{b.icon_emoji || ''}</span>
                      {b.icon_url ? <img src={b.icon_url} alt="icon" style={{height:18, width:18, objectFit:'contain', marginRight:4, borderRadius:3}} /> : null}
                      <span>{b.text}</span>
                      <button title="Mover esquerda" onClick={() => moveBadge(i,'left')} disabled={i===0} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>◀</button>
                      <button title="Mover direita" onClick={() => moveBadge(i,'right')} disabled={i===(form.badges||[]).length-1} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>▶</button>
                      <button onClick={() => removeBadge(i)}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 80px 1fr 1fr auto auto auto',gap:6,marginTop:8,alignItems:'center'}}>
                  <input placeholder="Texto (ex: Instalação Grátis)" value={newBadge.text} onChange={e=>setNewBadge({...newBadge,text:e.target.value})} />
                  <input placeholder="Emoji" value={newBadge.icon_emoji || ''} onChange={e=>setNewBadge({...newBadge,icon_emoji:e.target.value})} title="Ícone Emoji (ex: ⚙️)" />
                  <input type="color" title="Cor de Fundo" value={newBadge.bg_color} onChange={e=>setNewBadge({...newBadge,bg_color:e.target.value})} style={{height:38}} />
                  <input type="color" title="Cor do Texto" value={newBadge.text_color} onChange={e=>setNewBadge({...newBadge,text_color:e.target.value})} style={{height:38}} />
                  <label className="admin-btn ghost small" style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',margin:0}}>
                    {newBadge.icon_url ? '📷 OK' : '📷'}
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, 'newBadge')} style={{display:'none'}} />
                  </label>
                  <button className="admin-btn ghost small" onClick={addBadge}>+</button>
                </div>
              </div>

              {/* Apps inclusos */}
              <div className="admin-field">
                <label>Apps inclusos no plano</label>
                <input 
                  placeholder="Texto do título (ex: Aplicativos inclusos no plano:)" 
                  value={form.label_included || ''} 
                  onChange={e => setForm({...form, label_included: e.target.value})} 
                  style={{marginBottom: 12}}
                />
                {appLibrary.length > 0 && (
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:'0.78rem',color:'#9ca3af',marginBottom:4,display:'block'}}>📚 Selecionar da Biblioteca:</label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                      {appLibrary.map(libApp => (
                        <button key={libApp.id} className="admin-btn ghost small" onClick={() => selectFromLibrary(libApp, 'included')} style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.75rem',padding:'4px 8px'}} title={libApp.description || libApp.name}>
                          {libApp.icon_url ? <img src={libApp.icon_url} style={{width:16,height:16,borderRadius:3,objectFit:'contain'}} /> : <span style={{background:libApp.color,color:libApp.textColor,borderRadius:3,padding:'0 3px',fontSize:'0.65rem',fontWeight:800}}>{libApp.abbr}</span>}
                          {libApp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="tags-list">
                  {form.included_apps.map((app,i) => (
                    <div key={i} className="tag-chip" style={app.icon_url ? {borderLeft:'3px solid var(--adm-accent)', paddingLeft:4} : {borderLeft:`3px solid ${app.color}`}}>
                      {app.icon_url ? <img src={app.icon_url} alt="icon" style={{height:18, width:18, objectFit:'contain', marginRight:4, borderRadius:4}} /> : null}
                      <span>{app.abbr || 'App'} — {app.name}</span>
                      <button title="Mover esquerda" onClick={() => moveApp(i,'left')} disabled={i===0} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>◀</button>
                      <button title="Mover direita" onClick={() => moveApp(i,'right')} disabled={i===form.included_apps.length-1} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>▶</button>
                      <button title="Editar" onClick={() => editApp(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#6d9eeb',padding:'0 2px'}}>✏️</button>
                      <button onClick={() => removeApp(i)}>×</button>
                    </div>
                  ))}
                </div>
                {editingAppIdx !== null && <div style={{marginTop:6,padding:'4px 8px',background:'#2a2a3d',borderRadius:6,fontSize:'0.78rem',color:'#a0c4ff'}}>✏️ Editando app #{editingAppIdx+1} — clique em + para salvar</div>}
                <div style={{display:'flex', flexDirection:'column', gap:6, marginTop:8}}>
                  <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr auto auto',gap:6}}>
                    <input placeholder="Nome" value={newApp.name} onChange={e=>setNewApp({...newApp,name:e.target.value})} />
                    <input placeholder="Sigla" value={newApp.abbr} onChange={e=>setNewApp({...newApp,abbr:e.target.value})} />
                    <input type="color" title="Cor de Fundo" value={newApp.color} onChange={e=>setNewApp({...newApp,color:e.target.value})} style={{height:38}} />
                    <input type="color" title="Cor do Texto" value={newApp.textColor} onChange={e=>setNewApp({...newApp,textColor:e.target.value})} style={{height:38}} />
                    <label className="admin-btn ghost small" style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',margin:0}}>
                      {newApp.icon_url ? '📷 OK' : '📷'}
                      <input type="file" accept="image/*" onChange={e => handleUpload(e, 'newApp')} style={{display:'none'}} />
                    </label>
                    <button className="admin-btn ghost small" onClick={addApp} title={editingAppIdx !== null ? 'Salvar edição' : 'Adicionar'}>{editingAppIdx !== null ? '✔' : '+'}</button>
                  </div>
                  <input placeholder="Descrição detalhada (exibida no pop-up)" value={newApp.description || ''} onChange={e=>setNewApp({...newApp,description:e.target.value})} />
                </div>
              </div>

              {/* Bonus app */}
              <div className="admin-field">
                <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
                  <input type="checkbox" id="chk-enable-bonus" checked={form.enable_bonus} onChange={e=>setForm({...form,enable_bonus:e.target.checked})} />
                  <label htmlFor="chk-enable-bonus" style={{textTransform:'none',letterSpacing:0, margin:0, fontWeight:'bold', color:'#fff'}}>Habilitar seção "App Bônus"</label>
                </div>
                {form.enable_bonus && (
                  <>
                    <label>Apps Bônus</label>
                    <input 
                      placeholder="Texto do título (ex: Na assinatura, adicione mais um benefício:)" 
                      value={form.label_bonus || ''} 
                      onChange={e => setForm({...form, label_bonus: e.target.value})} 
                      style={{marginBottom: 12}}
                    />
                    {appLibrary.length > 0 && (
                      <div style={{marginBottom:10}}>
                        <label style={{fontSize:'0.78rem',color:'#9ca3af',marginBottom:4,display:'block'}}>📚 Selecionar da Biblioteca:</label>
                        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                          {appLibrary.map(libApp => (
                            <button key={libApp.id} className="admin-btn ghost small" onClick={() => selectFromLibrary(libApp, 'bonus')} style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.75rem',padding:'4px 8px'}} title={libApp.description || libApp.name}>
                              {libApp.icon_url ? <img src={libApp.icon_url} style={{width:16,height:16,borderRadius:3,objectFit:'contain'}} /> : <span style={{background:libApp.color,color:libApp.textColor,borderRadius:3,padding:'0 3px',fontSize:'0.65rem',fontWeight:800}}>{libApp.abbr}</span>}
                              {libApp.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="tags-list">
                      {(form.bonus_apps || []).map((app,i) => (
                        <div key={i} className="tag-chip" style={app.icon_url ? {borderLeft:'3px solid var(--adm-accent)', paddingLeft:4} : {borderLeft:`3px solid ${app.color}`}}>
                          {app.icon_url ? <img src={app.icon_url} alt="icon" style={{height:18, width:18, objectFit:'contain', marginRight:4, borderRadius:4}} /> : null}
                          <span>{app.abbr || 'Bônus'} — {app.name}</span>
                          <button title="Mover esquerda" onClick={() => moveBonus(i,'left')} disabled={i===0} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>◀</button>
                          <button title="Mover direita" onClick={() => moveBonus(i,'right')} disabled={i===(form.bonus_apps||[]).length-1} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>▶</button>
                          <button title="Editar" onClick={() => editBonus(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#6d9eeb',padding:'0 2px'}}>✏️</button>
                          <button onClick={() => removeBonus(i)}>×</button>
                        </div>
                      ))}
                    </div>
                    {editingBonusIdx !== null && <div style={{marginTop:6,padding:'4px 8px',background:'#2a2a3d',borderRadius:6,fontSize:'0.78rem',color:'#a0c4ff'}}>✏️ Editando bônus #{editingBonusIdx+1} — clique em ✔ para salvar</div>}
                    <div style={{display:'flex', flexDirection:'column', gap:6, marginTop:8}}>
                      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr auto auto',gap:6}}>
                        <input placeholder="Nome" value={newBonus.name} onChange={e=>setNewBonus({...newBonus,name:e.target.value})} />
                        <input placeholder="Sigla" value={newBonus.abbr} onChange={e=>setNewBonus({...newBonus,abbr:e.target.value})} />
                        <input type="color" title="Cor de Fundo" value={newBonus.color} onChange={e=>setNewBonus({...newBonus,color:e.target.value})} style={{height:38}} />
                        <input type="color" title="Cor do Texto" value={newBonus.textColor} onChange={e=>setNewBonus({...newBonus,textColor:e.target.value})} style={{height:38}} />
                        <label className="admin-btn ghost small" style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',margin:0}}>
                          {newBonus.icon_url ? '📷 OK' : '📷'}
                          <input type="file" accept="image/*" onChange={e => handleUpload(e, 'bonusApp')} style={{display:'none'}} />
                        </label>
                        <button className="admin-btn ghost small" onClick={addBonus} title={editingBonusIdx !== null ? 'Salvar edição' : 'Adicionar'}>{editingBonusIdx !== null ? '✔' : '+'}</button>
                      </div>
                      <input placeholder="Descrição detalhada (exibida no pop-up)" value={newBonus.description || ''} onChange={e=>setNewBonus({...newBonus,description:e.target.value})} />
                    </div>
                  </>
                )}
              </div>

              {/* Textos da Interface (Botões e Labels) */}
              <div className="admin-field" style={{marginTop: 16}}>
                <label>Textos da Interface (Pop-up e Cartão)</label>
                <div className="admin-form-row" style={{marginTop: 8}}>
                  <input placeholder="Texto do botão (ex: Mais detalhes do plano)" value={form.label_details || ''} onChange={e=>setForm({...form,label_details:e.target.value})} />
                  <input placeholder="Período do preço cartão (ex: por mês)" value={form.label_price_period || ''} onChange={e=>setForm({...form,label_price_period:e.target.value})} />
                  <input placeholder="Subtítulo do preço pop-up (ex: Depois R$129,90)" value={form.modal_price_text || ''} onChange={e=>setForm({...form,modal_price_text:e.target.value})} />
                </div>
              </div>

              {/* Detalhes */}
              <div className="admin-field">
                <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
                  <input type="checkbox" id="chk-enable-details" checked={form.enable_details !== false} onChange={e=>setForm({...form,enable_details:e.target.checked})} />
                  <label htmlFor="chk-enable-details" style={{textTransform:'none',letterSpacing:0, margin:0, fontWeight:'bold', color:'#fff'}}>Habilitar seção "Itens do plano (detalhes)"</label>
                </div>
                {form.enable_details !== false && (
                  <>
                    <label>Itens do plano</label>
                    <div className="tags-list">
                      {form.details.map((d,i) => (
                        <div key={i} className="tag-chip" style={{alignItems:'center'}}>
                          <span>{d}</span>
                          <button title="Subir" onClick={() => moveDetail(i,'left')} disabled={i===0} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>◀</button>
                          <button title="Descer" onClick={() => moveDetail(i,'right')} disabled={i===form.details.length-1} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa',padding:'0 2px'}}>▶</button>
                          <button title="Editar" onClick={() => editDetail(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#6d9eeb',padding:'0 2px'}}>✏️</button>
                          <button onClick={()=>removeDetail(i)}>×</button>
                        </div>
                      ))}
                    </div>
                    {editingDetailIdx !== null && <div style={{marginTop:6,padding:'4px 8px',background:'#2a2a3d',borderRadius:6,fontSize:'0.78rem',color:'#a0c4ff'}}>✏️ Editando item #{editingDetailIdx+1} — clique em ✔ para salvar</div>}
                    <div style={{display:'flex',gap:6,marginTop:8}}>
                      <input placeholder="Ex: Wi-Fi 6 incluso" value={newDetail} onChange={e=>setNewDetail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addDetail()} style={{flex:1}} />
                      <button className="admin-btn ghost small" onClick={addDetail} title={editingDetailIdx !== null ? 'Salvar edição' : 'Adicionar'}>{editingDetailIdx !== null ? '✔' : '+'}</button>
                    </div>
                  </>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-field"><label>Ordem</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
                <div className="admin-field" style={{flexDirection:'row',alignItems:'center',gap:10,paddingTop:22}}>
                  <input type="checkbox" id="chk-popular" checked={form.popular} onChange={e=>setForm({...form,popular:e.target.checked})} />
                  <label htmlFor="chk-popular" style={{textTransform:'none',letterSpacing:0}}>Mais Popular</label>
                  <input type="checkbox" id="chk-active" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} style={{marginLeft:12}} />
                  <label htmlFor="chk-active" style={{textTransform:'none',letterSpacing:0}}>Ativo</label>
                </div>
              </div>

              <div className="admin-field" style={{marginTop: 16, borderTop: '1px solid #333', paddingTop: 16}}>
                <h4>🎨 Personalização Visual e Textos</h4>
                <div className="admin-form-row">
                  <div className="admin-field"><label>Cor Fundo Cartão</label><div style={{display:'flex',gap:6}}><input type="color" value={form.card_bg_color || '#ffffff'} onChange={e=>setForm({...form,card_bg_color:e.target.value})} style={{height:38,width:40}} /><button className="admin-btn ghost small" onClick={()=>setForm({...form,card_bg_color:''})}>Limpar</button></div></div>
                  <div className="admin-field"><label>Cor Texto Principal</label><div style={{display:'flex',gap:6}}><input type="color" value={form.card_text_color || '#1e293b'} onChange={e=>setForm({...form,card_text_color:e.target.value})} style={{height:38,width:40}} /><button className="admin-btn ghost small" onClick={()=>setForm({...form,card_text_color:''})}>Limpar</button></div></div>
                  <div className="admin-field"><label>Cor Fundo Botão</label><div style={{display:'flex',gap:6}}><input type="color" value={form.button_bg_color || '#a855f7'} onChange={e=>setForm({...form,button_bg_color:e.target.value})} style={{height:38,width:40}} /><button className="admin-btn ghost small" onClick={()=>setForm({...form,button_bg_color:''})}>Limpar</button></div></div>
                  <div className="admin-field"><label>Cor Texto Botão</label><div style={{display:'flex',gap:6}}><input type="color" value={form.button_text_color || '#ffffff'} onChange={e=>setForm({...form,button_text_color:e.target.value})} style={{height:38,width:40}} /><button className="admin-btn ghost small" onClick={()=>setForm({...form,button_text_color:''})}>Limpar</button></div></div>
                </div>
                <div className="admin-field" style={{marginTop:8}}>
                  <label>Fonte Customizada</label>
                  <select value={form.plan_font || ''} onChange={e=>setForm({...form,plan_font:e.target.value})} style={{padding:8, borderRadius:4, border:'1px solid #444', backgroundColor:'#1e1e2d', color:'#fff'}}>
                    <option value="">Padrão do Site</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="'Outfit', sans-serif">Outfit</option>
                  </select>
                </div>
                <div className="admin-form-row" style={{marginTop:8}}>
                  <div className="admin-field"><label>Cor de Acento (Lilás/Contorno)</label><div style={{display:'flex',gap:6}}><input type="color" value={form.accent_color || '#7c3aed'} onChange={e=>setForm({...form,accent_color:e.target.value})} style={{height:38,width:40}} /><button className="admin-btn ghost small" onClick={()=>setForm({...form,accent_color:'#7c3aed'})}>Padrão</button></div></div>
                  <div className="admin-field"><label>Cor Título Pop-up</label><div style={{display:'flex',gap:6}}><input type="color" value={form.modal_title_color || '#c084fc'} onChange={e=>setForm({...form,modal_title_color:e.target.value})} style={{height:38,width:40}} title="Cor de '600 MEGA' no pop-up" /><button className="admin-btn ghost small" onClick={()=>setForm({...form,modal_title_color:''})}>Limpar</button></div></div>
                  <div className="admin-field"><label>Cor Textos Pop-up</label><div style={{display:'flex',gap:6}}><input type="color" value={form.modal_label_color || '#4b4460'} onChange={e=>setForm({...form,modal_label_color:e.target.value})} style={{height:38,width:40}} title="Cor de '1 App da Área Standard' etc" /><button className="admin-btn ghost small" onClick={()=>setForm({...form,modal_label_color:''})}>Limpar</button></div></div>
                </div>
                <div className="admin-form-row" style={{marginTop:8}}>
                  <div className="admin-field"><label>Texto "Incluso no plano"</label><input value={form.label_included ?? ''} onChange={e=>setForm({...form,label_included:e.target.value})} placeholder="Ex: Incluso no plano:" /></div>
                  <div className="admin-field"><label>Texto "Mais benefício"</label><input value={form.label_bonus ?? ''} onChange={e=>setForm({...form,label_bonus:e.target.value})} placeholder="Ex: Na assinatura, adicione mais um benefício:" /></div>
                  <div className="admin-field"><label>Texto "Detalhes"</label><input value={form.label_details ?? ''} onChange={e=>setForm({...form,label_details:e.target.value})} placeholder="Ex: Mais detalhes do plano" /></div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Plano'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagePlans;
