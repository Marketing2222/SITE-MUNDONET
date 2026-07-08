import { useState, useEffect } from 'react';
import '../styles/LandingPage.css';
import { API_BASE_URL } from '../config/api';

interface LandingSettings {
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_image: string;
  hero_bg_color: string;
  hero_text_color: string;
  hero_highlight_color: string;
  plan_name: string;
  plan_speed: string;
  plan_price: string;
  plan_period: string;
  plan_installment: string;
  plan_original_price: string;
  plan_highlight_text: string;
  plan_apps: string;
  plan_badge_text: string;
  plan_card_bg: string;
  plan_price_color: string;
  plan_btn_text: string;
  plan_btn_link: string;
  plan_btn_color: string;
  plan_btn_text_color: string;
  cta_title: string;
  cta_desc: string;
  cta_btn_text: string;
  cta_btn_link: string;
  cta_bg_color: string;
  cta_text_color: string;
  cta_btn_color: string;
  cta_btn_text_color: string;
  features_title: string;
  features: string;
  footer_text: string;
  footer_bg_color: string;
  footer_text_color: string;
}

const DEFAULT_SETTINGS: LandingSettings = {
  hero_title: 'Na MUNDONET você tem o',
  hero_highlight: 'melhor do entretenimento do MUNDO!',
  hero_subtitle: 'Internet 100% Fibra Óptica com os melhores apps inclusos',
  hero_image: 'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png',
  hero_bg_color: '#0a1628',
  hero_text_color: '#ffffff',
  hero_highlight_color: '#22c55e',
  plan_name: '700 MEGA',
  plan_speed: '700',
  plan_price: '39,90',
  plan_period: 'POR APENAS',
  plan_installment: '39,90',
  plan_original_price: '129,90',
  plan_highlight_text: '1 APP DA ÁREA STANDARD + 1 APP DA ÁREA TOP',
  plan_apps: 'Deezer,Globoplay,Sky,Apple TV,PlayKids,Telecine',
  plan_badge_text: 'MEGA',
  plan_card_bg: '#1a2744',
  plan_price_color: '#ffffff',
  plan_btn_text: 'QUERO CONTRATAR',
  plan_btn_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá! Vim pelo site e gostaria de contratar o plano.',
  plan_btn_color: '#2563eb',
  plan_btn_text_color: '#ffffff',
  cta_title: 'Como podemos te ajudar hoje?',
  cta_desc: 'Fale com nossa equipe e descubra o plano perfeito para você',
  cta_btn_text: 'Falar com Atendente',
  cta_btn_link: 'https://api.whatsapp.com/send?phone=559830420030',
  cta_bg_color: '#ffffff',
  cta_text_color: '#1e293b',
  cta_btn_color: '#2563eb',
  cta_btn_text_color: '#ffffff',
  features_title: 'Por que escolher a Mundonet?',
  features: 'Internet 100% Fibra Óptica,Wi-Fi 6 incluso,40 canais de TV grátis,Filmes e E-Books inclusos,Instalação rápida em até 48h,Suporte técnico 24h',
  footer_text: 'Mundonet Telecom - Conectando você com o mundo',
  footer_bg_color: '#0a1628',
  footer_text_color: '#94a3b8',
};

const APP_ICONS: Record<string, string> = {
  Deezer: '🎵',
  Globoplay: '📺',
  Sky: '📡',
  'Apple TV': '🍎',
  PlayKids: '🧒',
  Telecine: '🎬',
  'Disney+': '✨',
  Max: '🎬',
  Kaspersky: '🛡️',
};

export const LandingPage = () => {
  const [settings, setSettings] = useState<LandingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const s = { ...DEFAULT_SETTINGS };
        for (const [key, val] of Object.entries(data) as [string, { value: string }][]) {
          if (key.startsWith('lp_') && val.value && key.replace('lp_', '') in s) {
            (s as Record<string, string>)[key.replace('lp_', '')] = val.value;
          }
        }
        setSettings(s);
      })
      .catch(() => {});
  }, []);

  const apps = settings.plan_apps.split(',').map(a => a.trim()).filter(Boolean);
  const features = settings.features.split(',').map(f => f.trim()).filter(Boolean);

  return (
    <div className="lp-container">
      {/* HERO */}
      <section className="lp-hero" style={{ backgroundColor: settings.hero_bg_color }}>
        <div className="lp-hero-content">
          <div className="lp-hero-left">
            <h1 className="lp-hero-title" style={{ color: settings.hero_text_color }}>
              {settings.hero_title}{' '}
              <span style={{ color: settings.hero_highlight_color }}>{settings.hero_highlight}</span>
            </h1>
            <p className="lp-hero-subtitle" style={{ color: settings.hero_text_color + 'cc' }}>
              {settings.hero_subtitle}
            </p>
            <a href={settings.plan_btn_link} target="_blank" rel="noreferrer" className="lp-hero-cta" style={{ backgroundColor: settings.plan_btn_color, color: settings.plan_btn_text_color }}>
              {settings.plan_btn_text}
            </a>
          </div>
          <div className="lp-hero-right">
            <div className="lp-hero-image-wrapper">
              <img src={settings.hero_image} alt="Mundonet" className="lp-hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* PLAN CARD */}
      <section className="lp-plan-section" style={{ backgroundColor: settings.hero_bg_color }}>
        <div className="lp-plan-card" style={{ backgroundColor: settings.plan_card_bg }}>
          <div className="lp-plan-header">
            <div className="lp-plan-speed">
              <span className="lp-plan-speed-value" style={{ color: settings.plan_price_color }}>{settings.plan_speed}</span>
              <span className="lp-plan-speed-badge" style={{ backgroundColor: settings.plan_btn_color }}>{settings.plan_badge_text}</span>
            </div>
            <div className="lp-plan-apps">
              {apps.map((app, i) => (
                <div key={i} className="lp-plan-app-icon" title={app}>
                  <span>{APP_ICONS[app] || '📱'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-plan-highlight">{settings.plan_highlight_text}</div>
          <div className="lp-plan-price-block">
            <span className="lp-plan-period">{settings.plan_period}</span>
            <div className="lp-plan-price">
              <span className="lp-plan-currency">R$</span>
              <span className="lp-plan-value" style={{ color: settings.plan_price_color }}>{settings.plan_price.split(',')[0]}</span>
              <span className="lp-plan-cents">,{settings.plan_price.split(',')[1] || '90'}</span>
            </div>
            <span className="lp-plan-installment">Instalação R${settings.plan_installment}</span>
          </div>
          <a href={settings.plan_btn_link} target="_blank" rel="noreferrer" className="lp-plan-cta" style={{ backgroundColor: settings.plan_btn_color, color: settings.plan_btn_text_color }}>
            {settings.plan_btn_text}
          </a>
          {settings.plan_original_price && (
            <p className="lp-plan-discount">*Valor com desconto no primeiro pagamento. Depois R${settings.plan_original_price}</p>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features" style={{ backgroundColor: '#f8fafc' }}>
        <div className="lp-features-wrapper">
          <h2 className="lp-features-title" style={{ color: '#1e293b' }}>{settings.features_title}</h2>
          <div className="lp-features-grid">
            {features.map((feat, i) => (
              <div key={i} className="lp-feature-card">
                <div className="lp-feature-icon">✓</div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section" style={{ backgroundColor: settings.cta_bg_color }}>
        <div className="lp-cta-wrapper">
          <h2 className="lp-cta-title" style={{ color: settings.cta_text_color }}>{settings.cta_title}</h2>
          <p className="lp-cta-desc" style={{ color: settings.cta_text_color + 'cc' }}>{settings.cta_desc}</p>
          <a href={settings.cta_btn_link} target="_blank" rel="noreferrer" className="lp-cta-btn" style={{ backgroundColor: settings.cta_btn_color, color: settings.cta_btn_text_color }}>
            {settings.cta_btn_text}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer" style={{ backgroundColor: settings.footer_bg_color }}>
        <p style={{ color: settings.footer_text_color }}>{settings.footer_text}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
