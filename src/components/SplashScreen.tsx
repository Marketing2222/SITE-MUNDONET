import { useEffect, useRef, useState, type CSSProperties } from 'react';
import '../styles/SplashScreen.css';
import useCepChecker from '../hooks/useCepChecker';
import { buildWhatsAppLink } from '../lib/cep';
import { trackWhatsAppClick } from '../lib/track';
import { API_BASE_URL } from '../config/api';

interface SplashScreenProps {
  onEnter: () => void;
}

const DEFAULT_LOGO = 'https://mundonetbandalarga.com.br/wp-content/uploads/2023/10/logo-mundonet.png';

const DEFAULT_UI = {
  cepPlaceholder: 'Digite seu CEP',
  cepButtonText: 'Consultar disponibilidade',
  btnClientText: 'SOU CLIENTE',
  btnLeadText: 'QUERO SER CLIENTE',
  bgColor1: '#00123f',
  bgColor2: '#005CFF',
  ctaBg: '#FCB900',
  ctaColor: '#002D72',
  btn1Bg: '#FFFFFF',
  btn1Color: '#002D72',
  btn2Color: '#FFFFFF',
};

type UiSettings = typeof DEFAULT_UI;

export const SplashScreen = ({ onEnter }: SplashScreenProps) => {
  const { settings, ready, cep, setCep, result, addressInfo, handleVerify, reset, interest } = useCepChecker();
  const [bgUrl, setBgUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
  const [ui, setUi] = useState<UiSettings>(DEFAULT_UI);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/settings?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        // Tela inicial desativada pelo admin → entra direto no site
        if (data.splash_enabled?.value === 'false') {
          onEnter();
          return;
        }
        const g = (key: string) => data[key]?.value || '';
        if (g('splash_bg_url')) setBgUrl(g('splash_bg_url'));
        if (g('splash_logo_url')) setLogoUrl(g('splash_logo_url'));
        else if (g('logo_url')) setLogoUrl(g('logo_url'));

        setUi({
          cepPlaceholder: g('splash_cep_placeholder') || DEFAULT_UI.cepPlaceholder,
          cepButtonText: g('splash_cep_button_text') || DEFAULT_UI.cepButtonText,
          btnClientText: g('splash_btn_client_text') || DEFAULT_UI.btnClientText,
          btnLeadText: g('splash_btn_lead_text') || DEFAULT_UI.btnLeadText,
          bgColor1: g('splash_bg_color1') || DEFAULT_UI.bgColor1,
          bgColor2: g('splash_bg_color2') || DEFAULT_UI.bgColor2,
          ctaBg: g('splash_cep_btn_bg') || DEFAULT_UI.ctaBg,
          ctaColor: g('splash_cep_btn_color') || DEFAULT_UI.ctaColor,
          btn1Bg: g('splash_btn1_bg') || DEFAULT_UI.btn1Bg,
          btn1Color: g('splash_btn1_color') || DEFAULT_UI.btn1Color,
          btn2Color: g('splash_btn2_color') || DEFAULT_UI.btn2Color,
        });
      })
      .catch(() => { /* mantém padrões */ });
    return () => { active = false; };
  }, [onEnter]);

  const showForm = result === 'idle' || result === 'invalid';

  const focusCep = () => {
    if (!showForm) reset();
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const bgStyle: CSSProperties = bgUrl
    ? { backgroundImage: `url("${bgUrl}")` }
    : { backgroundImage: `linear-gradient(135deg, ${ui.bgColor1} 0%, ${ui.bgColor2} 100%)` };

  return (
    <div
      className={`splash ${focused ? 'splash--focused' : ''}`}
      style={{ '--splash-accent': ui.ctaBg } as CSSProperties}
    >
      <div className="splash__bg" style={bgStyle} />
      <div className="splash__overlay" />

      <div className="splash__content">
        <img className="splash__logo" src={logoUrl} alt="Mundonet Telecom" />

        {ready && settings.enabled && (
          <div className="splash__cep">
            {showForm && (
              <>
                <div className={`splash__field ${result === 'invalid' ? 'has-error' : ''}`}>
                  <input
                    ref={inputRef}
                    className="splash__input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={ui.cepPlaceholder}
                    value={cep}
                    onChange={e => setCep(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerify();
                      }
                    }}
                  />
                </div>
                {result === 'invalid' && (
                  <div className="splash__msg splash__msg--error" role="alert">
                    {settings.invalid_msg}
                  </div>
                )}
                <button
                  type="button"
                  className="splash__consult"
                  style={{ backgroundColor: ui.ctaBg, color: ui.ctaColor }}
                  onClick={handleVerify}
                >
                  {result === 'invalid' ? 'Tentar novamente' : ui.cepButtonText}
                </button>
              </>
            )}

            {result === 'success' && (
              <div className="splash__result splash__result--success">
                <p className="splash__result-title">{settings.success_msg}</p>
                {addressInfo && (
                  <p className="splash__address">
                    {addressInfo.street && <>{addressInfo.street}<br /></>}
                    {addressInfo.neighborhood && <>{addressInfo.neighborhood}<br /></>}
                    {addressInfo.city && addressInfo.uf && <>{addressInfo.city} - {addressInfo.uf}</>}
                  </p>
                )}
                <div className="splash__result-actions">
                  <button
                    type="button"
                    className="splash__mini splash__mini--solid"
                    style={{ backgroundColor: ui.btn1Bg, color: ui.btn1Color }}
                    onClick={onEnter}
                  >
                    Acessar o site
                  </button>
                  <a
                    className="splash__mini splash__mini--ghost"
                    style={{ color: ui.btn2Color, borderColor: ui.btn2Color }}
                    href={buildWhatsAppLink(settings.whatsapp_link, cep, addressInfo)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackWhatsAppClick(cep, 'splash')}
                  >
                    Falar com especialista
                  </a>
                </div>
                <button type="button" className="splash__link" onClick={reset}>
                  Fazer nova consulta
                </button>
              </div>
            )}

            {result === 'fail' && (
              <div className="splash__result splash__result--fail">
                <p className="splash__result-title">{settings.fail_msg}</p>
                {!interest.sent ? (
                  <div className="splash__interest">
                    <p className="splash__interest-title">
                      Deixe seus dados para quando expandirmos sua região:
                    </p>
                    <input
                      className="splash__interest-input"
                      type="text"
                      placeholder="Endereço (rua, nº)"
                      value={interest.endereco}
                      onChange={e => interest.setEndereco(e.target.value)}
                    />
                    <input
                      className="splash__interest-input"
                      type="text"
                      placeholder="Bairro"
                      value={interest.bairro}
                      onChange={e => interest.setBairro(e.target.value)}
                    />
                    <input
                      className="splash__interest-input"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={interest.whatsapp}
                      onChange={e => interest.setWhatsapp(e.target.value)}
                      maxLength={16}
                    />
                    <button
                      type="button"
                      className="splash__consult"
                      onClick={interest.submit}
                      disabled={interest.sending || !interest.valid}
                      style={{
                        backgroundColor: ui.ctaBg,
                        color: ui.ctaColor,
                        opacity: interest.sending || !interest.valid ? 0.5 : 1,
                      }}
                    >
                      {interest.sending ? 'Enviando...' : 'Enviar dados de interesse'}
                    </button>
                  </div>
                ) : (
                  <div className="splash__sent">
                    Dados enviados com sucesso! Quando expandirmos sua região, entraremos em contato.
                  </div>
                )}
                <button type="button" className="splash__link" onClick={reset}>
                  Tentar outro CEP
                </button>
              </div>
            )}
          </div>
        )}

        <div className="splash__actions">
          <button
            type="button"
            className="splash__cta splash__cta--primary"
            style={{ backgroundColor: ui.btn1Bg, color: ui.btn1Color, borderColor: ui.btn1Bg }}
            onClick={onEnter}
          >
            {ui.btnClientText}
          </button>
          <button
            type="button"
            className="splash__cta splash__cta--outline"
            style={{ color: ui.btn2Color, borderColor: ui.btn2Color }}
            onClick={focusCep}
          >
            {ui.btnLeadText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
