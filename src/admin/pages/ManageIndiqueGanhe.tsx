import { useState, useEffect } from 'react';
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
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'CTA Final' },
  { id: 'cabecalho', label: 'Cabeçalho' },
  { id: 'menu', label: 'Menu' },
  { id: 'rodape', label: 'Rodapé' },
];

const FIELD_CONFIG: Record<string, ({ key: string; label: string; type?: string; hint?: string; options?: { value: string; label: string }[] })[]> = {
  hero: [
    { key: 'ig_badge_text', label: 'Texto do Badge', hint: 'INDIQUE E GANHE' },
    { key: 'ig_badge_bg', label: 'Cor do Badge', type: 'color' },
    { key: 'ig_badge_text_color', label: 'Cor Texto do Badge', type: 'color' },
    { key: 'ig_hero_title', label: 'Título Hero', hint: 'Indique e Ganhe R$ 150' },
    { key: 'ig_hero_subtitle', label: 'Subtítulo Hero', type: 'textarea' },
    { key: 'ig_hero_image', label: 'Imagem Hero', type: 'image' },
    { key: 'ig_hero_bg', label: 'Cor Fundo Hero', type: 'color' },
    { key: 'ig_hero_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_hero_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'ig_hero_btn_text', label: 'Texto Botão', hint: 'Indique Agora' },
    { key: 'ig_hero_btn_link', label: 'Link Botão', hint: '#como-funciona' },
    { key: 'ig_hero_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'ig_hero_btn_color', label: 'Cor Texto Botão', type: 'color' },
    { key: 'ig_hero_amount', label: 'Valor por Indicação (R$)', hint: '150' },
    { key: 'ig_hero_discount', label: 'Desconto (%)', hint: '10%' },
    { key: 'ig_hero_footnote', label: 'Nota Rodapé Hero', type: 'textarea' },
    { key: 'ig_hero_padding', label: 'Espaçamento Hero (px)', hint: 'Ex: 100' },
  ],
  marcas: [],
  passos: [
    { key: 'ig_steps_title', label: 'Título Seção' },
    { key: 'ig_steps_subtitle', label: 'Subtítulo' },
    { key: 'ig_steps_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_steps_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_steps_subtitle_color', label: 'Cor Subtítulo', type: 'color' },
    { key: 'ig_step_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_step_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_step_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_step_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_step_num_color', label: 'Cor Números', type: 'color' },
    { key: 'ig_step_title_color', label: 'Cor Títulos Cards', type: 'color' },
    { key: 'ig_step_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_steps_padding', label: 'Espaçamento (px)', hint: 'Ex: 100' },
  ],
  calculadora: [
    { key: 'ig_calc_title', label: 'Título', hint: 'Quanto eu posso ganhar?' },
    { key: 'ig_calc_value_per', label: 'Valor por Indicação (R$)', hint: '150' },
    { key: 'ig_calc_note', label: 'Nota', type: 'textarea' },
    { key: 'ig_calc_padding', label: 'Espaçamento (px)', hint: 'Ex: 100' },
  ],
  beneficios: [
    { key: 'ig_benefits_title', label: 'Título Seção' },
    { key: 'ig_benefits_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'ig_benefits_title_color', label: 'Cor Título', type: 'color' },
    { key: 'ig_benefit_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'ig_benefit_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'ig_benefit_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'ig_benefit_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'ig_benefit_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'ig_benefit_desc_color', label: 'Cor Descrições', type: 'color' },
    { key: 'ig_benefits_padding', label: 'Espaçamento (px)', hint: 'Ex: 100' },
  ],
  depoimentos: [],
  faq: [],
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
    { key: 'ig_cta_padding', label: 'Espaçamento (px)', hint: 'Ex: 100' },
  ],
  cabecalho: [
    { key: 'ig_logo_url', label: 'Logo URL', type: 'image' },
    { key: 'ig_header_bg_color', label: 'Cor Fundo Barra', type: 'color' },
    { key: 'ig_header_text_color', label: 'Cor Texto Menu', type: 'color' },
    { key: 'ig_header_topbar_bg', label: 'Cor Fundo Top Bar', type: 'color' },
    { key: 'ig_header_topbar_text', label: 'Cor Texto Top Bar', type: 'color' },
    { key: 'ig_header_font', label: 'Fonte (Google Fonts)', hint: 'Ex: Poppins' },
    { key: 'ig_header_height', label: 'Altura Header (px)', hint: '80' },
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
    { key: 'ig_nav_item_gap', label: 'Distância entre Itens', hint: 'Ex: 8px' },
    { key: 'ig_nav_item_padding', label: 'Espaço Clicável Itens', hint: 'Ex: 8px 16px' },
    { key: 'ig_nav_dropdown_width', label: 'Largura Dropdown', hint: 'Ex: 200px' },
    { key: 'ig_nav_dropdown_padding', label: 'Espaço Interno Dropdown', hint: 'Ex: 8px 0' },
    { key: 'ig_nav_subitem_padding', label: 'Espaço Clicável Sub-itens', hint: 'Ex: 10px 20px' },
    { key: 'ig_nav_font_size', label: 'Tamanho Fonte Menu', hint: 'Ex: 16px' },
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
    { key: 'ig_footer_font', label: 'Fonte (Google Fonts)', hint: 'Ex: Poppins' },
    { key: 'ig_footer_padding', label: 'Padding', hint: 'Ex: 60px 0' },
    { key: 'ig_footer_subbar_bg', label: 'Cor Fundo Sub Bar', type: 'color' },
    { key: 'ig_footer_subbar_text', label: 'Cor Texto Sub Bar', type: 'color' },
    { key: 'ig_footer_anatel_logo_url', label: 'URL Logo Anatel', type: 'image' },
    { key: 'ig_footer_cnpj', label: 'CNPJ' },
    { key: 'ig_footer_anatel', label: 'ANATEL' },
  ],
};

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
  settings: Record<string, Setting>;
  set: (key: string, value: string, label: string) => void;
  label: string;
  storageKey: string;
  fields: { key: string; label: string; type?: string }[];
}) {
  const raw = settings[storageKey]?.value || '[]';
  let items: Record<string, string>[] = [];
  try { items = JSON.parse(raw); } catch { items = []; }

  const updateItems = (newItems: Record<string, string>[]) => {
    set(storageKey, JSON.stringify(newItems), label);
  };

  const addItem = () => {
    const obj: Record<string, string> = {};
    fields.forEach(f => { obj[f.key] = ''; });
    updateItems([...items, obj]);
  };

  const removeItem = (i: number) => {
    updateItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, fkey: string, v: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [fkey]: v };
    updateItems(copy);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{label}</h3>
        <button onClick={addItem} className="admin-btn sm"
          style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          + Adicionar
        </button>
      </div>
      {items.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>Nenhum item ainda.</p>}
      {items.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600 }}>Item #{idx + 1}</span>
            <button onClick={() => removeItem(idx)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
              Remover
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {fields.map(f => {
              const v = item[f.key] || '';
              if (f.type === 'image') {
                return (
                  <div key={f.key} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label>
                    <ImageUpload value={v} onChange={nv => updateItem(idx, f.key, nv)} />
                  </div>
                );
              }
              if (f.type === 'textarea') {
                return (
                  <div key={f.key} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label>
                    <textarea value={v} onChange={e => updateItem(idx, f.key, e.target.value)}
                      style={{ width: '100%', minHeight: 60, padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12, resize: 'vertical' }} />
                  </div>
                );
              }
              return (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>{f.label}</label>
                  <input type="text" value={v} onChange={e => updateItem(idx, f.key, e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} />
                </div>
              );
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
      for (const [key, obj] of Object.entries(data)) {
        map[key] = { key, value: obj.value, label: obj.label };
      }
      setSettings(map);
      // Load nav
      const navVal = map['ig_nav_menu']?.value;
      if (navVal) {
        try { setNavItems(JSON.parse(navVal)); } catch { setNavItems([]); }
      }
    }).catch(() => {});
  }, []);

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({ ...prev, [key]: { key, value, label } }));
  };

  const saveAll = async () => {
    setSaving(true);
    setMsg('');
    try {
      const allKeys = Object.keys(FIELD_CONFIG).flatMap(k => FIELD_CONFIG[k].map(f => f.key));
      allKeys.push('ig_nav_menu');
      const updates = allKeys.filter(k => settings[k] || k === 'ig_nav_menu');
      const toSave = updates.map(k => {
        if (k === 'ig_nav_menu') {
          return apiFetch(`/settings/ig_nav_menu`, {
            method: 'PUT',
            body: JSON.stringify({ value: JSON.stringify(navItems), label: 'IG: Menu de Navegação (JSON)' })
          });
        }
        return apiFetch(`/settings/${k}`, {
          method: 'PUT',
          body: JSON.stringify({ value: settings[k].value, label: settings[k].label })
        });
      });
      // Dynamic list keys
      ['ig_brands_items', 'ig_steps_items', 'ig_benefits_items', 'ig_testimonials_items', 'ig_faq_items'].forEach(k => {
        if (settings[k]) {
          toSave.push(apiFetch(`/settings/${k}`, {
            method: 'PUT',
            body: JSON.stringify({ value: settings[k].value, label: settings[k].label })
          }));
        }
      });
      await Promise.all(toSave);
      setMsg('Configurações salvas com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const currentTab = TABS[activeTab].id;

  const btn = (active = false): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 8, border: '1px solid #333',
    background: active ? '#22c55e' : 'transparent',
    color: active ? '#fff' : '#9ca3af', cursor: 'pointer', fontSize: '0.82rem',
    fontWeight: active ? 700 : 400, transition: 'all 0.15s',
  });

  // Nav helpers
  const addNavItem = () => {
    setNavItems(items => [...items, { id: uid(), label: 'Novo Item', href: '#', target: '_self', hasDropdown: false, items: [] }]);
  };
  const removeNavItem = (id: string) => setNavItems(items => items.filter(i => i.id !== id));
  const updateNavItem = (id: string, patch: Partial<NavItem>) => {
    setNavItems(items => items.map(i => i.id === id ? { ...i, ...patch } : i));
  };
  const moveNavItem = (id: string, dir: -1 | 1) => {
    setNavItems(items => {
      const idx = items.findIndex(i => i.id === id);
      if (idx < 0) return items;
      const next = idx + dir;
      if (next < 0 || next >= items.length) return items;
      const arr = [...items];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };
  const addSubItem = (parentId: string) => {
    setNavItems(items => items.map(i => i.id === parentId
      ? { ...i, hasDropdown: true, items: [...i.items, { id: uid(), label: 'Sub-item', href: '#', target: '_self' }] }
      : i
    ));
  };
  const removeSubItem = (parentId: string, subId: string) => {
    setNavItems(items => items.map(i => i.id === parentId
      ? { ...i, items: i.items.filter(s => s.id !== subId) }
      : i
    ));
  };
  const updateSubItem = (parentId: string, subId: string, patch: Partial<NavSubItem>) => {
    setNavItems(items => items.map(i => i.id === parentId
      ? { ...i, items: i.items.map(s => s.id === subId ? { ...s, ...patch } : s) }
      : i
    ));
  };

  const renderStandardSection = (tabId: string) => {
    const fields = FIELD_CONFIG[tabId] || [];
    return (
      <div>
        <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
          {TABS.find(t => t.id === tabId)?.label}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fields.map(fd => {
            const val = settings[fd.key]?.value || '';
            return renderField(fd, val, v => set(fd.key, v, fd.label));
          })}
        </div>
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
          <a href="/indique-e-ganhe" target="_blank" rel="noreferrer" className="admin-btn ghost">
            Visualizar
          </a>
          <button className="admin-btn primary" onClick={saveAll} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Tudo'}
          </button>
        </div>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          {TABS.map((tab, i) => (
            <button key={tab.id} onClick={() => setActiveTab(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 4,
                background: activeTab === i ? '#22c55e' : 'transparent',
                color: activeTab === i ? '#fff' : '#9ca3af',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeTab === i ? 600 : 400,
                transition: 'all 0.15s'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-card" style={{ flex: 1 }}>
          {currentTab === 'marcas' && (
            <DynamicListEditor
              settings={settings}
              set={set}
              label="Marcas Parceiras"
              storageKey="ig_brands_items"
              fields={[
                { key: 'logo', label: 'URL da Logo', type: 'image' },
                { key: 'name', label: 'Nome da Marca' },
              ]}
            />
          )}

          {currentTab === 'passos' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {(FIELD_CONFIG.passos || []).map(fd => {
                  const val = settings[fd.key]?.value || '';
                  return renderField(fd, val, v => set(fd.key, v, fd.label));
                })}
              </div>
              <DynamicListEditor
                settings={settings}
                set={set}
                label="Passos (Itens Dinâmicos)"
                storageKey="ig_steps_items"
                fields={[
                  { key: 'icon', label: 'Ícone (emoji)' },
                  { key: 'title', label: 'Título' },
                  { key: 'desc', label: 'Descrição', type: 'textarea' },
                ]}
              />
            </div>
          )}

          {currentTab === 'beneficios' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {(FIELD_CONFIG.beneficios || []).map(fd => {
                  const val = settings[fd.key]?.value || '';
                  return renderField(fd, val, v => set(fd.key, v, fd.label));
                })}
              </div>
              <DynamicListEditor
                settings={settings}
                set={set}
                label="Benefícios (Itens Dinâmicos)"
                storageKey="ig_benefits_items"
                fields={[
                  { key: 'icon', label: 'Ícone (emoji)' },
                  { key: 'title', label: 'Título' },
                  { key: 'desc', label: 'Descrição', type: 'textarea' },
                ]}
              />
            </div>
          )}

          {currentTab === 'depoimentos' && (
            <DynamicListEditor
              settings={settings}
              set={set}
              label="Depoimentos"
              storageKey="ig_testimonials_items"
              fields={[
                { key: 'photo', label: 'URL da Foto', type: 'image' },
                { key: 'name', label: 'Nome' },
                { key: 'company', label: 'Empresa / Cargo' },
                { key: 'text', label: 'Depoimento', type: 'textarea' },
              ]}
            />
          )}

          {currentTab === 'faq' && (
            <DynamicListEditor
              settings={settings}
              set={set}
              label="Perguntas Frequentes"
              storageKey="ig_faq_items"
              fields={[
                { key: 'question', label: 'Pergunta', type: 'textarea' },
                { key: 'answer', label: 'Resposta', type: 'textarea' },
              ]}
            />
          )}

          {currentTab === 'menu' && (
            <div>
              {/* Nav spacing */}
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Dimensionamento do Menu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {(FIELD_CONFIG.menu || []).map(fd => {
                    const val = settings[fd.key]?.value || '';
                    return renderField(fd, val, v => set(fd.key, v, fd.label));
                  })}
                </div>
              </div>
              {/* Nav items */}
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Itens do Menu</h3>
                  <button onClick={addNavItem} className="admin-btn primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>+ Adicionar Item</button>
                </div>
                {navItems.map((item, idx) => (
                  <div key={item.id} style={{ border: '1px solid #333', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#1e1e2d', cursor: 'pointer' }}
                      onClick={() => setExpandedNav(expandedNav === item.id ? null : item.id)}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, -1); }} style={{ ...btn(), padding: '2px 6px', fontSize: '0.7rem' }} disabled={idx === 0}>▲</button>
                        <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, 1); }} style={{ ...btn(), padding: '2px 6px', fontSize: '0.7rem' }} disabled={idx === navItems.length - 1}>▼</button>
                      </div>
                      <span style={{ flex: 1, fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                        {item.label}
                        {item.hasDropdown && <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#6b7280', fontWeight: 400 }}>({item.items.length} sub-itens)</span>}
                      </span>
                      <button onClick={e => { e.stopPropagation(); removeNavItem(item.id); }} style={{ ...btn(), color: '#ef4444', borderColor: '#ef4444', padding: '4px 10px' }}>🗑️</button>
                      <span style={{ color: '#6b7280', fontSize: '1rem' }}>{expandedNav === item.id ? '▾' : '▸'}</span>
                    </div>
                    {expandedNav === item.id && (
                      <div style={{ padding: '16px', background: '#16162a', borderTop: '1px solid #333' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12 }}>
                          <div>
                            <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Texto</label>
                            <input value={item.label} onChange={e => updateNavItem(item.id, { label: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Link</label>
                            <input value={item.href} onChange={e => updateNavItem(item.id, { href: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Abrir em</label>
                            <select value={item.target || '_self'} onChange={e => updateNavItem(item.id, { target: e.target.value as '_blank' | '_self' })}
                              style={{ height: 32, padding: '0 8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }}>
                              <option value="_self">Mesma aba</option>
                              <option value="_blank">Nova aba</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem' }}>
                              {item.hasDropdown ? 'Sub-itens' : 'Item sem dropdown'}
                            </label>
                            <button onClick={() => addSubItem(item.id)} style={{ ...btn(), fontSize: '0.8rem' }}>+ Sub-item</button>
                          </div>
                          {item.items.length === 0 && (
                            <p style={{ color: '#6b7280', fontSize: '0.82rem', fontStyle: 'italic' }}>Nenhum sub-item.</p>
                          )}
                          {item.items.map(sub => (
                            <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                              <div>
                                <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Nome</label>
                                <input value={sub.label} onChange={e => updateSubItem(item.id, sub.id, { label: e.target.value })}
                                  style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} />
                              </div>
                              <div>
                                <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 2 }}>Link</label>
                                <input value={sub.href} onChange={e => updateSubItem(item.id, sub.id, { href: e.target.value })}
                                  style={{ width: '100%', padding: '6px 10px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 12 }} />
                              </div>
                              <select value={sub.target || '_self'} onChange={e => updateSubItem(item.id, sub.id, { target: e.target.value as '_blank' | '_self' })}
                                style={{ height: 32, padding: '0 6px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 11, alignSelf: 'end' }}>
                                <option value="_self">Mesma</option>
                                <option value="_blank">Nova</option>
                              </select>
                              <button onClick={() => removeSubItem(item.id, sub.id)} style={{ ...btn(), color: '#ef4444', borderColor: '#ef4444', height: 32, padding: '0 10px', alignSelf: 'end' }}>🗑️</button>
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

          {['hero', 'calculadora', 'cta', 'cabecalho', 'rodape'].includes(currentTab) && renderStandardSection(currentTab)}

          {currentTab === 'testimonials' && (
            <DynamicListEditor
              settings={settings}
              set={set}
              label="Depoimentos"
              storageKey="ig_testimonials_items"
              fields={[
                { key: 'photo', label: 'URL da Foto', type: 'image' },
                { key: 'name', label: 'Nome' },
                { key: 'company', label: 'Empresa / Cargo' },
                { key: 'text', label: 'Depoimento', type: 'textarea' },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageIndiqueGanhe;
