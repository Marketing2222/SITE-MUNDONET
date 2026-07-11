import { useState, useEffect } from 'react';
import '../styles/AppSection.css';
import { API_BASE_URL } from '../config/api';

export const AppSection: React.FC = () => {
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

  const bullets = s.app_bullets 
    ? s.app_bullets.split('\n').filter(b => b.trim() !== '')
    : [
        'Emissão de 2ª via de boleto em poucos toques',
        'Desbloqueio de confiança imediato',
        'Consulta de consumo de internet',
        'Suporte técnico por chat direto no aplicativo'
      ];

  const alignStyle = (key: string): React.CSSProperties => {
    const a = s[key];
    if (a) return { textAlign: a as any };
    return {};
  };

  return (
    <section id="app" className="app-section section-padding" style={s.app_bg_color ? { backgroundColor: s.app_bg_color } : undefined}>
      <div className="container app-grid">
        <div className="app-content animate-slide-up">
          <span className="subtitle-badge" style={alignStyle('app_subtitle_align')}>{s.app_subtitle || 'Aplicativo Móvel'}</span>
          <h2 className="site-section-title" style={alignStyle('app_title_align')}>{s.app_title || 'O app que conecta você a tudo da Mundonet'}</h2>
          <p className="app-desc" style={alignStyle('app_desc_align')} dangerouslySetInnerHTML={{ __html: s.app_desc || 'Tenha a Central do Assinante na palma da sua mão. Com o aplicativo <strong>Mundonet+</strong>, você gerencia sua conta com total praticidade e rapidez, a qualquer hora e de qualquer lugar.' }}></p>

          <ul className="app-features-list">
            {bullets.map((b, i) => (
              <li key={i}>
                <div className="bullet-check">
                  <svg viewBox="0 0 512 512" width="12" height="12">
                    <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                  </svg>
                </div>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="store-buttons">
            <a 
              href={s.app_playstore || "https://play.google.com/store/apps/details?id=com.r3r.mundonet&hl=pt_BR"} 
              target="_blank" 
              rel="noreferrer" 
              className="store-btn"
            >
              <img src={s.app_playstore_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/play_store.png"} alt="Disponível no Google Play" />
            </a>
            <a 
              href={s.app_appstore || "https://apps.apple.com/br/app/mundonet/id6747144804"} 
              target="_blank" 
              rel="noreferrer" 
              className="store-btn"
            >
              <img src={s.app_appstore_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/apple_store.png"} alt="Disponível na App Store" />
            </a>
          </div>
        </div>

        <div className="app-mockup animate-fade-in">
          <div className="glow-effect"></div>
          <img 
            src={s.app_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/download_app_mundonet-1024x380.png"} 
            alt="Mundonet App Mockup" 
            className="mockup-img"
            style={s.app_image_size ? { maxWidth: s.app_image_size, width: s.app_image_size } : undefined}
          />
        </div>
      </div>
    </section>
  );
};
export default AppSection;
