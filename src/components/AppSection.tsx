import { useState, useEffect } from 'react';
import '../styles/AppSection.css';
import { API_BASE_URL } from '../config/api';

const SVG_ICONS: Record<string, React.ReactNode> = {
  documento: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  escudo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  grafico: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  relogio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  estrela: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  estrela2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

const ICON_OPTIONS = [
  { value: 'documento', label: 'Documento / Boleto' },
  { value: 'escudo', label: 'Escudo / Proteção' },
  { value: 'grafico', label: 'Gráfico / Consumo' },
  { value: 'chat', label: 'Chat / Suporte' },
  { value: 'wifi', label: 'Wi-Fi / Velocidade' },
  { value: 'relogio', label: 'Relógio / Agilidade' },
  { value: 'estrela', label: 'Estrela / Destaque' },
  { value: 'download', label: 'Download / App' },
  { value: 'phone', label: 'Celular / App' },
  { value: 'estrela2', label: 'Estrela / Premium' },
];

export { ICON_OPTIONS };

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

  const gridItems = [1, 2, 3, 4].map(i => ({
    icon: s[`app_grid${i}_icon`] || ['documento', 'escudo', 'grafico', 'chat'][i - 1],
    title: s[`app_grid${i}_title`] || ['2ª via de boleto', 'Desbloqueio', 'Consumo', 'Suporte'][i - 1],
    desc: s[`app_grid${i}_desc`] || ['Emissão em poucos toques', 'Confiança imediato', 'Consulte sua internet', 'Chat direto no app'][i - 1],
  }));

  const alignStyle = (key: string): React.CSSProperties => {
    const a = s[key];
    if (a) return { textAlign: a as any };
    return {};
  };

  return (
    <section id="app" className="app-section section-padding" style={s.app_bg_color ? { backgroundColor: s.app_bg_color } : undefined}>
      <div className="container app-grid">
        <div className="app-mockup animate-fade-in">
          <div className="glow-effect"></div>
          <img
            src={s.app_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/download_app_mundonet-1024x380.png"}
            alt="Mundonet App Mockup"
            className="mockup-img"
            style={s.app_image_size ? { maxWidth: s.app_image_size, width: s.app_image_size } : undefined}
            loading="lazy"
          />
        </div>

        <div className="app-content animate-slide-up">
          <span className="subtitle-badge" style={alignStyle('app_subtitle_align')}>{s.app_subtitle || 'Aplicativo Móvel'}</span>
          <h2 className="site-section-title" style={alignStyle('app_title_align')}>{s.app_title || 'O app que conecta você a tudo da Mundonet'}</h2>
          <p className="app-desc" style={alignStyle('app_desc_align')} dangerouslySetInnerHTML={{ __html: s.app_desc || 'Tenha a Central do Assinante na palma da sua mão. Com o aplicativo <strong>Mundonet+</strong>, você gerencia sua conta com total praticidade e rapidez, a qualquer hora e de qualquer lugar.' }}></p>

          <div className="app-icon-grid">
            {gridItems.map((item, i) => (
              <div key={i} className="app-icon-card">
                <div className="app-icon-circle">
                  {SVG_ICONS[item.icon] || SVG_ICONS.documento}
                </div>
                <div className="app-icon-texts">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="store-buttons">
            <a
              href={s.app_playstore || "https://play.google.com/store/apps/details?id=com.r3r.mundonet&hl=pt_BR"}
              target="_blank"
              rel="noreferrer"
              className="store-btn"
            >
              <img src={s.app_playstore_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/play_store.png"} alt="Disponível no Google Play" loading="lazy" />
            </a>
            <a
              href={s.app_appstore || "https://apps.apple.com/br/app/mundonet/id6747144804"}
              target="_blank"
              rel="noreferrer"
              className="store-btn"
            >
              <img src={s.app_appstore_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/apple_store.png"} alt="Disponível na App Store" loading="lazy" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AppSection;
