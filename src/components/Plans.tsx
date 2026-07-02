import { useState, useEffect } from 'react';
import '../styles/Plans.css';

interface AppIcon {
  name: string;
  color?: string;
  textColor?: string;
  abbr?: string;
  icon_url?: string;
  description?: string;
}

interface Badge {
  text: string;
  icon_url?: string;
  icon_emoji?: string;
  bg_color?: string;
  text_color?: string;
}

interface Plan {
  id: number;
  name: string;
  speed: string;
  price: string;
  highlight: string;
  highlight_icon: string;
  button_text: string;
  whatsapp_msg: string;
  included_apps: AppIcon[];
  bonus_app: AppIcon;
  details: string[];
  popular: boolean;
  card_bg_color?: string;
  card_text_color?: string;
  button_bg_color?: string;
  button_text_color?: string;
  plan_font?: string;
  label_included?: string;
  label_bonus?: string;
  label_details?: string;
  label_price_period?: string;
  accent_color?: string;
  bonus_apps?: AppIcon[];
  enable_bonus?: boolean;
  enable_details?: boolean;
  badges?: Badge[];
  modal_label_color?: string;
  modal_title_color?: string;
}

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlanModal, setSelectedPlanModal] = useState<Plan | null>(null);
  const [selectedBonusTab, setSelectedBonusTab] = useState<number>(0);
  const [selectedAppTab, setSelectedAppTab] = useState<number>(0);

  const [visible, setVisible] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (plans.length === 0) return null; // ou um loading spinner

  const maxIndex = Math.max(0, plans.length - visible);
  const needsScroll = plans.length > visible;

  // Card width in px (290px default, 270px on md, full on mobile)
  const cardWidthPx = visible === 1 ? window.innerWidth - 52 : visible === 2 ? 270 : 290;
  const cardGapPx = 20;
  const totalTrackWidth = plans.length * (cardWidthPx + cardGapPx) - cardGapPx;
  // If plans fit: center them by adding symmetric padding
  const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 1200) : 1200;
  const centeringOffset = !needsScroll ? Math.max(0, (containerWidth - totalTrackWidth) / 2) : 0;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      next();
    } else if (distance < -swipeThreshold) {
      prev();
    }
    setTouchStart(null);
  };

  const toggleDetails = (index: number) => {
    setSelectedPlanModal(plans[index]);
    setSelectedBonusTab(null);
    setSelectedAppTab(0);
  };

  return (
    <section id="internet" className="plans-section">
      <div className="plans-wrapper">
        <div className="plans-header">
          <span className="plans-eyebrow">Nossos Planos</span>
          <h2 className="site-section-title">A melhor internet da Área Itaqui Bacanga</h2>
          <p className="site-section-subtitle">
            Assine a Mundonet e tenha acesso a aplicativos, canais de TV e muito mais!
          </p>
        </div>

        <div className="plans-carousel-wrapper">
          <div
            className="plans-track"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: needsScroll
                ? `translateX(calc(-${currentIndex} * (var(--card-width) + var(--card-gap))))`
                : 'none',
              paddingLeft: needsScroll ? 0 : centeringOffset
            }}
          >
            {plans.map((plan, i) => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
                style={{
                  '--card-bg': plan.card_bg_color || '#fff',
                  '--card-text': plan.card_text_color || '#1a0533',
                  '--plan-name-color': plan.card_text_color || (plan.accent_color || '#7c3aed'),
                  '--btn-bg': plan.button_bg_color || 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  '--btn-text': plan.button_text_color || '#fff',
                  '--accent': plan.accent_color || '#7c3aed',
                  fontFamily: plan.plan_font || undefined
                } as React.CSSProperties}
              >
                {plan.popular && <div className="popular-ribbon">Mais Popular</div>}

                <div className="plan-card-top">
                  <div className="plan-name-row">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-user-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="plan-price-block">
                    {plan.price.toLowerCase() === 'sob consulta' ? (
                      <span className="plan-price-consult">Sob Consulta</span>
                    ) : (
                      <>
                        <span className="plan-price-currency">R$</span>
                        <span className="plan-price-value">{plan.price}</span>
                        <span className="plan-price-period"> {plan.label_price_period || 'por mês'}</span>
                      </>
                    )}
                  </div>

                  <div className="plan-highlight">
                    <span className="plan-highlight-icon">{plan.highlight_icon}</span>
                    <span>{plan.highlight}</span>
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=559830420030&text=${plan.whatsapp_msg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="plan-cta-btn"
                >
                  {plan.button_text}
                </a>

                <div className="plan-included">
                  <p className="plan-included-label">{plan.label_included || 'Incluso no plano:'}</p>
                  <div className="plan-apps-row">
                    {plan.included_apps?.map((app, j) => (
                      app.icon_url ? (
                        <div key={j} className="plan-app-chip-img-wrapper" title={app.name}>
                          <img src={app.icon_url} alt={app.name} className="plan-app-chip-img" />
                        </div>
                      ) : (
                        <div
                          key={j}
                          className="plan-app-chip"
                          style={{ backgroundColor: app.color, color: app.textColor }}
                          title={app.name}
                        >
                          {app.abbr}
                        </div>
                      )
                    ))}
                  </div>
                  {plan.enable_bonus !== false && ((plan.bonus_apps && plan.bonus_apps.length > 0) || (plan.bonus_app && (plan.bonus_app.abbr || plan.bonus_app.icon_url))) && (
                    <>
                      <p className="plan-bonus-label">{plan.label_bonus || 'Na assinatura, adicione mais um benefício:'}</p>
                      <div className="plan-apps-row">
                        {(plan.bonus_apps && plan.bonus_apps.length > 0 ? plan.bonus_apps : plan.bonus_app ? [plan.bonus_app] : []).map((b, j) => (
                          b.icon_url ? (
                            <div key={j} className="plan-app-chip-img-wrapper" title={b.name}>
                              <img src={b.icon_url} alt={b.name} className="plan-app-chip-img" />
                            </div>
                          ) : (
                            <div
                              key={j}
                              className="plan-app-chip plan-bonus-chip"
                              style={{ backgroundColor: b.color, color: b.textColor }}
                              title={b.name}
                            >
                              {b.abbr}
                            </div>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="plan-details-footer">
                  <button
                    className="plan-details-toggle"
                    onClick={() => toggleDetails(i)}
                  >
                    <span>{plan.label_details || 'Mais detalhes do plano'}</span>
                    <span className="details-toggle-icon">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="plans-nav">
          <button
            className={`plans-nav-btn ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label="Plano anterior"
          >
            <svg viewBox="0 0 256 512" width="14" height="14">
              <path fill="currentColor" d="M31.7 244l192-184c6.2-6 16.3-5.6 22 1l15 15.6c5.7 6 5.2 16-.9 21.6L84.8 256l175 161.8c6 5.6 6.5 15.6.9 21.6l-15 15.6c-5.7 6.6-15.8 7-22 1L31.7 268c-7.6-7-7.6-17 0-24z"/>
            </svg>
          </button>
          <button
            className={`plans-nav-btn ${currentIndex >= maxIndex ? 'disabled' : ''}`}
            onClick={next}
            disabled={currentIndex >= maxIndex}
            aria-label="Próximo plano"
          >
            <svg viewBox="0 0 256 512" width="14" height="14">
              <path fill="currentColor" d="M224.3 273l-192 184c-6.2 6-16.3 5.6-22-1l-15-15.6c-5.7-6-5.2-16 .9-21.6L171.2 256 9.8 95.8c-6-5.6-6.5-15.6-.9-21.6l15-15.6c-5.7-6.6 15.8-7 22-1l192 184c7.6 7 7.6 17 0 24z"/>
            </svg>
          </button>
        </div>

        <div className="plans-dots">
          {plans.slice(0, Math.max(1, plans.length - visible + 1)).map((_, i) => (
            <button
              key={i}
              className={`plans-dot ${currentIndex === i ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir para posição ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES DO PLANO (NOVO LAYOUT) */}
      {selectedPlanModal && (
        <div className="plan-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedPlanModal(null)}>
          <div className="plan-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="plan-modal-close" onClick={() => setSelectedPlanModal(null)}>×</button>
            
            <div className="plan-modal-header">
              <h3 style={{color: selectedPlanModal.modal_title_color || selectedPlanModal.accent_color || '#c084fc'}}>{selectedPlanModal.name}</h3>
            </div>

            <div className="plan-modal-badges">
              {selectedPlanModal.badges && selectedPlanModal.badges.length > 0 && selectedPlanModal.badges.map((badge, idx) => (
                <div key={idx} className="plan-modal-badge" style={{ backgroundColor: badge.bg_color || '#1e1e2d', color: badge.text_color || '#fff' }}>
                  {badge.icon_emoji && (
                    <span className="plan-modal-badge-emoji">{badge.icon_emoji}</span>
                  )}
                  {badge.icon_url && !badge.icon_emoji && (
                    <img src={badge.icon_url} alt="icon" className="plan-modal-badge-img" />
                  )}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            <div className="plan-modal-body-split">
              <div className="plan-modal-left-col">
                {selectedPlanModal.included_apps && selectedPlanModal.included_apps.length > 0 && (
                  <div className="plan-modal-apps-section">
                    <h4 style={{color: selectedPlanModal.modal_label_color}}>{selectedPlanModal.label_included || 'Aplicativos inclusos no plano:'}</h4>
                    <div className="plan-modal-apps-container">
                      <div className="plan-modal-apps-sidebar">
                        <div className="plan-modal-apps-line" style={{ height: `calc(100% - ${selectedPlanModal.included_apps.length * 64}px + ${selectedAppTab * 64}px + 32px)` }}></div>
                        {selectedPlanModal.included_apps.map((app, idx) => (
                          <div 
                            key={idx} 
                            className={`plan-modal-app-icon-wrapper ${selectedAppTab === idx ? 'active' : ''}`}
                            onClick={() => setSelectedAppTab(idx)}
                          >
                            {app.icon_url ? (
                              <img src={app.icon_url} alt={app.name} className="plan-modal-app-icon" />
                            ) : (
                              <div className="plan-modal-app-icon text-icon" style={{ backgroundColor: app.color, color: app.textColor }}>
                                {app.abbr}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="plan-modal-app-details">
                        {selectedPlanModal.included_apps[selectedAppTab] && (
                          <div className="plan-modal-app-info animate-fade-in">
                            <h5 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#fff' }}>{selectedPlanModal.included_apps[selectedAppTab].name}</h5>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4 }}>{selectedPlanModal.included_apps[selectedAppTab].description || 'Benefício incluso no seu plano sem custo adicional.'}</p>
                          </div>
                        )}

                        <div className="plan-modal-price-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                          <div className="plan-modal-price" style={{ margin: 0 }}>
                            <span className="currency">R$</span>
                            <span className="value">{selectedPlanModal.price}</span>
                            <span className="period">{selectedPlanModal.modal_price_text || selectedPlanModal.label_price_period || 'por mês'}</span>
                          </div>
                          <a 
                            href={`https://api.whatsapp.com/send?phone=559830420030&text=${selectedPlanModal.whatsapp_msg}`}
                            target="_blank"
                            rel="noreferrer"
                            className="plan-modal-cta"
                            style={{ backgroundColor: selectedPlanModal.button_bg_color || '#7c3aed', color: selectedPlanModal.button_text_color || '#fff', width: 'auto', padding: '12px 32px' }}
                          >
                            {selectedPlanModal.button_text}
                          </a>
                        </div>

                        {selectedPlanModal.enable_bonus !== false && ((selectedPlanModal.bonus_apps && selectedPlanModal.bonus_apps.length > 0) || (selectedPlanModal.bonus_app && (selectedPlanModal.bonus_app.abbr || selectedPlanModal.bonus_app.icon_url))) && (
                          <>
                            <div className="plan-modal-bonus-section">
                              <h4 style={{color: selectedPlanModal.modal_label_color, margin: '0 0 12px 0'}}>{selectedPlanModal.label_bonus || 'Na assinatura adicione mais um aplicativo:'}</h4>
                              
                              <div className="plan-modal-bonus-tabs">
                                {(selectedPlanModal.bonus_apps && selectedPlanModal.bonus_apps.length > 0 ? selectedPlanModal.bonus_apps : selectedPlanModal.bonus_app ? [selectedPlanModal.bonus_app] : []).map((app, idx) => (
                                  <button
                                    key={idx}
                                    className={`plan-modal-bonus-tab ${selectedBonusTab === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedBonusTab(selectedBonusTab === idx ? null : idx)}
                                    title={app.name}
                                  >
                                    {app.icon_url ? (
                                      <img src={app.icon_url} alt={app.name} />
                                    ) : (
                                      <div className="text-icon" style={{ backgroundColor: app.color, color: app.textColor }}>
                                        {app.abbr}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>

                              {selectedBonusTab !== null && (() => {
                                const arr = selectedPlanModal.bonus_apps && selectedPlanModal.bonus_apps.length > 0 ? selectedPlanModal.bonus_apps : selectedPlanModal.bonus_app ? [selectedPlanModal.bonus_app] : [];
                                const app = arr[selectedBonusTab];
                                return app ? (
                                  <div className="plan-modal-bonus-details animate-fade-in">
                                    <h5 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{app.name}</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{app.description || 'Benefício extra disponível para assinatura.'}</p>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlanModal.enable_details !== false && selectedPlanModal.details && selectedPlanModal.details.length > 0 && (
                  <div className="plan-modal-list-section animate-fade-in" style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{color: selectedPlanModal.modal_label_color}}>{selectedPlanModal.label_details || 'Itens do Plano (Detalhes):'}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {selectedPlanModal.details.map((detail, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.9rem', color: '#ccc' }}>
                          <span style={{ color: selectedPlanModal.accent_color || '#7c3aed', marginTop: 2 }}>✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Plans;
