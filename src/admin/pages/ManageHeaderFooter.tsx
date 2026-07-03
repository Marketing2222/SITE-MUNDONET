import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';

interface Setting { key: string; value: string; label: string; }

type FieldType = 'text' | 'color' | 'url' | 'font' | 'textarea' | 'spacing' | 'select';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
}

export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  target?: '_blank' | '_self';
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  target?: '_blank' | '_self';
  hasDropdown: boolean;
  items: NavSubItem[];
}

const DEFAULT_NAV: NavItem[] = [
  {
    id: 'planos', label: 'Planos', href: '#internet', target: '_self', hasDropdown: true,
    items: [
      { id: 'planos-1', label: 'Internet', href: '#internet', target: '_self' },
      { id: 'planos-2', label: 'Aplicativos', href: '#aplicativos', target: '_self' },
      { id: 'planos-3', label: 'Canais de TV', href: '#entretenimento', target: '_self' },
    ]
  },
  { id: 'app', label: 'App Mundonet +', href: '#app', target: '_self', hasDropdown: false, items: [] },
  {
    id: 'para-voce', label: 'Para Você', href: '#para-voce', target: '_self', hasDropdown: true,
    items: [
      { id: 'voce-1', label: 'Vem pra Mundonet', href: 'https://indique.mundonetbandalarga.com.br', target: '_blank' },
      { id: 'voce-2', label: 'Guia do Assinante', href: 'https://drive.google.com/file/d/1HFTbp_ISg_4flLS33RzgpcLR9INaZPfq/view?usp=sharing', target: '_blank' },
    ]
  },
  { id: 'empresas', label: 'Para Empresas', href: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20para%20a%20minha%20empresa.', target: '_blank', hasDropdown: false, items: [] },
  { id: 'trabalhe', label: 'Trabalhe Conosco', href: 'https://www.linkedin.com/company/mundonettelecom', target: '_blank', hasDropdown: false, items: [] },
  {
    id: 'mais', label: 'MAIS', href: '#mais', target: '_self', hasDropdown: true,
    items: [
      { id: 'mais-1', label: 'Contrato', href: 'https://drive.google.com/file/d/1t5XomND_mju6X07q1I3HFfQpdb81PXwJ/view?usp=sharing', target: '_blank' },
      { id: 'mais-2', label: 'Contato', href: '#contact', target: '_self' },
    ]
  },
];

const HEADER_FIELDS: FieldDef[] = [
  { key: 'logo_url', label: 'URL do Logo', type: 'url', hint: 'Link da imagem do logo (ex: https://...)' },
  { key: 'header_bg_color', label: 'Cor de fundo do Header', type: 'color' },
  { key: 'header_text_color', label: 'Cor do texto/ícones', type: 'color' },
  { key: 'header_topbar_bg', label: 'Cor de fundo da barra superior', type: 'color' },
  { key: 'header_topbar_text', label: 'Cor do texto da barra superior', type: 'color' },
  { key: 'header_font', label: 'Fonte (Google Fonts)', type: 'font', hint: 'Nome da fonte, ex: Poppins. Deixe em branco para padrão.' },
  { key: 'header_portal_text', label: 'Texto do botão Portal', type: 'text' },
  { key: 'header_portal_url', label: 'URL do botão Portal', type: 'url' },
  { key: 'header_portal_bg', label: 'Cor de fundo do botão Portal', type: 'color' },
  { key: 'header_portal_text_color', label: 'Cor do texto do botão Portal', type: 'color' },
  { 
    key: 'header_portal_position', 
    label: 'Posição do botão Portal', 
    type: 'select', 
    options: [
      { value: 'navbar_right', label: 'Barra Principal - Direita (Padrão)' },
      { value: 'navbar_left', label: 'Barra Principal - Esquerda (Perto do logo)' },
      { value: 'topbar_right', label: 'Barra Superior - Direita' },
      { value: 'topbar_left', label: 'Barra Superior - Esquerda' }
    ] 
  },
];

const NAV_SPACING_FIELDS: FieldDef[] = [
  { key: 'nav_item_gap', label: 'Distância entre os itens', type: 'spacing', hint: 'Ex: 8px, 12px, 20px' },
  { key: 'nav_item_padding', label: 'Espaço clicável de cada item', type: 'spacing', hint: 'Ex: 8px 16px' },
  { key: 'nav_dropdown_width', label: 'Largura da caixa de sub-itens', type: 'spacing', hint: 'Ex: 200px, 260px' },
  { key: 'nav_dropdown_padding', label: 'Espaço interno da caixa', type: 'spacing', hint: 'Ex: 8px 0' },
  { key: 'nav_subitem_padding', label: 'Espaço clicável dos sub-itens', type: 'spacing', hint: 'Ex: 10px 20px' },
  { key: 'nav_font_size', label: 'Tamanho do texto do menu', type: 'spacing', hint: 'Ex: 16px, 1rem' },
];

const FOOTER_FIELDS: FieldDef[] = [
  { key: 'footer_logo_url', label: 'URL da Logomarca do Footer', type: 'url', hint: 'Deixe em branco para usar o logo do cabeçalho' },
  { key: 'footer_bg_color', label: 'Cor de fundo do Footer', type: 'color' },
  { key: 'footer_text_color', label: 'Cor do texto', type: 'color' },
  { key: 'footer_heading_color', label: 'Cor dos títulos das colunas', type: 'color' },
  { key: 'footer_link_color', label: 'Cor dos links', type: 'color' },
  { key: 'footer_about_text', label: 'Texto institucional (sobre a empresa)', type: 'textarea' },
  { key: 'footer_col2_title', label: 'Título da coluna de Contato', type: 'text' },
  { key: 'footer_col3_title', label: 'Título da coluna de Atalhos', type: 'text' },
  { key: 'footer_col4_title', label: 'Título da coluna de Redes Sociais', type: 'text' },
  { key: 'footer_subbar_bg', label: 'Cor de fundo da barra inferior', type: 'color' },
  { key: 'footer_subbar_text', label: 'Cor do texto da barra inferior', type: 'color' },
  { key: 'footer_anatel_logo_url', label: 'URL do logo Anatel', type: 'url', hint: 'Link da imagem do selo Anatel' },
  { key: 'footer_font', label: 'Fonte do Footer (Google Fonts)', type: 'font', hint: 'Nome da fonte, ex: Poppins. Deixe em branco para padrão.' },
  { key: 'footer_padding', label: 'Espaçamento interno do Footer', type: 'spacing', hint: 'Ex: 60px 0, ou 80px 24px' },
  { key: 'footer_cnpj', label: 'CNPJ da empresa', type: 'text' },
  { key: 'footer_anatel', label: 'Número Anatel', type: 'text' },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Styles in-component ────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'var(--adm-surface)',
  border: '1px solid var(--adm-border)',
  borderRadius: 'var(--adm-radius)',
  padding: 20,
  marginBottom: 12,
};

const btn = (active = false): React.CSSProperties => ({
  padding: '6px 14px',
  borderRadius: 8,
  border: '1px solid var(--adm-border)',
  background: active ? 'var(--adm-accent)' : 'var(--adm-bg)',
  color: active ? '#fff' : 'var(--adm-text)',
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontWeight: active ? 700 : 400,
  transition: 'all 0.15s',
});

export const ManageHeaderFooter = () => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'header' | 'nav' | 'footer'>('header');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [footerLogoPreview, setFooterLogoPreview] = useState('');
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  const load = async () => {
    const data: Setting[] = await apiFetch('/settings/all');
    const obj: Record<string, string> = {};
    data.forEach(f => { obj[f.key] = f.value; });
    setForm(obj);
    if (obj.logo_url) setLogoPreview(obj.logo_url);
    // Load nav menu
    const navSetting = data.find(f => f.key === 'nav_menu');
    if (navSetting?.value) {
      try { setNavItems(JSON.parse(navSetting.value)); } catch { /* use default */ }
    }
    if (obj.footer_logo_url) setFooterLogoPreview(obj.footer_logo_url);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      const ALL_FIELDS = [...HEADER_FIELDS, ...NAV_SPACING_FIELDS, ...FOOTER_FIELDS];
      await Promise.all([
        ...ALL_FIELDS.map(fd => apiFetch(`/settings/${fd.key}`, {
          method: 'PUT',
          body: JSON.stringify({ value: form[fd.key] ?? '', label: fd.label })
        })),
        // Save nav menu as JSON
        apiFetch('/settings/nav_menu', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(navItems), label: 'Menu de Navegação (JSON)' })
        }),
      ]);
      setMsg('✅ Configurações salvas com sucesso! Recarregue o site para ver as mudanças.');
    } catch (e: unknown) { setMsg(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploadingLogo(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) { setForm(f => ({ ...f, logo_url: data.url })); setLogoPreview(data.url); }
    } catch { alert('Erro no upload do logo'); }
    finally { setUploadingLogo(false); }
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploadingLogo(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) { setForm(f => ({ ...f, footer_logo_url: data.url })); setFooterLogoPreview(data.url); }
    } catch { alert('Erro no upload do logo do footer'); }
    finally { setUploadingLogo(false); }
  };

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  // ── Nav helpers ──────────────────────────────────────────────────────────
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

  // ── Field renderer ───────────────────────────────────────────────────────
  const renderField = (fd: FieldDef) => {
    const val = form[fd.key] ?? '';
    switch (fd.type) {
      case 'color':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={val || '#000000'} onChange={e => set(fd.key, e.target.value)}
                style={{ height: 42, width: 64, borderRadius: 8, border: '1px solid var(--adm-border)', cursor: 'pointer', padding: 2 }} />
              <input value={val} onChange={e => set(fd.key, e.target.value)} placeholder="#000000" style={{ flex: 1 }} />
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: val, border: '2px solid var(--adm-border)', flexShrink: 0 }} />
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <textarea value={val} onChange={e => set(fd.key, e.target.value)} rows={3} style={{ resize: 'vertical' }} />
          </div>
        );
      case 'font':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value)} placeholder="Ex: Poppins, Roboto, Inter..." />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
            {val && <div style={{ marginTop: 8, padding: '10px 14px', background: 'var(--adm-bg)', borderRadius: 8, fontFamily: val, fontSize: '1rem', border: '1px dashed var(--adm-border)' }}>Preview: {val}</div>}
          </div>
        );
      case 'select':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <select value={val || (fd.options?.[0]?.value ?? '')} onChange={e => set(fd.key, e.target.value)}
              style={{ height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', color: 'var(--adm-text)', width: '100%' }}>
              {fd.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      default:
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value)} placeholder={fd.hint || ''} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
    }
  };

  return (
    <div>
      {/* ── Page header ── */}
      <div className="admin-page-header">
        <div>
          <h2>🎨 Cabeçalho & Rodapé</h2>
          <p>Personalize cores, fontes, menus e textos do header e footer.</p>
        </div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>
          {saving ? 'Salvando...' : '💾 Salvar Alterações'}
        </button>
      </div>

      {msg && <div className={`admin-alert ${msg.startsWith('✅') ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>{msg}</div>}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--adm-border)', paddingBottom: 0 }}>
        {[
          { key: 'header', icon: '🔝', label: 'Cabeçalho' },
          { key: 'nav', icon: '📋', label: 'Menu de Navegação' },
          { key: 'footer', icon: '🔻', label: 'Rodapé' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'header' | 'nav' | 'footer')}
            style={{ padding: '10px 20px', border: 'none', borderBottom: tab === t.key ? '3px solid var(--adm-accent)' : '3px solid transparent', background: 'transparent', color: tab === t.key ? 'var(--adm-accent)' : 'var(--adm-text2)', fontWeight: tab === t.key ? 700 : 500, fontSize: '0.93rem', cursor: 'pointer', marginBottom: -2, transition: 'all 0.2s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══════ TAB: HEADER ══════ */}
      {tab === 'header' && (
        <div>
          {/* Logo */}
          <div style={card}>
            <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--adm-text)', fontSize: '1rem' }}>🖼️ Logo do Site</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {logoPreview && (
                <div style={{ background: form.header_bg_color || '#002D72', padding: 16, borderRadius: 12, border: '1px solid var(--adm-border)' }}>
                  <img src={logoPreview} alt="Logo" style={{ maxHeight: 50, maxWidth: 200, objectFit: 'contain', display: 'block' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <input value={form.logo_url || ''} onChange={e => { set('logo_url', e.target.value); setLogoPreview(e.target.value); }} placeholder="https://... ou faça upload abaixo" />
                <label className="admin-btn ghost small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: 'fit-content' }}>
                  {uploadingLogo ? '⏳ Enviando...' : '📷 Upload de novo logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          {/* Preview + fields */}
          <div style={card}>
            <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--adm-text)', fontSize: '1rem' }}>🎨 Aparência do Cabeçalho</h3>
            <div style={{ background: form.header_topbar_bg || '#001a4d', borderRadius: '10px 10px 0 0', padding: '6px 16px', display: 'flex', gap: 12, fontSize: '0.75rem', color: form.header_topbar_text || '#fff', marginBottom: 2 }}>
              <span>📞 (98) 3042-0030</span><span>📧 contato@mundonet.com.br</span>
            </div>
            <div style={{ background: form.header_bg_color || '#002D72', borderRadius: '0 0 10px 10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, fontFamily: form.header_font || 'inherit' }}>
              <span style={{ color: form.header_text_color || '#fff', fontWeight: 700, fontSize: '0.9rem' }}>🖼️ LOGO</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {navItems.slice(0, 3).map(n => <span key={n.id} style={{ color: form.header_text_color || '#fff', fontSize: '0.75rem' }}>{n.label}</span>)}
                <span style={{ background: form.header_portal_bg || '#4f46e5', color: form.header_portal_text_color || '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                  {form.header_portal_text || 'Portal'}
                </span>
              </div>
            </div>
            <div className="admin-form">
              {HEADER_FIELDS.filter(f => f.key !== 'logo_url').map(renderField)}
            </div>
          </div>
        </div>
      )}

      {/* ══════ TAB: MENU ══════ */}
      {tab === 'nav' && (
        <div>
          {/* Spacing controls */}
          <div style={card}>
            <h3 style={{ marginTop: 0, marginBottom: 4, color: 'var(--adm-text)', fontSize: '1rem' }}>📐 Dimensionamento do Menu</h3>
            <p style={{ color: 'var(--adm-text2)', fontSize: '0.82rem', marginTop: 0, marginBottom: 16 }}>Controle espaçamentos, largura do dropdown e tamanho da fonte.</p>
            <div className="admin-form" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {NAV_SPACING_FIELDS.map(renderField)}
            </div>
          </div>

          {/* Menu items editor */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: 'var(--adm-text)', fontSize: '1rem' }}>🗂️ Itens do Menu</h3>
              <button onClick={addNavItem} className="admin-btn primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>+ Adicionar Item</button>
            </div>

            {navItems.map((item, idx) => (
              <div key={item.id} style={{ border: '1px solid var(--adm-border)', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
                {/* Item header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--adm-bg)', cursor: 'pointer' }}
                  onClick={() => setExpandedNav(expandedNav === item.id ? null : item.id)}>
                  {/* Reorder */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, -1); }} style={{ ...btn(), padding: '2px 6px', fontSize: '0.7rem' }} disabled={idx === 0}>▲</button>
                    <button onClick={e => { e.stopPropagation(); moveNavItem(item.id, 1); }} style={{ ...btn(), padding: '2px 6px', fontSize: '0.7rem' }} disabled={idx === navItems.length - 1}>▼</button>
                  </div>
                  <span style={{ flex: 1, fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.9rem' }}>
                    {item.label}
                    {item.hasDropdown && <span style={{ marginLeft: 8, fontSize: '0.72rem', color: 'var(--adm-text2)', fontWeight: 400 }}>({item.items.length} sub-itens)</span>}
                  </span>
                  <button onClick={e => { e.stopPropagation(); removeNavItem(item.id); }} style={{ ...btn(), color: '#ef4444', borderColor: '#ef4444', padding: '4px 10px' }}>🗑️</button>
                  <span style={{ color: 'var(--adm-text2)', fontSize: '1rem' }}>{expandedNav === item.id ? '▾' : '▸'}</span>
                </div>

                {/* Expanded item editor */}
                {expandedNav === item.id && (
                  <div style={{ padding: '16px 16px 20px', background: 'var(--adm-surface)', borderTop: '1px solid var(--adm-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12 }}>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label>Texto do item</label>
                        <input value={item.label} onChange={e => updateNavItem(item.id, { label: e.target.value })} />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label>Link (href)</label>
                        <input value={item.href} onChange={e => updateNavItem(item.id, { href: e.target.value })} placeholder="#section ou https://..." />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label>Abrir em</label>
                        <select value={item.target || '_self'} onChange={e => updateNavItem(item.id, { target: e.target.value as '_blank' | '_self' })}
                          style={{ height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          <option value="_self">Mesma aba</option>
                          <option value="_blank">Nova aba</option>
                        </select>
                      </div>
                    </div>

                    {/* Sub-items */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <label style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          {item.hasDropdown ? `📂 Sub-itens do dropdown` : '📁 Este item não tem dropdown'}
                        </label>
                        <button onClick={() => addSubItem(item.id)} style={{ ...btn(), fontSize: '0.8rem' }}>+ Adicionar Sub-item</button>
                      </div>

                      {item.items.length === 0 && (
                        <p style={{ color: 'var(--adm-text2)', fontSize: '0.82rem', fontStyle: 'italic' }}>Nenhum sub-item. Clique em "+ Adicionar Sub-item" para criar um dropdown.</p>
                      )}

                      {item.items.map((sub) => (
                        <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                          <div className="admin-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.78rem' }}>Nome</label>
                            <input value={sub.label} onChange={e => updateSubItem(item.id, sub.id, { label: e.target.value })} style={{ fontSize: '0.85rem' }} />
                          </div>
                          <div className="admin-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.78rem' }}>Link</label>
                            <input value={sub.href} onChange={e => updateSubItem(item.id, sub.id, { href: e.target.value })} placeholder="#section ou https://..." style={{ fontSize: '0.85rem' }} />
                          </div>
                          <select value={sub.target || '_self'} onChange={e => updateSubItem(item.id, sub.id, { target: e.target.value as '_blank' | '_self' })}
                            style={{ height: 42, padding: '0 10px', borderRadius: 8, border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', color: 'var(--adm-text)', fontSize: '0.8rem', alignSelf: 'end' }}>
                            <option value="_self">Mesma aba</option>
                            <option value="_blank">Nova aba</option>
                          </select>
                          <button onClick={() => removeSubItem(item.id, sub.id)} style={{ ...btn(), color: '#ef4444', borderColor: '#ef4444', height: 42, padding: '0 12px', alignSelf: 'end' }}>🗑️</button>
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

      {/* ══════ TAB: FOOTER ══════ */}
      {tab === 'footer' && (
        <div>
          <div style={{ background: form.footer_bg_color || '#002D72', borderRadius: 12, padding: 24, marginBottom: 20, fontFamily: form.footer_font || 'inherit' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                {(() => {
                  const src = form.footer_logo_url || form.logo_url || '';
                  return src ? (
                    <img src={src} alt="Logo" style={{ maxHeight: 40, maxWidth: 140, objectFit: 'contain', display: 'block', marginBottom: 10 }} />
                  ) : (
                    <div style={{ background: '#ffffff22', height: 30, width: 120, borderRadius: 6, marginBottom: 10 }} />
                  );
                })()}
                <p style={{ color: form.footer_text_color || '#cbd5e1', fontSize: '0.72rem', margin: 0, lineHeight: 1.5 }}>{(form.footer_about_text || '').slice(0, 80)}...</p>
              </div>
              {[form.footer_col2_title || 'CONTATO', form.footer_col3_title || 'ATALHOS', form.footer_col4_title || 'REDES'].map((title, i) => (
                <div key={i}>
                  <p style={{ color: form.footer_heading_color || '#fff', fontWeight: 700, fontSize: '0.75rem', margin: '0 0 8px' }}>{title}</p>
                  {['Item 1', 'Item 2', 'Item 3'].map(it => <p key={it} style={{ color: form.footer_link_color || '#93c5fd', fontSize: '0.68rem', margin: '0 0 4px' }}>{it}</p>)}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #ffffff22', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: form.footer_subbar_text || '#94a3b8', fontSize: '0.68rem' }}>Mundonet | CNPJ {form.footer_cnpj || '00.000...'}</span>
              <span style={{ color: form.footer_subbar_text || '#94a3b8', fontSize: '0.68rem' }}>© {new Date().getFullYear()}</span>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--adm-text)', fontSize: '1rem' }}>🖼️ Logo do Rodapé</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
              {(() => {
                const src = footerLogoPreview || form.footer_logo_url || form.logo_url || '';
                return src ? (
                  <div style={{ background: form.footer_bg_color || '#002D72', padding: 16, borderRadius: 12, border: '1px solid var(--adm-border)' }}>
                    <img src={src} alt="Logo Footer" style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
                  </div>
                ) : (
                  <div style={{ background: '#ffffff22', height: 40, width: 140, borderRadius: 6 }} />
                );
              })()}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <input value={form.footer_logo_url || ''} onChange={e => { set('footer_logo_url', e.target.value); setFooterLogoPreview(e.target.value); }} placeholder="https://... ou faça upload" />
                <label className="admin-btn ghost small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: 'fit-content' }}>
                  {uploadingLogo ? '⏳ Enviando...' : '📷 Upload logo do rodapé'}
                  <input type="file" accept="image/*" onChange={handleFooterLogoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--adm-text)', fontSize: '1rem' }}>🎨 Configurações do Rodapé</h3>
            <div className="admin-form">{FOOTER_FIELDS.filter(f => f.key !== 'footer_logo_url').map(renderField)}</div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <button className="admin-btn primary" onClick={save} disabled={saving} style={{ padding: '14px 32px', fontSize: '1rem' }}>
          {saving ? '⏳ Salvando...' : '💾 Salvar Todas as Alterações'}
        </button>
      </div>
    </div>
  );
};

export default ManageHeaderFooter;
