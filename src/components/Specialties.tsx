import { useState, useEffect } from 'react';
import '../styles/Specialties.css';
import { API_BASE_URL } from '../config/api';

export const Specialties: React.FC = () => {
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

  const renderIcon = (iconStr: string | undefined, defaultSvg: React.ReactNode) => {
    if (!iconStr) return defaultSvg;
    if (iconStr.trim().startsWith('<svg')) {
      return <div dangerouslySetInnerHTML={{ __html: iconStr }} />;
    }
    return <span style={{ fontSize: '1.5em' }}>{iconStr}</span>;
  };

  return (
    <section id="aplicativos" className="specialties-section">
      {/* Link Dedicado Area */}
      <div className="dedicated-bar section-padding">
        <div className="container dedicated-grid">
          <div className="dedicated-content animate-slide-up">
            <span className="specialty-badge">{s.corp_subtitle || 'Soluções Corporativas'}</span>
            <h2>{s.corp_title || 'Link Dedicado para sua Empresa'}</h2>
            <p dangerouslySetInnerHTML={{ __html: s.corp_desc || 'Conexão exclusiva com 100% de garantia de banda de download e upload, IP fixo e monitoramento 24h. Ideal para negócios que precisam de segurança extrema, estabilidade máxima e atendimento prioritário.' }}></p>
            <div className="dedicated-features">
              <div className="d-feat-item">
                <div className="d-feat-icon">
                  {renderIcon(s.corp_feat1_icon, 
                    <svg viewBox="0 0 512 512" width="16" height="16">
                      <path fill="currentColor" d="M432 320H80a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h352a16 16 0 0 1 16 16v224a16 16 0 0 1-16 16zM32 416h448c17.67 0 32-14.33 32-32s-14.33-32-32-32H32c-17.67 0-32 14.33-32 32s14.33 32 32 32z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h4>{s.corp_feat1_title || 'Garantia de 100% de Banda'}</h4>
                  <p>{s.corp_feat1_desc || 'Velocidades simétricas reais para sua rede corporativa.'}</p>
                </div>
              </div>
              <div className="d-feat-item">
                <div className="d-feat-icon">
                  {renderIcon(s.corp_feat2_icon,
                    <svg viewBox="0 0 512 512" width="16" height="16">
                      <path fill="currentColor" d="M464 256c0-114.87-93.13-208-208-208S48 141.13 48 256s93.13 208 208 208 208-93.13 208-208zm-224 80V128h32v208h-32z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h4>{s.corp_feat2_title || 'Suporte SLA 24/7/365'}</h4>
                  <p>{s.corp_feat2_desc || 'Tempo de resposta imediato para sua empresa não parar.'}</p>
                </div>
              </div>
            </div>
            <a 
              href={s.corp_btn_link || "https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informações%20sobre%20o%20Link%20Dedicado."} 
              target="_blank" 
              rel="noreferrer" 
              className="specialty-btn primary"
            >
              {s.corp_btn_text || 'FALAR COM UM CONSULTOR'}
            </a>
          </div>
          <div className="dedicated-visual animate-zoom-in">
            <div className="visual-card">
              <div className="speed-dial">
                <div className="speed-val">{s.corp_speed_val || '100%'}</div>
                <div className="speed-lbl">{s.corp_speed_lbl || 'Disponibilidade'}</div>
              </div>
              <div className="dial-line"></div>
              <p>{s.corp_speed_desc || 'Fibra óptica ponta a ponta com redundância ativa.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wi-Fi 6 ZTE AX3000 Section */}
      <div className="wifi-bar section-padding">
        <div className="container wifi-grid">
          <div className="wifi-image animate-fade-in">
            <img 
              src={s.wifi_image || "https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/ax3000-da-zte-1-scaled.jpg"} 
              alt="Roteador Wi-Fi 6" 
              className="router-img"
            />
          </div>
          <div className="wifi-content animate-slide-up">
            <span className="specialty-badge accent">{s.wifi_subtitle || 'Ultra Wi-Fi 6'}</span>
            <h2>{s.wifi_title || 'Experimente o máximo desempenho com nossos equipamentos'}</h2>
            <p className="wifi-text" dangerouslySetInnerHTML={{ __html: s.wifi_desc || 'Estamos equipados com a mais recente tecnologia <strong>Wi-Fi 6</strong>. Oferecemos a você os melhores dispositivos disponíveis no mercado, garantindo uma cobertura de sinal superior, maior capacidade de dispositivos conectados e muito mais velocidade na sua rede sem fio.' }}></p>
            <div className="wifi-tech-list">
              <div className="wifi-tech-item">
                {s.wifi_feat1_icon && <div style={{ marginBottom: 8 }}>{renderIcon(s.wifi_feat1_icon, null)}</div>}
                <h5>{s.wifi_feat1_title || 'Velocidade Incrível'}</h5>
                <p>{s.wifi_feat1_desc || 'Até 3x mais rápido que as conexões Wi-Fi comuns.'}</p>
              </div>
              <div className="wifi-tech-item">
                {s.wifi_feat2_icon && <div style={{ marginBottom: 8 }}>{renderIcon(s.wifi_feat2_icon, null)}</div>}
                <h5>{s.wifi_feat2_title || 'Conexão de Vários Dispositivos'}</h5>
                <p>{s.wifi_feat2_desc || 'Mais estabilidade mesmo com toda a família conectada.'}</p>
              </div>
              <div className="wifi-tech-item">
                {s.wifi_feat3_icon && <div style={{ marginBottom: 8 }}>{renderIcon(s.wifi_feat3_icon, null)}</div>}
                <h5>{s.wifi_feat3_title || 'Cobertura Ampliada'}</h5>
                <p>{s.wifi_feat3_desc || 'Sinal forte em todos os cômodos da sua residência.'}</p>
              </div>
            </div>
            <a 
              href={s.wifi_btn_link || "https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20internet."} 
              target="_blank" 
              rel="noreferrer" 
              className="specialty-btn accent-btn"
            >
              {s.wifi_btn_text || 'CONTRATAR AGORA'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Specialties;
