import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

interface Setting { key: string; value: string; label: string; }
interface ListItem { icon: string; title: string; desc: string; }

const EMPTY_ITEM: ListItem = { icon: '', title: '', desc: '' };

const FIELDS = [
  { section: 'Hero', fields: [
    { key: 'emp_hero_bg', label: 'Cor Fundo Hero', type: 'color' },
    { key: 'emp_page_bg', label: 'Cor Fundo da Página', type: 'color' },
    { key: 'emp_hero_height', label: 'Altura Hero (px)', type: 'number', hint: '600' },
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
    { key: 'emp_plans_padding', label: 'Espaçamento Vertical (px)', type: 'number', hint: '100' },
    { key: 'emp_plans_empty_text', label: 'Texto (quando vazio)', type: 'text', hint: 'Em dúvida do plano ideal ou gostaria de personalizar seu plano?' },
    { key: 'emp_plans_empty_btn_text', label: 'Texto Botão (quando vazio)', type: 'text', hint: 'Consultar um especialista' },
    { key: 'emp_plans_empty_btn_link', label: 'Link Botão (quando vazio)', type: 'url' },
    { key: 'emp_plans_empty_btn_bg', label: 'Cor Fundo Botão (quando vazio)', type: 'color' },
    { key: 'emp_plans_empty_btn_color', label: 'Cor Texto Botão (quando vazio)', type: 'color' },
  ]},
  { section: 'Benefícios', fields: [
    { key: 'emp_benefits_title', label: 'Título', type: 'text' },
    { key: 'emp_benefits_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_benefits_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_benefits_padding', label: 'Espaçamento Vertical (px)', type: 'number', hint: '100' },
    { key: 'emp_benefit_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'emp_benefit_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'emp_benefit_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'emp_benefit_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'emp_benefit_title_color', label: 'Cor Títulos', type: 'color' },
    { key: 'emp_benefit_desc_color', label: 'Cor Descrições', type: 'color' },
  ]},
  { section: 'Serviços', fields: [
    { key: 'emp_services_label', label: 'Label (acima do título)', type: 'text', hint: 'Serviços dedicados e exclusivos' },
    { key: 'emp_services_label_color', label: 'Cor Label', type: 'color' },
    { key: 'emp_services_title', label: 'Título', type: 'text' },
    { key: 'emp_services_desc', label: 'Descrição (lado esquerdo)', type: 'text', hint: 'Conheça alguns serviços que sua empresa pode ter...' },
    { key: 'emp_services_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'emp_services_btn_text', label: 'Texto Botão', type: 'text', hint: 'Entre em contato' },
    { key: 'emp_services_btn_link', label: 'Link Botão', type: 'url' },
    { key: 'emp_services_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'emp_services_btn_color', label: 'Cor Texto Botão', type: 'color' },
    { key: 'emp_services_note', label: 'Nota (abaixo do botão)', type: 'text', hint: 'Consulte disponibilidade dos serviços.' },
    { key: 'emp_services_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_services_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_services_padding', label: 'Espaçamento Vertical (px)', type: 'number', hint: '100' },
    { key: 'emp_service_card_bg', label: 'Cor Fundo Cards', type: 'color' },
    { key: 'emp_service_card_border', label: 'Cor Borda Cards', type: 'color' },
    { key: 'emp_service_icon_bg', label: 'Cor Fundo Ícones', type: 'color' },
    { key: 'emp_service_icon_color', label: 'Cor Ícones', type: 'color' },
    { key: 'emp_service_title_color', label: 'Cor Títulos Cards', type: 'color' },
    { key: 'emp_service_desc_color', label: 'Cor Descrições Cards', type: 'color' },
  ]},
  { section: 'CTA Final', fields: [
    { key: 'emp_cta_bg', label: 'Cor Fundo', type: 'color' },
    { key: 'emp_cta_title', label: 'Título', type: 'text' },
    { key: 'emp_cta_desc', label: 'Descrição', type: 'text' },
    { key: 'emp_cta_title_color', label: 'Cor Título', type: 'color' },
    { key: 'emp_cta_desc_color', label: 'Cor Descrição', type: 'color' },
    { key: 'emp_cta_padding', label: 'Espaçamento Vertical (px)', type: 'number', hint: '100' },
    { key: 'emp_cta_btn_text', label: 'Texto Botão', type: 'text' },
    { key: 'emp_cta_btn_link', label: 'Link Botão', type: 'url' },
    { key: 'emp_cta_btn_bg', label: 'Cor Fundo Botão', type: 'color' },
    { key: 'emp_cta_btn_color', label: 'Cor Texto Botão', type: 'color' },
  ]},
];

const parseList = (val: string): ListItem[] => {
  if (!val) return [];
  try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : []; } catch { return []; }
};
const serializeList = (items: ListItem[]): string => JSON.stringify(items.filter(i => i.title.trim()));

export const ManageParaEmpresas = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [benefits, setBenefits] = useState<ListItem[]>([]);
  const [services, setServices] = useState<ListItem[]>([]);

  useEffect(() => {
    apiFetch('/settings').then((data: Record<string, { value: string; label: string }>) => {
      const map: Record<string, Setting> = {};
      for (const [key, obj] of Object.entries(data)) {
        map[key] = { key, value: obj.value, label: obj.label };
      }
      setSettings(map);
      setBenefits(parseList(data.emp_benefits_items?.value || '[]'));
      setServices(parseList(data.emp_services_items?.value || '[]'));
    }).catch(() => {});
  }, []);

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({ ...prev, [key]: { key, value, label } }));
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const allUpdates = [
        ...FIELDS.flatMap(s => s.fields).filter(f => settings[f.key]).map(f =>
          apiFetch(`/settings/${f.key}`, {
            method: 'PUT',
            body: JSON.stringify({ value: settings[f.key].value, label: f.label })
          })
        ),
        apiFetch('/settings/emp_benefits_items', {
          method: 'PUT',
          body: JSON.stringify({ value: serializeList(benefits), label: 'Itens Benefícios' })
        }),
        apiFetch('/settings/emp_services_items', {
          method: 'PUT',
          body: JSON.stringify({ value: serializeList(services), label: 'Itens Serviços' })
        }),
      ];
      await Promise.all(allUpdates);
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
      case 'number':
        return (
          <div key={fd.key}>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, display: 'block' }}>{fd.label}</label>
            <input type="number" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
              style={{ width: '100%', padding: '8px 12px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
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

  const renderDynamicList = (
    items: ListItem[],
    setItems: React.Dispatch<React.SetStateAction<ListItem[]>>,
    defaults: { icon: string; title: string; desc: string }[]
  ) => (
    <div>
      {items.map((item, idx) => (
        <div key={idx} style={{
          background: '#1a1a2e', borderRadius: 10, padding: 16, marginBottom: 12,
          border: '1px solid #333', position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>#{idx + 1}</span>
            <button onClick={() => setItems(items.filter((_, i) => i !== idx))}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>
              🗑️
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 3 }}>Ícone</label>
              <input value={item.icon} onChange={e => {
                const next = [...items]; next[idx] = { ...next[idx], icon: e.target.value }; setItems(next);
              }} placeholder={defaults[idx]?.icon || '📌'}
                style={{ width: '100%', padding: '8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 18, textAlign: 'center' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 3 }}>Título</label>
              <input value={item.title} onChange={e => {
                const next = [...items]; next[idx] = { ...next[idx], title: e.target.value }; setItems(next);
              }} placeholder={defaults[idx]?.title || 'Título'}
                style={{ width: '100%', padding: '8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 3 }}>Descrição</label>
            <input value={item.desc} onChange={e => {
              const next = [...items]; next[idx] = { ...next[idx], desc: e.target.value }; setItems(next);
            }} placeholder={defaults[idx]?.desc || 'Descrição'}
              style={{ width: '100%', padding: '8px', background: '#1e1e2d', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13 }} />
          </div>
        </div>
      ))}
      <button onClick={() => setItems([...items, { ...EMPTY_ITEM }])}
        style={{ width: '100%', padding: '10px', background: 'transparent', border: '2px dashed #333', borderRadius: 10, color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>
        + Adicionar Item
      </button>
    </div>
  );

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

          {FIELDS[activeSection].section === 'Benefícios' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {FIELDS[activeSection].fields.map(renderField)}
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, display: 'block', fontWeight: 600 }}>Itens do Benefícios (lado a lado na página)</label>
                {renderDynamicList(benefits, setBenefits, [
                  { icon: '📈', title: 'Planos flexíveis', desc: 'Opções que crescem com seu negócio.' },
                  { icon: '🌐', title: 'Conectividade total', desc: 'Alta performance para toda a empresa.' },
                  { icon: '🛡️', title: 'Suporte 24/7', desc: 'Atendimento especializado.' },
                  { icon: '🔒', title: 'Segurança', desc: 'Proteção dos dados corporativos.' },
                ])}
              </div>
            </div>
          ) : FIELDS[activeSection].section === 'Serviços' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {FIELDS[activeSection].fields.map(renderField)}
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, display: 'block', fontWeight: 600 }}>Itens dos Serviços (lado a lado na página)</label>
                {renderDynamicList(services, setServices, [
                  { icon: '📥', title: 'Download/Upload garantido', desc: 'Velocidade simétrica garantida.' },
                  { icon: '🌐', title: 'IP Dedicado', desc: 'IP exclusivo para sua empresa.' },
                  { icon: '🛡️', title: 'Segurança de Rede', desc: 'Firewall e proteção avançada.' },
                  { icon: '🔗', title: 'Intranet', desc: 'Rede interna exclusiva.' },
                  { icon: '🔐', title: 'VPN Corporativa', desc: 'Conexão criptografada e segura.' },
                  { icon: '☁️', title: 'Backup em Nuvem', desc: 'Solução escalável e confiável.' },
                ])}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {FIELDS[activeSection].fields.map(renderField)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageParaEmpresas;
