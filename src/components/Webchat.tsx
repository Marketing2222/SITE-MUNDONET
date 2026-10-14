import { useEffect } from 'react';

const DEFAULT_BASE = 'https://opasuite.mundonetbandalarga.com.br';
const DEFAULT_TOKEN = '6aca54df3fdc68516efe4e26';
const STYLE_ID = 'webchat-style';

declare global {
  // opa é um const de script clássico: existe no escopo global léxico, mas NÃO em window/globalThis
  var opa:
    | { init: (base: string, id: string, config: string) => void }
    | undefined;
}

let scriptInjected = false;
let opaInitialized = false;

export interface WebchatProps {
  baseUrl?: string;
  token?: string;
  anonimo?: boolean;
  customCss?: string;
  hideIcon?: boolean;
}

export default function Webchat({ baseUrl, token, anonimo = true, customCss = '', hideIcon = true }: WebchatProps) {
  const base = baseUrl?.trim() || DEFAULT_BASE;
  const tok = token?.trim() || DEFAULT_TOKEN;

  useEffect(() => {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = `${hideIcon ? '.opa_ico { display: none !important; }' : ''}\n${customCss}`;
    return () => {
      // ao sair (ex.: página do admin), mantém o ícone do OPA oculto
      const s = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (s) s.textContent = '.opa_ico { display: none !important; }';
    };
  }, [hideIcon, customCss]);

  useEffect(() => {
    if (scriptInjected) return;
    scriptInjected = true;

    const a = document.createElement('script');
    a.async = true;
    a.src = `${base}/js/opa.js`;
    document.head.appendChild(a);
    a.onload = () => {
      try {
        if (typeof opa !== 'undefined' && opa && !opaInitialized) {
          opaInitialized = true;
          // init faz JSON.parse(dados) internamente — precisa de string, não de objeto
          opa.init(base, tok, JSON.stringify({
            permitir_login_anonimo: anonimo ? 'on' : '',
            facebook_appid: '',
            google_credential: '',
            google_oauth: '',
          }));
        }
      } catch {
        /* widget não carregado */
      }
    };
    // init é feito uma única vez por visita; mudanças de token/URL valem no próximo carregamento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
