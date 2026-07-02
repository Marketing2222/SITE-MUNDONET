import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface Setting { key:string; value:string; label:string; }

export const ManageSettings = () => {
  const [fields, setFields] = useState<Setting[]>([]);
  const [form, setForm] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const data: Setting[] = await apiFetch('/settings/all');
    setFields(data);
    const obj: Record<string,string> = {};
    data.forEach(f => { obj[f.key] = f.value; });
    setForm(obj);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await Promise.all(
        fields.map(f => apiFetch(`/settings/${f.key}`, { method:'PUT', body: JSON.stringify({ value: form[f.key], label: f.label }) }))
      );
      setMsg('✅ Configurações salvas com sucesso!');
    } catch (e:unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>⚙️ Configurações Gerais</h2><p>Logo, dados cadastrais e configurações do site.</p></div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>{saving?'Salvando...':'💾 Salvar'}</button>
      </div>
      {msg && <div className={`admin-alert ${msg.startsWith('✅')?'success':'error'}`}>{msg}</div>}

      {/* Logo preview */}
      {form.logo_url && (
        <div style={{background:'var(--adm-surface)',border:'1px solid var(--adm-border)',borderRadius:'var(--adm-radius)',padding:16,marginBottom:20,display:'flex',alignItems:'center',gap:14}}>
          <img src={form.logo_url} alt="Logo" style={{maxHeight:50,maxWidth:200,objectFit:'contain'}} />
          <span style={{color:'var(--adm-text2)',fontSize:'0.82rem'}}>Preview do logo atual</span>
        </div>
      )}

      <div style={{background:'var(--adm-surface)',border:'1px solid var(--adm-border)',borderRadius:'var(--adm-radius)',padding:24}}>
        <div className="admin-form">
          {fields.map(f => (
            <div key={f.key} className="admin-field">
              <label>{f.label} <small style={{color:'var(--adm-text2)',fontWeight:400}}>({f.key})</small></label>
              {f.key === 'primary_color'
                ? <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <input type="color" value={form[f.key]||'#002D72'} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{height:38,width:60}} />
                    <input value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{flex:1}} />
                  </div>
                : f.value.startsWith('http')
                  ? <input value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder="https://..." />
                  : <input value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ManageSettings;
