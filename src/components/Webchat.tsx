import { useEffect } from 'react';

const WEBCHAT_BASE = 'https://opasuite.mundonetbandalarga.com.br';
const WEBCHAT_ID = '6aca54df3fdc68516efe4e26';
const WEBCHAT_CONFIG = {
  permitir_login_anonimo: 'on',
  facebook_appid: '',
  google_credential: '',
  google_oauth: '',
};

declare global {
  // opa é um const de script clássico: existe no escopo global léxico, mas NÃO em window/globalThis
  var opa:
    | { init: (base: string, id: string, config: string) => void }
    | undefined;
}

let scriptInjected = false;

export default function Webchat() {
  useEffect(() => {
    if (scriptInjected) return;
    scriptInjected = true;

    const a = document.createElement('script');
    a.async = true;
    a.src = `${WEBCHAT_BASE}/js/opa.js`;
    document.head.appendChild(a);
    a.onload = () => {
      try {
        // init faz JSON.parse(dados) internamente — precisa de string, não de objeto
        if (typeof opa !== 'undefined' && opa) {
          opa.init(WEBCHAT_BASE, WEBCHAT_ID, JSON.stringify(WEBCHAT_CONFIG));
        }
      } catch {
        /* widget não carregado */
      }
    };
  }, []);

  return null;
}
