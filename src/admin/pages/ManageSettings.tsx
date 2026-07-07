import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';
import { ColorPicker } from '../components/ColorPicker';
import { ToggleSwitch } from '../components/ToggleSwitch';

interface Setting { key: string; value: string; label: string; }

const GENERAL_KEYS = [
  'site_name', 'logo_url', 'favicon_url', 'primary_color',
  'whatsapp_float', 'footer_cnpj', 'footer_anatel',
];

export const ManageSettings = () => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const load = async () => {
    const data: Setting[] = await apiFetch('/settings/all');
    const obj: Record<string, string> = {};
    const lbl: Record<string, string> = {};
    data.forEach(f => { obj[f.key] = f.value; lbl[f.key] = f.label; });
    setForm(obj);
    setLabels(lbl);
    setWhatsappEnabled(!!obj.whatsapp_float);
  };

  useEffect(() => { load(); }, []);

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const toSave = GENERAL_KEYS.filter(k => k in form);
      await Promise.all(
        toSave.map(k => apiFetch(`/settings/${k}`, {
          method: 'PUT',
          body: JSON.stringify({ value: form[k] || '', label: labels[k] || k }),
        }))
      );
      setMsg('Configuracoes salvas com sucesso!');
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Configuracoes Gerais</h2>
          <p>Identidade visual, contato e informacoes do site.</p>
        </div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {msg && (
        <div className={`admin-alert ${msg.includes('sucesso') ? 'success' : 'error'}`}>
          {msg}
        </div>
      )}

      <div className="admin-settings-grid">

        {/* Identidade Visual */}
        <div className="admin-settings-card">
          <h3>Identidade Visual</h3>
          <div className="admin-form">
            <div className="admin-field">
              <label>Nome do Site</label>
              <input
                value={form.site_name || ''}
                onChange={e => set('site_name', e.target.value)}
                placeholder="MundoNet"
              />
            </div>
            <div className="admin-field">
              <label>Logo</label>
              <ImageUpload value={form.logo_url || ''} onChange={v => set('logo_url', v)} />
            </div>
            <div className="admin-field">
              <label>Favicon</label>
              <ImageUpload value={form.favicon_url || ''} onChange={v => set('favicon_url', v)} />
            </div>
            <div className="admin-field">
              <label>Cor Principal</label>
              <ColorPicker value={form.primary_color || '#002D72'} onChange={v => set('primary_color', v)} />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="admin-settings-card">
          <h3>Contato</h3>
          <div className="admin-form">
            <div className="admin-field">
              <label>WhatsApp Flutuante</label>
              <ToggleSwitch
                value={whatsappEnabled}
                onChange={v => {
                  setWhatsappEnabled(v);
                  if (!v) set('whatsapp_float', '');
                }}
                label={whatsappEnabled ? 'Ativado' : 'Desativado'}
              />
            </div>
            {whatsappEnabled && (
              <div className="admin-field">
                <label>Link do WhatsApp</label>
                <input
                  value={form.whatsapp_float || ''}
                  onChange={e => set('whatsapp_float', e.target.value)}
                  placeholder="https://wa.me/5511999999999"
                />
              </div>
            )}
          </div>
        </div>

        {/* Informacoes Legais */}
        <div className="admin-settings-card">
          <h3>Informacoes Legais</h3>
          <div className="admin-form">
            <div className="admin-field">
              <label>CNPJ</label>
              <input
                value={form.footer_cnpj || ''}
                onChange={e => set('footer_cnpj', e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div className="admin-field">
              <label>ANATEL</label>
              <input
                value={form.footer_anatel || ''}
                onChange={e => set('footer_anatel', e.target.value)}
                placeholder="Certificado ANATEL"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageSettings;
