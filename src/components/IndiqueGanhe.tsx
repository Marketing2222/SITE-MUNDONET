import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import '../styles/IndiqueGanhe.css';

interface Settings { [key: string]: { value: string; label: string } }
interface StepItem { icon: string; title: string; desc: string }
interface BenefitItem { icon: string; title: string; desc: string }
interface TestimonialItem { photo: string; name: string; company: string; text: string }
interface FaqItem { question: string; answer: string }
interface BrandItem { logo: string; name: string }

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

  const sectionStyle = (bgKey: string) => ({
    backgroundColor: g(bgKey, 'transparent'),
  });

  return (
    <div className="ig-page">
      <section className="ig-hero" style={{ backgroundColor: g('ig_hero_bg', '#1a0533') }}>
        <div className="ig-hero-content">
          <span className="ig-badge" style={{ backgroundColor: g('ig_badge_bg', '#22c55e'), color: g('ig_badge_text_color', '#fff') }}>
            {g('ig_badge_text', 'INDIQUE E GANHE')}
          </span>
          <h1 style={{ color: g('ig_hero_title_color', '#fff') }}>
            {g('ig_hero_title', 'Indique e Ganhe R$ 150')}
          </h1>
          <p className="ig-hero-subtitle" style={{ color: g('ig_hero_subtitle_color', '#a1a1aa') }}>
            {g('ig_hero_subtitle', 'Indique a Mundonet para seus amigos e ganhe R$ 150 em Gift-Card a cada nova contratação!')}
          </p>
          <div className="ig-hero-actions">
            <a href={g('ig_hero_btn_link', '#como-funciona')} className="ig-btn ig-btn-primary" style={{ backgroundColor: g('ig_hero_btn_bg', '#22c55e'), color: g('ig_hero_btn_color', '#fff') }}>
              {g('ig_hero_btn_text', 'Indique Agora')}
            </a>
          </div>
          <p className="ig-hero-footnote" style={{ color: g('ig_hero_subtitle_color', '#a1a1aa') }}>
            {g('ig_hero_footnote', '* R$ 150 em Gift-Card para gastar em diversas lojas')}
          </p>
        </div>
        <div className="ig-hero-image">
          <img src={g('ig_hero_image', 'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png')} alt="Indique e Ganhe" />
        </div>
      </section>

      {brands.length > 0 && (
        <section className="ig-brands">
          <div className="ig-brands-track">
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="ig-brand-item">
                {brand.logo ? <img src={brand.logo} alt={brand.name} /> : <span>{brand.name}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="como-funciona" className="ig-steps" style={sectionStyle('ig_steps_bg')}>
        <div className="ig-container">
          <h2 style={{ color: g('ig_steps_title_color', '#1a0533') }}>{g('ig_steps_title', 'Veja como é fácil indicar')}</h2>
          <p className="ig-section-subtitle" style={{ color: g('ig_steps_subtitle_color', '#64748b') }}>
            {g('ig_steps_subtitle', 'Em apenas 3 passos simples você começa a ganhar')}
          </p>
          <div className="ig-steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="ig-step-card" style={{ backgroundColor: g('ig_step_card_bg', '#f8fafc'), borderColor: g('ig_step_card_border', '#e2e8f0') }}>
                <div className="ig-step-icon" style={{ backgroundColor: g('ig_step_icon_bg', '#22c55e20'), color: g('ig_step_icon_color', '#22c55e') }}>
                  {step.icon}
                </div>
                <div className="ig-step-num" style={{ color: g('ig_step_num_color', '#22c55e') }}>{i + 1}</div>
                <h3 style={{ color: g('ig_step_title_color', '#1a0533') }}>{step.title}</h3>
                <p style={{ color: g('ig_step_desc_color', '#64748b') }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ig-calculator" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="ig-container ig-calc-inner">
          <h2 style={{ color: '#1a0533' }}>{g('ig_calc_title', 'Quanto eu posso ganhar?')}</h2>
          <div className="ig-calc-box">
            <div className="ig-calc-slider-area">
              <p className="ig-calc-label">Número de indicações</p>
              <input type="range" min={1} max={50} value={calcValue} onChange={e => setCalcValue(Number(e.target.value))}
                className="ig-calc-slider" />
              <div className="ig-calc-value-display">
                <span className="ig-calc-indications">{calcValue} {calcValue === 1 ? 'indicação' : 'indicações'}</span>
              </div>
            </div>
            <div className="ig-calc-result">
              <span className="ig-calc-result-label">Você vai ganhar</span>
              <span className="ig-calc-result-value">R$ {total.toLocaleString('pt-BR')}</span>
              <span className="ig-calc-result-note">em Gift-Cards</span>
            </div>
          </div>
          <p className="ig-calc-note" style={{ color: '#64748b' }}>
            {g('ig_calc_note', 'Gift-Card para gastar em diversas lojas')}
          </p>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="ig-benefits" style={sectionStyle('ig_benefits_bg')}>
          <div className="ig-container">
            <h2 style={{ color: g('ig_benefits_title_color', '#1a0533') }}>{g('ig_benefits_title', 'Por que indicar a Mundonet?')}</h2>
            <div className="ig-benefits-grid">
              {benefits.map((b, i) => (
                <div key={i} className="ig-benefit-card" style={{ backgroundColor: g('ig_benefit_card_bg', '#ffffff'), borderColor: g('ig_benefit_card_border', '#dcfce7') }}>
                  <div className="ig-benefit-icon" style={{ backgroundColor: g('ig_benefit_icon_bg', '#22c55e20'), color: g('ig_benefit_icon_color', '#22c55e') }}>
                    {b.icon}
                  </div>
                  <h3 style={{ color: g('ig_benefit_title_color', '#1a0533') }}>{b.title}</h3>
                  <p style={{ color: g('ig_benefit_desc_color', '#64748b') }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="ig-testimonials" style={{ backgroundColor: '#ffffff' }}>
          <div className="ig-container">
            <h2 style={{ color: '#1a0533' }}>O que dizem nossos indicadores</h2>
            <div className="ig-testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="ig-testimonial-card">
                  <div className="ig-testimonial-header">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="ig-testimonial-photo" />
                    ) : (
                      <div className="ig-testimonial-photo ig-testimonial-photo-placeholder">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <strong style={{ color: '#1a0533' }}>{t.name}</strong>
                      <span style={{ color: '#64748b', fontSize: 13 }}>{t.company}</span>
                    </div>
                  </div>
                  <p style={{ color: '#374151' }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="ig-faq" style={{ backgroundColor: '#f8fafc' }}>
          <div className="ig-container">
            <h2 style={{ color: '#1a0533' }}>Perguntas Frequentes</h2>
            <div className="ig-faq-list">
              {faq.map((item, i) => (
                <div key={i} className={`ig-faq-item ${openFaq === i ? 'ig-faq-open' : ''}`}>
                  <button className="ig-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.question}</span>
                    <span className="ig-faq-icon">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <div className="ig-faq-answer" style={{ maxHeight: openFaq === i ? 500 : 0 }}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ig-cta" style={{
        background: g('ig_cta_image') ? `url(${g('ig_cta_image')}) center/cover no-repeat` : g('ig_cta_bg', '#1a0533'),
        position: 'relative'
      }}>
        {g('ig_cta_overlay', 'true') === 'true' && (
          <div className="ig-cta-overlay" style={{ backgroundColor: g('ig_cta_bg', '#1a0533') }} />
        )}
        <div className="ig-container ig-cta-content">
          <h2 style={{ color: g('ig_cta_title_color', '#fff') }}>
            {g('ig_cta_title', 'Comece a indicar agora mesmo!')}
          </h2>
          <p style={{ color: g('ig_cta_desc_color', '#a1a1aa') }}>
            {g('ig_cta_desc', 'Junte-se a milhares de clientes que já estão ganhando com o Indique e Ganhe da Mundonet.')}
          </p>
          <a href={g('ig_cta_btn_link', '#')} className="ig-btn ig-btn-large" style={{ backgroundColor: g('ig_cta_btn_bg', '#22c55e'), color: g('ig_cta_btn_color', '#fff') }}>
            {g('ig_cta_btn_text', 'Indique e Ganhe Agora')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default IndiqueGanhe;
