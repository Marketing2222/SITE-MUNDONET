import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import '../styles/IndiqueGanhe.css';

interface Settings { [key: string]: { value: string; label: string } }

export const IndiqueGanhe = () => {
  const [s, setS] = useState<Settings>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`).then(r => r.json()).then(setS).catch(() => {});
  }, []);

  const g = (key: string, fallback = '') => s[key]?.value || fallback;

  return (
    <div className="ig-page">
      {/* Hero */}
      <section className="ig-hero" style={{ backgroundColor: g('ig_hero_bg', '#1a0533') }}>
        <div className="ig-hero-content">
          <span className="ig-badge" style={{ backgroundColor: g('ig_badge_bg', '#22c55e'), color: g('ig_badge_text_color', '#fff') }}>
            {g('ig_badge_text', 'INDIQUE E GANHE')}
          </span>
          <h1 style={{ color: g('ig_hero_title_color', '#fff') }}>
            {g('ig_hero_title', 'Indique a')} <span style={{ color: g('ig_hero_highlight_color', '#22c55e') }}>{g('ig_hero_highlight', 'Mundonet')}</span>{' '}
            {g('ig_hero_title_suffix', 'e ganhe recompensas!')}
          </h1>
          <p style={{ color: g('ig_hero_subtitle_color', '#a1a1aa') }}>
            {g('ig_hero_subtitle', 'Livres seus amigos da burocracia e da lentidão dos provedores tradicionais indicando a internet 100% fibra óptica da Mundonet!')}
          </p>
          <a href={g('ig_hero_btn_link', '#como-funciona')} className="ig-btn ig-btn-primary" style={{ backgroundColor: g('ig_hero_btn_bg', '#22c55e'), color: g('ig_hero_btn_color', '#fff') }}>
            {g('ig_hero_btn_text', 'Comece a Indicar')}
          </a>
        </div>
        <div className="ig-hero-image">
          <img src={g('ig_hero_image', 'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png')} alt="Indique e Ganhe" />
        </div>
      </section>

      {/* Como Funciona */}
      <section className="ig-steps" id="como-funciona" style={{ backgroundColor: g('ig_steps_bg', '#ffffff') }}>
        <div className="ig-container">
          <h2 style={{ color: g('ig_steps_title_color', '#1a0533') }}>{g('ig_steps_title', 'Veja como é fácil indicar')}</h2>
          <p className="ig-steps-subtitle" style={{ color: g('ig_steps_subtitle_color', '#64748b') }}>
            {g('ig_steps_subtitle', 'Em apenas 3 passos simples você começa a ganhar recompensas')}
          </p>
          <div className="ig-steps-grid">
            {[
              { num: '1', title: g('ig_step1_title', 'Crie seu link'), desc: g('ig_step1_desc', 'Acesse a área do Indique e Ganhe no app ou site da Mundonet e crie seu link personalizado.'), icon: g('ig_step1_icon', '🔗') },
              { num: '2', title: g('ig_step2_title', 'Compartilhe'), desc: g('ig_step2_desc', 'Envie seu link para amigos, familiares e conhecidos pelo WhatsApp, redes sociais ou qualquer canal.'), icon: g('ig_step2_icon', '📤') },
              { num: '3', title: g('ig_step3_title', 'Ganhe recompensas'), desc: g('ig_step3_desc', 'Quando seu indicado contratar, vocês dois ganham benefícios! É simples assim.'), icon: g('ig_step3_icon', '🎁') },
            ].map((step, i) => (
              <div key={i} className="ig-step-card" style={{ backgroundColor: g('ig_step_card_bg', '#f8fafc'), borderColor: g('ig_step_card_border', '#e2e8f0') }}>
                <div className="ig-step-icon" style={{ backgroundColor: g('ig_step_icon_bg', '#22c55e20'), color: g('ig_step_icon_color', '#22c55e') }}>
                  {step.icon}
                </div>
                <div className="ig-step-num" style={{ color: g('ig_step_num_color', '#22c55e') }}>{step.num}</div>
                <h3 style={{ color: g('ig_step_title_color', '#1a0533') }}>{step.title}</h3>
                <p style={{ color: g('ig_step_desc_color', '#64748b') }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que Indicar */}
      <section className="ig-benefits" style={{ backgroundColor: g('ig_benefits_bg', '#f0fdf4') }}>
        <div className="ig-container">
          <h2 style={{ color: g('ig_benefits_title_color', '#1a0533') }}>{g('ig_benefits_title', 'Por que indicar a Mundonet?')}</h2>
          <div className="ig-benefits-grid">
            {[
              { icon: g('ig_benefit1_icon', '🌐'), title: g('ig_benefit1_title', 'Internet de Verdade'), desc: g('ig_benefit1_desc', 'Fibra óptica 100% com velocidade real e estabilidade garantida.') },
              { icon: g('ig_benefit2_icon', '💰'), title: g('ig_benefit2_title', 'Preço Justo'), desc: g('ig_benefit2_desc', 'Planos a partir de R$ 39,90 sem taxas ocultas e sem surpresas na conta.') },
              { icon: g('ig_benefit3_icon', '⚡'), title: g('ig_benefit3_title', 'Instalação Rápida'), desc: g('ig_benefit3_desc', 'Instalação em até 48 horas com equipe técnica profissional.') },
              { icon: g('ig_benefit4_icon', '🎯'), title: g('ig_benefit4_title', 'Suporte Dedicado'), desc: g('ig_benefit4_desc', 'Suporte técnico rápido e eficiente quando você precisar.') },
            ].map((b, i) => (
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

      {/* Recompensas */}
      <section className="ig-rewards" style={{ backgroundColor: g('ig_rewards_bg', '#ffffff') }}>
        <div className="ig-container">
          <div className="ig-rewards-content">
            <div className="ig-rewards-text">
              <h2 style={{ color: g('ig_rewards_title_color', '#1a0533') }}>
                {g('ig_rewards_title', 'O que você ganha ao indicar?')}
              </h2>
              <p style={{ color: g('ig_rewards_desc_color', '#64748b') }}>
                {g('ig_rewards_desc', 'A cada amigo que contratar nossa internet, você acumula benefícios exclusivos. Quanto mais indicar, mais ganha!')}
              </p>
              <ul className="ig-rewards-list">
                {g('ig_rewards_item1', 'Descontos progressivos na mensalidade').split(',').map((item, i) => (
                  <li key={i} style={{ color: g('ig_rewards_item_color', '#374151') }}>
                    <span className="ig-check" style={{ color: g('ig_rewards_check_color', '#22c55e') }}>✓</span>
                    {item.trim()}
                  </li>
                ))}
              </ul>
              <a href={g('ig_rewards_btn_link', 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Indique%20e%20Ganhe%20da%20Mundonet.')} className="ig-btn ig-btn-primary" style={{ backgroundColor: g('ig_rewards_btn_bg', '#22c55e'), color: g('ig_rewards_btn_color', '#fff') }}>
                {g('ig_rewards_btn_text', 'Quero Participar')}
              </a>
            </div>
            <div className="ig-rewards-image">
              <img src={g('ig_rewards_image', 'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/globoplay1.png')} alt="Recompensas" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="ig-cta" style={{ backgroundColor: g('ig_cta_bg', '#1a0533') }}>
        <div className="ig-container">
          <h2 style={{ color: g('ig_cta_title_color', '#fff') }}>
            {g('ig_cta_title', 'Comece a indicar agora mesmo!')}
          </h2>
          <p style={{ color: g('ig_cta_desc_color', '#a1a1aa') }}>
            {g('ig_cta_desc', 'Junte-se a milhares de clientes que já estão ganhando com o Indique e Ganhe da Mundonet.')}
          </p>
          <a href={g('ig_cta_btn_link', 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20participar%20do%20Indique%20e%20Ganhe%20da%20Mundonet.')} className="ig-btn ig-btn-large" style={{ backgroundColor: g('ig_cta_btn_bg', '#22c55e'), color: g('ig_cta_btn_color', '#fff') }}>
            {g('ig_cta_btn_text', 'Indique e Ganhe Agora')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default IndiqueGanhe;
