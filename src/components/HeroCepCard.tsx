import { useState } from 'react';
import '../styles/HeroCepCard.css';
import useCepChecker from '../hooks/useCepChecker';
import { buildWhatsAppLink } from '../lib/cep';

export const HeroCepCard = () => {
  const { settings, ready, cep, setCep, result, addressInfo, handleVerify, reset, interest } = useCepChecker();
  const [focused, setFocused] = useState(false);

  if (!ready || !settings.enabled) return null;

  const showForm = result === 'idle' || result === 'invalid';
  const hasValue = cep.length > 0;
  const floated = focused || hasValue;

  return (
    <div className="hero-cep-card">
      {settings.card_title && (
        <div className="hero-cep-card__title">{settings.card_title}</div>
      )}

      {showForm && (
        <div className={`hero-cep-card__field-group ${result === 'invalid' ? 'has-error' : ''}`}>
          <div className="hero-cep-card__input-wrapper">
            <input
              id="hero-cep-input"
              className="hero-cep-card__input"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={9}
              placeholder=" "
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
            <label
              htmlFor="hero-cep-input"
              className={`hero-cep-card__label ${floated ? 'hero-cep-card__label--floated' : ''}`}
            >
              {settings.card_placeholder}
            </label>
          </div>
          {result === 'invalid' && (
            <span className="hero-cep-card__error" role="alert">{settings.invalid_msg}</span>
          )}
          <button
            type="button"
            className="hero-cep-card__submit"
            style={{ backgroundColor: settings.button_bg, color: settings.button_color }}
            onClick={handleVerify}
          >
            {settings.card_button_text}
          </button>
        </div>
      )}

      {result === 'success' && (
        <div className="hero-cep-card__result hero-cep-card__result--success">
          <p className="hero-cep-card__result-message">{settings.success_msg}</p>
          {addressInfo && (
            <p className="hero-cep-card__address">
              {addressInfo.street && <>{addressInfo.street}<br /></>}
              {addressInfo.neighborhood && <>{addressInfo.neighborhood}<br /></>}
              {addressInfo.city && addressInfo.uf && <>{addressInfo.city} - {addressInfo.uf}</>}
            </p>
          )}
          <a
            href={buildWhatsAppLink(settings.whatsapp_link, cep, addressInfo)}
            target="_blank"
            rel="noreferrer"
            className="hero-cep-card__whatsapp"
          >
            Falar com um especialista
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <button type="button" className="hero-cep-card__reset" onClick={reset}>
            Fazer nova consulta
          </button>
        </div>
      )}

      {result === 'fail' && (
        <div className="hero-cep-card__result hero-cep-card__result--fail">
          <p className="hero-cep-card__result-message">{settings.fail_msg}</p>
          {!interest.sent ? (
            <div className="hero-cep-card__interest">
              <p className="hero-cep-card__interest-title">
                Deixe seus dados para quando expandirmos sua região:
              </p>
              <input
                className="hero-cep-card__interest-input"
                type="text"
                placeholder="Endereço (rua, nº)"
                value={interest.endereco}
                onChange={e => interest.setEndereco(e.target.value)}
              />
              <input
                className="hero-cep-card__interest-input"
                type="text"
                placeholder="Bairro"
                value={interest.bairro}
                onChange={e => interest.setBairro(e.target.value)}
              />
              <input
                className="hero-cep-card__interest-input"
                type="tel"
                placeholder="(00) 00000-0000"
                value={interest.whatsapp}
                onChange={e => interest.setWhatsapp(e.target.value)}
                maxLength={16}
              />
              <button
                type="button"
                className="hero-cep-card__submit"
                style={{ backgroundColor: settings.button_bg, color: settings.button_color }}
                onClick={interest.submit}
                disabled={interest.sending || !interest.valid}
              >
                {interest.sending ? 'Enviando...' : 'Enviar dados de interesse'}
              </button>
            </div>
          ) : (
            <div className="hero-cep-card__interest-sent">
              Dados enviados com sucesso! Quando expandirmos sua região, entraremos em contato.
            </div>
          )}
          <button type="button" className="hero-cep-card__reset" onClick={reset}>
            Tentar outro CEP
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroCepCard;
