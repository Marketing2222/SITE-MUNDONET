import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }

const FIELDS = [
  { section: 'Hero', fields: [
    { key: 'ig_badge_text', label: 'Texto do Badge', type: 'text', hint: 'INDIQUE E GANHE' },
    { key: 'ig_badge_bg', label: 'Cor do Badge', type: 'color' },
    { key: 'ig_badge_text_color', label: 'Cor Texto do Badge', type: 'color' },
    { key: 'ig_hero_title', label: 'Título (parte 1)', type: 'text', hint: 'Indique a' },
    { key: 'ig_hero_highlight', label: 'Texto Destaque (verde)', type: 'text', hint: 'Mundonet' },
    { key: 'ig_hero_title_suffix', label: 'Título (parte 2)', type: 'text', hint: 'e ganhe recompensas!' },
    { key: 'ig_hero_subtitle', label: 'Subtítulo', type: 'textarea' },
    { key: 'ig_hero_image', label: 'Imagem', type: 'image' },
    { key: 'ig_hero_bg', label: 'Cor de Fundo', type: 'color' },
    { key: 'ig_hero_title_color', label: 'Cor do Título', type: 'color' },
    { key: 'ig_hero_highlight_color', label: 'Cor do Destaque', type: 'color' },
    { key: 'ig_hero_subtitle_color', label: 'Cor do Subtítulo', type: 'color' },
    { key: 'ig_hero_btn_text', label: 'Texto do Botão', type: 'text' },
    { key: 'ig_hero_btn_link', label: 'Link do Botão', type: 'url' },
    { key: 'ig_hero_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_hero_btn_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
  { section: 'Como Funciona', fields: [
    { key: 'ig_steps_title', label: 'Título', type: 'text' },
    { key: 'ig_steps_subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'ig_steps_bg', label: 'Cor de Fundo', type: 'color' },
    { key: 'ig_steps_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_steps_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'ig_step_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_step_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_step_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_step_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_step_num_color', label: 'Cor Números', type: 'color' },
    { key: 'ig_step_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_step_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_step1_icon', label: 'Ícone Passo 1', type: 'text', hint: '🔗' },
    { key: 'ig_step1_title', label: 'Título Passo 1', type: 'text', hint: 'Crie seu link' },
    { key: 'ig_step1_desc', label: 'Descrição Passo 1', type: 'textarea' },
    { key: 'ig_step2_icon', label: 'Ícone Passo 2', type: 'text', hint: '📤' },
    { key: 'ig_step2_title', label: 'Título Passo 2', type: 'text', hint: 'Compartilhe' },
    { key: 'ig_step2_desc', label: 'Descrição Passo 2', type: 'textarea' },
    { key: 'ig_step3_icon', label: 'Ícone Passo 3', type: 'text', hint: '🎁' },
    { key: 'ig_step3_title', label: 'Título Passo 3', type: 'text', hint: 'Ganhe recompensas' },
    { key: 'ig_step3_desc', label: 'Descrição Passo 3', type: 'textarea' },
  ]},
  { section: 'Benefícios', fields: [
    { key: 'ig_benefits_title', label: 'Título', type: 'text' },
    { key: 'ig_benefits_bg', label: 'Cor de Fundo', type: 'color' },
    { key: 'ig_benefits_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_benefit_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_benefit_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_benefit_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_benefit_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_benefit_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_benefit_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_benefit1_icon', label: 'Ícone Benefício 1', type: 'text', hint: '🌐' },
    { key: 'ig_benefit1_title', label: 'Título Benefício 1', type: 'text', hint: 'Internet de Verdade' },
    { key: 'ig_benefit1_desc', label: 'Descrição Benefício 1', type: 'textarea' },
    { key: 'ig_benefit2_icon', label: 'Ícone Benefício 2', type: 'text', hint: '💰' },
    { key: 'ig_benefit2_title', label: 'Título Benefício 2', type: 'text', hint: 'Preço Justo' },
    { key: 'ig_benefit2_desc', label: 'Descrição Benefício 2', type: 'textarea' },
    { key: 'ig_benefit3_icon', label: 'Ícone Benefício 3', type: 'text', hint: '⚡' },
    { key: 'ig_benefit3_title', label: 'Título Benefício 3', type: 'text', hint: 'Instalação Rápida' },
    { key: 'ig_benefit3_desc', label: 'Descrição Benefício 3', type: 'textarea' },
    { key: 'ig_benefit4_icon', label: 'Ícone Benefício 4', type: 'text', hint: '🎯' },
    { key: 'ig_benefit4_title', label: 'Título Benefício 4', type: 'text', hint: 'Suporte Dedicado' },
    { key: 'ig_benefit4_desc', label: 'Descrição Benefício 4', type: 'textarea' },
  ]},
  { section: 'Recompensas', fields: [
    { key: 'ig_rewards_title', label: 'Título', type: 'text' },
    { key: 'ig_rewards_desc', label: 'Descrição', type: 'textarea' },
    { key: 'ig_rewards_image', label: 'Imagem', type: 'image' },
    { key: 'ig_rewards_bg', label: 'Cor de Fundo', type: 'color' },
    { key: 'ig_rewards_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_rewards_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'ig_rewards_item_color', label: 'Cor Itens', type: 'color' },
    { key: 'ig_rewards_check_color', label: 'Cor Check', type: 'color' },
    { key: 'ig_rewards_item1', label: 'Benefício 1', type: 'text', hint: 'Descontos progressivos' },
    { key: 'ig_rewards_item2', label: 'Benefício 2', type: 'text', hint: '礼品' },
    { key: 'ig_rewards_item3', label: 'Benefício 3', type: 'text', hint: '礼品' },
    { key: 'ig_rewards_item4', label: 'Benefício 4', type: 'text', hint: '礼品' },
    { key: 'ig_rewards_item5', label: 'Benefício 5', type: 'text', hint: '礼品' },
    { key: 'ig_rewards_btn_text', label: 'Texto Botão', type: 'text' },
    { key: 'ig_rewards_btn_link', label: 'Link Botão', type: 'url' },
    { key: 'ig_rewards_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_rewards_btn_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
  { section: 'CTA Final', fields: [
    { key: 'ig_cta_title', label: 'Título', type: 'text' },
    { key: 'ig_cta_desc', label: 'Descrição', type: 'text' },
    { key: 'ig_cta_bg', label: 'Cor de Fundo', type: 'color' },
    { key: 'ig_cta_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_cta_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'ig_cta_btn_text', label: 'Texto Botão', type: 'text' },
    { key: 'ig_cta_btn_link', label: 'Link Botão', type: 'url' },
    { key: 'ig_cta_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_cta_btn_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
];

export const ManageIndiqueGanhe = () => {
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
      setMsg('Configurações salvas com sucesso!');
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
          <h2>🎁 Indique e Ganhe</h2>
          <p>Personalize a página de indicações com cores, textos, imagens e links.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/indique-e-ganhe" target="_blank" rel="noreferrer" className="admin-btn ghost">
            👁️ Visualizar
          </a>
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar'}
          </button>
        </div>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          {FIELDS.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 4,
                background: activeSection === i ? '#22c55e' : 'transparent',
                color: activeSection === i ? '#fff' : '#9ca3af',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
                transition: 'all 0.15s'
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

export default ManageIndiqueGanhe;
