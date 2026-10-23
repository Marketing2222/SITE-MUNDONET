import { useEffect, useState } from 'react';
import '../styles/CepChecker.css';
import useCepChecker from '../hooks/useCepChecker';

export const CepChecker = () => {
  const { settings, ready, cep, setCep, result, addressInfo, handleVerify, reset, interest } = useCepChecker();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroCardVisible, setHeroCardVisible] = useState(false);

  useEffect(() => {
    let interObs: IntersectionObserver | null = null;
    let mutObs: MutationObserver | null = null;
    let observed: Element | null = null;

    const watch = (el: Element) => {
      if (observed === el) return;
      interObs?.disconnect();
      observed = el;
      interObs = new IntersectionObserver(
        entries => setHeroCardVisible(entries.some(e => e.isIntersecting)),
        { threshold: 0.2 },
      );
      interObs.observe(el);
    };

    const sync = () => {
      const el = document.querySelector('.hero-cep-card');
      if (el) {
        watch(el);
      } else {
        observed = null;
        interObs?.disconnect();
        setHeroCardVisible(false);
      }
    };

    sync();
    mutObs = new MutationObserver(sync);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      interObs?.disconnect();
      mutObs?.disconnect();
    };
  }, []);

  const handleClose = () => {
    setSidebarOpen(false);
    reset();
  };

  if (!ready || !settings.enabled || heroCardVisible) return null;

  return (
    <>
      <div
        className={`cep-floating-bar ${settings.bar_style === 'centered' ? 'cep-floating-centered' : ''}`}
        style={{ backgroundColor: settings.button_bg }}
      >
        <span className="cep-floating-text" style={{ color: settings.button_color }}>
          {settings.button_text}
        </span>
        <button
          className="cep-floating-btn"
          style={{
            backgroundColor: settings.button_color,
            color: settings.button_bg,
          }}
          onClick={() => setSidebarOpen(true)}
        >
          Informe seu CEP
        </button>
      </div>

      {sidebarOpen && (
        <div className="cep-overlay" onClick={handleClose}>
          <div className="cep-sidebar" onClick={e => e.stopPropagation()}>
            <button className="cep-close" onClick={handleClose}>×</button>
            <p className="cep-sidebar-title">{settings.sidebar_title}</p>

            {(result === 'idle' || result === 'invalid') && (
              <>
                {result === 'invalid' && (
                  <div className="cep-result cep-result-error">
                    {settings.invalid_msg}
                  </div>
                )}
                <input
                  className="cep-input"
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={e => setCep(e.target.value)}
                  maxLength={9}
                  inputMode="numeric"
                />
                <button className="cep-verify-btn" onClick={handleVerify}>
                  {result === 'invalid' ? 'Tentar novamente' : 'Verificar endereço'}
                </button>
              </>
            )}

            {result === 'fail' && (
              <div className="cep-result-card cep-result-fail">
                <p>{settings.fail_msg}</p>
                {!interest.sent ? (
                  <div className="cep-interest-block">
                    <p className="cep-interest-title">
                      Deixe seus dados para quando expandirmos sua região:
                    </p>
                    <input
                      className="cep-input"
                      type="text"
                      placeholder="Endereço (rua, nº)"
                      value={interest.endereco}
                      onChange={e => interest.setEndereco(e.target.value)}
                    />
                    <input
                      className="cep-input"
                      type="text"
                      placeholder="Bairro"
                      value={interest.bairro}
                      onChange={e => interest.setBairro(e.target.value)}
                    />
                    <input
                      className="cep-input"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={interest.whatsapp}
                      onChange={e => interest.setWhatsapp(e.target.value)}
                      maxLength={16}
                    />
                    <button
                      className="cep-verify-btn"
                      onClick={interest.submit}
                      disabled={interest.sending || !interest.valid}
                      style={{ opacity: interest.sending || !interest.valid ? 0.5 : 1 }}
                    >
                      {interest.sending ? 'Enviando...' : 'Enviar dados de interesse'}
                    </button>
                  </div>
                ) : (
                  <div className="cep-interest-sent">
                    <p>
                      Dados enviados com sucesso! Quando expandirmos sua região, entraremos em contato.
                    </p>
                  </div>
                )}
              </div>
            )}

            {result === 'success' && (
              <div className="cep-result-card cep-result-success">
                <p>{settings.success_msg}</p>
                {addressInfo && (
                  <p className="cep-address">
                    {addressInfo.street && <>{addressInfo.street}<br /></>}
                    {addressInfo.neighborhood && <>{addressInfo.neighborhood}<br /></>}
                    {addressInfo.city && addressInfo.uf && <>{addressInfo.city} - {addressInfo.uf}</>}
                  </p>
                )}
                <a
                  href={(() => {
                    const base = settings.whatsapp_link.split('&text=')[0];
                    let msg = `Olá! Vim pelo site e gostaria de contratar a internet.`;
                    msg += `%0ACEP: ${cep}`;
                    if (addressInfo) {
                      if (addressInfo.street) msg += `%0ARua: ${addressInfo.street}`;
                      if (addressInfo.neighborhood) msg += `%0ABairro: ${addressInfo.neighborhood}`;
                      if (addressInfo.city && addressInfo.uf) msg += `%0ACidade: ${addressInfo.city} - ${addressInfo.uf}`;
                    }
                    return `${base}&text=${msg}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="cep-whatsapp-btn"
                >
                  Falar com um especialista
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: 6 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CepChecker;
