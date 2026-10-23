import { API_BASE_URL } from '../config/api';

export interface CepSettings {
  enabled: boolean;
  button_text: string;
  button_bg: string;
  button_color: string;
  bar_style: string;
  sidebar_title: string;
  success_msg: string;
  fail_msg: string;
  invalid_msg: string;
  whatsapp_link: string;
  cep_ranges: string[];
  card_title: string;
  card_placeholder: string;
  card_button_text: string;
}

export interface AddressInfo {
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

export type ResultType = 'idle' | 'invalid' | 'success' | 'fail';

export const DEFAULT_RANGES = [
  '65015-65015', '65020-65020', '65031-65031', '65035-65035',
  '65040-65042', '65044-65045', '65047-65049', '65054-65054',
  '65056-65060', '65062-65062', '65066-65068', '65070-65071',
  '65073-65073', '65075-65076', '65080-65083', '65085-65086',
  '65090-65095',
];

export const DEFAULT_SETTINGS: CepSettings = {
  enabled: true,
  button_text: 'Verifique se atendemos sua região',
  button_bg: '#005CFF',
  button_color: '#ffffff',
  bar_style: 'full',
  sidebar_title: 'Antes de continuar, vamos verificar se atendemos sua região?',
  success_msg: 'Parabéns! Atendemos sua região!',
  fail_msg: 'Infelizmente não atendemos sua região no momento.',
  invalid_msg: 'CEP inválido, tente novamente.',
  whatsapp_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Gostaria%20de%20saber%20se%20atendem%20minha%20região.',
  cep_ranges: DEFAULT_RANGES,
  card_title: '',
  card_placeholder: 'Digite seu CEP',
  card_button_text: 'Consultar disponibilidade',
};

export const formatCep = (v: string): string => {
  const digits = v.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

export const formatPhone = (v: string): string => {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const toPrefix5 = (s: string): number => {
  const digits = s.replace(/\D/g, '');
  return parseInt(digits.slice(0, 5), 10);
};

export const checkCep = (cep: string, ranges: string[]): ResultType => {
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

let settingsPromise: Promise<CepSettings> | null = null;

export const loadCepSettings = (): Promise<CepSettings> => {
  if (!settingsPromise) {
    settingsPromise = fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then((data): CepSettings => {
        const s: CepSettings = { ...DEFAULT_SETTINGS, cep_ranges: [...DEFAULT_RANGES] };
        if (data.cep_checker_enabled?.value === 'false') {
          s.enabled = false;
          return s;
        }
        if (data.cep_checker_button_text?.value) s.button_text = data.cep_checker_button_text.value;
        if (data.cep_checker_button_bg?.value) s.button_bg = data.cep_checker_button_bg.value;
        if (data.cep_checker_button_color?.value) s.button_color = data.cep_checker_button_color.value;
        if (data.cep_checker_bar_style?.value) s.bar_style = data.cep_checker_bar_style.value;
        if (data.cep_checker_sidebar_title?.value) s.sidebar_title = data.cep_checker_sidebar_title.value;
        if (data.cep_checker_success_msg?.value) s.success_msg = data.cep_checker_success_msg.value;
        if (data.cep_checker_fail_msg?.value) s.fail_msg = data.cep_checker_fail_msg.value;
        if (data.cep_checker_invalid_msg?.value) s.invalid_msg = data.cep_checker_invalid_msg.value;
        if (data.cep_checker_whatsapp_link?.value) s.whatsapp_link = data.cep_checker_whatsapp_link.value;
        if (data.cep_checker_card_title?.value !== undefined) s.card_title = data.cep_checker_card_title.value;
        if (data.cep_checker_card_placeholder?.value) s.card_placeholder = data.cep_checker_card_placeholder.value;
        if (data.cep_checker_card_button_text?.value) s.card_button_text = data.cep_checker_card_button_text.value;
        if (data.cep_checker_ranges?.value && data.cep_checker_ranges.value.trim()) {
          s.cep_ranges = data.cep_checker_ranges.value.split('\n').filter((l: string) => l.trim() !== '');
        }
        return s;
      })
      .catch(() => ({ ...DEFAULT_SETTINGS, cep_ranges: [...DEFAULT_RANGES] }));
  }
  return settingsPromise;
};

export const buildWhatsAppLink = (base: string, cep: string, address: AddressInfo | null): string => {
  const link = base.split('&text=')[0];
  let msg = 'Olá! Vim pelo site e gostaria de contratar a internet.';
  msg += `%0ACEP: ${cep}`;
  if (address) {
    if (address.street) msg += `%0ARua: ${address.street}`;
    if (address.neighborhood) msg += `%0ABairro: ${address.neighborhood}`;
    if (address.city && address.uf) msg += `%0ACidade: ${address.city} - ${address.uf}`;
  }
  return `${link}&text=${msg}`;
};
