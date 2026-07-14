import React, { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }
interface NavSubItem { id: string; label: string; href: string; target?: '_blank' | '_self'; }
interface NavItem { id: string; label: string; href: string; target?: '_blank' | '_self'; hasDropdown: boolean; items: NavSubItem[]; }
const uid = () => Math.random().toString(36).slice(2, 9);

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'passos', label: 'Como Funciona' },
  { id: 'calculadora', label: 'Calculadora' },
  { id: 'about', label: 'Sobre' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'CTA Final' },
  { id: 'visibilidade', label: 'Visibilidade' },
  { id: 'cabecalho', label: 'Cabeçalho' },
  { id: 'menu', label: 'Menu' },
  { id: 'rodape', label: 'Rodapé' },
];

const FIELD_CONFIG: Record<string, ({ key: string; label: string; type?: string; hint?: string; options?: { value: string; label: string }[]; gridColumn?: string })[]> = {
  hero: [
    { key: 'ig_badge_text', label: 'Texto do Badge' },
    { key: 'ig_badge_bg', label: 'Cor do Badge', type: 'color' },
    { key: 'ig_badge_text_color', label: 'Cor Texto Badge', type: 'color' },
    { key: 'ig_hero_title', label: 'Título Hero' },
    { key: 'ig_hero_subtitle', label: 'Subtítulo', type: 'textarea' },
    { key: 'ig_hero_bg', label: 'Cor Fundo Hero', type: 'color' },
    { key: 'ig_hero_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_hero_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'ig_hero_btn_text', label: 'Texto Botão' },
    { key: 'ig_hero_btn_link', label: 'Link Botão' },
    { key: 'ig_hero_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_hero_btn_color', label: 'Cor Texto Botão', type: 'color' },
    { key: 'ig_hero_amount', label: 'Valor por Indicação (R$)' },
    { key: 'ig_hero_discount', label: 'Desconto (%)' },
    { key: 'ig_hero_footnote', label: 'Nota Rodapé', type: 'textarea' },
    { key: 'ig_hero_banner', label: 'Banner Hero (imagem full)', type: 'image' },
    { key: 'ig_hero_overlay', label: 'Ativar Overlay', type: 'select', options: [{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }] },
    { key: 'ig_hero_overlay_color', label: 'Cor Overlay', hint: 'rgba(0,20,60,0.7) ou #000000' },
    { key: 'ig_hero_show_text', label: 'Mostrar Textos e Botão', type: 'select', options: [{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }] },
    { key: 'ig_hero_padding', label: 'Espaçamento (px)' },
  ],
  marcas: [],
  passos: [
    { key: 'ig_steps_title', label: 'Título' },
    { key: 'ig_steps_subtitle', label: 'Subtítulo' },
    { key: 'ig_steps_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_steps_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_steps_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'ig_step_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_step_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_step_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_step_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_step_num_color', label: 'Cor Números', type: 'color' },
    { key: 'ig_step_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_step_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_steps_padding', label: 'Espaçamento (px)' },
  ],
  calculadora: [
    { key: 'ig_calc_title', label: 'Título' },
    { key: 'ig_calc_subtitle', label: 'Subtítulo' },
    { key: 'ig_calc_value_per', label: 'Valor por Indicação (R$)' },
    { key: 'ig_calc_badge_text', label: 'Texto Badge' },
    { key: 'ig_calc_note', label: 'Nota', type: 'textarea' },
    { key: 'ig_calc_note_size', label: 'Tamanho Nota (px)' },
    { key: 'ig_calc_btn_text', label: 'Texto Botão' },
    { key: 'ig_calc_btn_link', label: 'Link Botão' },
    { key: 'ig_calc_bg_color', label: 'Fundo Calculadora', hint: 'Cor ou gradiente CSS' },
    { key: 'ig_calc_result_bg', label: 'Fundo Resultado', hint: 'Cor ou gradiente CSS' },
    { key: 'ig_calc_result_color', label: 'Cor Texto Resultado', type: 'color' },
    { key: 'ig_calc_value_color', label: 'Cor Valor (R$)', type: 'color' },
    { key: 'ig_calc_slider_color', label: 'Cor Slider', type: 'color' },
    { key: 'ig_calc_border_radius', label: 'Border Radius', hint: 'Ex: 32px' },
    { key: 'ig_calc_padding', label: 'Espaçamento (px)' },
  ],
  about: [
    { key: 'ig_about_title', label: 'Título' },
    { key: 'ig_about_highlight', label: 'Destaque Título' },
    { key: 'ig_about_desc', label: 'Descrição', type: 'textarea' },
    { key: 'ig_about_bg', label: 'Fundo Seção', hint: 'Cor ou gradiente CSS' },
    { key: 'ig_about_stat_color', label: 'Cor Estatísticas', type: 'color' },
    { key: 'ig_about_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'ig_about_stat1_number', label: 'Nº Estatística 1' },
    { key: 'ig_about_stat1_label', label: 'Label Estatística 1' },
    { key: 'ig_about_stat2_number', label: 'Nº Estatística 2' },
    { key: 'ig_about_stat2_label', label: 'Label Estatística 2' },
    { key: 'ig_about_stat3_number', label: 'Nº Estatística 3' },
    { key: 'ig_about_stat3_label', label: 'Label Estatística 3' },
    { key: 'ig_about_stat4_number', label: 'Nº Estatística 4' },
    { key: 'ig_about_stat4_label', label: 'Label Estatística 4' },
  ],
  beneficios: [
    { key: 'ig_benefits_title', label: 'Título' },
    { key: 'ig_benefits_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_benefits_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_benefit_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_benefit_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_benefit_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_benefit_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_benefit_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_benefit_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_benefits_padding', label: 'Espaçamento (px)' },
  ],
  cta: [
    { key: 'ig_cta_title', label: 'Título' },
    { key: 'ig_cta_desc', label: 'Descrição', type: 'textarea' },
    { key: 'ig_cta_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_cta_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_cta_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'ig_cta_btn_text', label: 'Texto Botão' },
    { key: 'ig_cta_btn_link', label: 'Link Botão' },
    { key: 'ig_cta_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_cta_btn_color', label: 'Cor Texto Botão', type: 'color' },
    { key: 'ig_cta_overlay', label: 'Ativar Overlay', type: 'select', options: [{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }] },
    { key: 'ig_cta_image', label: 'Imagem Fundo CTA', type: 'image' },
    { key: 'ig_cta_padding', label: 'Espaçamento (px)' },
  ],
  cabecalho: [
    { key: 'ig_logo_url', label: 'Logo URL', type: 'image' },
    { key: 'ig_header_bg_color', label: 'Cor Fundo Barra', type: 'color' },
    { key: 'ig_header_text_color', label: 'Cor Texto Menu', type: 'color' },
    { key: 'ig_header_topbar_bg', label: 'Cor Fundo Top Bar', type: 'color' },
    { key: 'ig_header_topbar_text', label: 'Cor Texto Top Bar', type: 'color' },
    { key: 'ig_header_font', label: 'Fonte (Google Fonts)' },
    { key: 'ig_header_height', label: 'Altura Header (px)' },
    { key: 'ig_header_portal_text', label: 'Texto Botão Portal' },
    { key: 'ig_header_portal_url', label: 'Link Botão Portal' },
    { key: 'ig_header_portal_bg', label: 'Cor Fundo Botão Portal', type: 'color' },
    { key: 'ig_header_portal_text_color', label: 'Cor Texto Botão Portal', type: 'color' },
    { key: 'ig_header_portal_position', label: 'Posição Botão Portal', type: 'select', options: [
      { value: 'navbar_right', label: 'Barra Principal - Direita' },
      { value: 'navbar_left', label: 'Barra Principal - Esquerda' },
      { value: 'topbar_right', label: 'Barra Superior - Direita' },
      { value: 'topbar_left', label: 'Barra Superior - Esquerda' },
    ]},
  ],
  menu: [
    { key: 'ig_nav_item_gap', label: 'Distância entre Itens' },
    { key: 'ig_nav_item_padding', label: 'Espaço Clicável Itens' },
    { key: 'ig_nav_dropdown_width', label: 'Largura Dropdown' },
    { key: 'ig_nav_dropdown_padding', label: 'Espaço Interno Dropdown' },
    { key: 'ig_nav_subitem_padding', label: 'Espaço Clicável Sub-itens' },
    { key: 'ig_nav_font_size', label: 'Tamanho Fonte Menu' },
  ],
  rodape: [
    { key: 'ig_footer_logo_url', label: 'Logo Rodapé', type: 'image' },
    { key: 'ig_footer_bg_color', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_footer_text_color', label: 'Cor Texto', type: 'color' },
    { key: 'ig_footer_heading_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_footer_link_color', label: 'Cor Links', type: 'color' },
    { key: 'ig_footer_about_text', label: 'Texto Sobre', type: 'textarea' },
    { key: 'ig_footer_col2_title', label: 'Título Coluna 2' },
    { key: 'ig_footer_col3_title', label: 'Título Coluna 3' },
    { key: 'ig_footer_col4_title', label: 'Título Coluna 4' },
    { key: 'ig_footer_font', label: 'Fonte (Google Fonts)' },
    { key: 'ig_footer_padding', label: 'Padding' },
    { key: 'ig_footer_subbar_bg', label: 'Cor Fundo Sub Bar', type: 'color' },
    { key: 'ig_footer_subbar_text', label: 'Cor Texto Sub Bar', type: 'color' },
    { key: 'ig_footer_anatel_logo_url', label: 'URL Logo Anatel', type: 'image' },
    { key: 'ig_footer_cnpj', label: 'CNPJ' },
    { key: 'ig_footer_anatel', label: 'ANATEL' },
  ],
};

const VIS_FIELDS = [
  { section: 'Hero', visKey: 'ig_vis_hero', mobKey: 'ig_vis_hero_mobile' },
  { section: 'Marcas', visKey: 'ig_vis_brands', mobKey: 'ig_vis_brands_mobile' },
  { section: 'Como Funciona', visKey: 'ig_vis_steps', mobKey: 'ig_vis_steps_mobile' },
  { section: 'Calculadora', visKey: 'ig_vis_calc', mobKey: 'ig_vis_calc_mobile' },
  { section: 'Sobre', visKey: 'ig_vis_about', mobKey: 'ig_vis_about_mobile' },
  { section: 'Benefícios', visKey: 'ig_vis_benefits', mobKey: 'ig_vis_benefits_mobile' },
  { section: 'Depoimentos', visKey: 'ig_vis_testimonials', mobKey: 'ig_vis_testimonials_mobile' },
  { section: 'FAQ', visKey: 'ig_vis_faq', mobKey: 'ig_vis_faq_mobile' },
  { section: 'CTA Final', visKey: 'ig_vis_cta', mobKey: 'ig_vis_cta_mobile' },
];

const renderField = (
  fd: { key: string; label?: string; type?: string; hint?: string; options?: { value: string; label: string }[] },
  val: string,
  onChange: (value: string) => void,
) => {
  switch (fd.type || 'text') {
    case 'image':
      return (
        <div key={fd.key} style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
          <ImageUpload value={val} onChange={onChange} />
        </div>
      );
    case 'color':
      return (
        <div key={fd.key}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={val || '#000000'} onChange={e => onChange(e.target.value)}
              style={{ width: 40, height: 36, padding: 0, border: '1px solid #333', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
            <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={fd.hint}
              style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '6px 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff' }} />
          </div>
        </div>
      );
    case 'textarea':
      return (
        <div key={fd.key} style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
          <textarea value={val} onChange={e => onChange(e.target.value)} placeholder={fd.hint}
            style={{ width: '100%', minHeight: 80, padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13, resize: 'vertical' }} />
        </div>
      );
    case 'select':
      return (
        <div key={fd.key}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
          <select value={val || (fd.options?.[0]?.value ?? '')} onChange={e => onChange(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }}>
            {fd.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    default:
      return (
        <div key={fd.key}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
          <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={fd.hint}
            style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
        </div>
      );
  }
};

function DynamicListEditor({ settings, set, label, storageKey, fields }: {
  settings: Record<string, Setting>; set: (key: string, value: string, label: string) => void;
  label: string; storageKey: string; fields: { key: string; label: string; type?: string }[];
}) {
  const raw = settings[storageKey]?.value || '[]';
  let items: Record<string, string>[] = [];
  try { items = JSON.parse(raw); } catch { items = []; }
  const updateItems = (newItems: Record<string, string>[]) => set(storageKey, JSON.stringify(newItems), label);
  const addItem = () => { const obj: Record<string, string> = {}; fields.forEach(f => { obj[f.key] = ''; }); updateItems([...items, obj]); };
  const removeItem = (i: number) => updateItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, fkey: string, v: string) => { const copy = [...items]; copy[i] = { ...copy[i], [fkey]: v }; updateItems(copy); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{label}</h3>
        <button onClick={addItem} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Adicionar</button>
      </div>
      {items.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>Nenhum item ainda.</p>}
      {items.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600 }}>Item #{idx + 1}</span>
            <button onClick={() => removeItem(idx)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Remover</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {fields.map(f => {
              const v = item[f.key] || '';
              if (f.type === 'image') return <div key={f.key} style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label><ImageUpload value={v} onChange={nv => updateItem(idx, f.key, nv)} /></div>;
              if (f.type === 'textarea') return <div key={f.key} style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label><textarea value={v} onChange={e => updateItem(idx, f.key, e.target.value)} style={{ width: '100%', minHeight: 60, padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12, resize: 'vertical' }} /></div>;
              return <div key={f.key}><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label><input type="text" value={v} onChange={e => updateItem(idx, f.key, e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} /></div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export const ManageIndiqueGanhe = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/settings').then((data: Record<string, { value: string; label: string }>) => {
      const map: Record<string, Setting> = {};
      for (const [key, obj] of Object.entries(data)) { map[key] = { key, value: obj.value, label: obj.label }; }
      setSettings(map);
      const navVal = map['ig_nav_menu']?.value;
      if (navVal) { try { setNavItems(JSON.parse(navVal)); } catch { setNavItems([]); } }
    }).catch(() => {});
  }, []);

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({ ...prev, [key]: { key, value, label } }));
  };

  const saveAll = async () => {
    setSaving(true); setMsg('');
    try {
      const allKeys = Object.keys(FIELD_CONFIG).flatMap(k => FIELD_CONFIG[k].map(f => f.key));
      allKeys.push('ig_nav_menu');
      VIS_FIELDS.forEach(vf => { allKeys.push(vf.visKey, vf.mobKey); });
      allKeys.push('ig_page_gradient', 'ig_page_gradient_color1', 'ig_page_gradient_color2', 'ig_page_gradient_color3', 'ig_page_gradient_angle');
      allKeys.push('ig_hero_overlay', 'ig_hero_overlay_color', 'ig_hero_show_text');
      ['ig_brands_items', 'ig_steps_items', 'ig_benefits_items', 'ig_testimonials_items', 'ig_faq_items'].forEach(k => allKeys.push(k));
      const toSave = allKeys.filter(k => settings[k] || k === 'ig_nav_menu').map(k => {
        if (k === 'ig_nav_menu') return apiFetch('/settings/ig_nav_menu', { method: 'PUT', body: JSON.stringify({ value: JSON.stringify(navItems), label: 'IG: Menu de Navegação (JSON)' }) });
        return apiFetch(`/settings/${k}`, { method: 'PUT', body: JSON.stringify({ value: settings[k].value, label: settings[k].label }) });
      });
      await Promise.all(toSave);
      setMsg('Configurações salvas com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) { setMsg(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const currentTab = TABS[activeTab].id;

  const addNavItem = () => setNavItems(items => [...items, { id: uid(), label: 'Novo Item', href: '#', target: '_self', hasDropdown: false, items: [] }]);
  const removeNavItem = (id: string) => setNavItems(items => items.filter(i => i.id !== id));
  const updateNavItem = (id: string, patch: Partial<NavItem>) => setNavItems(items => items.map(i => i.id === id ? { ...i, ...patch } : i));
  const moveNavItem = (id: string, dir: -1 | 1) => setNavItems(items => { const idx = items.findIndex(i => i.id === id); if (idx < 0) return items; const next = idx + dir; if (next < 0 || next >= items.length) return items; const arr = [...items]; [arr[idx], arr[next]] = [arr[next], arr[idx]]; return arr; });
  const addSubItem = (pid: string) => setNavItems(items => items.map(i => i.id === pid ? { ...i, hasDropdown: true, items: [...i.items, { id: uid(), label: 'Sub-item', href: '#', target: '_self' }] } : i));
  const removeSubItem = (pid: string, sid: string) => setNavItems(items => items.map(i => i.id === pid ? { ...i, items: i.items.filter(s => s.id !== sid) } : i));
  const updateSubItem = (pid: string, sid: string, patch: Partial<NavSubItem>) => setNavItems(items => items.map(i => i.id === pid ? { ...i, items: i.items.map(s => s.id === sid ? { ...s, ...patch } : s) } : i));

  const renderStandardSection = (tabId: string) => {
    const fields = FIELD_CONFIG[tabId] || [];
    return (
      <div>
        <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
          {TABS.find(t => t.id === tabId)?.label}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fields.map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label)))}
        </div>
      </div>
    );
  };

  const Toggle = ({ label, valKey }: { label: string; valKey: string }) => {
    const val = settings[valKey]?.value || 'true';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <button onClick={() => set(valKey, val === 'true' ? 'false' : 'true', label)}
          style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', background: val === 'true' ? '#22c55e' : '#4b5563', transition: 'all 0.2s' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: val === 'true' ? 23 : 3, transition: 'all 0.2s' }} />
        </button>
        <span style={{ fontSize: 13, color: '#e2e8f0' }}>{label}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Indique e Ganhe</h2>
          <p>Personalize a página de indicações com todas as seções, cores e conteúdos.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/indique-e-ganhe" target="_blank" rel="noreferrer" className="admin-btn ghost">Visualizar</a>
          <button className="admin-btn primary" onClick={saveAll} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Tudo'}</button>
        </div>
      </div>
      {msg && <div className="admin-alert success">{msg}</div>}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          {TABS.map((tab, i) => (
            <button key={tab.id} onClick={() => setActiveTab(i)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 4, background: activeTab === i ? '#22c55e' : 'transparent', color: activeTab === i ? '#fff' : '#9ca3af', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeTab === i ? 600 : 400, transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="admin-card" style={{ flex: 1 }}>
          {currentTab === 'marcas' && <DynamicListEditor settings={settings} set={set} label="Marcas Parceiras" storageKey="ig_brands_items" fields={[{ key: 'logo', label: 'URL da Logo', type: 'image' }, { key: 'name', label: 'Nome da Marca' }]} />}
          {currentTab === 'passos' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {(FIELD_CONFIG.passos || []).map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label)))}
              </div>
              <DynamicListEditor settings={settings} set={set} label="Passos (Itens Dinâmicos)" storageKey="ig_steps_items" fields={[{ key: 'icon', label: 'Ícone (emoji)' }, { key: 'title', label: 'Título' }, { key: 'desc', label: 'Descrição', type: 'textarea' }]} />
            </div>
          )}
          {currentTab === 'beneficios' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {(FIELD_CONFIG.beneficios || []).map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label)))}
              </div>
              <DynamicListEditor settings={settings} set={set} label="Benefícios (Itens Dinâmicos)" storageKey="ig_benefits_items" fields={[{ key: 'icon', label: 'Ícone (emoji)' }, { key: 'title', label: 'Título' }, { key: 'desc', label: 'Descrição', type: 'textarea' }]} />
            </div>
          )}
          {currentTab === 'depoimentos' && <DynamicListEditor settings={settings} set={set} label="Depoimentos" storageKey="ig_testimonials_items" fields={[{ key: 'photo', label: 'URL da Foto', type: 'image' }, { key: 'name', label: 'Nome' }, { key: 'company', label: 'Empresa / Cargo' }, { key: 'text', label: 'Depoimento', type: 'textarea' }]} />}
          {currentTab === 'faq' && <DynamicListEditor settings={settings} set={set} label="Perguntas Frequentes" storageKey="ig_faq_items" fields={[{ key: 'question', label: 'Pergunta', type: 'textarea' }, { key: 'answer', label: 'Resposta', type: 'textarea' }]} />}
          {currentTab === 'menu' && (
            <div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Dimensionamento do Menu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {(FIELD_CONFIG.menu || []).map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label)))}
                </div>
              </div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Itens do Menu</h3>
                  <button onClick={addNavItem} className="admin-btn primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>+ Adicionar Item</button>
                </div>
                {navItems.map((item, idx) => (
                  <div key={item.id} style={{ border: '1px solid #333', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#1e1e2d', cursor: 'pointer' }} onClick={() => setExpandedNav(expandedNav === item.id ? null : item.id)}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, -1); }} style={{ padding: '2px 6px', fontSize: '0.7rem', background: '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} disabled={idx === 0}>▲</button>
                        <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, 1); }} style={{ padding: '2px 6px', fontSize: '0.7rem', background: '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} disabled={idx === navItems.length - 1}>▼</button>
                      </div>
                      <span style={{ flex: 1, fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>{item.label}{item.hasDropdown && <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#6b7280', fontWeight: 400 }}>({item.items.length} sub)</span>}</span>
                      <button onClick={e => { e.stopPropagation(); removeNavItem(item.id); }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>🗑️</button>
                      <span style={{ color: '#6b7280' }}>{expandedNav === item.id ? '▾' : '▸'}</span>
                    </div>
                    {expandedNav === item.id && (
                      <div style={{ padding: 16, background: '#16162a', borderTop: '1px solid #333' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12 }}>
                          <div><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Texto</label><input value={item.label} onChange={e => updateNavItem(item.id, { label: e.target.value })} style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} /></div>
                          <div><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Link</label><input value={item.href} onChange={e => updateNavItem(item.id, { href: e.target.value })} style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} /></div>
                          <div><label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Abrir em</label><select value={item.target || '_self'} onChange={e => updateNavItem(item.id, { target: e.target.value as '_blank' | '_self' })} style={{ height: 32, padding: '0 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }}><option value="_self">Mesma</option><option value="_blank">Nova</option></select></div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem' }}>{item.hasDropdown ? 'Sub-itens' : 'Sem dropdown'}</label>
                            <button onClick={() => addSubItem(item.id)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>+ Sub</button>
                          </div>
                          {item.items.map(sub => (
                            <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                              <div><label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Nome</label><input value={sub.label} onChange={e => updateSubItem(item.id, sub.id, { label: e.target.value })} style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} /></div>
                              <div><label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Link</label><input value={sub.href} onChange={e => updateSubItem(item.id, sub.id, { href: e.target.value })} style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} /></div>
                              <select value={sub.target || '_self'} onChange={e => updateSubItem(item.id, sub.id, { target: e.target.value as '_blank' | '_self' })} style={{ height: 32, padding: '0 6px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 11 }}><option value="_self">Mesma</option><option value="_blank">Nova</option></select>
                              <button onClick={() => removeSubItem(item.id, sub.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>🗑️</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentTab === 'visibilidade' && (
            <div>
              <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Gradiente Global da Página</h3>
              <div style={{ marginBottom: 20 }}>
                <Toggle label="Ativar gradiente de fundo em todas as seções" valKey="ig_page_gradient" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end', marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>Cor Início</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="color" value={settings['ig_page_gradient_color1']?.value || '#e3f8ff'} onChange={e => set('ig_page_gradient_color1', e.target.value, 'Cor 1')}
                      style={{ width: 40, height: 36, padding: 0, border: '1px solid #333', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                    <input type="text" value={settings['ig_page_gradient_color1']?.value || '#e3f8ff'} onChange={e => set('ig_page_gradient_color1', e.target.value, 'Cor 1')}
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '6px 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>Cor Meio</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="color" value={settings['ig_page_gradient_color2']?.value || '#ffffff'} onChange={e => set('ig_page_gradient_color2', e.target.value, 'Cor 2')}
                      style={{ width: 40, height: 36, padding: 0, border: '1px solid #333', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                    <input type="text" value={settings['ig_page_gradient_color2']?.value || '#ffffff'} onChange={e => set('ig_page_gradient_color2', e.target.value, 'Cor 2')}
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '6px 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>Cor Fim</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="color" value={settings['ig_page_gradient_color3']?.value || '#f0f9ff'} onChange={e => set('ig_page_gradient_color3', e.target.value, 'Cor 3')}
                      style={{ width: 40, height: 36, padding: 0, border: '1px solid #333', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                    <input type="text" value={settings['ig_page_gradient_color3']?.value || '#f0f9ff'} onChange={e => set('ig_page_gradient_color3', e.target.value, 'Cor 3')}
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '6px 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>Direção</label>
                  <select value={settings['ig_page_gradient_angle']?.value || '180'} onChange={e => set('ig_page_gradient_angle', e.target.value, 'Ângulo')}
                    style={{ padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }}>
                    <option value="180">↓ Cima → Baixo</option>
                    <option value="0">↓ Baixo → Cima</option>
                    <option value="90">→ Esquerda → Direita</option>
                    <option value="270">← Direita → Esquerda</option>
                    <option value="135">↘ Diagonal</option>
                    <option value="45">↗ Diagonal Inversa</option>
                  </select>
                </div>
              </div>
              <div style={{ height: 80, borderRadius: 16, background: `linear-gradient(${settings['ig_page_gradient_angle']?.value || '180'}deg, ${settings['ig_page_gradient_color1']?.value || '#e3f8ff'} 0%, ${settings['ig_page_gradient_color2']?.value || '#ffffff'} 50%, ${settings['ig_page_gradient_color3']?.value || '#f0f9ff'} 100%)`, border: '1px solid #333', marginBottom: 32 }} />

              <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Visibilidade das Seções</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #333', fontWeight: 600, fontSize: 13, color: '#9ca3af' }}>Seção</div>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #333', fontWeight: 600, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>Desktop</div>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #333', fontWeight: 600, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>Mobile</div>
                {VIS_FIELDS.map(vf => (
                  <React.Fragment key={vf.visKey}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #222', fontSize: 14, color: '#e2e8f0' }}>{vf.section}</div>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #222', textAlign: 'center' }}><Toggle label="" valKey={vf.visKey} /></div>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #222', textAlign: 'center' }}><Toggle label="" valKey={vf.mobKey} /></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          {['hero', 'calculadora', 'about', 'cta', 'cabecalho', 'rodape'].includes(currentTab) && renderStandardSection(currentTab)}
        </div>
      </div>
    </div>
  );
};

export default ManageIndiqueGanhe;
