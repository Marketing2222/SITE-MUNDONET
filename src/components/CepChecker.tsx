import { useState, useEffect } from 'react';
import '../styles/CepChecker.css';
import { API_BASE_URL } from '../config/api';

interface CepSettings {
  enabled: boolean;
  button_text: string;
  button_bg: string;
  button_color: string;
  sidebar_title: string;
  success_msg: string;
  fail_msg: string;
  invalid_msg: string;
  whatsapp_link: string;
  cep_ranges: string[];
}

const DEFAULT_RANGES = [
  '65015-65015', '65020-65020', '65031-65031', '65035-65035',
  '65040-65042', '65044-65045', '65047-65049', '65054-65054',
  '65056-65060', '65062-65062', '65066-65068', '65070-65071',
  '65073-65073', '65075-65076', '65080-65083', '65085-65086',
  '65090-65095',
];

const DEFAULT_SETTINGS: CepSettings = {
  enabled: true,
  button_text: 'Verifique se atendemos sua região',
  button_bg: '#005CFF',
  button_color: '#ffffff',
  sidebar_title: 'Antes de continuar, vamos verificar se atendemos sua região?',
  success_msg: 'Parabéns! Atendemos sua região!',
  fail_msg: 'Infelizmente não atendemos sua região no momento.',
  invalid_msg: 'CEP inválido, tente novamente.',
  whatsapp_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Gostaria%20de%20saber%20se%20atendem%20minha%20região.',
  cep_ranges: DEFAULT_RANGES,
};

type ResultType = 'idle' | 'invalid' | 'success' | 'fail';

const formatCep = (v: string): string => {
  const digits = v.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

const toPrefix5 = (s: string): number => {
  const digits = s.replace(/\D/g, '');
  return parseInt(digits.slice(0, 5), 10);
};

const checkCep = (cep: string, ranges: string[]): ResultType => {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return 'invalid';
  const num = parseInt(digits.slice(0, 5), 10);
  const fullNum = parseInt(digits, 10);
  for (const range of ranges) {
    const r = range.trim();
    if (r.includes('-')) {
      const parts = r.split('-').map(s => s.trim());
      const leftDigits = parts[0].replace(/\D/g, '');
      const rightDigits = parts[1].replace(/\D/g, '');
      if (leftDigits.length === 5 && rightDigits.length === 3) {
        const rFull = parseInt(leftDigits + rightDigits, 10);
        if (!isNaN(rFull) && fullNum === rFull) return 'success';
      } else {
        const from = toPrefix5(parts[0]);
        const to = toPrefix5(parts[1]);
        if (!isNaN(from) && !isNaN(to) && num >= from && num <= to) return 'success';
      }
    } else {
      const digitsOnly = r.replace(/\D/g, '');
      if (digitsOnly.length === 8) {
        const rNum = parseInt(digitsOnly, 10);
        if (!isNaN(rNum) && fullNum === rNum) return 'success';
      } else if (digitsOnly.length === 5) {
        const single = parseInt(digitsOnly, 10);
        if (!isNaN(single) && num === single) return 'success';
      }
    }
  }
  return 'fail';
};

export const CepChecker = () => {
  const [settings, setSettings] = useState<CepSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [result, setResult] = useState<ResultType>('idle');
  const [addressInfo, setAddressInfo] = useState<{ street: string; neighborhood: string; city: string; uf: string } | null>(null);
  const [interestEndereco, setInterestEndereco] = useState('');
  const [interestBairro, setInterestBairro] = useState('');
  const [interestWhatsapp, setInterestWhatsapp] = useState('');
  const [interestSent, setInterestSent] = useState(false);
  const [interestSending, setInterestSending] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const s = { ...DEFAULT_SETTINGS };
        if (data.cep_checker_enabled?.value === 'false') {
          s.enabled = false;
          setSettings(s);
          setReady(true);
          return;
        }
        if (data.cep_checker_button_text?.value) s.button_text = data.cep_checker_button_text.value;
        if (data.cep_checker_button_bg?.value) s.button_bg = data.cep_checker_button_bg.value;
        if (data.cep_checker_button_color?.value) s.button_color = data.cep_checker_button_color.value;
        if (data.cep_checker_sidebar_title?.value) s.sidebar_title = data.cep_checker_sidebar_title.value;
        if (data.cep_checker_success_msg?.value) s.success_msg = data.cep_checker_success_msg.value;
        if (data.cep_checker_fail_msg?.value) s.fail_msg = data.cep_checker_fail_msg.value;
        if (data.cep_checker_invalid_msg?.value) s.invalid_msg = data.cep_checker_invalid_msg.value;
        if (data.cep_checker_whatsapp_link?.value) s.whatsapp_link = data.cep_checker_whatsapp_link.value;
        if (data.cep_checker_ranges?.value && data.cep_checker_ranges.value.trim()) {
          s.cep_ranges = data.cep_checker_ranges.value.split('\n').filter((l: string) => l.trim() !== '');
        }
        setSettings(s);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const handleVerify = async () => {
    const r = checkCep(cep, settings.cep_ranges);
    setResult(r);
    setAddressInfo(null);

    // Buscar endereço via ViaCEP e registrar no backend
    const digits = cep.replace(/\D/g, '');
    if (digits.length === 8) {
      try {
        const viaCepRes = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const viaCepData = await viaCepRes.json();
        if (!viaCepData.erro) {
          setAddressInfo({
            street: viaCepData.logradouro || '',
            neighborhood: viaCepData.bairro || '',
            city: viaCepData.localidade || '',
            uf: viaCepData.uf || '',
          });
        }
        await fetch(`${API_BASE_URL}/api/cep-searches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cep: cep,
            street: viaCepData.logradouro || '',
            neighborhood: viaCepData.bairro || '',
            city: viaCepData.localidade || '',
            uf: viaCepData.uf || '',
            result: r,
          }),
        });
      } catch {
        // Falha silenciosa — não afeta a experiência do usuário
        try {
          await fetch(`${API_BASE_URL}/api/cep-searches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cep, street: '', neighborhood: '', city: '', uf: '', result: r }),
          });
        } catch { /* ignore */ }
      }
    }
  };

  const handleClose = () => {
    setSidebarOpen(false);
    setResult('idle');
    setCep('');
    setAddressInfo(null);
    setInterestEndereco('');
    setInterestBairro('');
    setInterestWhatsapp('');
    setInterestSent(false);
  };

  const handleInterestSubmit = async () => {
    if (!interestEndereco.trim() || !interestWhatsapp.trim()) return;
    setInterestSending(true);
    try {
      await fetch(`${API_BASE_URL}/api/cep-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cep,
          endereco: interestEndereco.trim(),
          bairro: interestBairro.trim(),
          whatsapp: interestWhatsapp.trim(),
        }),
      });
      setInterestSent(true);
    } catch {
      // falha silenciosa
    } finally {
      setInterestSending(false);
    }
  };

  if (!ready || !settings.enabled) return null;

  return (
    <>
      <div
        className="cep-floating-bar"
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

            {result === 'idle' && (
              <>
                <input
                  className="cep-input"
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={e => setCep(formatCep(e.target.value))}
                  maxLength={9}
                  inputMode="numeric"
                />
                <button className="cep-verify-btn" onClick={handleVerify}>
                  Verificar endereço
                </button>
              </>
            )}

            {result === 'invalid' && (
              <>
                <div className="cep-result cep-result-error">
                  {settings.invalid_msg}
                </div>
                <input
                  className="cep-input"
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={e => setCep(formatCep(e.target.value))}
                  maxLength={9}
                  inputMode="numeric"
                />
                <button className="cep-verify-btn" onClick={handleVerify}>
                  Tentar novamente
                </button>
              </>
            )}

            {result === 'fail' && (
              <div className="cep-result-card cep-result-fail">
                <p>{settings.fail_msg}</p>
                {!interestSent ? (
                  <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>
                      Deixe seus dados para quando expandirmos sua região:
                    </p>
                    <input
                      className="cep-input"
                      type="text"
                      placeholder="Endereço (rua, nº)"
                      value={interestEndereco}
                      onChange={e => setInterestEndereco(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      className="cep-input"
                      type="text"
                      placeholder="Bairro"
                      value={interestBairro}
                      onChange={e => setInterestBairro(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      className="cep-input"
                      type="tel"
                      placeholder="WhatsApp (com DDD)"
                      value={interestWhatsapp}
                      onChange={e => setInterestWhatsapp(e.target.value)}
                      style={{ marginBottom: 12 }}
                    />
                    <button
                      className="cep-verify-btn"
                      onClick={handleInterestSubmit}
                      disabled={interestSending || !interestEndereco.trim() || !interestWhatsapp.trim()}
                      style={{ opacity: interestSending || !interestEndereco.trim() || !interestWhatsapp.trim() ? 0.5 : 1 }}
                    >
                      {interestSending ? 'Enviando...' : 'Enviar dados de interesse'}
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                    <p style={{ fontSize: 14, color: '#166534', margin: 0, fontWeight: 600 }}>
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
                  <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 12px', lineHeight: 1.5 }}>
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
