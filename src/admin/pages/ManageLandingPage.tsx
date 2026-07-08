import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }

const FIELDS = [
  { section: 'Hero (Parte Superior)', fields: [
    { key: 'lp_hero_title', label: 'Título Principal', type: 'text', hint: 'Ex: Na MUNDONET você tem o' },
    { key: 'lp_hero_highlight', label: 'Texto Destaque (verde)', type: 'text', hint: 'Ex: melhor do entretenimento do MUNDO!' },
    { key: 'lp_hero_subtitle', label: 'Subtítulo', type: 'text', hint: 'Internet 100% Fibra Óptica...' },
    { key: 'lp_hero_image', label: 'Imagem do Herói', type: 'image' },
    { key: 'lp_hero_bg_color', label: 'Cor de Fundo', type: 'color' },
    { key: 'lp_hero_text_color', label: 'Cor do Texto', type: 'color' },
    { key: 'lp_hero_highlight_color', label: 'Cor do Destaque', type: 'color' },
  ]},
  { section: 'Card do Plano', fields: [
    { key: 'lp_plan_name', label: 'Nome do Plano', type: 'text', hint: '700 MEGA' },
    { key: 'lp_plan_speed', label: 'Velocidade', type: 'text', hint: '700' },
    { key: 'lp_plan_price', label: 'Preço', type: 'text', hint: '39,90' },
    { key: 'lp_plan_badge_text', label: 'Texto do Badge', type: 'text', hint: 'MEGA' },
    { key: 'lp_plan_period', label: 'Texto Acima do Preço', type: 'text', hint: 'POR APENAS' },
    { key: 'lp_plan_installment', label: 'Valor Instalação', type: 'text', hint: '39,90' },
    { key: 'lp_plan_original_price', label: 'Preço Original (riscado)', type: 'text', hint: '129,90' },
    { key: 'lp_plan_highlight_text', label: 'Texto de Destaque', type: 'text', hint: '1 APP DA ÁREA STANDARD...' },
    { key: 'lp_plan_apps', label: 'Apps (vírgula)', type: 'text', hint: 'Deezer,Globoplay,Sky,Apple TV' },
    { key: 'lp_plan_card_bg', label: 'Cor Fundo do Card', type: 'color' },
    { key: 'lp_plan_price_color', label: 'Cor do Preço', type: 'color' },
    { key: 'lp_plan_btn_text', label: 'Texto do Botão', type: 'text' },
    { key: 'lp_plan_btn_link', label: 'Link do Botão', type: 'url' },
    { key: 'lp_plan_btn_color', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'lp_plan_btn_text_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
  { section: 'Benefícios', fields: [
    { key: 'lp_features_title', label: 'Título da Seção', type: 'text' },
    { key: 'lp_features', label: 'Benefícios (vírgula)', type: 'textarea', hint: 'Um benefício por linha ou separado por vírgula' },
  ]},
  { section: 'CTA Final', fields: [
    { key: 'lp_cta_title', label: 'Título', type: 'text' },
    { key: 'lp_cta_desc', label: 'Descrição', type: 'text' },
    { key: 'lp_cta_btn_text', label: 'Texto do Botão', type: 'text' },
    { key: 'lp_cta_btn_link', label: 'Link do Botão', type: 'url' },
    { key: 'lp_cta_bg_color', label: 'Cor de Fundo', type: 'color' },
    { key: 'lp_cta_text_color', label: 'Cor do Texto', type: 'color' },
    { key: 'lp_cta_btn_color', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'lp_cta_btn_text_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
  { section: 'Rodapé', fields: [
    { key: 'lp_footer_text', label: 'Texto do Rodapé', type: 'text' },
    { key: 'lp_footer_bg_color', label: 'Cor de Fundo', type: 'color' },
    { key: 'lp_footer_text_color', label: 'Cor do Texto', type: 'color' },
  ]},
];

export const ManageLandingPage = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    apiFetch('/settings').then((data: Record<string, { value: string; label: string }>) => {
      const map: Record<string, Setting> = {};
      for (const [key, obj] of Object.entries(data)) {
        map[key] = { key, value: obj.value, label: obj.label };
      }
      setSettings(map);
    }).catch(() => {});
  }, []);

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({ ...prev, [key]: { key, value, label } }));
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updates = FIELDS.flatMap(s => s.fields).filter(f => settings[f.key]);
      await Promise.all(
        updates.map(f =>
          apiFetch(`/settings/${f.key}`, {
            method: 'PUT',
            body: JSON.stringify({ value: settings[f.key].value, label: f.label })
          })
        )
      );
      setMsg('Landing page salva com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (fd: { key: string; label: string; type: string; hint?: string }) => {
    const val = settings[fd.key]?.value || '';
    switch (fd.type) {
      case 'image':
        return (
          <div key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <ImageUpload value={val} onChange={v => set(fd.key, v, fd.label)} />
          </div>
        );
      case 'color':
        return (
          <div key={fd.key}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="color" value={val || '#000000'} onChange={e => set(fd.key, e.target.value, fd.label)}
                style={{ width: 40, height: 36, padding: 0, border: '1px solid #333', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
              <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
                style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '6px 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff' }} />
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <textarea value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
              style={{ width: '100%', minHeight: 80, padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13, resize: 'vertical' }} />
            {fd.hint && <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      default:
        return (
          <div key={fd.key}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
              style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
            {fd.hint && <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>🚀 Landing Page "Vem pra Mundonet"</h2>
          <p>Personalize a página de promoção com cores, textos, imagens e links.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/vem-pra-mundonet" target="_blank" rel="noreferrer" className="admin-btn ghost">
            👁️ Visualizar
          </a>
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar'}
          </button>
        </div>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          {FIELDS.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 4,
                background: activeSection === i ? '#7c3aed' : 'transparent',
                color: activeSection === i ? '#fff' : '#9ca3af',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
                transition: 'all 0.15s'
              }}>
              {s.section}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="admin-card" style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333' }}>
            {FIELDS[activeSection].section}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FIELDS[activeSection].fields.map(renderField)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLandingPage;
