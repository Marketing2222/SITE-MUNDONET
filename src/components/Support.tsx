import { useState, useEffect } from 'react';
import '../styles/Support.css';

export const Support: React.FC = () => {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {};
        for (const [key, obj] of Object.entries(data)) {
          map[key] = (obj as any).value;
        }
        setS(map);
      })
      .catch(console.error);
  }, []);

  const bg = s.support_bg_color || '#f5f0ff';
  const padding = s.support_padding || '60px 20px';

  const leftTitle = s.support_left_title || 'Somos a Mundonet';
  const leftDesc = s.support_left_desc || 'Na Mundonet, em todas as nossas ações, acreditamos em desafiar os "valores" tradicionais dos provedores de internet. Fazemos isso tratando você como um parceiro que desejamos apoiar, e não apenas como um "cliente".';
  const leftHighlight = s.support_left_highlight || 'Faça parte deste movimento.';
  const leftBtnText = s.support_left_btn_text || 'Conheça mais';
  const leftBtnLink = s.support_left_btn_link || '#';
  const leftBtnBg = s.support_left_btn_bg || '#7c3aed';
  const leftBtnColor = s.support_left_btn_color || '#ffffff';
  const leftBtnFontSize = s.support_left_btn_font_size || '16px';
  const leftBtnPadding = s.support_left_btn_padding || '14px 40px';
  const leftBtnBorderRadius = s.support_left_btn_border_radius || '8px';

  const rightTitle = s.support_right_title || 'Canais de atendimento';
  const rightDesc = s.support_right_desc || 'Conheça os canais de atendimento da Mundonet e entre em contato com nosso time, estamos sempre a disposição.';

  const ch1Value = s.support_ch1_value || '0800 765 5507';
  const ch1Label = s.support_ch1_label || 'Whatsapp e telefone';
  const ch1Link = s.support_ch1_link || 'https://api.whatsapp.com/send?phone=559830420030';
  const ch1Icon = s.support_ch1_icon || 'phone';

  const ch2Value = s.support_ch2_value || 'contato@mundonetbandalarga.com.br';
  const ch2Label = s.support_ch2_label || 'Por e-mail';
  const ch2Link = s.support_ch2_link || 'mailto:contato@mundonetbandalarga.com.br';
  const ch2Icon = s.support_ch2_icon || 'email';

  const chBtn1Text = s.support_ch_btn1_text || 'Entre em contato';
  const chBtn1Link = s.support_ch_btn1_link || 'https://api.whatsapp.com/send?phone=559830420030';
  const chBtn1Bg = s.support_ch_btn1_bg || '#7c3aed';
  const chBtn1Color = s.support_ch_btn1_color || '#ffffff';

  const chBtn2Text = s.support_ch_btn2_text || 'Quero que me liguem';
  const chBtn2Link = s.support_ch_btn2_link || 'tel:+559830420030';
  const chBtn2Bg = s.support_ch_btn2_bg || '#ffffff';
  const chBtn2Color = s.support_ch_btn2_color || '#7c3aed';

  const titleColor = s.support_title_color || '#1e1b4b';
  const descColor = s.support_desc_color || '#64748b';

  const cardBg = s.support_card_bg || '#ffffff';
  const cardBorder = s.support_card_border || '#e9e5f5';
  const cardTextColor = s.support_card_text_color || '#1e1b4b';

  const renderIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        );
      case 'email':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        );
      case 'chat':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        );
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  return (
    <section className="support-section" style={{ backgroundColor: bg, padding }}>
      <div className="container">
        <div className="support-wrapper">
          <div className="support-left">
            <h2 className="support-title" style={{ color: titleColor }}>{leftTitle}</h2>
            <p className="support-desc" style={{ color: descColor }}>{leftDesc}</p>
            <p className="support-desc" style={{ color: descColor, fontWeight: 600, marginTop: 0 }}>{leftHighlight}</p>
            {leftBtnText && (
              <a
                href={leftBtnLink}
                target="_blank"
                rel="noreferrer"
                className="support-cta-btn"
                style={{
                  backgroundColor: leftBtnBg,
                  color: leftBtnColor,
                  fontSize: leftBtnFontSize,
                  padding: leftBtnPadding,
                  borderRadius: leftBtnBorderRadius,
                }}
              >
                {leftBtnText}
              </a>
            )}
          </div>

          <div className="support-right">
            <h2 className="support-title" style={{ color: titleColor }}>{rightTitle}</h2>
            <p className="support-desc" style={{ color: descColor }}>{rightDesc}</p>

            <div className="support-channels-grid">
              {ch1Value && (
                <a href={ch1Link} target="_blank" rel="noreferrer" className="support-channel-card" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, color: cardTextColor }}>
                  <span className="support-channel-icon" style={{ color: leftBtnBg }}>{renderIcon(ch1Icon)}</span>
                  <span className="support-channel-value">{ch1Value}</span>
                  <span className="support-channel-label" style={{ color: descColor }}>{ch1Label}</span>
                </a>
              )}
              {ch2Value && (
                <a href={ch2Link} target="_blank" rel="noreferrer" className="support-channel-card" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, color: cardTextColor }}>
                  <span className="support-channel-icon" style={{ color: leftBtnBg }}>{renderIcon(ch2Icon)}</span>
                  <span className="support-channel-value">{ch2Value}</span>
                  <span className="support-channel-label" style={{ color: descColor }}>{ch2Label}</span>
                </a>
              )}
              {chBtn1Text && (
                <a href={chBtn1Link} target="_blank" rel="noreferrer" className="support-channel-btn" style={{ backgroundColor: chBtn1Bg, color: chBtn1Color }}>
                  {renderIcon('chat')}
                  {chBtn1Text}
                </a>
              )}
              {chBtn2Text && (
                <a href={chBtn2Link} target="_blank" rel="noreferrer" className="support-channel-btn" style={{ backgroundColor: chBtn2Bg, color: chBtn2Color, border: `2px solid ${chBtn2Color}` }}>
                  {renderIcon('user')}
                  {chBtn2Text}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
