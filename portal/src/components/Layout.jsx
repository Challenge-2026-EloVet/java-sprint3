import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Usuários', path: '/usuarios', icon: '👥' },
  { label: 'Pets', path: '/pets', icon: '🐾' },
  { label: 'Veterinários', path: '/veterinarios', icon: '⚕️' },
  { label: 'Care Plans', path: '/care-plans', icon: '📋' },
];

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="layout-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">
            <img src="/favicon.svg" alt="Elo Vet" />
          </div>
          <div>
            <h3>Elo Vet</h3>
            <small>Portal</small>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">🏥 Clínica Veterinária</p>
            <h2>Gestão de cuidados</h2>
          </div>

          <button className="btn btn-secondary" onClick={logout}>
            🚪 Sair
          </button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

