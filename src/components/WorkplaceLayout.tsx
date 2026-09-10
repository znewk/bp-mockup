import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import {
  DownOutlined,
  IdcardOutlined,
  LogoutOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ROLES, type RoleKey } from '../data/registry';
import logoSymbol from '../assets/img/logo2.svg';
import logoWord from '../assets/img/kmg.svg';
import './WorkplaceLayout.css';

/**
 * Каркас рабочего места — повторяет containers/default-layout основного проекта:
 * сайдбар 60px, разворачивающийся до 270px по наведению, шапка #f0f6fc с
 * названием модуля, языковой панелью и пользователем, ряд ссылок-таблеток
 * и контент на фоновой картинке.
 */

/**
 * Пункты меню — из default-layout.component.html основного проекта.
 * Оставлены только модули, которые есть в макете: остальные вели бы в никуда.
 */
const MENU = [
  { key: 'visitor', icon: <IdcardOutlined />, label: 'Посетители', to: '/workplace/reception' },
  { key: 'security', icon: <SecurityScanOutlined />, label: 'Охрана', to: '/workplace/security' },
];

/** Ряд ссылок под шапкой — enums/module-type.ts, массив AllLinks */
export interface ModuleLink {
  url: string;
  name: string;
}

interface Props {
  role: RoleKey;
  /** Название модуля в шапке */
  moduleName: string;
  /** Какой пункт меню подсвечен */
  activeMenu: string;
  links: ModuleLink[];
  children: ReactNode;
}

export default function WorkplaceLayout({
  role,
  moduleName,
  activeMenu,
  links,
  children,
}: Props) {
  const info = ROLES[role];
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState('Рус');

  return (
    <div className="app-layout">
      <aside
        className={`menu-sidebar ${expanded ? 'big-menu-sidebar' : 'mini-menu-sidebar'}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="sidebar-logo">
          <Link to="/">
            <img src={logoSymbol} alt="logo" className="sidebar-logo-logo" />
            <img src={logoWord} alt="KMG" className="sidebar-logo-name" />
          </Link>
        </div>

        <ul className="ant-menu-dark">
          {MENU.map((item) => (
            <li key={item.key} className={item.key === activeMenu ? 'menu-item selected' : 'menu-item'}>
              <Link to={item.to}>
                <i className="menu-icon">{item.icon}</i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li className="trigger-button">
            <Link to="/" title="Выйти">
              <i className="menu-icon">
                <LogoutOutlined />
              </i>
            </Link>
          </li>
        </ul>
      </aside>

      <div className="content-default">
        <header className="app-header">
          <div className="left-panel showIfBig">{moduleName}</div>
          <div className="right-panel">
            <div className="lang-panel">
              <Dropdown
                menu={{
                  items: ['Рус', 'Қаз', 'Eng']
                    .filter((l) => l !== lang)
                    .map((l) => ({ key: l, label: l, onClick: () => setLang(l) })),
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  {lang} <DownOutlined />
                </a>
              </Dropdown>
            </div>
            <a>
              <Avatar size={40} icon={<UserOutlined />} />
            </a>
            <a className="userInfo">{info.user}</a>
          </div>
        </header>

        <div className="app-content">
          <div className="inner-content">
            <div className="links">
              {links.map((l) => (
                <Link
                  key={l.url}
                  to={l.url}
                  className={pathname === l.url ? 'link activeLink' : 'link'}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
