import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-title">Cryptonite</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/realtime" className={({ isActive }) => isActive ? 'active' : ''}>
            Realtime Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/ai" className={({ isActive }) => isActive ? 'active' : ''}>
            AI Recommendation
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
