import { API_BASE_URL } from '../config/api';

/**
 * Registra um clique no botão "Falar com especialista" (WhatsApp).
 * Chamada fire-and-forget: nunca bloqueia nem quebra a navegação.
 */
export function trackWhatsAppClick(cep: string, source: string) {
  try {
    fetch(`${API_BASE_URL}/api/whatsapp-clicks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep: cep || '', source }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silencioso */
  }
}
