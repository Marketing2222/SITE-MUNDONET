import { useState, useEffect } from 'react';
import '../styles/CtaBanner.css';
import { API_BASE_URL } from '../config/api';

export const CtaBanner: React.FC = () => {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
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

  const sectionBgColor = s.cta_section_bg_color || '';
  const bg = s.cta_bg_color || '#1a0a2e';
  const title = s.cta_title || 'Procurando um plano para sua empresa?';
  const desc = s.cta_desc || 'Planos de internet para empresas que impulsionam a produtividade e conectividade.';
  const btnText = s.cta_btn_text || 'Conheça nossas soluções';
  const btnLink = s.cta_btn_link || '#';
  const btnBg = s.cta_btn_bg || '#ffffff';
  const btnColor = s.cta_btn_color || '#7c3aed';
  const textColor = s.cta_text_color || '#ffffff';
  const descColor = s.cta_desc_color || '#d1d5db';
  const contentPosition = s.cta_content_position || 'left';
  const bgImage = s.cta_bg_image || '';

  const containerStyle: React.CSSProperties = {
    background: bgImage ? `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, transparent 85%), url(${bgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${bg} 0%, ${bg}dd 100%)`,
    backgroundColor: bgImage ? bg : undefined,
    borderRadius: '16px',
    padding: '60px 50px',
    maxWidth: 1200,
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    minHeight: '320px',
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
  };

  return (
    <section className="cta-banner-section" style={{ backgroundColor: sectionBgColor || undefined }}>
      <div className="container">
        <div style={containerStyle}>
          <div style={contentStyle}>
            <h2 style={{ color: textColor, fontSize: '28px', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>{title}</h2>
            <p style={{ color: descColor, fontSize: '15px', margin: '0 0 24px', lineHeight: 1.6 }}>{desc}</p>
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
                  fontSize: '14px',
                  padding: '12px 28px',
                  borderRadius: '24px',
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
