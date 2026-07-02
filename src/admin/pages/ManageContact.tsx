import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface ContactField { key:string; value:string; label:string; }

export const ManageContact = () => {
  const [fields, setFields] = useState<ContactField[]>([]);
  const [form, setForm] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const data: ContactField[] = await apiFetch('/contact/all');
    setFields(data);
    const obj: Record<string,string> = {};
    data.forEach(f => { obj[f.key] = f.value; });
    setForm(obj);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await Promise.all(
        fields.map(f => apiFetch(`/contact/${f.key}`, { method:'PUT', body: JSON.stringify({ value: form[f.key], label: f.label }) }))
      );
      setMsg('✅ Dados de contato salvos!');
    } catch (e:unknown) { setMsg(e instanceof Error ? e.message : 'Erro'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h2>📞 Informações de Contato</h2><p>Telefones, e-mail, endereço e links do site.</p></div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>{saving?'Salvando...':'💾 Salvar Tudo'}</button>
      </div>
      {msg && <div className={`admin-alert ${msg.startsWith('✅')?'success':'error'}`}>{msg}</div>}
      <div style={{background:'var(--adm-surface)',border:'1px solid var(--adm-border)',borderRadius:'var(--adm-radius)',padding:24}}>
        <div className="admin-form">
          {fields.map(f => (
            <div key={f.key} className="admin-field">
              <label>{f.label} <small style={{color:'var(--adm-text2)',fontWeight:400}}>({f.key})</small></label>
              {form[f.key]?.startsWith('http') || f.key.includes('text')
                ? <textarea value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} rows={3} />
                : <input value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ManageContact;
