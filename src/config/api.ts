// URL base da API – configurável via variável de ambiente VITE_API_URL
// Em produção, defina VITE_API_URL no painel do EasyPanel (ex: https://mundonet.seudominio.com.br)
// Em desenvolvimento local, usa http://localhost:3001 como fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
