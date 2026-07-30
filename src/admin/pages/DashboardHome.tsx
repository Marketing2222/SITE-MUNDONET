import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getUser } from '../hooks/useAuth';

interface Stats { plans: number; slides: number; quicklinks: number; entertainment: number; }

const Icons = {
  box: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  film: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  externalLink: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

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
    { icon: Icons.box, value: stats.plans, label: 'Planos ativos' },
    { icon: Icons.image, value: stats.slides, label: 'Slides do banner' },
    { icon: Icons.link, value: stats.quicklinks, label: 'Links rápidos' },
    { icon: Icons.film, value: stats.entertainment, label: 'Categorias entretenimento' },
  ];

  const QUICK = [
    { to: '/admin/plans', icon: Icons.box, title: 'Gerenciar Planos', desc: 'Preços, velocidades e benefícios' },
    { to: '/admin/hero', icon: Icons.image, title: 'Banners do Site', desc: 'Slides e imagens do topo' },
    { to: '/admin/home-sections', icon: Icons.link, title: 'Links Rápidos', desc: 'Cards de suporte e acesso' },
    { to: '/admin/entertainment', icon: Icons.film, title: 'Entretenimento', desc: 'Categorias de conteúdo' },
    { to: '/admin/contact', icon: Icons.phone, title: 'Contato', desc: 'Telefones, e-mail e endereço' },
    { to: '/admin/settings', icon: Icons.settings, title: 'Configurações', desc: 'Logo, cores e dados gerais' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Bem-vindo, {user?.name}!</h2>
          <p>Gerencie todo o conteúdo do site Mundonet aqui.</p>
        </div>
        <a href="/" target="_blank" className="admin-btn ghost">
          <span style={{width:16,height:16,display:'inline-flex'}}>{Icons.externalLink}</span>
          Ver site
        </a>
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

      <h3 style={{ marginBottom: 14, color: 'var(--adm-text2)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Acesso Rápido</h3>
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
