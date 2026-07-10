import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout } from './hooks/useAuth';
import './styles/Admin.css';

const NAV = [
  { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/hero', icon: '🖼️', label: 'Banners (Hero)' },
  { to: '/admin/plans', icon: '📦', label: 'Planos' },
  { to: '/admin/entertainment', icon: '🎬', label: 'Entretenimento' },
  { to: '/admin/contact', icon: '📞', label: 'Contato' },
  { to: '/admin/home-sections', icon: '📝', label: 'Seções da Home' },
  { to: '/admin/header-footer', icon: '🎨', label: 'Cabeçalho & Rodapé' },
  { to: '/admin/settings', icon: '⚙️', label: 'Configurações Gerais' },
  { to: '/admin/site-settings', icon: '🎨', label: 'Personalização Global' },
  { to: '/admin/indique-ganhe', icon: '🎁', label: 'Indique e Ganhe' },
  { to: '/admin/para-empresas', icon: '🏢', label: 'Para Empresas' },
  { to: '/admin/enterprise-plans', icon: '📊', label: 'Planos Empresariais' },
];

export const AdminLayout = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">M</div>
          <span>Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" className="admin-nav-item view-site">
            <span className="nav-icon">🌐</span>
            <span>Ver Site</span>
          </a>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">Painel de Controle — Mundonet</div>
          <div className="admin-topbar-user">
            <div className="admin-avatar">{user?.name?.[0] || 'A'}</div>
            <span>{user?.name || 'Administrador'}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
