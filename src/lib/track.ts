import { API_BASE_URL } from '../config/api';

export interface LeadData {
  name?: string;
  whatsapp?: string;
}

/**
 * Registra um clique no botão "Falar com especialista" (WhatsApp).
 * Chamada fire-and-forget: nunca bloqueia nem quebra a navegação.
 */
export function trackWhatsAppClick(cep: string, source: string, lead?: LeadData) {
  try {
    fetch(`${API_BASE_URL}/api/whatsapp-clicks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cep: cep || '',
        source,
        name: lead?.name || '',
        whatsapp: lead?.whatsapp || '',
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silencioso */
  }
}
