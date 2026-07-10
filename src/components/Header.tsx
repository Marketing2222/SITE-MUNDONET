import { useState, useEffect } from 'react';
import '../styles/Header.css';
import { API_BASE_URL } from '../config/api';

type Settings = Record<string, { value: string; label: string }>;
type ContactInfo = Record<string, { value: string; label: string }>;

interface NavSubItem { id: string; label: string; href: string; target?: string; }
interface NavItem { id: string; label: string; href: string; target?: string; hasDropdown: boolean; items: NavSubItem[]; }

const DEFAULT_NAV: NavItem[] = [
  { id: 'planos', label: 'Planos', href: '#internet', target: '_self', hasDropdown: true, items: [{ id: 'p1', label: 'Internet', href: '#internet', target: '_self' }, { id: 'p2', label: 'Aplicativos', href: '#aplicativos', target: '_self' }, { id: 'p3', label: 'Canais de TV', href: '#entretenimento', target: '_self' }] },
  { id: 'app', label: 'App Mundonet +', href: '#app', target: '_self', hasDropdown: false, items: [] },
  { id: 'para-voce', label: 'Para Você', href: '#para-voce', target: '_self', hasDropdown: true, items: [{ id: 'v1', label: 'Vem pra Mundonet', href: 'https://indique.mundonetbandalarga.com.br', target: '_blank' }, { id: 'v2', label: 'Guia do Assinante', href: 'https://drive.google.com/file/d/1HFTbp_ISg_4flLS33RzgpcLR9INaZPfq/view?usp=sharing', target: '_blank' }] },
  { id: 'empresas', label: 'Para Empresas', href: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20para%20a%20minha%20empresa.', target: '_blank', hasDropdown: false, items: [] },
  { id: 'trabalhe', label: 'Trabalhe Conosco', href: 'https://www.linkedin.com/company/mundonettelecom', target: '_blank', hasDropdown: false, items: [] },
  { id: 'mais', label: 'MAIS', href: '#mais', target: '_self', hasDropdown: true, items: [{ id: 'm1', label: 'Contrato', href: 'https://drive.google.com/file/d/1t5XomND_mju6X07q1I3HFfQpdb81PXwJ/view?usp=sharing', target: '_blank' }, { id: 'm2', label: 'Contato', href: '#contact', target: '_self' }] },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [contacts, setContacts] = useState<ContactInfo | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/settings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/contact`).then(res => res.json())
    ]).then(([settingsData, contactsData]: [Settings, ContactInfo]) => {
      setSettings(settingsData);
      setContacts(contactsData);
      if (settingsData?.primary_color?.value) {
        document.documentElement.style.setProperty('--primary', settingsData.primary_color.value);
      }
      if (settingsData?.header_font?.value) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${settingsData.header_font.value.replace(/ /g, '+')}:wght@400;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
      if (settingsData?.header_height?.value) {
        document.documentElement.style.setProperty('--header-height', settingsData.header_height.value + 'px');
      }
      // Load nav menu
      if (settingsData?.nav_menu?.value) {
        try { setNavItems(JSON.parse(settingsData.nav_menu.value)); } catch { /* use default */ }
      }
    }).catch(console.error);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const s = settings;
  const headerBg = s?.header_bg_color?.value || '#002D72';
  const headerText = s?.header_text_color?.value || '#ffffff';
  const topbarBg = s?.header_topbar_bg?.value || '#001a4d';
  const topbarText = s?.header_topbar_text?.value || '#ffffff';
  const headerFont = s?.header_font?.value || '';
  const headerHeight = s?.header_height?.value || '80';
  const portalUrl = s?.header_portal_url?.value || 'https://ixc.mundonetbandalarga.com.br/central_assinante_web/login';
  const portalText = s?.header_portal_text?.value || 'Portal do Assinante';
  const portalBg = s?.header_portal_bg?.value || '#4f46e5';
  const portalTextColor = s?.header_portal_text_color?.value || '#ffffff';
  const portalPosition = s?.header_portal_position?.value || 'navbar_right';

  const renderPortalBtn = (wrapperClass: string, extraStyle?: React.CSSProperties) => (
    <div className={wrapperClass} style={extraStyle}>
      <a href={portalUrl} target="_blank" rel="noreferrer" className="portal-btn"
        style={{ backgroundColor: portalBg, color: portalTextColor }}>
        {portalText}
      </a>
    </div>
  );

  // Nav spacing from settings
  const navGap = s?.nav_item_gap?.value || '8px';
  const navItemPadding = s?.nav_item_padding?.value || '8px 12px';
  const navDropdownWidth = s?.nav_dropdown_width?.value || '220px';
  const navDropdownPadding = s?.nav_dropdown_padding?.value || '8px 0';
  const navSubitemPadding = s?.nav_subitem_padding?.value || '10px 20px';
  const navFontSize = s?.nav_font_size?.value || '0.9rem';
  const currentPath = window.location.pathname;

  return (
    <header
      className={`site-header ${isScrolled ? 'sticky' : ''}`}
      style={{ fontFamily: headerFont || undefined, '--header-height': headerHeight + 'px' } as React.CSSProperties}
    >
      <div className="top-bar" style={{ backgroundColor: topbarBg, color: topbarText }}>
        <div className="container top-bar-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Segment links na mesma linha do topo */}
            <div className="topbar-segment" style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: 12 }}>
              <a href="/" className={`segment-link ${currentPath === '/' || currentPath.startsWith('/admin') ? 'active' : ''}`}
                style={{ color: currentPath === '/' || currentPath.startsWith('/admin') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                Para você
              </a>
              <a href="/para-empresas" className={`segment-link ${currentPath === '/para-empresas' ? 'active' : ''}`}
                style={{ color: currentPath === '/para-empresas' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                Para empresas
              </a>
            </div>
            {portalPosition === 'topbar_left' && renderPortalBtn('topbar-cta', { transform: 'scale(0.85)', transformOrigin: 'left center', margin: '-10px 0' })}
            <div className="contact-info" style={{ color: topbarText }}>
              <span>
                <svg viewBox="0 0 512 512" width="14" height="14">
                  <path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                </svg>
                {contacts?.phone?.value || '(98) 3042-0030'}
              </span>
              <span>
                <svg viewBox="0 0 512 512" width="14" height="14">
                  <path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.9V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5.1 5.7-8 9.7-4.9L256 342.4l246.3-151.6zM256 294.4L11.7 144.5c-4.1-2.5-4.2-8.5-.1-11L244 4c7.6-4.7 17.4-4.7 25 0l232.4 129.5c4.1 2.5 4 8.5-.1 11L256 294.4z"/>
                </svg>
                {contacts?.email?.value || 'contato@mundonetbandalarga.com.br'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {portalPosition === 'topbar_right' && renderPortalBtn('topbar-cta', { transform: 'scale(0.85)', transformOrigin: 'right center', margin: '-10px 0' })}
            <div className="social-links">
              <a href={contacts?.whatsapp?.value || '#'} target="_blank" rel="noreferrer" style={{ color: topbarText }}>
                <svg viewBox="0 0 448 512" width="16" height="16">
                  <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
              <a href={contacts?.instagram?.value || '#'} target="_blank" rel="noreferrer" style={{ color: topbarText }}>
                <svg viewBox="0 0 448 512" width="16" height="16">
                  <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar" style={{ backgroundColor: headerBg }}>
        <div className="container navbar-container" style={{ gap: portalPosition === 'navbar_left' ? 32 : undefined }}>
          <a href="#" className="logo">
            <img src={s?.logo_url?.value || 'https://mundonetbandalarga.com.br/wp-content/uploads/2023/10/logo-mundonet.png'} alt="Mundonet Telecom" />
          </a>
          
          {portalPosition === 'navbar_left' && renderPortalBtn('nav-cta-wrapper', { marginLeft: 0, marginRight: 'auto' })}

          <button
            className={`hamburger-menu ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            style={{ color: headerText }}
          >
            <span style={{ backgroundColor: headerText }}></span>
            <span style={{ backgroundColor: headerText }}></span>
            <span style={{ backgroundColor: headerText }}></span>
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}
            style={{
              backgroundColor: mobileMenuOpen ? headerBg : undefined,
              '--nav-font-size': navFontSize,
              '--nav-gap': navGap,
              '--nav-item-padding': navItemPadding,
              '--nav-dropdown-width': navDropdownWidth,
              '--nav-dropdown-padding': navDropdownPadding,
              '--nav-subitem-padding': navSubitemPadding
            } as React.CSSProperties}>
            <ul>
              {navItems.map(item => (
                <li key={item.id} className={`${item.hasDropdown && item.items.length > 0 ? 'has-dropdown' : ''} ${activeDropdown === item.id ? 'open' : ''}`}>
                  <a
                    href={item.href}
                    target={item.target || '_self'}
                    rel={item.target === '_blank' ? 'noreferrer' : undefined}
                    style={{ color: headerText }}
                    onClick={item.hasDropdown && item.items.length > 0
                      ? (e) => { e.preventDefault(); toggleDropdown(item.id); }
                      : () => setMobileMenuOpen(false)
                    }
                  >
                    {item.label}
                    {item.hasDropdown && item.items.length > 0 && (
                      <svg className="chevron-icon" viewBox="0 0 320 512" width="10" height="10">
                        <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1z"/>
                      </svg>
                    )}
                  </a>
                  {item.hasDropdown && item.items.length > 0 && (
                    <ul className="dropdown-menu">
                      {item.items.map(sub => (
                        <li key={sub.id}>
                          <a
                            href={sub.href}
                            target={sub.target || '_self'}
                            rel={sub.target === '_blank' ? 'noreferrer' : undefined}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {portalPosition === 'navbar_right' 
              ? renderPortalBtn('nav-cta-wrapper') 
              : renderPortalBtn('nav-cta-wrapper mobile-portal-fallback')}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;

