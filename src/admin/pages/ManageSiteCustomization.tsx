import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface SiteSettings {
  customization_enabled: boolean;
  bg_color: string;
  text_color: string;
  title_color: string;
  primary_font: string;
  section_spacing: string;
  accent_color: string;
  accent_hover_color: string;
  button_bg_color: string;
  button_text_color: string;
  section_bg_color: string;
  section_border_color: string;
  card_bg_color: string;
  card_text_color: string;
  hero_overlay_color: string;
  hero_overlay_enabled: boolean;
  hero_height: string;
  hero_width: string;
  hero_transition: string;
  hero_show_buttons: boolean;
  border_radius: string;
  hero_btn1_text: string;
  hero_btn1_link: string;
  hero_btn1_bg: string;
  hero_btn1_text_color: string;
  hero_btn2_text: string;
  hero_btn2_link: string;
  hero_btn2_bg: string;
  hero_btn2_text_color: string;
}

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="admin-field">
    <label>{label}</label>
    <div style={{ display: 'flex', gap: 10 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ height: 38, width: 60 }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  </div>
);

const DEFAULT_SETTINGS: SiteSettings = {
  customization_enabled: true,
  bg_color: '#f3e8ff',
  text_color: '#4b5563',
  title_color: '#1e1b4b',
  primary_font: 'Montserrat, sans-serif',
  section_spacing: '80px',
  accent_color: '#005CFF',
  accent_hover_color: '#0046CC',
  button_bg_color: '#005CFF',
  button_text_color: '#ffffff',
  section_bg_color: '#ffffff',
  section_border_color: '#E2E8F0',
  card_bg_color: '#ffffff',
  card_text_color: '#1E293B',
  hero_overlay_color: 'rgba(0, 45, 114, 0.7)',
  hero_overlay_enabled: true,
  hero_height: '650',
  hero_width: '600',
  hero_transition: 'fade',
  hero_show_buttons: true,
  border_radius: '16px',
  hero_btn1_text: 'Ver Planos',
  hero_btn1_link: '#internet',
  hero_btn1_bg: '#ff6a00',
  hero_btn1_text_color: '#ffffff',
  hero_btn2_text: 'Falar com Atendente',
  hero_btn2_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.',
  hero_btn2_bg: 'rgba(255, 255, 255, 0.15)',
  hero_btn2_text_color: '#ffffff',
};

export const ManageSiteCustomization = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch('/site-settings');
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await apiFetch('/site-settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setMsg('Configurações salvas com sucesso! Atualize o site para ver as mudanças.');
    } catch (e: any) {
      setMsg(e.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <header className="admin-page-header">
        <div>
          <h2>Personalização Global</h2>
          <p>Altere cores globais, fontes e espaçamentos do site.</p>
        </div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </header>

      {msg && <div style={{ background: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msg}</div>}

      <div style={{
        background: 'var(--adm-surface)',
        border: '1px solid var(--adm-border)',
        borderRadius: 'var(--adm-radius)',
        padding: 24,
        opacity: settings.customization_enabled ? 1 : 0.5,
        pointerEvents: settings.customization_enabled ? 'auto' : 'none' as React.CSSProperties['pointerEvents'],
        transition: 'opacity 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '16px 20px',
          background: settings.customization_enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${settings.customization_enabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: 12
        }}>
          <div>
            <strong style={{ fontSize: '1rem', color: settings.customization_enabled ? '#10b981' : '#ef4444' }}>
              {settings.customization_enabled ? 'Personalização Ativada' : 'Personalização Desativada'}
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
              {settings.customization_enabled
                ? 'As cores e estilos personalizados estão sendo aplicados ao site.'
                : 'O site está usando o tema padrão. Ative para aplicar as customizações.'}
            </p>
          </div>
          <button
            onClick={() => setSettings({...settings, customization_enabled: !settings.customization_enabled})}
            style={{
              position: 'relative',
              width: 56,
              height: 28,
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              background: settings.customization_enabled ? '#10b981' : '#6b7280',
              transition: 'background 0.2s ease',
              flexShrink: 0
            }}
          >
            <span style={{
              position: 'absolute',
              top: 3,
              left: settings.customization_enabled ? 30 : 3,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        <div className="admin-form">
          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20 }}>Cores do Corpo da Página</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <ColorField label="Fundo da Página" value={settings.bg_color} onChange={v => setSettings({...settings, bg_color: v})} />
            <ColorField label="Cor do Texto Geral" value={settings.text_color} onChange={v => setSettings({...settings, text_color: v})} />
            <ColorField label="Cor dos Títulos" value={settings.title_color} onChange={v => setSettings({...settings, title_color: v})} />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Cores de Destaque (Accent)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <ColorField label="Cor de Destaque Principal" value={settings.accent_color} onChange={v => setSettings({...settings, accent_color: v})} />
            <ColorField label="Cor de Destaque (Hover)" value={settings.accent_hover_color} onChange={v => setSettings({...settings, accent_hover_color: v})} />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Cores dos Botões</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <ColorField label="Fundo do Botão" value={settings.button_bg_color} onChange={v => setSettings({...settings, button_bg_color: v})} />
            <ColorField label="Texto do Botão" value={settings.button_text_color} onChange={v => setSettings({...settings, button_text_color: v})} />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Cores das Seções</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <ColorField label="Fundo das Seções" value={settings.section_bg_color} onChange={v => setSettings({...settings, section_bg_color: v})} />
            <ColorField label="Borda das Seções" value={settings.section_border_color} onChange={v => setSettings({...settings, section_border_color: v})} />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Cores dos Cards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <ColorField label="Fundo dos Cards" value={settings.card_bg_color} onChange={v => setSettings({...settings, card_bg_color: v})} />
            <ColorField label="Texto dos Cards" value={settings.card_text_color} onChange={v => setSettings({...settings, card_text_color: v})} />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Hero / Banner</h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: 16,
            background: settings.hero_overlay_enabled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${settings.hero_overlay_enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: 10
          }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: settings.hero_overlay_enabled ? '#10b981' : '#ef4444' }}>
                Overlay do Hero {settings.hero_overlay_enabled ? 'Ativado' : 'Desativado'}
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
                {settings.hero_overlay_enabled
                  ? 'A cor de overlay está sendo aplicada ao banner.'
                  : 'Banner sem overlay de cor personalizado.'}
              </p>
            </div>
            <button
              onClick={() => setSettings({...settings, hero_overlay_enabled: !settings.hero_overlay_enabled})}
              style={{
                position: 'relative',
                width: 56,
                height: 28,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: settings.hero_overlay_enabled ? '#10b981' : '#6b7280',
                transition: 'background 0.2s ease',
                flexShrink: 0
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: settings.hero_overlay_enabled ? 30 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
          <div style={{
            opacity: settings.hero_overlay_enabled ? 1 : 0.4,
            pointerEvents: settings.hero_overlay_enabled ? 'auto' : 'none' as React.CSSProperties['pointerEvents'],
            transition: 'opacity 0.3s ease'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <ColorField label="Cor do Overlay" value={settings.hero_overlay_color} onChange={v => setSettings({...settings, hero_overlay_color: v})} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 8 }}>
              Cor aplicada sobre o banner do Hero. Use formato rgba(...) ou #hex.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: 16,
            marginTop: 20,
            background: settings.hero_show_buttons ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${settings.hero_show_buttons ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: 10
          }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: settings.hero_show_buttons ? '#10b981' : '#ef4444' }}>
                Botões no Banner {settings.hero_show_buttons ? 'Visíveis' : 'Ocultos'}
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
                {settings.hero_show_buttons
                  ? 'Exibir botões "Ver Planos" e "Falar com Atendente" no banner.'
                  : 'Banner sem botões de ação visíveis.'}
              </p>
            </div>
            <button
              onClick={() => setSettings({...settings, hero_show_buttons: !settings.hero_show_buttons})}
              style={{
                position: 'relative',
                width: 56,
                height: 28,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: settings.hero_show_buttons ? '#10b981' : '#6b7280',
                transition: 'background 0.2s ease',
                flexShrink: 0
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: settings.hero_show_buttons ? 30 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 16 }}>
            <div className="admin-field">
              <label>Altura do Banner</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={10}
                  value={parseInt(settings.hero_height) || 650}
                  onChange={e => setSettings({...settings, hero_height: e.target.value})}
                  style={{ flex: 1, accentColor: '#005CFF' }}
                />
                <input
                  type="text"
                  value={settings.hero_height}
                  onChange={e => setSettings({...settings, hero_height: e.target.value})}
                  style={{ width: 80, textAlign: 'center' }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Altura do banner do Hero (padrão: 650px). Valor atual: {settings.hero_height}px</p>
            </div>

            <div className="admin-field">
              <label>Largura Máxima do Conteúdo</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="range"
                  min={400}
                  max={1200}
                  step={10}
                  value={parseInt(settings.hero_width) || 600}
                  onChange={e => setSettings({...settings, hero_width: e.target.value})}
                  style={{ flex: 1, accentColor: '#005CFF' }}
                />
                <input
                  type="text"
                  value={settings.hero_width}
                  onChange={e => setSettings({...settings, hero_width: e.target.value})}
                  style={{ width: 80, textAlign: 'center' }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Largura máxima do texto e botões no banner (padrão: 600px). Valor atual: {settings.hero_width}px</p>
            </div>

            <div className="admin-field">
              <label>Efeito de Transição</label>
              <select
                value={settings.hero_transition}
                onChange={e => setSettings({...settings, hero_transition: e.target.value})}
                style={{ padding: '10px 14px', borderRadius: 8, background: '#111827', color: '#fff', border: '1px solid #374151' }}
              >
                <option value="fade">Fade (Suavizar)</option>
                <option value="slide-left">Deslizar para Esquerda</option>
                <option value="slide-right">Deslizar para Direita</option>
                <option value="zoom">Zoom In</option>
                <option value="zoom-out">Zoom Out</option>
                <option value="none">Sem Transição</option>
              </select>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Tipo de animação entre os slides do banner.</p>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Botões do Banner</h3>

          <div style={{
            opacity: settings.hero_show_buttons ? 1 : 0.4,
            pointerEvents: settings.hero_show_buttons ? 'auto' : 'none' as React.CSSProperties['pointerEvents'],
            transition: 'opacity 0.3s ease'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div className="admin-field">
                <label>Botão 1 - Texto</label>
                <input type="text" value={settings.hero_btn1_text} onChange={e => setSettings({...settings, hero_btn1_text: e.target.value})} />
              </div>
              <div className="admin-field">
                <label>Botão 1 - Link</label>
                <input type="text" value={settings.hero_btn1_link} onChange={e => setSettings({...settings, hero_btn1_link: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <ColorField label="Botão 1 - Fundo" value={settings.hero_btn1_bg} onChange={v => setSettings({...settings, hero_btn1_bg: v})} />
              <ColorField label="Botão 1 - Texto" value={settings.hero_btn1_text_color} onChange={v => setSettings({...settings, hero_btn1_text_color: v})} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 16 }}>
              <div className="admin-field">
                <label>Botão 2 - Texto</label>
                <input type="text" value={settings.hero_btn2_text} onChange={e => setSettings({...settings, hero_btn2_text: e.target.value})} />
              </div>
              <div className="admin-field">
                <label>Botão 2 - Link</label>
                <input type="text" value={settings.hero_btn2_link} onChange={e => setSettings({...settings, hero_btn2_link: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <ColorField label="Botão 2 - Fundo" value={settings.hero_btn2_bg} onChange={v => setSettings({...settings, hero_btn2_bg: v})} />
              <ColorField label="Botão 2 - Texto" value={settings.hero_btn2_text_color} onChange={v => setSettings({...settings, hero_btn2_text_color: v})} />
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Tipografia</h3>
          <div className="admin-field">
            <label>Fonte do Site</label>
            <select value={settings.primary_font} onChange={e => setSettings({...settings, primary_font: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, background: '#111827', color: '#fff', border: '1px solid #374151' }}>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Poppins', sans-serif">Poppins</option>
              <option value="'Outfit', sans-serif">Outfit</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Lato', sans-serif">Lato</option>
              <option value="'Nunito', sans-serif">Nunito</option>
              <option value="'Raleway', sans-serif">Raleway</option>
              <option value="'Ubuntu', sans-serif">Ubuntu</option>
            </select>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: 10, marginBottom: 20, marginTop: 40 }}>Espaçamentos e Bordas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <div className="admin-field">
              <label>Arredondamento Global (Padrão: 16px)</label>
              <input type="text" placeholder="Ex: 16px ou 1rem" value={settings.border_radius} onChange={e => setSettings({...settings, border_radius: e.target.value})} />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Define o arredondamento de cards e componentes.</p>
            </div>
            <div className="admin-field">
              <label>Espaçamento entre seções (Padrão: 80px)</label>
              <input type="text" placeholder="Ex: 80px ou 5rem" value={settings.section_spacing} onChange={e => setSettings({...settings, section_spacing: e.target.value})} />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Distância no topo e embaixo de cada seção principal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
