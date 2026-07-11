import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }

interface Tab { id: string; label: string; }

const TABS: Tab[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'passos', label: 'Como Funciona' },
  { id: 'calculadora', label: 'Calculadora' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'CTA Final' },
  { id: 'cabecalho', label: 'Cabeçalho' },
  { id: 'rodape', label: 'Rodapé' },
];

const FIELD_KEYS: Record<string, string[]> = {
  hero: ['ig_badge_text', 'ig_badge_bg', 'ig_badge_text_color', 'ig_hero_title', 'ig_hero_subtitle', 'ig_hero_image', 'ig_hero_bg', 'ig_hero_title_color', 'ig_hero_subtitle_color', 'ig_hero_btn_text', 'ig_hero_btn_link', 'ig_hero_btn_bg', 'ig_hero_btn_color', 'ig_hero_amount', 'ig_hero_discount', 'ig_hero_footnote'],
  passos: ['ig_steps_title', 'ig_steps_subtitle', 'ig_steps_bg', 'ig_steps_title_color', 'ig_steps_subtitle_color', 'ig_step_card_bg', 'ig_step_card_border', 'ig_step_icon_bg', 'ig_step_icon_color', 'ig_step_num_color', 'ig_step_title_color', 'ig_step_desc_color'],
  calculadora: ['ig_calc_title', 'ig_calc_value_per', 'ig_calc_note'],
  beneficios: ['ig_benefits_title', 'ig_benefits_bg', 'ig_benefits_title_color', 'ig_benefit_card_bg', 'ig_benefit_card_border', 'ig_benefit_icon_bg', 'ig_benefit_icon_color', 'ig_benefit_title_color', 'ig_benefit_desc_color'],
  cta: ['ig_cta_title', 'ig_cta_desc', 'ig_cta_bg', 'ig_cta_title_color', 'ig_cta_desc_color', 'ig_cta_btn_text', 'ig_cta_btn_link', 'ig_cta_btn_bg', 'ig_cta_btn_color', 'ig_cta_overlay', 'ig_cta_image'],
  cabecalho: ['ig_logo_url', 'ig_header_bg_color', 'ig_header_text_color', 'ig_header_topbar_bg', 'ig_header_topbar_text', 'ig_header_portal_text', 'ig_header_portal_url', 'ig_header_portal_bg', 'ig_header_portal_text_color'],
  rodape: ['ig_footer_logo_url', 'ig_footer_bg_color', 'ig_footer_text_color', 'ig_footer_heading_color', 'ig_footer_link_color', 'ig_footer_about_text', 'ig_footer_col2_title', 'ig_footer_col3_title', 'ig_footer_col4_title', 'ig_footer_subbar_bg', 'ig_footer_subbar_text', 'ig_footer_cnpj', 'ig_footer_anatel'],
};

const renderField = (
  fd: { key: string; label?: string; type?: string; hint?: string },
  val: string,
  onChange: (value: string) => void,
  _label: string
) => {
  const label = fd.label || '';
  switch (fd.type || 'text') {
    case 'image':
      return (
        <div key={fd.key} style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{label}</label>
          <ImageUpload value={val} onChange={onChange} />
        </div>
      );
    case 'color':
      return (
        <div key={fd.key}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{label}</label>
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
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{label}</label>
          <textarea value={val} onChange={e => onChange(e.target.value)} placeholder={fd.hint}
            style={{ width: '100%', minHeight: 80, padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13, resize: 'vertical' }} />
        </div>
      );
    default:
      return (
        <div key={fd.key}>
          <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{label}</label>
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
      {items.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>Nenhum item ainda. Clique em "Adicionar" para criar.</p>}
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
  ],
  calculadora: [
    { key: 'ig_calc_title', label: 'Título', hint: 'Quanto eu posso ganhar?' },
    { key: 'ig_calc_value_per', label: 'Valor por Indicação (R$)', hint: '150' },
    { key: 'ig_calc_note', label: 'Nota', type: 'textarea' },
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
  ],
  cabecalho: [
    { key: 'ig_logo_url', label: 'Logo URL', type: 'image' },
    { key: 'ig_header_bg_color', label: 'Cor Fundo Barra', type: 'color' },
    { key: 'ig_header_text_color', label: 'Cor Texto Menu', type: 'color' },
    { key: 'ig_header_topbar_bg', label: 'Cor Fundo Top Bar', type: 'color' },
    { key: 'ig_header_topbar_text', label: 'Cor Texto Top Bar', type: 'color' },
    { key: 'ig_header_portal_text', label: 'Texto Botão Portal' },
    { key: 'ig_header_portal_url', label: 'Link Botão Portal' },
    { key: 'ig_header_portal_bg', label: 'Cor Fundo Botão Portal', type: 'color' },
    { key: 'ig_header_portal_text_color', label: 'Cor Texto Botão Portal', type: 'color' },
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
    { key: 'ig_footer_subbar_bg', label: 'Cor Fundo Sub Bar', type: 'color' },
    { key: 'ig_footer_subbar_text', label: 'Cor Texto Sub Bar', type: 'color' },
    { key: 'ig_footer_cnpj', label: 'CNPJ' },
    { key: 'ig_footer_anatel', label: 'ANATEL' },
  ],
};

export const ManageIndiqueGanhe = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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

  const saveAll = async () => {
    setSaving(true);
    setMsg('');
    try {
      const allKeys = Object.values(FIELD_KEYS).flat();
      const updates = allKeys.filter(k => settings[k]);
      await Promise.all(
        updates.map(k =>
          apiFetch(`/settings/${k}`, {
            method: 'PUT',
            body: JSON.stringify({ value: settings[k].value, label: settings[k].label })
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

  const currentTab = TABS[activeTab].id;

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
                {(FIELD_CONFIG.passos || []).map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label), fd.label))}
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
                {(FIELD_CONFIG.beneficios || []).map(fd => renderField(fd, settings[fd.key]?.value || '', v => set(fd.key, v, fd.label), fd.label))}
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

          {(currentTab === 'hero' || currentTab === 'calculadora' || currentTab === 'cta' || currentTab === 'cabecalho' || currentTab === 'rodape') && (
            <div>
              <h3 style={{ margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #333', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
                {TABS.find(t => t.id === currentTab)?.label}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {(FIELD_CONFIG[currentTab] || []).map(fd => {
                  const val = settings[fd.key]?.value || '';
                  const fdWithLabel = { ...fd, label: fd.label };
                  if (fd.type === 'select') {
                    const opts = (fd as { options?: { value: string; label: string }[] }).options || [];
                    return (
                      <div key={fd.key}>
                        <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
                        <select value={val} onChange={e => set(fd.key, e.target.value, fd.label)}
                          style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }}>
                          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    );
                  }
                  return renderField(fdWithLabel, val, v => set(fd.key, v, fd.label), fd.label);
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageIndiqueGanhe;
