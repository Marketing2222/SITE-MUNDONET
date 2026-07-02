import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getUser } from '../hooks/useAuth';

interface Stats { plans: number; slides: number; quicklinks: number; entertainment: number; }

export const DashboardHome = () => {
  const [stats, setStats] = useState<Stats>({ plans: 0, slides: 0, quicklinks: 0, entertainment: 0 });
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      const [plans, hero, ql, ent] = await Promise.all([
        apiFetch('/plans/all'), apiFetch('/hero/all'), apiFetch('/quicklinks/all'), apiFetch('/entertainment/all'),
      ]);
      setStats({ plans: plans.length, slides: hero.length, quicklinks: ql.length, entertainment: ent.length });
    };
    load().catch(console.error);
  }, []);

  const STATS = [
    { icon: '📦', value: stats.plans, label: 'Planos ativos' },
    { icon: '🖼️', value: stats.slides, label: 'Slides do banner' },
    { icon: '🔗', value: stats.quicklinks, label: 'Links rápidos' },
    { icon: '🎬', value: stats.entertainment, label: 'Categorias entretenimento' },
  ];

  const QUICK = [
    { to: '/admin/plans', icon: '📦', title: 'Gerenciar Planos', desc: 'Preços, velocidades e benefícios' },
    { to: '/admin/hero', icon: '🖼️', title: 'Banners do Site', desc: 'Slides e imagens do topo' },
    { to: '/admin/home-sections', icon: '🔗', title: 'Links Rápidos', desc: 'Cards de suporte e acesso' },
    { to: '/admin/entertainment', icon: '🎬', title: 'Entretenimento', desc: 'Categorias de conteúdo' },
    { to: '/admin/contact', icon: '📞', title: 'Contato', desc: 'Telefones, e-mail e endereço' },
    { to: '/admin/settings', icon: '⚙️', title: 'Configurações', desc: 'Logo, cores e dados gerais' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Bem-vindo, {user?.name}! 👋</h2>
          <p>Gerencie todo o conteúdo do site Mundonet aqui.</p>
        </div>
        <a href="/" target="_blank" className="admin-btn ghost">🌐 Ver site</a>
      </div>

      <div className="admin-stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 14, color: 'var(--adm-text2)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acesso Rápido</h3>
      <div className="admin-quick-actions">
        {QUICK.map(q => (
          <Link key={q.to} to={q.to} className="admin-quick-card">
            <span className="qc-icon">{q.icon}</span>
            <span className="qc-title">{q.title}</span>
            <span className="qc-desc">{q.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
