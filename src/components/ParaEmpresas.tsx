import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import '../styles/ParaEmpresas.css';

interface Settings { [key: string]: { value: string; label: string } }
interface Plan { id?: number; name: string; speed: string; price: string; highlight: string; highlight_icon: string; button_text: string; whatsapp_msg: string; features: string[]; popular: boolean; active: boolean; sort_order: number; card_bg_color: string; card_text_color: string; button_bg_color: string; button_text_color: string; }
interface ListItem { icon: string; title: string; desc: string; }

const parseList = (val: string): ListItem[] => {
  if (!val) return [];
  try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : []; } catch { return []; }
};

const DEFAULT_BENEFITS: ListItem[] = [
  { icon: '📈', title: 'Planos flexíveis', desc: 'Opções que crescem com seu negócio.' },
  { icon: '🌐', title: 'Conectividade total', desc: 'Alta performance para toda a empresa.' },
  { icon: '🛡️', title: 'Suporte 24/7', desc: 'Atendimento especializado.' },
  { icon: '🔒', title: 'Segurança', desc: 'Proteção dos dados corporativos.' },
];

const DEFAULT_SERVICES: ListItem[] = [
  { icon: '📥', title: 'Download/Upload garantido', desc: 'Velocidade simétrica garantida.' },
  { icon: '🌐', title: 'IP Dedicado', desc: 'IP exclusivo para sua empresa.' },
  { icon: '🛡️', title: 'Segurança de Rede', desc: 'Firewall e proteção avançada.' },
  { icon: '🔗', title: 'Intranet', desc: 'Rede interna exclusiva.' },
  { icon: '🔐', title: 'VPN Corporativa', desc: 'Conexão criptografada e segura.' },
  { icon: '☁️', title: 'Backup em Nuvem', desc: 'Solução escalável e confiável.' },
];

export const ParaEmpresas = () => {
  const [s, setS] = useState<Settings>({});
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`).then(r => r.json()).then(setS).catch(() => {});
    fetch(`${API_BASE_URL}/api/enterprise-plans`).then(r => r.json()).then(setPlans).catch(() => {});
  }, []);

  const g = (key: string, fallback = '') => s[key]?.value || fallback;

  const benefits = parseList(g('emp_benefits_items', '[]'));
  const benefitsList = benefits.length > 0 ? benefits : DEFAULT_BENEFITS;
  const services = parseList(g('emp_services_items', '[]'));
  const servicesList = services.length > 0 ? services : DEFAULT_SERVICES;
  const heroHeight = g('emp_hero_height', '600');
  const pageBg = g('emp_page_bg', '');
  const activePlans = plans.filter(p => p.active);

  return (
    <div className="emp-page" style={pageBg ? { backgroundColor: pageBg } : undefined}>
      {/* Hero */}
      <section className="emp-hero" style={{ backgroundColor: g('emp_hero_bg', '#1a0533'), minHeight: heroHeight + 'px' }}>
        <div className="emp-hero-content">
          <h1 style={{ color: g('emp_hero_title_color', '#fff') }}>{g('emp_hero_title', 'Conectividade corporativa de alto nível')}</h1>
          <p style={{ color: g('emp_hero_subtitle_color', '#a1a1aa') }}>{g('emp_hero_subtitle', 'Soluções de internet dedicadas para empresas que precisam de performance, segurança e suporte especializado.')}</p>
          <div className="emp-hero-buttons">
            <a href={g('emp_hero_btn1_link', '#')} className="emp-btn emp-btn-primary" style={{ backgroundColor: g('emp_hero_btn1_bg', '#22c55e'), color: g('emp_hero_btn1_color', '#fff') }}>
              {g('emp_hero_btn1_text', 'Fale Conosco')}
            </a>
            <a href={g('emp_hero_btn2_link', '#emp-planos')} className="emp-btn emp-btn-outline" style={{ backgroundColor: g('emp_hero_btn2_bg', 'rgba(255,255,255,0.15)'), color: g('emp_hero_btn2_color', '#fff') }}>
              {g('emp_hero_btn2_text', 'Ver Planos')}
            </a>
          </div>
        </div>
        <div className="emp-hero-image">
          <img src={g('emp_hero_image', 'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png')} alt="Para Empresas" />
        </div>
      </section>

      {/* Planos */}
      {g('emp_plans_enabled', 'true') !== 'false' && (
        <section id="emp-planos" className="emp-plans" style={{
          ...(g('emp_plans_bg') ? { backgroundColor: g('emp_plans_bg') } : {}),
          ...(g('emp_plans_padding') ? { padding: g('emp_plans_padding') + 'px 0' } : {}),
        }}>
          <div className="emp-container">
            <h2 style={{ color: g('emp_plans_title_color', '#1a0533') }}>{g('emp_plans_title', 'Planos sob medida para sua empresa')}</h2>
            <p className="emp-section-sub" style={{ color: g('emp_plans_subtitle_color', '#64748b') }}>{g('emp_plans_subtitle', 'Temos soluções para qualquer que seja sua necessidade')}</p>

            {activePlans.length > 0 ? (
              <div className="emp-plans-grid">
                {activePlans.map(plan => (
                  <div key={plan.id} className="emp-plan-card" style={{
                    backgroundColor: plan.card_bg_color || '#ffffff',
                    color: plan.card_text_color || '#1a0533'
                  }}>
                    {plan.popular && <div className="emp-plan-badge">⭐ Mais Popular</div>}
                    <div className="emp-plan-icon">{plan.highlight_icon || '🏢'}</div>
                    <h3>{plan.name}</h3>
                    <div className="emp-plan-speed">{plan.speed} Mbps</div>
                    <div className="emp-plan-price" style={{ color: plan.card_text_color === '#ffffff' ? '#22c55e' : '#005CFF' }}>
                      {plan.price === 'Sob Consulta' ? 'Sob Consulta' : `R$ ${plan.price}/mês`}
                    </div>
                    <p className="emp-plan-highlight">{plan.highlight}</p>
                    <ul className="emp-plan-features">
                      {plan.features?.map((f, i) => (
                        <li key={i} style={{ color: plan.card_text_color || '#374151' }}>
                          <span className="emp-check" style={{ color: plan.card_text_color === '#ffffff' ? '#22c55e' : '#005CFF' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <a href={`https://api.whatsapp.com/send?phone=559830420030&text=${encodeURIComponent(plan.whatsapp_msg || `Olá! Quero saber mais sobre ${plan.name}.`)}`}
                      target="_blank" rel="noreferrer" className="emp-plan-btn"
                      style={{ backgroundColor: plan.button_bg_color || '#005CFF', color: plan.button_text_color || '#fff' }}>
                      {plan.button_text || 'CONSULTAR'}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emp-plans-empty">
                <p style={{ color: g('emp_plans_title_color', '#1a0533'), fontSize: 17, margin: '0 0 20px' }}>
                  {g('emp_plans_empty_text', 'Em dúvida do plano ideal ou gostaria de personalizar seu plano?')}
                </p>
                <a href={g('emp_plans_empty_btn_link', 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20planos%20empresariais.')}
                  target="_blank" rel="noreferrer" className="emp-btn"
                  style={{ backgroundColor: g('emp_plans_empty_btn_bg', '#005CFF'), color: g('emp_plans_empty_btn_color', '#fff') }}>
                  {g('emp_plans_empty_btn_text', 'Consultar um especialista')}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Benefícios - lado a lado */}
      <section className="emp-benefits" style={{
        ...(g('emp_benefits_bg') ? { backgroundColor: g('emp_benefits_bg') } : {}),
        ...(g('emp_benefits_padding') ? { padding: g('emp_benefits_padding') + 'px 0' } : {}),
      }}>
        <div className="emp-container">
          <h2 style={{ color: g('emp_benefits_title_color', '#1a0533') }}>{g('emp_benefits_title', 'Benefícios e vantagens para sua empresa')}</h2>
          <div className="emp-benefits-grid">
            {benefitsList.map((b, i) => (
              <div key={i} className="emp-benefit-card" style={{ backgroundColor: g('emp_benefit_card_bg', '#ffffff'), borderColor: g('emp_benefit_card_border', '#e2e8f0') }}>
                <div className="emp-benefit-icon" style={{ backgroundColor: g('emp_benefit_icon_bg', '#005CFF20'), color: g('emp_benefit_icon_color', '#005CFF') }}>{b.icon}</div>
                <h3 style={{ color: g('emp_benefit_title_color', '#1a0533') }}>{b.title}</h3>
                <p style={{ color: g('emp_benefit_desc_color', '#64748b') }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços - lado a lado */}
      <section className="emp-services" style={{
        ...(g('emp_services_bg') ? { backgroundColor: g('emp_services_bg') } : {}),
        ...(g('emp_services_padding') ? { padding: g('emp_services_padding') + 'px 0' } : {}),
      }}>
        <div className="emp-container">
          <h2 style={{ color: g('emp_services_title_color', '#1a0533') }}>{g('emp_services_title', 'Serviços dedicados e exclusivos')}</h2>
          <p className="emp-section-sub" style={{ color: g('emp_services_subtitle_color', '#64748b') }}>{g('emp_services_subtitle', 'Serviços disponíveis em nossos planos empresariais')}</p>
          <div className="emp-services-grid">
            {servicesList.map((svc, i) => (
              <div key={i} className="emp-service-card" style={{ backgroundColor: g('emp_service_card_bg', '#ffffff'), borderColor: g('emp_service_card_border', '#dbeafe') }}>
                <div className="emp-service-icon" style={{ backgroundColor: g('emp_service_icon_bg', '#005CFF20'), color: g('emp_service_icon_color', '#005CFF') }}>{svc.icon}</div>
                <h3 style={{ color: g('emp_service_title_color', '#1a0533') }}>{svc.title}</h3>
                <p style={{ color: g('emp_service_desc_color', '#64748b') }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="emp-cta" style={{
        ...(g('emp_cta_bg') ? { backgroundColor: g('emp_cta_bg') } : {}),
        ...(g('emp_cta_padding') ? { padding: g('emp_cta_padding') + 'px 0' } : {}),
      }}>
        <div className="emp-container">
          <h2 style={{ color: g('emp_cta_title_color', '#fff') }}>{g('emp_cta_title', 'Faça parte deste movimento, assine um plano empresarial!')}</h2>
          <p style={{ color: g('emp_cta_desc_color', '#a1a1aa') }}>{g('emp_cta_desc', 'Soluções completas em conectividade para impulsionar o seu negócio.')}</p>
          <a href={g('emp_cta_btn_link', 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20contratar%20um%20plano%20empresarial.')}
            target="_blank" rel="noreferrer" className="emp-btn emp-btn-large" style={{ backgroundColor: g('emp_cta_btn_bg', '#22c55e'), color: g('emp_cta_btn_color', '#fff') }}>
            {g('emp_cta_btn_text', 'Fale com nosso time')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default ParaEmpresas;
