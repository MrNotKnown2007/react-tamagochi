import { NavLink, Outlet } from 'react-router-dom'
import './TabsLayout.css'

export default function TabsLayout() {
  return (
    <div className="tabs-layout">
      <div className="tabs-content">
        <Outlet />
      </div>
      <nav className="tabs-nav">
        <NavLink to="/tabs" end className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
          <img src="/models/models/icons/buttons/move/main.png" alt="Главная" className="tab-icon-img" />
        </NavLink>
        <NavLink to="/tabs/games" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
          <img src="/models/models/icons/buttons/move/games.png" alt="Игры" className="tab-icon-img" />
        </NavLink>
        <NavLink to="/tabs/shop" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
          <img src="/models/models/icons/buttons/move/shop.png" alt="Магазин" className="tab-icon-img" />
        </NavLink>
        <NavLink to="/tabs/stats" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
          <img src="/models/models/icons/buttons/move/stat.png" alt="Статистика" className="tab-icon-img" />
        </NavLink>
      </nav>
    </div>
  )
}
