import { useEffect, useRef } from 'react';

const DEFAULT_BASE = 'https://opasuite.mundonetbandalarga.com.br';
const DEFAULT_TOKEN = '6aca54df3fdc68516efe4e26';
const STYLE_ID = 'webchat-style';
const NAME_KEY = 'webchat_name';
const ID_KEY = 'webchat_user_id';

declare global {
  // opa é um const de script clássico: existe no escopo global léxico, mas NÃO em window/globalThis
  var opa:
    | { init: (base: string, id: string, config: string) => void; socket?: unknown }
    | undefined;
}

type OpaSocket = { emit: (event: string, ...args: unknown[]) => void };

let scriptInjected = false;
let opaInitialized = false;

const getSavedName = () => localStorage.getItem(NAME_KEY) || '';

const getUserId = () => {
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ID_KEY, id);
  }
  return id;
};

const getOpaSocket = (): OpaSocket | undefined => {
  const sock = typeof opa !== 'undefined' ? opa?.socket : undefined;
  return sock && typeof (sock as OpaSocket).emit === 'function' ? (sock as OpaSocket) : undefined;
};

// injeta dadosLogin (nome) em toda mensagem enviada pelo campo do chat
const patchSocket = (sock: OpaSocket) => {
  const target = sock as OpaSocket & { __webchatPatched?: boolean };
  if (target.__webchatPatched) return;
  target.__webchatPatched = true;
  const original = sock.emit.bind(sock);
  sock.emit = (event: string, ...args: unknown[]) => {
    if (event === 'mensagem' && args.length >= 3) {
      const payload = args[2] as { dadosLogin?: unknown } | undefined;
      if (payload && !payload.dadosLogin && getSavedName()) {
        payload.dadosLogin = {
          idWebPage: getUserId(),
          nomeUsuario: getSavedName(),
          email: '',
          imagemPerfil: '',
        };
      }
    }
    return original(event, ...args);
  };
};

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
    // 1) pede o nome do visitante antes de abrir o chat (uma vez; depois salva no navegador)
    // 2) pula a tela "Continuar sem efetuar login" só com o socket OPA pronto
    // 3) envia o nome pro atendente (set_id_opa_user + dadosLogin nas mensagens)
    // 4) injeta a mensagem de boas-vindas (suporta {nome})
    let skipped = false;
    let welcomed = false;
    let welcomeTimer: number | undefined;

    const ensureGate = (corpo: Element, socketReady: boolean) => {
      let gate = corpo.querySelector('.webchat-name-gate') as HTMLElement | null;
      if (!gate) {
        gate = document.createElement('div');
        gate.className = 'webchat-name-gate';
        gate.style.cssText = 'padding:28px 20px;text-align:center;';
        const p = document.createElement('p');
        p.style.cssText = 'margin:0 0 14px;color:#555;font-size:14px;';
        p.textContent = 'Antes de começar, qual seu nome?';
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 60;
        input.placeholder = 'Seu nome';
        input.style.cssText = 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;outline:none;';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'width:100%;padding:10px 12px;border:0;border-radius:8px;background:#005CFF;color:#fff;font-size:14px;font-weight:600;cursor:pointer;';
        const submit = () => {
          const nome = input.value.trim();
          if (!nome) {
            input.focus();
            return;
          }
          const sock = getOpaSocket();
          if (!sock) return; // ainda conectando; botão fica desabilitado até lá
          localStorage.setItem(NAME_KEY, nome);
          patchSocket(sock);
          try {
            sock.emit('set_id_opa_user', getUserId());
          } catch { /* ignore */ }
          gate?.remove();
          const link = document.querySelector('.sem-login') as HTMLElement | null;
          link?.click();
          window.setTimeout(() => {
            try {
              sock.emit('mensagem', '', '', {
                tipo: 'texto',
                conteudo: `Meu nome é ${nome}`,
                dadosLogin: {
                  idWebPage: getUserId(),
                  nomeUsuario: nome,
                  email: '',
                  imagemPerfil: '',
                },
              });
            } catch { /* ignore */ }
          }, 700);
        };
        btn.addEventListener('click', submit);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') submit();
        });
        gate.append(p, input, btn);
        corpo.appendChild(gate);
        input.focus();
      }
      const btn = gate.querySelector('button') as HTMLButtonElement | null;
      if (btn) {
        btn.disabled = !socketReady;
        btn.textContent = socketReady ? 'Começar conversa' : 'Conectando...';
        btn.style.opacity = socketReady ? '1' : '0.6';
      }
    };

    const tick = () => {
      const sock = getOpaSocket();
      const socketReady = !!sock;
      const semLogin = document.querySelector('.sem-login') as HTMLElement | null;
      const savedName = getSavedName();
      const corpo = document.querySelector('.opa_corpo');

      if (sock) {
        patchSocket(sock);
        if (savedName) {
          try {
            sock.emit('set_id_opa_user', getUserId());
          } catch { /* ignore */ }
        }
      }

      if (semLogin) {
        if (!savedName) {
          skipped = false;
          const logins = document.querySelector('.div-logins') as HTMLElement | null;
          if (logins) logins.style.display = 'none';
          if (corpo) ensureGate(corpo, socketReady);
        } else {
          const gateEl = document.querySelector('.webchat-name-gate');
          if (gateEl) gateEl.remove();
          if (socketReady && !skipped) {
            skipped = true;
            semLogin.click();
          }
        }
      } else {
        skipped = false;
      }

      if (!corpo) {
        welcomed = false;
        if (welcomeTimer) {
          clearTimeout(welcomeTimer);
          welcomeTimer = undefined;
        }
        return;
      }
      if (!welcomed && welcomeRef.current.trim() && getSavedName()) {
        welcomed = true;
        welcomeTimer = window.setTimeout(() => {
          welcomeTimer = undefined;
          const c = document.querySelector('.opa_corpo');
          const nome = getSavedName();
          if (!c || !welcomeRef.current.trim() || !nome) return;
          const wrap = document.createElement('div');
          wrap.style.position = 'relative';
          wrap.style.textAlign = 'left';
          const ballon = document.createElement('div');
          ballon.className = 'opa_ballon recebida';
          ballon.style.textAlign = 'left';
          ballon.style.whiteSpace = 'pre-wrap';
          ballon.textContent = welcomeRef.current.replace(/{nome}/gi, nome);
          const time = document.createElement('div');
          time.className = 'time';
          time.style.paddingLeft = '5px';
          time.style.textAlign = 'left';
          time.textContent = `Mundonet - ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
          ballon.appendChild(time);
          wrap.appendChild(ballon);
          c.appendChild(wrap);
          ballon.scrollIntoView({ block: 'nearest' });
        }, 300);
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
