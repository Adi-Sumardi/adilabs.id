import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const TABS = [
  { to: '/dashboard', label: 'Artikel', end: true },
  { to: '/dashboard/portofolio', label: 'Portofolio Produk' },
  { to: '/dashboard/iklan', label: 'Iklan' },
  { to: '/dashboard/running-teks', label: 'Running Teks' },
  { to: '/dashboard/teks-hero', label: 'Teks Hero' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dash">
      <nav className="dash-nav">
        <div className="brand">adi<span>labs</span> · Dashboard</div>
        <div className="who">
          <span>{user?.name}</span>
          <button onClick={logout}>Keluar</button>
        </div>
      </nav>

      <div className="dash-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `dash-tab${isActive ? ' active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
