import { useState, useEffect, useCallback } from 'react';
import '../styles/ExitPopup.css';
import { API_BASE_URL } from '../config/api';

interface PopupCard {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_type: string;
}

interface PopupSettings {
  title: string;
  subtitle: string;
  bg_color: string;
  text_color: string;
  title_color: string;
  accent_color: string;
  card_bg: string;
  card_border: string;
  overlay_color: string;
  cards: PopupCard[];
}

const DEFAULT_SETTINGS: PopupSettings = {
  title: 'Ainda está aí?',
  subtitle: 'Entre em contato e contrate com a gente de forma simples e segura!',
  bg_color: '#1a1028',
  text_color: '#a1a1aa',
  title_color: '#ffffff',
  accent_color: '#a855f7',
  card_bg: '#2a1f3d',
  card_border: 'rgba(255,255,255,0.08)',
  overlay_color: 'rgba(0,0,0,0.6)',
  cards: [
    { id: 1, title: 'Contratar agora', description: 'Contratar agora pelo WhatsApp', link: 'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.', icon_type: 'whatsapp' },
    { id: 2, title: 'Suporte', description: 'Suporte técnico via WhatsApp', link: 'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Preciso%20de%20suporte%20t%C3%A9cnico.', icon_type: 'support' },
    { id: 3, title: 'Telefone', description: 'Ligue para nós agora', link: 'tel:+559830420030', icon_type: 'phone' },
    { id: 4, title: 'E-mail', description: 'Escreva para nós', link: 'mailto:contato@mundonetbandalarga.com.br', icon_type: 'email' },
  ],
};

const renderCardIcon = (type: string, color: string) => {
  const style = { width: 22, height: 22, fill: color };
  switch (type) {
    case 'whatsapp':
      return <svg viewBox="0 0 448 512" style={style}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>;
    case 'support':
      return <svg viewBox="0 0 512 512" style={style}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM388.3 320H235.7c-8.8 0-16 7.2-16 16s7.2 16 16 16H388.3c8.8 0 16-7.2 16-16s-7.2-16-16-16zm0 64H235.7c-8.8 0-16 7.2-16 16s7.2 16 16 16H388.3c8.8 0 16-7.2 16-16s-7.2-16-16-16zM123.7 288H276.3c8.8 0 16-7.2 16-16s-7.2-16-16-16H123.7c-8.8 0-16 7.2-16 16s7.2 16 16 16zm0 64H276.3c8.8 0 16-7.2 16-16s-7.2-16-16-16H123.7c-8.8 0-16 7.2-16 16s7.2 16 16 16zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 368c-88.4 0-160-71.6-160-160S167.6 96 256 96s160 71.6 160 160-71.6 160-160 160z"/></svg>;
    case 'phone':
      return <svg viewBox="0 0 512 512" style={style}><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.3l-224 96C6.7 100.3 0 109.6 0 120.4V376.1c0 11.9 6.7 22.2 17.1 27.5l224 96c19.4 5.2 39.7-4.7 47.4-23.3l164-368c4.5-10.8-2.8-23.3-14.1-23.3H179.1c-11.3 0-22.8 7.5-27.1 18.7zM256 352c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-96-80V161.4L395.8 128 160 74.6 160 272z"/></svg>;
    case 'email':
      return <svg viewBox="0 0 512 512" style={style}><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4C504.9 141.3 512 127.1 512 112c0-26.5-21.5-48-48-48H48zM0 176v208c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V176L256 288 0 176z"/></svg>;
    default:
      return <svg viewBox="0 0 512 512" style={style}><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0z"/></svg>;
  }
};

export const ExitPopup = () => {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState<PopupSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.exit_popup_enabled?.value === 'false') {
          setEnabled(false);
          setReady(true);
          return;
        }
        setEnabled(true);
        setReady(true);
        if (data.exit_popup_title?.value) {
          const s = { ...DEFAULT_SETTINGS };
          if (data.exit_popup_title?.value) s.title = data.exit_popup_title.value;
          if (data.exit_popup_subtitle?.value) s.subtitle = data.exit_popup_subtitle.value;
          if (data.exit_popup_bg_color?.value) s.bg_color = data.exit_popup_bg_color.value;
          if (data.exit_popup_text_color?.value) s.text_color = data.exit_popup_text_color.value;
          if (data.exit_popup_title_color?.value) s.title_color = data.exit_popup_title_color.value;
          if (data.exit_popup_accent_color?.value) s.accent_color = data.exit_popup_accent_color.value;
          if (data.exit_popup_card_bg?.value) s.card_bg = data.exit_popup_card_bg.value;
          if (data.exit_popup_card_border?.value) s.card_border = data.exit_popup_card_border.value;
          if (data.exit_popup_overlay_color?.value) s.overlay_color = data.exit_popup_overlay_color.value;
          if (data.exit_popup_cards?.value) {
            try { s.cards = JSON.parse(data.exit_popup_cards.value); } catch {}
          }
          setSettings(s);
        }
      })
      .catch(() => { setReady(true); });

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (sessionStorage.getItem('exit_popup_dismissed')) return;
      setVisible(true);
      document.removeEventListener('mouseout', handleMouseOut, true);
    };

    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem('exit_popup_dismissed', '1');
  }, []);

  if (!visible || !enabled || !ready || settings.cards.length === 0) return null;

  return (
    <div className="exit-popup-overlay" style={{ background: settings.overlay_color }} onClick={dismiss}>
      <div
        className="exit-popup"
        onClick={e => e.stopPropagation()}
        style={{
          '--exit-bg': settings.bg_color,
          '--exit-text': settings.text_color,
          '--exit-title-color': settings.title_color,
          '--exit-accent': settings.accent_color,
          '--exit-card-bg': settings.card_bg,
          '--exit-card-border': settings.card_border,
        } as React.CSSProperties}
      >
        <button className="exit-popup-close" onClick={dismiss} aria-label="Fechar">&times;</button>
        <h2 className="exit-popup-title">{settings.title}</h2>
        <p className="exit-popup-subtitle">{settings.subtitle}</p>
        <div className="exit-popup-cards">
          {settings.cards.map(card => (
            <a key={card.id} href={card.link} target="_blank" rel="noreferrer" className="exit-popup-card">
              <div className="exit-popup-card-icon" style={{ background: settings.accent_color + '18' }}>
                {renderCardIcon(card.icon_type, settings.accent_color)}
              </div>
              <p className="exit-popup-card-title">{card.title}</p>
              <p className="exit-popup-card-desc">{card.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;
