import { useState, useEffect, useRef } from 'react';
import '../styles/Entertainment.css';
import { API_BASE_URL } from '../config/api';

interface AppItem {
  id: number;
  name: string;
  icon: string;
  logo_url: string;
  banner_url: string;
  description: string;
  link_url: string;
}

export const Entertainment: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [s, setS] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/entertainment`)
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(console.error);

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

  if (apps.length === 0) return null;

  const scroll = (dir: -1 | 1) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const bgColor = s.ent_bg_color || '#f8fafc';
  const textColor = s.ent_text_color || '#1e293b';

  return (
    <section id="entretenimento" className="entertainment-section section-padding" style={{ background: bgColor }}>
      <div className="container">
        <div className="entertainment-header text-center">
          <h2 className="site-section-title">
            {s.ent_title || 'Aplicativos para diversão, entretenimento e segurança para toda a família'}
          </h2>
          <p className="site-section-subtitle">
            {s.ent_subtitle || 'Aplicativos de entretenimento que traz diversão para toda a família. Junte-se a nós e descubra uma nova forma de se divertir juntos!'}
          </p>
        </div>

        <div className="ent-carousel-section">
          <button className="ent-arrow ent-arrow-left" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="ent-carousel-track" ref={scrollRef}>
            {apps.map(app => (
              <div
                key={app.id}
                className="ent-card"
                title={app.description || app.name}
              >
                <div className="ent-card-inner">
                  {app.banner_url ? (
                    <img className="ent-card-banner" src={app.banner_url} alt={app.name} />
                  ) : (
                    <div className="ent-card-banner ent-card-placeholder">
                      <span>{app.icon}</span>
                    </div>
                  )}
                  <div className="ent-card-overlay" />
                  <div className="ent-card-logo">
                    {app.logo_url ? (
                      <img src={app.logo_url} alt={app.name} />
                    ) : (
                      <span className="ent-card-logo-text">{app.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="ent-arrow ent-arrow-right" onClick={() => scroll(1)} aria-label="Próximo">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {(s.ent_bottom_text || s.ent_btn_text) && (
          <div className="ent-footer text-center" style={{ color: textColor }}>
            {s.ent_bottom_text && <p className="ent-bottom-text" style={{ fontSize: s.ent_bottom_font_size || undefined }}>{s.ent_bottom_text}</p>}
            {s.ent_btn_text && s.ent_btn_link && (
              <a href={s.ent_btn_link} target="_blank" rel="noopener noreferrer" className="ent-cta-btn" style={{
                fontSize: s.ent_btn_font_size || undefined,
                background: s.ent_btn_bg || undefined,
                color: s.ent_btn_text_color || undefined,
              }}>
                {s.ent_btn_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export default Entertainment;