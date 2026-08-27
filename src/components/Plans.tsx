import { useState, useEffect } from 'react';
import '../styles/Plans.css';
import { API_BASE_URL } from '../config/api';

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
  offer_tag_enabled?: boolean;
  offer_tag_text?: string;
  offer_tag_color?: string;
  offer_tag_text_color?: string;
  offer_tag_icon?: string;
  show_price?: boolean;
  header_image?: string;
}

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlanModal, setSelectedPlanModal] = useState<Plan | null>(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [selectedBonusTab, setSelectedBonusTab] = useState<number | null>(0);
  const [selectedAppTab, setSelectedAppTab] = useState<number>(0);
  const [sectionColors, setSectionColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [speedFilter, setSpeedFilter] = useState<string>('all');

  const [visible, setVisible] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/plans`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/settings`).then(res => res.json()),
    ]).then(([plansData, settingsData]) => {
      setPlans(plansData);
      const colors: Record<string, string> = {};
      for (const [key, obj] of Object.entries(settingsData) as [string, { value: string }][]) {
        if (key.startsWith('plans_') && obj.value) colors[key] = obj.value;
      }
      setSectionColors(colors);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <section id="internet" className="plans-section" style={{ padding: '60px 20px', background: sectionColors.plans_bg_color || '#0a0a1a' }} />;
  if (plans.length === 0) return null;

  const filteredPlans = speedFilter === 'all'
    ? plans
    : plans.filter(p => {
        const speed = parseInt(p.speed) || 0;
        if (speedFilter === '500') return speed <= 500;
        if (speedFilter === '500+') return speed > 500 && speed < 1000;
        if (speedFilter === '1000+') return speed >= 1000;
        return true;
      });

  const maxIndex = Math.max(0, filteredPlans.length - visible);
  const needsScroll = filteredPlans.length > visible;

  // Card width in px (290px default, 270px on md, full on mobile)
  const cardWidthPx = visible === 1 ? window.innerWidth - 52 : visible === 2 ? 270 : 290;
  const cardGapPx = 20;
  const totalTrackWidth = filteredPlans.length * (cardWidthPx + cardGapPx) - cardGapPx;
  // If plans fit: center them by adding symmetric padding
  const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 1280) : 1280;
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

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setSelectedPlanModal(null);
      setModalClosing(false);
    }, 250);
  };

  return (
    <section id="internet" className="plans-section" style={sectionColors.plans_bg_color ? { backgroundColor: sectionColors.plans_bg_color } : undefined}>
      <div className="plans-wrapper">
        <div className="plans-header">
          <span className="plans-eyebrow" style={{ color: sectionColors.plans_eyebrow_color || undefined, backgroundColor: sectionColors.plans_eyebrow_bg || undefined }}>Nossos Planos</span>
          <h2 className="site-section-title" style={{ color: sectionColors.plans_title_color || undefined }}>A melhor internet da Área Itaqui Bacanga</h2>
          <p className="site-section-subtitle">
            Assine a Mundonet e tenha acesso a aplicativos, canais de TV e muito mais!
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Todos' },
              { key: '500', label: 'Até 500MB' },
              { key: '500+', label: '500MB - 1GB' },
              { key: '1000+', label: '1GB+' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => { setSpeedFilter(f.key); setCurrentIndex(0); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 50,
                  border: speedFilter === f.key ? '2px solid #7c3aed' : '1px solid rgba(124,58,237,0.2)',
                  background: speedFilter === f.key ? '#7c3aed' : 'transparent',
                  color: speedFilter === f.key ? '#fff' : '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
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
            {filteredPlans.map((plan, i) => (
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
                {plan.offer_tag_enabled && (
                  <div 
                    className="offer-tag-ribbon"
                    style={{
                      backgroundColor: plan.offer_tag_color || '#6b21a8',
                      color: plan.offer_tag_text_color || '#fff'
                    }}
                  >
                    <span>{plan.offer_tag_text}</span>
                    {plan.offer_tag_icon && <span className="offer-tag-icon">{plan.offer_tag_icon}</span>}
                  </div>
                )}
                {plan.popular && <div className="popular-ribbon">Mais Popular</div>}

                <div 
                  className={`plan-card-top ${plan.header_image ? 'has-header-image' : ''}`}
                  style={plan.header_image ? { backgroundImage: `url(${plan.header_image})` } : undefined}
                >
                  <div className="plan-price-block">
                    {(() => {
                      const match = plan.name.match(/^(\d+)\s*(.*)$/);
                      if (match) {
                        return (
                          <>
                            <span className="plan-speed-number">{match[1]}</span>
                            <span className="plan-speed-unit">{match[2]}</span>
                          </>
                        );
                      }
                      return <span className="plan-name plan-name-speed">{plan.name}</span>;
                    })()}
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
                          <img src={app.icon_url} alt={app.name} className="plan-app-chip-img" loading="lazy" />
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
                  {plan.show_price !== false && (
                    <div className="plan-price-bottom">
                      {plan.price.toLowerCase().includes('sob consulta') ? (
                        <span className="plan-price-consult">Sob Consulta</span>
                      ) : (
                        <>
                          <span className="plan-price-bottom-currency">R$</span>
                          <span className="plan-price-bottom-value">{plan.price}</span>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    className="plan-details-toggle"
                    onClick={() => toggleDetails(i)}
                  >
                    <span>{plan.label_details || 'Mais detalhes do plano'}</span>
                    <span className="details-toggle-icon">+</span>
                  </button>
                  <button
                    className="plan-share-btn"
                    onClick={() => {
                      const url = window.location.href;
                      const text = `Confira o plano ${plan.name} da Mundonet Telecom: ${plan.speed} por R$ ${plan.price}`;
                      if (navigator.share) {
                        navigator.share({ title: plan.name, text, url });
                      } else {
                        navigator.clipboard.writeText(`${text} ${url}`);
                        alert('Link copiado!');
                      }
                    }}
                    title="Compartilhar plano"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
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
            style={{ color: sectionColors.plans_arrow_color || undefined, backgroundColor: sectionColors.plans_arrow_bg || undefined, borderColor: sectionColors.plans_arrow_border || undefined }}
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
            style={{ color: sectionColors.plans_arrow_color || undefined, backgroundColor: sectionColors.plans_arrow_bg || undefined, borderColor: sectionColors.plans_arrow_border || undefined }}
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
              style={currentIndex === i && sectionColors.plans_dots_color ? { backgroundColor: sectionColors.plans_dots_color, borderColor: sectionColors.plans_dots_color } : undefined}
            />
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES DO PLANO (NOVO LAYOUT) */}
      {selectedPlanModal && (
        <div className={`plan-modal-overlay ${modalClosing ? 'closing' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="plan-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="plan-modal-close" onClick={closeModal}>×</button>
            
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
                    <img src={badge.icon_url} alt="icon" className="plan-modal-badge-img" loading="lazy" />
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
                              <img src={app.icon_url} alt={app.name} className="plan-modal-app-icon" loading="lazy" />
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
                            <span className="period">{selectedPlanModal.label_price_period || 'por mês'}</span>
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
                                      <img src={app.icon_url} alt={app.name} loading="lazy" />
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
                                if (!app) return null;
                                return (
                                  <div className="plan-modal-bonus-details animate-fade-in">
                                    <h5 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{app.name}</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{app.description || 'Benefício extra disponível para assinatura.'}</p>
                                  </div>
                                );
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
