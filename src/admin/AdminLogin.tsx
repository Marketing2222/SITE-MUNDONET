import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';
import { API_BASE_URL } from '../config/api';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@mundonet.com.br');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let errMsg = 'Erro ao fazer login';
        try { const d = await res.json(); if (d.error) errMsg = d.error; } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-logo-icon">M</div>
          <span>Mundonet Admin</span>
        </div>
        <h1>Área Administrativa</h1>
        <p className="admin-login-subtitle">Faça login para gerenciar o site</p>

        {error && <div className="admin-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@mundonet.com.br"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="admin-btn primary full-width" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <a href="/" className="admin-back-link">← Voltar para o site</a>
      </div>
    </div>
  );
};

export default AdminLogin;
