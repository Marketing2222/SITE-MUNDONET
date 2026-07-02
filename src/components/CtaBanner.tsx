import { useState, useEffect } from 'react';
import '../styles/CtaBanner.css';

export const CtaBanner: React.FC = () => {
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

  const bg = s.cta_bg_color || '#1a0a2e';
  const bgGrad = s.cta_bg_gradient || 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)';
  const title = s.cta_title || 'Procurando um plano para sua empresa?';
  const desc = s.cta_desc || 'Planos de internet para empresas que impulsionam a produtividade e conectividade.';
  const btnText = s.cta_btn_text || 'Conheça nossas soluções';
  const btnLink = s.cta_btn_link || '#';
  const btnBg = s.cta_btn_bg || '#ffffff';
  const btnColor = s.cta_btn_color || '#7c3aed';
  const btnFontSize = s.cta_btn_font_size || '14px';
  const btnPadding = s.cta_btn_padding || '12px 28px';
  const btnBorderRadius = s.cta_btn_border_radius || '24px';
  const textColor = s.cta_text_color || '#ffffff';
  const descColor = s.cta_desc_color || '#d1d5db';
  const titleFontSize = s.cta_title_font_size || '28px';
  const descFontSize = s.cta_desc_font_size || '15px';
  const textAlign = s.cta_text_align || 'left';
  const contentPosition = s.cta_content_position || 'left';
  const bgImage = s.cta_bg_image || '';
  const borderRadius = s.cta_border_radius || '16px';
  const padding = s.cta_padding || '60px 50px';
  const maxHeight = s.cta_max_height || '320px';

  const containerStyle: React.CSSProperties = {
    background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bgGrad,
    backgroundColor: bgImage ? bg : undefined,
    borderRadius,
    padding,
    maxWidth: 1200,
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    minHeight: maxHeight,
  };

  if (contentPosition === 'center') {
    containerStyle.justifyContent = 'center';
    containerStyle.textAlign = 'center';
  } else if (contentPosition === 'right') {
    containerStyle.justifyContent = 'flex-end';
    containerStyle.textAlign = 'right';
  } else {
    containerStyle.justifyContent = 'flex-start';
  }

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: 500,
    textAlign: textAlign as any,
  };

  return (
    <section className="cta-banner-section">
      <div className="container">
        <div style={containerStyle}>
          <div style={contentStyle}>
            <h2 style={{ color: textColor, fontSize: titleFontSize, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>{title}</h2>
            <p style={{ color: descColor, fontSize: descFontSize, margin: '0 0 24px', lineHeight: 1.6 }}>{desc}</p>
            {btnText && (
              <a
                href={btnLink}
                target="_blank"
                rel="noreferrer"
                className="cta-banner-btn"
                style={{
                  display: 'inline-block',
                  backgroundColor: btnBg,
                  color: btnColor,
                  fontSize: btnFontSize,
                  padding: btnPadding,
                  borderRadius: btnBorderRadius,
                  textDecoration: 'none',
                  fontWeight: 600,
                  border: `2px solid ${btnBg === 'transparent' ? btnColor : 'transparent'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {btnText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
