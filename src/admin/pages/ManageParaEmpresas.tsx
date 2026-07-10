import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }

const FIELDS = [
  { section: 'Hero', fields: [
    { key: 'emp_hero_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_hero_title', label: 'Título', type: 'text' },
    { key: 'emp_hero_subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'emp_hero_image', label: 'Imagem', type: 'image' },
    { key: 'emp_hero_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_hero_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'emp_hero_btn1_text', label: 'Botão 1 Texto', type: 'text' },
    { key: 'emp_hero_btn1_link', label: 'Botão 1 Link', type: 'url' },
    { key: 'emp_hero_btn1_bg', label: 'Botão 1 Cor Fundo', type: 'color' },
    { key: 'emp_hero_btn1_color', label: 'Botão 1 Cor Texto', type: 'color' },
    { key: 'emp_hero_btn2_text', label: 'Botão 2 Texto', type: 'text' },
    { key: 'emp_hero_btn2_link', label: 'Botão 2 Link', type: 'url' },
    { key: 'emp_hero_btn2_bg', label: 'Botão 2 Cor Fundo', type: 'color' },
    { key: 'emp_hero_btn2_color', label: 'Botão 2 Cor Texto', type: 'color' },
  ]},
  { section: 'Planos', fields: [
    { key: 'emp_plans_enabled', label: 'Ativar Seção Planos', type: 'toggle' },
    { key: 'emp_plans_title', label: 'Título', type: 'text' },
    { key: 'emp_plans_subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'emp_plans_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_plans_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_plans_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
  ]},
  { section: 'Benefícios', fields: [
    { key: 'emp_benefits_title', label: 'Título', type: 'text' },
    { key: 'emp_benefits_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_benefits_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_benefit_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'emp_benefit_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'emp_benefit_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'emp_benefit_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'emp_benefit_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'emp_benefit_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'emp_benefit1_icon', label: 'Ícone 1', type: 'text', hint: '📈' },
    { key: 'emp_benefit1_title', label: 'Título 1', type: 'text' },
    { key: 'emp_benefit1_desc', label: 'Descrição 1', type: 'text' },
    { key: 'emp_benefit2_icon', label: 'Ícone 2', type: 'text', hint: '🌐' },
    { key: 'emp_benefit2_title', label: 'Título 2', type: 'text' },
    { key: 'emp_benefit2_desc', label: 'Descrição 2', type: 'text' },
    { key: 'emp_benefit3_icon', label: 'Ícone 3', type: 'text', hint: '🛡️' },
    { key: 'emp_benefit3_title', label: 'Título 3', type: 'text' },
    { key: 'emp_benefit3_desc', label: 'Descrição 3', type: 'text' },
    { key: 'emp_benefit4_icon', label: 'Ícone 4', type: 'text', hint: '🔒' },
    { key: 'emp_benefit4_title', label: 'Título 4', type: 'text' },
    { key: 'emp_benefit4_desc', label: 'Descrição 4', type: 'text' },
  ]},
  { section: 'Serviços', fields: [
    { key: 'emp_services_title', label: 'Título', type: 'text' },
    { key: 'emp_services_subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'emp_services_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_services_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_services_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'emp_service_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'emp_service_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'emp_service_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'emp_service_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'emp_service_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'emp_service_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'emp_service1_icon', label: 'Ícone Serviço 1', type: 'text', hint: '📥' },
    { key: 'emp_service1_title', label: 'Título Serviço 1', type: 'text' },
    { key: 'emp_service1_desc', label: 'Descrição Serviço 1', type: 'text' },
    { key: 'emp_service2_icon', label: 'Ícone Serviço 2', type: 'text', hint: '🌐' },
    { key: 'emp_service2_title', label: 'Título Serviço 2', type: 'text' },
    { key: 'emp_service2_desc', label: 'Descrição Serviço 2', type: 'text' },
    { key: 'emp_service3_icon', label: 'Ícone Serviço 3', type: 'text', hint: '🛡️' },
    { key: 'emp_service3_title', label: 'Título Serviço 3', type: 'text' },
    { key: 'emp_service3_desc', label: 'Descrição Serviço 3', type: 'text' },
    { key: 'emp_service4_icon', label: 'Ícone Serviço 4', type: 'text', hint: '🔗' },
    { key: 'emp_service4_title', label: 'Título Serviço 4', type: 'text' },
    { key: 'emp_service4_desc', label: 'Descrição Serviço 4', type: 'text' },
    { key: 'emp_service5_icon', label: 'Ícone Serviço 5', type: 'text', hint: '🔐' },
    { key: 'emp_service5_title', label: 'Título Serviço 5', type: 'text' },
    { key: 'emp_service5_desc', label: 'Descrição Serviço 5', type: 'text' },
    { key: 'emp_service6_icon', label: 'Ícone Serviço 6', type: 'text', hint: '☁️' },
    { key: 'emp_service6_title', label: 'Título Serviço 6', type: 'text' },
    { key: 'emp_service6_desc', label: 'Descrição Serviço 6', type: 'text' },
  ]},
  { section: 'CTA Final', fields: [
    { key: 'emp_cta_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_cta_title', label: 'Título', type: 'text' },
    { key: 'emp_cta_desc', label: 'Descrição', type: 'text' },
    { key: 'emp_cta_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_cta_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'emp_cta_btn_text', label: 'Texto Botão', type: 'text' },
    { key: 'emp_cta_btn_link', label: 'Link Botão', type: 'url' },
    { key: 'emp_cta_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'emp_cta_btn_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
];

export const ManageParaEmpresas = () => {
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
      setMsg('Configurações salvas!');
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
      case 'toggle':
        const isActive = val === 'true' || val === '';
        return (
          <div key={fd.key}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 44, height: 24, borderRadius: 12, position: 'relative', transition: 'background 0.2s',
                background: isActive ? '#22c55e' : '#555'
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2,
                  left: isActive ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </div>
              <input type="checkbox" checked={isActive} onChange={e => set(fd.key, e.target.checked ? 'true' : 'false', fd.label)}
                style={{ display: 'none' }} />
              <span style={{ fontSize: 13, color: isActive ? '#16a34a' : '#94a3b8' }}>{isActive ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>
        );
      default:
        return (
          <div key={fd.key}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
              style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>🏢 Para Empresas</h2>
          <p>Personalize a página empresarial com cores, textos, imagens e links.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/para-empresas" target="_blank" rel="noreferrer" className="admin-btn ghost">👁️ Visualizar</a>
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar'}
          </button>
        </div>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          {FIELDS.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 4,
                background: activeSection === i ? '#005CFF' : 'transparent',
                color: activeSection === i ? '#fff' : '#9ca3af',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
              }}>
              {s.section}
            </button>
          ))}
        </div>

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

export default ManageParaEmpresas;
