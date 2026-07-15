import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';
import '../styles/IndiqueGanhe.css';

interface Settings { [key: string]: { value: string; label: string } }
interface StepItem { icon: string; title: string; desc: string }
interface BenefitItem { icon: string; title: string; desc: string }
interface TestimonialItem { photo: string; name: string; company: string; text: string }
interface FaqItem { question: string; answer: string }
interface BrandItem { logo: string; name: string }

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const AnimatedCounter = ({ target, suffix = '', color }: { target: string; suffix?: string; color?: string }) => {
  const { ref, visible } = useInView(0.3);
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
  const prefix = target.match(/^[^0-9]*/)?.[0] || '';
  const suffixPart = target.match(/[^0-9.]*$/)?.[0] || '';
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible || isNaN(numericPart)) { setCount(isNaN(numericPart) ? 0 : numericPart); return; }
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericPart * 10) / 10);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, numericPart]);

  const displayValue = numericPart >= 1000 ? Math.round(count).toLocaleString('pt-BR') : count % 1 !== 0 ? count.toFixed(1) : Math.round(count).toString();

  return (
    <div ref={ref} className="ig-about-stat-number" style={{ color: color || '#007DFF' }}>
      <span className={visible ? 'ig-counter-animated' : ''}>{prefix}{displayValue}{suffix || suffixPart}</span>
    </div>
  );
};

export const IndiqueGanhe = () => {
  const [s, setS] = useState<Settings>({});
  const [calcValue, setCalcValue] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`).then(r => r.json()).then(setS).catch(() => {});
  }, []);

  const g = (key: string, fallback = '') => s[key]?.value || fallback;
  const parseJson = <T,>(key: string, fallback: T): T => {
    try { return JSON.parse(g(key, JSON.stringify(fallback))); } catch { return fallback; }
  };
  const vis = (section: string, mobile = false) => {
    const key = mobile ? `ig_vis_${section}_mobile` : `ig_vis_${section}`;
    return g(key, 'true') === 'true';
  };

  const steps: StepItem[] = parseJson('ig_steps_items', [
    { icon: '🔗', title: 'Gere seu link', desc: 'Em poucos cliques, crie seu link de indicação.' },
    { icon: '📤', title: 'Compartilhe', desc: 'Envie para amigos e familiares.' },
    { icon: '🎁', title: 'Receba seu prêmio', desc: 'Ganhe R$ 150 em Gift-Card por indicação.' },
  ]);
  const benefits: BenefitItem[] = parseJson('ig_benefits_items', []);
  const testimonials: TestimonialItem[] = parseJson('ig_testimonials_items', []);
  const faq: FaqItem[] = parseJson('ig_faq_items', []);
  const brands: BrandItem[] = parseJson('ig_brands_items', []);

  const amountPer = parseInt(g('ig_calc_value_per', '150'));
  const total = calcValue * amountPer;

  const secP = (key: string, fallback = '') => { const val = g(key, ''); return val ? `${val}px 0` : fallback; };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => { const h = () => setIsMobile(window.innerWidth <= 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const show = (section: string) => vis(section, isMobile);

  const useGradient = g('ig_page_gradient', 'false') === 'true';
  const gradAngle = g('ig_page_gradient_angle', '180');
  const gradC1 = g('ig_page_gradient_color1', '#e3f8ff');
  const gradC2 = g('ig_page_gradient_color2', '#ffffff');
  const gradC3 = g('ig_page_gradient_color3', '#f0f9ff');
  const gradCss = useGradient ? `linear-gradient(${gradAngle}deg, ${gradC1} 0%, ${gradC2} 50%, ${gradC3} 100%)` : undefined;
  const secBg = (ownColor: string) => useGradient ? 'transparent' : ownColor;

  return (
    <div className="ig-page" style={useGradient ? { background: gradCss, minHeight: '100vh' } : undefined}>
      {show('hero') && (
        <section className="ig-hero" style={{
          backgroundColor: g('ig_hero_bg', '#1a0533'),
          backgroundImage: !isMobile && g('ig_hero_banner') ? `url(${g('ig_hero_banner')})` : undefined,
          backgroundSize: !isMobile ? 'cover' : undefined,
          backgroundPosition: !isMobile ? 'center' : undefined,
          padding: isMobile ? '0' : secP('ig_hero_padding', '120px 24px 100px'),
          minHeight: isMobile ? undefined : (g('ig_hero_height') || undefined),
        }}>
          {isMobile && g('ig_hero_banner') && (
            <img src={g('ig_hero_banner')} alt="" className="ig-hero-mobile-img" />
          )}
          {g('ig_hero_overlay', 'true') === 'true' && g('ig_hero_banner') && (
            <div className="ig-hero-overlay" style={{
              background: `linear-gradient(to right, ${g('ig_hero_overlay_color', 'rgba(0,20,60,0.7)')} 0%, transparent 100%)`,
            }} />
          )}
          <div className="ig-container">
            {g('ig_hero_show_text', 'true') === 'true' && (
            <div className="ig-hero-content-left">
              <span className="ig-badge" style={{ backgroundColor: g('ig_badge_bg', '#22c55e'), color: g('ig_badge_text_color', '#fff') }}>{g('ig_badge_text', 'INDIQUE E GANHE')}</span>
              <h1 style={{ color: g('ig_hero_title_color', '#fff') }}>{g('ig_hero_title', 'Indique e Ganhe R$ 150')}</h1>
              <p className="ig-hero-subtitle" style={{ color: g('ig_hero_subtitle_color', '#a1a1aa') }}>{g('ig_hero_subtitle', 'Indique a Mundonet para seus amigos e ganhe R$ 150 em Gift-Card a cada nova contratação!')}</p>
              <div className="ig-hero-actions">
                <a href={g('ig_hero_btn_link', '#como-funciona')} className="ig-btn ig-btn-primary" style={{ backgroundColor: g('ig_hero_btn_bg', '#22c55e'), color: g('ig_hero_btn_color', '#fff') }}>{g('ig_hero_btn_text', 'Indique Agora')}</a>
              </div>
              <p className="ig-hero-footnote" style={{ color: g('ig_hero_subtitle_color', '#a1a1aa') }}>{g('ig_hero_footnote', '* R$ 150 em Gift-Card para gastar em diversas lojas')}</p>
            </div>
            )}
          </div>
        </section>
      )}

      {show('brands') && brands.length > 0 && (
        <section className="ig-brands" style={useGradient ? { background: 'transparent' } : undefined}>
          <div className="ig-brands-track">
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="ig-brand-item">
                {brand.logo ? <img src={brand.logo} alt={brand.name} /> : <span>{brand.name}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {show('steps') && (
        <section id="como-funciona" className="ig-steps" style={{ backgroundColor: secBg(g('ig_steps_bg', '#ffffff')), padding: secP('ig_steps_padding', '100px 0') }}>
          <div className="ig-container">
            <h2 style={{ color: g('ig_steps_title_color', '#1a0533') }}>{g('ig_steps_title', 'Veja como é fácil indicar')}</h2>
            <p className="ig-section-subtitle" style={{ color: g('ig_steps_subtitle_color', '#64748b') }}>{g('ig_steps_subtitle', 'Em apenas 3 passos simples você começa a ganhar')}</p>
            <div className="ig-steps-grid-wrap">
              <div className="ig-steps-grid">
              {steps.map((step, i) => (
                <div key={i} className="ig-step-card" style={{ backgroundColor: g('ig_step_card_bg', '#f8fafc'), borderColor: g('ig_step_card_border', '#e2e8f0') }}>
                  <div className="ig-step-icon" style={{ backgroundColor: g('ig_step_icon_bg', '#22c55e20'), color: g('ig_step_icon_color', '#22c55e') }}>{step.icon}</div>
                  <div className="ig-step-num" style={{ color: g('ig_step_num_color', '#22c55e') }}>{i + 1}</div>
                  <h3 style={{ color: g('ig_step_title_color', '#1a0533') }}>{step.title}</h3>
                  <p style={{ color: g('ig_step_desc_color', '#64748b') }}>{step.desc}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {show('calc') && (
        <section className="ig-calc-section" style={{ padding: secP('ig_calc_padding', '80px 0') }}>
          <div className="ig-calc-wrapper" style={{ background: g('ig_calc_bg_color', 'linear-gradient(97deg, #e3f8ff 0%, #deefff 27.6%, #d2e6ff 48.96%, #daf2ff 86.46%, #d4fcf8 100%)'), borderRadius: g('ig_calc_border_radius', '32px') }}>
            <div className="ig-calc-left">
              <h2>{g('ig_calc_title', 'Quanto eu posso ganhar?')}</h2>
              <p className="ig-calc-subtitle">{g('ig_calc_subtitle', 'Selecione o número de indicações:')}</p>
              <div className="ig-calc-badge" style={{ backgroundColor: g('ig_calc_slider_color', '#007DFF') }}>
                <span>{calcValue} {g('ig_calc_badge_text', 'indicações')}</span>
              </div>
              <input type="range" min={1} max={50} value={calcValue} onChange={e => setCalcValue(Number(e.target.value))} className="ig-calc-range" style={{ '--slider-color': g('ig_calc_slider_color', '#007DFF') } as React.CSSProperties} />
              <div className="ig-calc-btn-wrap">
                <a href={g('ig_calc_btn_link', '#')} className="ig-calc-cta-btn" style={{ background: g('ig_calc_slider_color', '#007DFF') }}>
                  {g('ig_calc_btn_text', 'Começar a indicar')} <span>→</span>
                </a>
              </div>
            </div>
            <div className="ig-calc-right" style={{ background: g('ig_calc_result_bg', 'linear-gradient(61deg, #006FF9 -23.69%, #0092FF 19.37%, #00C4FE 62.42%, #00CED1 105.48%)') }}>
              <span className="ig-calc-result-label" style={{ color: g('ig_calc_result_color', '#ffffff') }}>Você vai ganhar</span>
              <span className="ig-calc-result-value" style={{ color: g('ig_calc_value_color', '#007DFF') }}>R$ {total.toLocaleString('pt-BR')}</span>
              <span className="ig-calc-result-note" style={{ color: g('ig_calc_result_color', '#ffffff') }}>{g('ig_calc_note', 'em Gift-Card para gastar em diversas lojas')}</span>
            </div>
          </div>
        </section>
      )}

      {show('about') && (
        <section className="ig-about" style={{ background: useGradient ? 'transparent' : g('ig_about_bg', 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)') }}>
          <div className="ig-container">
            <h2 className="ig-about-title">{g('ig_about_title', 'Ainda não conhece a Mundonet?')}</h2>
            <p className="ig-about-desc" style={{ color: g('ig_about_desc_color', '#374151') }}>{g('ig_about_desc', 'Somos uma empresa de internet fibra óptica com tecnologia Wi-Fi 6 de ponta, conectando você ao mundo com velocidade real.')}</p>
            <div className="ig-about-stats">
              {[
                { num: g('ig_about_stat1_number', '50.000+'), label: g('ig_about_stat1_label', 'Clientes ativos') },
                { num: g('ig_about_stat2_number', '99.9%'), label: g('ig_about_stat2_label', 'Uptime garantido') },
                { num: g('ig_about_stat3_number', '24h'), label: g('ig_about_stat3_label', 'Instalação') },
                { num: g('ig_about_stat4_number', '4.9'), label: g('ig_about_stat4_label', 'Nota no Google') },
              ].map((stat, i) => (
                <div key={i} className="ig-about-stat-card">
                  <AnimatedCounter target={stat.num} color={g('ig_about_stat_color', '#007DFF')} />
                  <span className="ig-about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {show('benefits') && benefits.length > 0 && (
        <section className="ig-benefits" style={{ backgroundColor: secBg(g('ig_benefits_bg', '#f0fdf4')), padding: secP('ig_benefits_padding', '100px 0') }}>
          <div className="ig-container">
            <h2 style={{ color: g('ig_benefits_title_color', '#1a0533') }}>{g('ig_benefits_title', 'Por que indicar a Mundonet?')}</h2>
            <div className="ig-benefits-grid-wrap">
              <div className="ig-benefits-grid">
              {benefits.map((b, i) => (
                <div key={i} className="ig-benefit-card" style={{ backgroundColor: g('ig_benefit_card_bg', '#ffffff'), borderColor: g('ig_benefit_card_border', '#dcfce7') }}>
                  <div className="ig-benefit-icon" style={{ backgroundColor: g('ig_benefit_icon_bg', '#22c55e20'), color: g('ig_benefit_icon_color', '#22c55e') }}>{b.icon}</div>
                  <h3 style={{ color: g('ig_benefit_title_color', '#1a0533') }}>{b.title}</h3>
                  <p style={{ color: g('ig_benefit_desc_color', '#64748b') }}>{b.desc}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {show('testimonials') && testimonials.length > 0 && (
        <section className="ig-testimonials" style={{ backgroundColor: useGradient ? 'transparent' : '#ffffff', padding: secP('ig_testimonials_padding', '100px 0') }}>
          <div className="ig-container">
            <h2>O que dizem nossos indicadores</h2>
            <div className="ig-testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="ig-testimonial-card">
                  <div className="ig-testimonial-header">
                    {t.photo ? <img src={t.photo} alt={t.name} className="ig-testimonial-photo" /> : <div className="ig-testimonial-photo ig-testimonial-photo-placeholder">{t.name.charAt(0)}</div>}
                    <div><strong style={{ color: '#1a0533' }}>{t.name}</strong><span style={{ color: '#64748b', fontSize: 13 }}>{t.company}</span></div>
                  </div>
                  <p style={{ color: '#374151' }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {show('faq') && faq.length > 0 && (
        <section className="ig-faq" style={{ backgroundColor: useGradient ? 'transparent' : g('ig_faq_bg', '#f8fafc'), padding: secP('ig_faq_padding', '100px 0') }}>
          <div className="ig-container">
            <h2 style={{ color: g('ig_faq_title_color', '#1a0533') }}>Dúvidas Frequentes</h2>
            <div className="ig-faq-grid">
              {faq.map((item, i) => (
                <div key={i} className={`ig-faq-item ${openFaq === i ? 'ig-faq-open' : ''}`} style={{ backgroundColor: g('ig_faq_card_bg', '#fff'), borderColor: g('ig_faq_border') || undefined }}>
                  <button className="ig-faq-question" style={{ color: g('ig_faq_question_color', '#1a0533') }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.question}</span>
                    <span className="ig-faq-icon" style={{ color: g('ig_faq_icon_color', '#22c55e') }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <div className="ig-faq-answer" style={{ maxHeight: openFaq === i ? 500 : 0 }}>
                    <p style={{ color: g('ig_faq_answer_color', '#64748b') }}>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {show('cta') && (
        <section className="ig-cta" style={{
          background: g('ig_cta_image') ? `url(${g('ig_cta_image')}) center/cover no-repeat` : g('ig_cta_bg', '#1a0533'),
          padding: secP('ig_cta_padding', '100px 0'),
          position: 'relative',
        }}>
          {g('ig_cta_overlay', 'true') === 'true' && <div className="ig-cta-overlay" style={{ backgroundColor: g('ig_cta_bg', '#1a0533') }} />}
          <div className="ig-container ig-cta-content">
            <h2 style={{ color: g('ig_cta_title_color', '#fff') }}>{g('ig_cta_title', 'Comece a indicar agora mesmo!')}</h2>
            <p style={{ color: g('ig_cta_desc_color', '#a1a1aa') }}>{g('ig_cta_desc', 'Junte-se a milhares de clientes que já estão ganhando com o Indique e Ganhe da Mundonet.')}</p>
            <a href={g('ig_cta_btn_link', '#')} className="ig-btn ig-btn-large" style={{ backgroundColor: g('ig_cta_btn_bg', '#22c55e'), color: g('ig_cta_btn_color', '#fff') }}>{g('ig_cta_btn_text', 'Indique e Ganhe Agora')}</a>
          </div>
        </section>
      )}
    </div>
  );
};

export default IndiqueGanhe;
