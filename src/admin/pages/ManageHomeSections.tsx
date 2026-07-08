import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import ManageQuickLinks from './ManageQuickLinks';
import ManageBenefits from './ManageBenefits';
import { RichTextField } from '../components/RichTextField';
import { API_BASE_URL } from '../../config/api';

interface Setting { key: string; value: string; label: string; }

type FieldType = 'text' | 'url' | 'textarea' | 'image' | 'color' | 'toggle' | 'font' | 'spacing' | 'list' | 'align' | 'select';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
}

const SECTIONS: Record<string, FieldDef[]> = {
  'Links Rápidos (Ajuda)': [
    { key: 'quicklinks_title', label: 'Título Principal', type: 'text', hint: 'Padrão: Como podemos te ajudar hoje?' },
  ],
  'Benefícios': [
    { key: 'benefits_title', label: 'Título Principal', type: 'text', hint: 'Padrão: Benefícios e vantagens de ser cliente Mundonet' },
  ],
  'Aplicativo Móvel': [
    { key: 'app_subtitle', label: 'Subtítulo', type: 'text', hint: 'Padrão: Aplicativo Móvel' },
    { key: 'app_subtitle_align', label: 'Alinhamento do Subtítulo', type: 'align' },
    { key: 'app_title', label: 'Título Principal', type: 'text', hint: 'Padrão: O app que conecta você a tudo da Mundonet' },
    { key: 'app_title_align', label: 'Alinhamento do Título', type: 'align' },
    { key: 'app_desc', label: 'Texto Descritivo', type: 'textarea' },
    { key: 'app_desc_align', label: 'Alinhamento do Descrição', type: 'align' },
    { key: 'app_bullets', label: 'Benefícios (um por linha)', type: 'list' },
    { key: 'app_playstore', label: 'Link Google Play', type: 'url' },
    { key: 'app_appstore', label: 'Link App Store', type: 'url' },
    { key: 'app_image', label: 'Imagem de Destaque', type: 'image' },
    { key: 'app_image_size', label: 'Tamanho da Imagem (%)', type: 'spacing', hint: 'Ex: 100%, 80%, 500px' },
  ],
  'Especialidades': [
    { key: 'corp_subtitle', label: 'Subtítulo Link Dedicado', type: 'text', hint: 'Padrão: Soluções Corporativas' },
    { key: 'corp_subtitle_align', label: 'Alinhamento do Subtítulo', type: 'align' },
    { key: 'corp_title', label: 'Título Link Dedicado', type: 'text', hint: 'Padrão: Link Dedicado para sua Empresa' },
    { key: 'corp_title_align', label: 'Alinhamento do Título', type: 'align' },
    { key: 'corp_desc', label: 'Descrição Link Dedicado', type: 'textarea' },
    { key: 'corp_desc_align', label: 'Alinhamento da Descrição', type: 'align' },
    { key: 'corp_feat1_icon', label: 'Ícone Benefício 1 (SVG ou Emoji)', type: 'textarea', hint: 'Cole um código <svg> ou um emoji.' },
    { key: 'corp_feat1_title', label: 'Título Benefício 1', type: 'text' },
    { key: 'corp_feat1_desc', label: 'Descrição Benefício 1', type: 'text' },
    { key: 'corp_feat2_icon', label: 'Ícone Benefício 2 (SVG ou Emoji)', type: 'textarea', hint: 'Cole um código <svg> ou um emoji.' },
    { key: 'corp_feat2_title', label: 'Título Benefício 2', type: 'text' },
    { key: 'corp_feat2_desc', label: 'Descrição Benefício 2', type: 'text' },
    { key: 'corp_speed_val', label: 'Valor Gráfico', type: 'text', hint: 'Padrão: 100%' },
    { key: 'corp_speed_lbl', label: 'Rótulo Gráfico', type: 'text', hint: 'Padrão: Disponibilidade' },
    { key: 'corp_speed_desc', label: 'Texto do Gráfico', type: 'text' },
    { key: 'corp_btn_text', label: 'Texto do Botão Link Dedicado', type: 'text' },
    { key: 'corp_btn_link', label: 'Link do Botão Link Dedicado', type: 'url' },
    { key: 'wifi_subtitle', label: 'Subtítulo Wi-Fi 6', type: 'text', hint: 'Padrão: Ultra Wi-Fi 6' },
    { key: 'wifi_subtitle_align', label: 'Alinhamento do Subtítulo Wi-Fi 6', type: 'align' },
    { key: 'wifi_title', label: 'Título Wi-Fi 6', type: 'text', hint: 'Padrão: Experimente o máximo desempenho com nossos equipamentos' },
    { key: 'wifi_title_align', label: 'Alinhamento do Título Wi-Fi 6', type: 'align' },
    { key: 'wifi_desc', label: 'Descrição Wi-Fi 6', type: 'textarea' },
    { key: 'wifi_desc_align', label: 'Alinhamento da Descrição Wi-Fi 6', type: 'align' },
    { key: 'wifi_feat1_icon', label: 'Ícone Benefício 1 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat1_title', label: 'Título Benefício 1 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat1_desc', label: 'Descrição Benefício 1 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat2_icon', label: 'Ícone Benefício 2 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat2_title', label: 'Título Benefício 2 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat2_desc', label: 'Descrição Benefício 2 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat3_icon', label: 'Ícone Benefício 3 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat3_title', label: 'Título Benefício 3 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat3_desc', label: 'Descrição Benefício 3 Wi-Fi 6', type: 'text' },
    { key: 'wifi_btn_text', label: 'Texto do Botão Wi-Fi 6', type: 'text' },
    { key: 'wifi_btn_link', label: 'Link do Botão Wi-Fi 6', type: 'url' },
    { key: 'wifi_image', label: 'Imagem do Roteador', type: 'image' },
  ],
  'Entretenimento': [
    { key: 'ent_subtitle', label: 'Subtítulo', type: 'text', hint: 'Aplicativos para diversão...' },
    { key: 'ent_subtitle_align', label: 'Alinhamento do Subtítulo', type: 'align' },
    { key: 'ent_subtitle_font_size', label: 'Tamanho do Subtítulo', type: 'spacing', hint: 'Ex: 0.95rem, 16px' },
    { key: 'ent_title', label: 'Título Principal', type: 'text', hint: 'Aplicativos de entretenimento que traz...' },
    { key: 'ent_title_align', label: 'Alinhamento do Título', type: 'align' },
    { key: 'ent_title_font_size', label: 'Tamanho do Título', type: 'spacing', hint: 'Ex: 28px, 2rem' },
    { key: 'ent_title_font', label: 'Fonte do Título', type: 'font', hint: 'Google Fonts, ex: Poppins. Vazio = padrão.' },
    { key: 'ent_bottom_text', label: 'Texto inferior (acima do botão)', type: 'text', hint: 'Fale com nosso time e consulte...' },
    { key: 'ent_bottom_align', label: 'Alinhamento do Texto Inferior', type: 'align' },
    { key: 'ent_bottom_font_size', label: 'Tamanho do Texto Inferior', type: 'spacing', hint: 'Ex: 0.92rem, 14px' },
    { key: 'ent_btn_text', label: 'Texto do Botão', type: 'text', hint: 'Fale com nosso time' },
    { key: 'ent_btn_bg', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #6d28d9' },
    { key: 'ent_btn_text_color', label: 'Cor do Texto do Botão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'ent_btn_font_size', label: 'Tamanho do Botão', type: 'spacing', hint: 'Ex: 0.95rem, 16px' },
    { key: 'ent_btn_link', label: 'Link do Botão', type: 'url', hint: 'Ex: https://api.whatsapp.com/...' },
    { key: 'ent_bg_color', label: 'Cor de Fundo da Seção', type: 'color', hint: 'Padrão: #f8fafc' },
    { key: 'ent_text_color', label: 'Cor do Texto', type: 'color', hint: 'Padrão: #1e293b' },
    { key: 'ent_carousel_bg', label: 'Cor de Fundo do Carrossel', type: 'color', hint: 'Padrão: #ffffff' },
  ],
  'Planos': [
    { key: 'plans_eyebrow_color', label: 'Cor do Subtítulo ("Nossos Planos")', type: 'color', hint: 'Padrão: #7c3aed' },
    { key: 'plans_eyebrow_bg', label: 'Fundo do Subtítulo ("Nossos Planos")', type: 'color', hint: 'Padrão: #f3e8ff' },
    { key: 'plans_title_color', label: 'Cor do Título Principal', type: 'color', hint: 'Padrão: #1e1b4b' },
    { key: 'plans_arrow_color', label: 'Cor das Setas do Carrossel', type: 'color', hint: 'Padrão: #7c3aed' },
    { key: 'plans_arrow_bg', label: 'Fundo das Setas do Carrossel', type: 'color', hint: 'Padrão: #f3e8ff' },
    { key: 'plans_arrow_border', label: 'Borda das Setas do Carrossel', type: 'color', hint: 'Padrão: #e9d5ff' },
    { key: 'plans_dots_color', label: 'Cor dos Pontos do Carrossel', type: 'color', hint: 'Padrão: #7c3aed' },
  ],
  'Popup de Saída': [
    { key: 'exit_popup_enabled', label: 'Popup Ativo', type: 'toggle' },
    { key: 'exit_popup_title', label: 'Título do Popup', type: 'text', hint: 'Padrão: Ainda está aí?' },
    { key: 'exit_popup_subtitle', label: 'Subtítulo', type: 'text', hint: 'Padrão: Entre em contato e contrate com a gente de forma simples e segura!' },
    { key: 'exit_popup_bg_color', label: 'Cor de Fundo', type: 'color', hint: 'Padrão: #1a1028' },
    { key: 'exit_popup_text_color', label: 'Cor do Texto', type: 'color', hint: 'Padrão: #a1a1aa' },
    { key: 'exit_popup_title_color', label: 'Cor do Título', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'exit_popup_accent_color', label: 'Cor de Destaque (Ícones e Links)', type: 'color', hint: 'Padrão: #a855f7' },
    { key: 'exit_popup_card_bg', label: 'Cor de Fundo dos Cards', type: 'color', hint: 'Padrão: #2a1f3d' },
    { key: 'exit_popup_card_border', label: 'Cor da Borda dos Cards', type: 'color', hint: 'Padrão: rgba(255,255,255,0.08)' },
    { key: 'exit_popup_overlay_color', label: 'Cor do Overlay (fundo escurecido)', type: 'color', hint: 'Padrão: rgba(0,0,0,0.6)' },
  ],
  'Botão WhatsApp': [
    { key: 'wa_btn_link', label: 'Link do WhatsApp', type: 'url', hint: 'Ex: https://api.whatsapp.com/send?phone=55...' },
    { key: 'wa_btn_image', label: 'Imagem do Botão (URL ou upload)', type: 'image', hint: 'Deixe vazio para usar o ícone padrão do WhatsApp' },
    { key: 'wa_btn_size', label: 'Tamanho do Botão (px)', type: 'spacing', hint: 'Padrão: 60px' },
    { key: 'wa_btn_color', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #25D366' },
    { key: 'wa_btn_icon_color', label: 'Cor do Ícone/Imagem', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'wa_btn_shadow', label: 'Cor da Sombra', type: 'color', hint: 'Padrão: rgba(37,211,102,0.4)' },
    { key: 'wa_bubble_text', label: 'Texto do Balão', type: 'text', hint: 'Ex: Olá! Precisa de ajuda?' },
    { key: 'wa_bubble_bg', label: 'Cor de Fundo do Balão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'wa_bubble_color', label: 'Cor do Texto do Balão', type: 'color', hint: 'Padrão: #333333' },
    { key: 'wa_bubble_font_size', label: 'Tamanho da Fonte do Balão', type: 'spacing', hint: 'Padrão: 14px' },
  ],
  'Banner CTA': [
    { key: 'cta_bg_image', label: 'Imagem de Fundo', type: 'image', hint: 'Imagem de fundo do banner' },
    { key: 'cta_bg_color', label: 'Cor de Fundo', type: 'color', hint: 'Padrão: #1a0a2e' },
    { key: 'cta_title', label: 'Título', type: 'text', hint: 'Procurando um plano para sua empresa?' },
    { key: 'cta_desc', label: 'Descrição', type: 'text', hint: 'Planos de internet para empresas...' },
    { key: 'cta_text_color', label: 'Cor do Título', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'cta_desc_color', label: 'Cor da Descrição', type: 'color', hint: 'Padrão: #d1d5db' },
    { key: 'cta_content_position', label: 'Posição do Conteúdo', type: 'select', hint: 'left', options: [
      { value: 'left', label: 'Esquerda' },
      { value: 'center', label: 'Centro' },
      { value: 'right', label: 'Direita' },
    ]},
    { key: 'cta_btn_text', label: 'Texto do Botão', type: 'text', hint: 'Conheça nossas soluções' },
    { key: 'cta_btn_link', label: 'Link do Botão', type: 'url' },
    { key: 'cta_btn_bg', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'cta_btn_color', label: 'Cor do Texto do Botão', type: 'color', hint: 'Padrão: #7c3aed' },
  ],
  'Central de Atendimento': [],
};

const SECTION_DEFS = [
  { id: 'hero', label: 'Banner (Hero)', icon: '🖼️' },
  { id: 'quicklinks', label: 'Links Rápidos', icon: '🔗' },
  { id: 'plans', label: 'Planos', icon: '📦' },
  { id: 'benefits', label: 'Benefícios', icon: '⭐' },
  { id: 'app', label: 'Aplicativo Móvel', icon: '📱' },
  { id: 'specialties', label: 'Especialidades (Wi-Fi 6 + Link Dedicado)', icon: '📶' },
  { id: 'entertainment', label: 'Entretenimento', icon: '🎬' },
  { id: 'cta', label: 'Banner CTA', icon: '🎯' },
  { id: 'support', label: 'Central de Atendimento', icon: '💬' },
  { id: 'contact', label: 'Contato', icon: '📞' },
];

const DEFAULT_ORDER = SECTION_DEFS.map(s => s.id);
const DEFAULT_ACTIVE: Record<string, boolean> = Object.fromEntries(SECTION_DEFS.map(s => [s.id, true]));

export const ManageHomeSections = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>(Object.keys(SECTIONS)[0]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_ORDER);
  const [sectionsActive, setSectionsActive] = useState<Record<string, boolean>>({ ...DEFAULT_ACTIVE });
  const [popupCards, setPopupCards] = useState<{ id: number; title: string; description: string; link: string; icon_type: string }[]>([]);

  const load = async () => {
    try {
      const data: Record<string, { value: string; label: string }> = await apiFetch('/settings');
      const map: Record<string, Setting> = {};
      for (const [key, obj] of Object.entries(data)) {
        map[key] = { key, value: obj.value, label: obj.label };
      }
      setSettings(map);
      if (data.sections_order?.value) {
        try {
          const parsed = JSON.parse(data.sections_order.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = [...parsed];
            for (const id of DEFAULT_ORDER) {
              if (!merged.includes(id)) merged.push(id);
            }
            setSectionOrder(merged);
          }
        } catch { /* use default */ }
      }
      if (data.sections_active?.value) {
        try {
          const parsed = JSON.parse(data.sections_active.value);
          if (typeof parsed === 'object' && parsed !== null) setSectionsActive({ ...DEFAULT_ACTIVE, ...parsed });
        } catch { /* use default */ }
      }
      if (data.exit_popup_cards?.value) {
        try {
          const parsed = JSON.parse(data.exit_popup_cards.value);
          if (Array.isArray(parsed)) setPopupCards(parsed);
        } catch { /* use default */ }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setSectionOrder(next);
  };

  const toggleActive = (id: string) => {
    setSectionsActive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await Promise.all([
        apiFetch('/settings/sections_order', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(sectionOrder), label: 'Ordem das Seções' })
        }),
        apiFetch('/settings/sections_active', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(sectionsActive), label: 'Seções Ativas' })
        })
      ]);
      setMsg('Ordem e visibilidade salvas com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { key, value, label }
    }));
  };

  const handleImageUpload = async (file: File, key: string, label: string) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('mundonet_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) set(key, data.url, label);
    } catch (e) {
      console.error('Erro no upload', e);
      alert('Erro no upload da imagem.');
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updates = Object.values(settings);
      await Promise.all(
        updates.map(s => 
          apiFetch(`/settings/${s.key}`, {
            method: 'PUT',
            body: JSON.stringify({ value: s.value, label: s.label })
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

  const renderField = (fd: FieldDef) => {
    const val = settings[fd.key]?.value || '';

    switch (fd.type) {
      case 'textarea':
        const alignKey = fd.key + '_align';
        const currentAlign = settings[alignKey]?.value || 'left';
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>{fd.label}</label>
              <div style={{ display: 'flex', gap: 2 }}>
                {[
                  { v: 'left', icon: '⫷', title: 'Esquerda' },
                  { v: 'center', icon: '☰', title: 'Centralizado' },
                  { v: 'right', icon: '⫸', title: 'Direita' },
                  { v: 'justify', icon: '≡', title: 'Justificado' },
                ].map(a => (
                  <button
                    key={a.v}
                    className={`admin-btn ${currentAlign === a.v ? 'primary' : 'ghost'}`}
                    style={{ padding: '3px 8px', fontSize: 12, minWidth: 32 }}
                    title={a.title}
                    onClick={() => set(alignKey, a.v, fd.label + ' (Alinhamento)')}
                  >{a.icon}</button>
                ))}
              </div>
            </div>
            <RichTextField value={val} onChange={v => set(fd.key, v, fd.label)} placeholder={fd.hint} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'image':
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder="https://..." style={{ flex: 1 }} />
              <label className="admin-btn ghost" style={{ cursor: 'pointer', margin: 0 }}>
                Upload
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0], fd.key, fd.label);
                  }
                }} />
              </label>
            </div>
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
            {val && (
              <div style={{ marginTop: 10, padding: 10, background: 'var(--adm-bg)', borderRadius: 8, display: 'inline-block' }}>
                <img src={val} alt="Preview" style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        );
      case 'color':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={val || '#000000'} onChange={e => set(fd.key, e.target.value, fd.label)}
                style={{ width: 40, height: 36, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
              <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
                style={{ flex: 1, fontFamily: 'monospace', fontSize: 13 }} />
            </div>
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'toggle':
        const isActive = val === 'true' || val === '' || val === undefined;
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                <input type="checkbox" checked={isActive} onChange={e => set(fd.key, e.target.checked ? 'true' : 'false', fd.label)}
                  style={{ display: 'none' }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 12, transition: 'background 0.2s',
                  background: isActive ? 'var(--adm-primary, #2563EB)' : '#ccc'
                }} />
                <span style={{
                  position: 'absolute', top: 2, left: isActive ? 22 : 2, width: 20, height: 20,
                  borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </label>
              <span style={{ fontSize: 13, color: 'var(--adm-text2)' }}>{isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>
        );
      case 'font':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint || 'Ex: Poppins, Inter...'} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
            {val && <div style={{ marginTop: 6, padding: '8px 12px', background: 'var(--adm-bg)', borderRadius: 6, fontFamily: val, fontSize: '0.95rem', border: '1px dashed var(--adm-border)' }}>Preview: {val}</div>}
          </div>
        );
      case 'spacing':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint || 'Ex: 28px, 0.95rem, 16px'} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'list':
        const listItems = val ? val.split('\n') : [];
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {listItems.map((item: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: 'var(--adm-text2)', fontSize: 13, minWidth: 20 }}>{idx + 1}.</span>
                  <input
                    value={item}
                    onChange={e => {
                      const next = [...listItems];
                      next[idx] = e.target.value;
                      set(fd.key, next.join('\n'), fd.label);
                    }}
                    style={{ flex: 1, padding: '6px 10px', fontSize: 13 }}
                  />
                  <button
                    className="admin-btn ghost"
                    style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444' }}
                    onClick={() => {
                      const next = listItems.filter((_: string, i: number) => i !== idx);
                      set(fd.key, next.join('\n'), fd.label);
                    }}
                  >×</button>
                </div>
              ))}
              <button
                className="admin-btn ghost"
                style={{ fontSize: 13, alignSelf: 'flex-start' }}
                onClick={() => set(fd.key, listItems.concat(['']).join('\n'), fd.label)}
              >+ Adicionar Benefício</button>
            </div>
          </div>
        );
      case 'align':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { v: 'left', icon: '⫷', title: 'Esquerda' },
                { v: 'center', icon: '☰', title: 'Centralizado' },
                { v: 'right', icon: '⫸', title: 'Direita' },
                { v: 'justify', icon: '≡', title: 'Justificado' },
              ].map(a => (
                <button
                  key={a.v}
                  className={`admin-btn ${val === a.v ? 'primary' : 'ghost'}`}
                  style={{ padding: '6px 12px', fontSize: 14, minWidth: 42 }}
                  title={a.title}
                  onClick={() => set(fd.key, a.v, fd.label)}
                >{a.icon}</button>
              ))}
            </div>
          </div>
        );
      case 'select':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <select
              value={val || fd.hint || ''}
              onChange={e => set(fd.key, e.target.value, fd.label)}
              style={{ padding: '6px 10px', fontSize: 13 }}
            >
              {fd.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input type={fd.type} value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Seções da Home</h2>
          <p>Personalize os textos, imagens e benefícios apresentados nas seções da página inicial.</p>
        </div>
        {activeTab !== 'Links Rápidos (Ajuda)' && activeTab !== 'Benefícios' && (
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {msg && <div className={`admin-alert ${msg.includes('Erro') ? 'red' : 'success'}`}>{msg}</div>}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Ordem das Seções</h3>
          <button className="admin-btn primary" onClick={saveOrder} disabled={saving} style={{ fontSize: 13 }}>
            {saving ? 'Salvando...' : 'Salvar Ordem e Visibilidade'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sectionOrder.map((id, i) => {
            const def = SECTION_DEFS.find(s => s.id === id);
            const active = sectionsActive[id] !== false;
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', background: 'var(--adm-bg)', borderRadius: 8,
                border: '1px solid var(--adm-border)', opacity: active ? 1 : 0.5
              }}>
                <span style={{ fontSize: 18 }}>{def?.icon || '?'}</span>
                <span style={{ flex: 1 }}>{def?.label || id}</span>
                <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'var(--adm-text2)' }}>
                  <input type="checkbox" checked={active} onChange={() => toggleActive(id)}
                    style={{ width:16, height:16, cursor:'pointer' }} />
                  {active ? 'Ativo' : 'Inativo'}
                </label>
                <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 13, lineHeight: 1 }}
                  disabled={i === 0} onClick={() => moveSection(i, -1)} title="Mover para cima">▲</button>
                <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 13, lineHeight: 1 }}
                  disabled={i === sectionOrder.length - 1} onClick={() => moveSection(i, 1)} title="Mover para baixo">▼</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {Object.keys(SECTIONS).map(tab => (
          <button 
            key={tab} 
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toggle de ativar/desativar seção */}
      <div className="admin-card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{SECTION_DEFS.find(s => s.id === Object.keys(SECTIONS).find(k => k === activeTab))?.icon || '📋'}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Seção {activeTab}</span>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
          <span style={{ color: sectionsActive[Object.keys(SECTIONS).find(k => k === activeTab) || ''] !== false ? '#16a34a' : '#94a3b8', fontWeight: 500 }}>
            {sectionsActive[Object.keys(SECTIONS).find(k => k === activeTab) || ''] !== false ? 'Visível no site' : 'Oculta no site'}
          </span>
          <div
            onClick={async () => {
              const tabId = sectionOrder.find(id => SECTION_DEFS.find(s => s.id === id)?.label === activeTab);
              if (tabId) {
                const nextActive = { ...sectionsActive, [tabId]: sectionsActive[tabId] === false ? true : false };
                setSectionsActive(nextActive);
                try {
                  await apiFetch('/settings/sections_active', {
                    method: 'PUT',
                    body: JSON.stringify({ value: JSON.stringify(nextActive), label: 'Seções Ativas' })
                  });
                } catch (e) { console.error(e); }
              }
            }}
            style={{
              width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
              background: sectionsActive[sectionOrder.find(id => SECTION_DEFS.find(s => s.id === id)?.label === activeTab) || ''] !== false ? '#16a34a' : '#cbd5e1',
              transition: 'background 0.2s'
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: 2,
              transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transform: sectionsActive[sectionOrder.find(id => SECTION_DEFS.find(s => s.id === id)?.label === activeTab) || ''] !== false ? 'translateX(20px)' : 'translateX(0)'
            }} />
          </div>
        </label>
      </div>

      {activeTab === 'Links Rápidos (Ajuda)' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto da Seção
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Texto'}
              </button>
            </div>
          </div>
          <ManageQuickLinks />
        </>
      ) : activeTab === 'Benefícios' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto da Seção
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Texto'}
              </button>
            </div>
          </div>
          <ManageBenefits />
        </>
      ) : activeTab === 'Popup de Saída' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto e Cores
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
          </div>
          <div className="admin-card">
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Opções de Contato (Cards)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {popupCards.map((card, i) => (
                <div key={card.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 8, alignItems: 'center',
                  padding: '12px', background: 'var(--adm-bg)', borderRadius: 8, border: '1px solid var(--adm-border)'
                }}>
                  <input value={card.title} placeholder="Título" onChange={e => {
                    const next = [...popupCards]; next[i] = { ...card, title: e.target.value }; setPopupCards(next);
                  }} style={{ padding: '6px 10px', fontSize: 13 }} />
                  <input value={card.description} placeholder="Descrição" onChange={e => {
                    const next = [...popupCards]; next[i] = { ...card, description: e.target.value }; setPopupCards(next);
                  }} style={{ padding: '6px 10px', fontSize: 13 }} />
                  <select value={card.icon_type} onChange={e => {
                    const next = [...popupCards]; next[i] = { ...card, icon_type: e.target.value }; setPopupCards(next);
                  }} style={{ padding: '6px 8px', fontSize: 13 }}>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telefone</option>
                    <option value="email">E-mail</option>
                    <option value="support">Suporte</option>
                  </select>
                  <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444' }}
                    onClick={() => setPopupCards(popupCards.filter((_, j) => j !== i))}>Remover</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn ghost" onClick={() => setPopupCards([...popupCards, {
                  id: Date.now(), title: '', description: '', link: '#', icon_type: 'whatsapp'
                }])} style={{ fontSize: 13 }}>+ Adicionar Card</button>
              </div>
              {popupCards.map((card, i) => (
                <div key={`link-${card.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                  <input value={card.link} placeholder="Link (https://... ou tel:... ou mailto:...)" onChange={e => {
                    const next = [...popupCards]; next[i] = { ...card, link: e.target.value }; setPopupCards(next);
                  }} style={{ padding: '6px 10px', fontSize: 13 }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={async () => {
                await save();
                await apiFetch('/settings/exit_popup_cards', {
                  method: 'PUT',
                  body: JSON.stringify({ value: JSON.stringify(popupCards), label: 'Cards do Popup de Saída' })
                });
              }} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Popup de Saída'}
              </button>
            </div>
          </div>
        </>
      ) : activeTab === 'Central de Atendimento' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header: Cores */}
          <div className="admin-card">
            <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15 }}>🎨 Aparência</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              {[
                { key: 'support_bg_color', label: 'Fundo da Seção', hint: '#f5f0ff' },
                { key: 'support_title_color', label: 'Cor dos Títulos', hint: '#1e1b4b' },
                { key: 'support_desc_color', label: 'Cor das Descrições', hint: '#64748b' },
                { key: 'support_card_bg', label: 'Fundo dos Cards', hint: '#ffffff' },
              ].map(fd => {
                const val = settings[fd.key]?.value || '';
                return (
                  <div key={fd.key}>
                    <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>{fd.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="color" value={val || '#000000'} onChange={e => set(fd.key, e.target.value, fd.label)}
                        style={{ width: 36, height: 32, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                      <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
                        style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '4px 8px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado a lado: Esquerda / Direita */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Coluna Esquerda */}
            <div className="admin-card">
              <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#7c3aed', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>ESQUERDA</span>
                Sobre a Empresa
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Título</label>
                  <input value={settings.support_left_title?.value || ''} onChange={e => set('support_left_title', e.target.value, 'Título')}
                    placeholder="Somos a Mundonet" style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Descrição</label>
                  <textarea value={settings.support_left_desc?.value || ''} onChange={e => set('support_left_desc', e.target.value, 'Descrição')}
                    placeholder="Texto institucional..." rows={4} style={{ width: '100%', padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Texto Destaque</label>
                  <input value={settings.support_left_highlight?.value || ''} onChange={e => set('support_left_highlight', e.target.value, 'Texto Destaque')}
                    placeholder="Faça parte deste movimento." style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                  <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Botão</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Texto</label>
                      <input value={settings.support_left_btn_text?.value || ''} onChange={e => set('support_left_btn_text', e.target.value, 'Texto Botão')}
                        placeholder="Conheça mais" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Link</label>
                      <input value={settings.support_left_btn_link?.value || ''} onChange={e => set('support_left_btn_link', e.target.value, 'Link Botão')}
                        placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Cor</label>
                    <input type="color" value={settings.support_left_btn_bg?.value || '#7c3aed'} onChange={e => set('support_left_btn_bg', e.target.value, 'Cor Botão')}
                      style={{ width: 32, height: 28, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                    <span style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Texto</span>
                    <input type="color" value={settings.support_left_btn_color?.value || '#ffffff'} onChange={e => set('support_left_btn_color', e.target.value, 'Cor Texto Botão')}
                      style={{ width: 32, height: 28, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="admin-card">
              <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#7c3aed', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>DIREITA</span>
                Canais de Atendimento
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Título</label>
                  <input value={settings.support_right_title?.value || ''} onChange={e => set('support_right_title', e.target.value, 'Título Direita')}
                    placeholder="Canais de atendimento" style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Descrição</label>
                  <textarea value={settings.support_right_desc?.value || ''} onChange={e => set('support_right_desc', e.target.value, 'Descrição Direita')}
                    placeholder="Texto sobre canais..." rows={3} style={{ width: '100%', padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
                </div>

                {/* Canais */}
                {[
                  { prefix: 'ch1', label: 'Canal 1' },
                  { prefix: 'ch2', label: 'Canal 2' },
                ].map(ch => (
                  <div key={ch.prefix} style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                    <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>{ch.label}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Valor</label>
                        <input value={settings[`support_${ch.prefix}_value`]?.value || ''} onChange={e => set(`support_${ch.prefix}_value`, e.target.value, `${ch.label} Valor`)}
                          placeholder="0800 765 5507" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Rótulo</label>
                        <input value={settings[`support_${ch.prefix}_label`]?.value || ''} onChange={e => set(`support_${ch.prefix}_label`, e.target.value, `${ch.label} Rótulo`)}
                          placeholder="Whatsapp e telefone" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Link</label>
                      <input value={settings[`support_${ch.prefix}_link`]?.value || ''} onChange={e => set(`support_${ch.prefix}_link`, e.target.value, `${ch.label} Link`)}
                        placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                  </div>
                ))}

                {/* Botões de ação */}
                <div style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                  <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Botões de Ação</label>
                  {[{ prefix: 'ch_btn1', label: 'Botão 1' }, { prefix: 'ch_btn2', label: 'Botão 2' }].map(btn => (
                    <div key={btn.prefix} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>{btn.label} - Texto</label>
                          <input value={settings[`support_${btn.prefix}_text`]?.value || ''} onChange={e => set(`support_${btn.prefix}_text`, e.target.value, `${btn.label} Texto`)}
                            placeholder="Entre em contato" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>{btn.label} - Link</label>
                          <input value={settings[`support_${btn.prefix}_link`]?.value || ''} onChange={e => set(`support_${btn.prefix}_link`, e.target.value, `${btn.label} Link`)}
                            placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Fundo</label>
                        <input type="color" value={settings[`support_${btn.prefix}_bg`]?.value || '#7c3aed'} onChange={e => set(`support_${btn.prefix}_bg`, e.target.value, `${btn.label} Cor`)}
                          style={{ width: 28, height: 24, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Texto</label>
                        <input type="color" value={settings[`support_${btn.prefix}_color`]?.value || '#ffffff'} onChange={e => set(`support_${btn.prefix}_color`, e.target.value, `${btn.label} Cor Texto`)}
                          style={{ width: 28, height: 24, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn primary" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Central de Atendimento'}
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
            Editar {activeTab}
          </h3>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {SECTIONS[activeTab].map(renderField)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeSections;