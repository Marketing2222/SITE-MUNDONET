export const getToken = () => localStorage.getItem('admin_token');
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('admin_user') || 'null'); }
  catch { return null; }
};
export const isLoggedIn = () => !!getToken();
export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(`http://localhost:3001/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    logout();
    window.location.href = '/admin/login';
    throw new Error('Sessão expirada');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
};
