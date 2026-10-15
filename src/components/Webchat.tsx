import { useEffect, useRef } from 'react';

const DEFAULT_BASE = 'https://opasuite.mundonetbandalarga.com.br';
const DEFAULT_TOKEN = '6aca54df3fdc68516efe4e26';
const STYLE_ID = 'webchat-style';

declare global {
  // opa é um const de script clássico: existe no escopo global léxico, mas NÃO em window/globalThis
  var opa:
    | { init: (base: string, id: string, config: string) => void; socket?: unknown }
    | undefined;
}

let scriptInjected = false;
let opaInitialized = false;

export interface WebchatProps {
  baseUrl?: string;
  token?: string;
  anonimo?: boolean;
  welcome?: string;
  customCss?: string;
  hideIcon?: boolean;
}

export default function Webchat({ baseUrl, token, anonimo = true, welcome = '', customCss = '', hideIcon = true }: WebchatProps) {
  const base = baseUrl?.trim() || DEFAULT_BASE;
  const tok = token?.trim() || DEFAULT_TOKEN;
  const welcomeRef = useRef(welcome);
  useEffect(() => {
    welcomeRef.current = welcome;
  }, [welcome]);

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
    // 1) pula a tela "Continuar sem efetuar login" — só após o socket do OPA estar pronto,
    //    senão chat_rodape() trava e o campo de mensagem nunca é criado
    // 2) injeta a mensagem de boas-vindas no corpo do chat quando ele abre
    let skipped = false;
    let welcomed = false;
    let welcomeTimer: number | undefined;

    const tick = () => {
      const semLogin = document.querySelector('.sem-login') as HTMLElement | null;
      if (semLogin) {
        const socketReady = typeof opa !== 'undefined' && !!opa?.socket;
        if (socketReady && !skipped) {
          skipped = true;
          semLogin.click();
        }
      } else {
        skipped = false;
      }

      const corpo = document.querySelector('.opa_corpo');
      if (!corpo) {
        welcomed = false;
        if (welcomeTimer) {
          clearTimeout(welcomeTimer);
          welcomeTimer = undefined;
        }
        return;
      }
      if (!welcomed && welcomeRef.current.trim()) {
        welcomed = true;
        welcomeTimer = window.setTimeout(() => {
          welcomeTimer = undefined;
          const c = document.querySelector('.opa_corpo');
          if (!c || !welcomeRef.current.trim()) return;
          const wrap = document.createElement('div');
          wrap.style.position = 'relative';
          wrap.style.textAlign = 'left';
          const ballon = document.createElement('div');
          ballon.className = 'opa_ballon recebida';
          ballon.style.textAlign = 'left';
          ballon.style.whiteSpace = 'pre-wrap';
          ballon.textContent = welcomeRef.current;
          const time = document.createElement('div');
          time.className = 'time';
          time.style.paddingLeft = '5px';
          time.style.textAlign = 'left';
          time.textContent = `Mundonet - ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
          ballon.appendChild(time);
          wrap.appendChild(ballon);
          c.appendChild(wrap);
          ballon.scrollIntoView({ block: 'nearest' });
        }, 400);
      }
    };

    const interval = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(interval);
      if (welcomeTimer) clearTimeout(welcomeTimer);
    };
  }, []);

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
