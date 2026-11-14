import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import type { AddressInfo, CepSettings, ResultType } from '../lib/cep';
import {
  DEFAULT_SETTINGS,
  checkCep,
  formatCep,
  formatPhone,
  loadCepSettings,
} from '../lib/cep';

export const useCepChecker = () => {
  const [settings, setSettings] = useState<CepSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [cep, setCepRaw] = useState('');
  const [result, setResult] = useState<ResultType>('idle');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [interestNome, setInterestNome] = useState('');
  const [interestEndereco, setInterestEndereco] = useState('');
  const [interestBairro, setInterestBairro] = useState('');
  const [interestWhatsapp, setInterestWhatsapp] = useState('');
  const [interestSent, setInterestSent] = useState(false);
  const [interestSending, setInterestSending] = useState(false);

  useEffect(() => {
    let active = true;
    loadCepSettings().then(s => {
      if (!active) return;
      setSettings(s);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setCep = useCallback((value: string) => {
    setCepRaw(formatCep(value));
    setResult(prev => (prev === 'invalid' ? 'idle' : prev));
  }, []);

  const handleVerify = useCallback(async () => {
    const r = checkCep(cep, settings.cep_ranges);
    setResult(r);
    setAddressInfo(null);

    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

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
          cep,
          street: viaCepData.logradouro || '',
          neighborhood: viaCepData.bairro || '',
          city: viaCepData.localidade || '',
          uf: viaCepData.uf || '',
          result: r,
        }),
      });
    } catch {
      try {
        await fetch(`${API_BASE_URL}/api/cep-searches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cep, street: '', neighborhood: '', city: '', uf: '', result: r }),
        });
      } catch { /* falha silenciosa */ }
    }
  }, [cep, settings.cep_ranges]);

  const reset = useCallback(() => {
    setResult('idle');
    setCepRaw('');
    setAddressInfo(null);
    setInterestNome('');
    setInterestEndereco('');
    setInterestBairro('');
    setInterestWhatsapp('');
    setInterestSent(false);
  }, []);

  // Mesma fórmula do "Falar com especialista": nome + WhatsApp com 11 dígitos
  const interestDigits = interestWhatsapp.replace(/\D/g, '');
  const interestValid =
    interestNome.trim().length >= 2 &&
    Boolean(interestEndereco.trim()) &&
    interestDigits.length === 11;

  const handleInterestSubmit = useCallback(async () => {
    if (!interestNome.trim() || !interestEndereco.trim() || interestWhatsapp.replace(/\D/g, '').length !== 11) return;
    setInterestSending(true);
    try {
      await fetch(`${API_BASE_URL}/api/cep-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cep,
          nome: interestNome.trim().toUpperCase(),
          endereco: interestEndereco.trim(),
          bairro: interestBairro.trim(),
          whatsapp: interestWhatsapp.replace(/\D/g, ''),
        }),
      });
      setInterestSent(true);
    } catch {
      // falha silenciosa
    } finally {
      setInterestSending(false);
    }
  }, [cep, interestNome, interestEndereco, interestBairro, interestWhatsapp]);

  const setInterestPhone = useCallback((value: string) => {
    setInterestWhatsapp(formatPhone(value));
  }, []);

  return {
    settings,
    ready,
    cep,
    setCep,
    result,
    setResult,
    addressInfo,
    handleVerify,
    reset,
    interest: {
      nome: interestNome,
      setNome: setInterestNome,
      endereco: interestEndereco,
      setEndereco: setInterestEndereco,
      bairro: interestBairro,
      setBairro: setInterestBairro,
      whatsapp: interestWhatsapp,
      setWhatsapp: setInterestPhone,
      sent: interestSent,
      sending: interestSending,
      submit: handleInterestSubmit,
      valid: interestValid,
    },
  };
};

export default useCepChecker;
