import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { isLoggedIn } from './admin/hooks/useAuth';
import { API_BASE_URL } from './config/api';

// Public site components
import Header from './components/Header';
import Hero from './components/Hero';
import QuickLinks from './components/QuickLinks';
import Plans from './components/Plans';
import AppSection from './components/AppSection';
import Specialties from './components/Specialties';
import Entertainment from './components/Entertainment';
import CtaBanner from './components/CtaBanner';
import Support from './components/Support';
import Benefits from './components/Benefits';
import Contact from './components/Contact';
import ExitPopup from './components/ExitPopup';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import IndiqueGanhe from './components/IndiqueGanhe';

// Admin components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/pages/DashboardHome';
import ManagePlans from './admin/pages/ManagePlans';
import ManageHero from './admin/pages/ManageHero';
import ManageEntertainment from './admin/pages/ManageEntertainment';
import ManageContact from './admin/pages/ManageContact';
import ManageSettings from './admin/pages/ManageSettings';
import ManageHeaderFooter from './admin/pages/ManageHeaderFooter';
import ManageHomeSections from './admin/pages/ManageHomeSections';
import { ManageSiteCustomization } from './admin/pages/ManageSiteCustomization';
import ManageLandingPage from './admin/pages/ManageLandingPage';
import ManageIndiqueGanhe from './admin/pages/ManageIndiqueGanhe';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function PublicSite() {
  const [floatLink, setFloatLink] = useState('https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.');
  const [floatImage, setFloatImage] = useState('');
  const [floatSize, setFloatSize] = useState('60px');
  const [floatColor, setFloatColor] = useState('#25D366');
  const [floatIconColor, setFloatIconColor] = useState('#ffffff');
  const [floatShadow, setFloatShadow] = useState('rgba(37,211,102,0.4)');
  const [bubbleText, setBubbleText] = useState('Olá! Precisa de ajuda?');
  const [bubbleBg, setBubbleBg] = useState('#ffffff');
  const [bubbleColor, setBubbleColor] = useState('#333333');
  const [bubbleFontSize, setBubbleFontSize] = useState('14px');
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [sectionOrder, setSectionOrder] = useState<string[] | null>(null);
  const [sectionsActive, setSectionsActive] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp_float?.value) setFloatLink(data.whatsapp_float.value);
        if (data.wa_btn_link?.value) setFloatLink(data.wa_btn_link.value);
        if (data.wa_btn_image?.value) setFloatImage(data.wa_btn_image.value);
        if (data.wa_btn_size?.value) setFloatSize(data.wa_btn_size.value);
        if (data.wa_btn_color?.value) setFloatColor(data.wa_btn_color.value);
        if (data.wa_btn_icon_color?.value) setFloatIconColor(data.wa_btn_icon_color.value);
        if (data.wa_btn_shadow?.value) setFloatShadow(data.wa_btn_shadow.value);
        if (data.wa_bubble_text?.value) setBubbleText(data.wa_bubble_text.value);
        if (data.wa_bubble_bg?.value) setBubbleBg(data.wa_bubble_bg.value);
        if (data.wa_bubble_color?.value) setBubbleColor(data.wa_bubble_color.value);
        if (data.wa_bubble_font_size?.value) setBubbleFontSize(data.wa_bubble_font_size.value);
        if (data.sections_order?.value) {
          try {
            const parsed = JSON.parse(data.sections_order.value);
            if (Array.isArray(parsed) && parsed.length > 0) setSectionOrder(parsed);
          } catch { /* use default */ }
        }
        if (data.sections_active?.value) {
          try {
            const parsed = JSON.parse(data.sections_active.value);
            if (typeof parsed === 'object' && parsed !== null) setSectionsActive(parsed);
          } catch { /* use default */ }
        }
      })
      .catch(console.error);
  }, []);

  const componentMap: Record<string, React.ReactNode> = {
    hero: <Hero />,
    quicklinks: <QuickLinks />,
    plans: <Plans />,
    benefits: <Benefits />,
    app: <AppSection />,
    specialties: <Specialties />,
    entertainment: <Entertainment />,
    cta: <CtaBanner />,
    support: <Support />,
    contact: <Contact />,
  };

  const defaultOrder = ['hero', 'quicklinks', 'plans', 'benefits', 'app', 'specialties', 'entertainment', 'cta', 'support', 'contact'];

  const mergeOrder = (saved: string[]): string[] => {
    const merged = [...saved];
    for (const id of defaultOrder) {
      if (!merged.includes(id)) merged.push(id);
    }
    return merged;
  };

  const order = sectionOrder ? mergeOrder(sectionOrder) : defaultOrder;

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(var(--header-height) + 36px)' }}>
        {order.map(id => {
          if (sectionsActive && sectionsActive[id] === false) return null;
          const Component = componentMap[id];
          return Component ? <React.Fragment key={id}>{Component}</React.Fragment> : null;
        })}
      </main>
      <Footer />
      <div className={`whatsapp-float-wrapper ${!bubbleVisible ? 'bubble-closed' : ''}`}>
        {bubbleText && bubbleVisible && (
          <div
            className="whatsapp-bubble"
            style={{
              backgroundColor: bubbleBg,
              color: bubbleColor,
              fontSize: bubbleFontSize,
            }}
          >
            <button
              className="whatsapp-bubble-close"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBubbleVisible(false); }}
              style={{ color: bubbleColor }}
            >×</button>
            <span>{bubbleText}</span>
            <div className="whatsapp-bubble-arrow" style={{ borderTopColor: bubbleBg }}></div>
          </div>
        )}
        <a
          href={floatLink}
          target="_blank"
          rel="noreferrer"
          className={`whatsapp-float ${floatImage ? 'whatsapp-float--custom' : ''} animate-fade-in`}
          aria-label="Falar pelo WhatsApp"
          style={{
            backgroundColor: floatImage ? 'transparent' : floatColor,
            width: floatImage ? 'auto' : floatSize,
            height: floatImage ? 'auto' : floatSize,
            boxShadow: floatImage ? 'none' : `0 4px 12px ${floatShadow}`,
          }}
        >
          {floatImage ? (
            <img src={floatImage} alt="WhatsApp" className="whatsapp-float-img" />
          ) : (
            <svg viewBox="0 0 448 512" style={{ width: '55%', height: '55%', fill: floatIconColor }}>
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          )}
        </a>
      </div>
      <ExitPopup />
    </>
  );
}

function App() {
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/site-settings`)
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        const root = document.documentElement;
        root.style.removeProperty('--global-bg');
        root.style.removeProperty('--global-text');
        root.style.removeProperty('--global-title');
        root.style.removeProperty('--section-spacing');
        root.style.removeProperty('--global-accent');
        root.style.removeProperty('--global-accent-hover');
        root.style.removeProperty('--global-button-bg');
        root.style.removeProperty('--global-button-text');
        root.style.removeProperty('--section-bg');
        root.style.removeProperty('--section-border');
        root.style.removeProperty('--global-card-bg');
        root.style.removeProperty('--global-card-text');
        root.style.removeProperty('--hero-overlay');
        root.style.removeProperty('--global-border-radius');
        root.style.removeProperty('--color-primary');
        root.style.removeProperty('--color-primary-hover');
        root.style.removeProperty('--color-primary-light');
        root.style.removeProperty('--hero-height');
        root.style.removeProperty('--hero-width');
        root.style.removeProperty('--hero-btn1-bg');
        root.style.removeProperty('--hero-btn1-text');
        root.style.removeProperty('--hero-btn2-bg');
        root.style.removeProperty('--hero-btn2-text');
        if (data.customization_enabled === false) return;
        if (data.bg_color) root.style.setProperty('--global-bg', data.bg_color);
        if (data.text_color) root.style.setProperty('--global-text', data.text_color);
        if (data.title_color) root.style.setProperty('--global-title', data.title_color);
        if (data.primary_font) {
          root.style.setProperty('--font-family-body', data.primary_font);
          root.style.setProperty('--font-family-title', data.primary_font);
          const fontName = data.primary_font.split(',')[0].replace(/'/g, '').trim();
          if (!document.querySelector(`link[href*="${fontName}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
            document.head.appendChild(link);
          }
        }
        if (data.section_spacing) root.style.setProperty('--section-spacing', data.section_spacing);
        if (data.accent_color) {
          root.style.setProperty('--global-accent', data.accent_color);
          root.style.setProperty('--color-primary', data.accent_color);
          root.style.setProperty('--color-primary-light', data.accent_color + '20');
        }
        if (data.accent_hover_color) {
          root.style.setProperty('--global-accent-hover', data.accent_hover_color);
          root.style.setProperty('--color-primary-hover', data.accent_hover_color);
        }
        if (data.button_bg_color) root.style.setProperty('--global-button-bg', data.button_bg_color);
        if (data.button_text_color) root.style.setProperty('--global-button-text', data.button_text_color);
        if (data.section_bg_color) root.style.setProperty('--section-bg', data.section_bg_color);
        if (data.section_border_color) root.style.setProperty('--section-border', data.section_border_color);
        if (data.card_bg_color) root.style.setProperty('--global-card-bg', data.card_bg_color);
        if (data.card_text_color) root.style.setProperty('--global-card-text', data.card_text_color);
        if (data.hero_overlay_color) root.style.setProperty('--hero-overlay', data.hero_overlay_enabled === false ? 'transparent' : data.hero_overlay_color);
        if (data.border_radius) root.style.setProperty('--global-border-radius', data.border_radius);
        if (data.hero_height) root.style.setProperty('--hero-height', Number(data.hero_height) + 'px');
        if (data.hero_width) root.style.setProperty('--hero-width', data.hero_width + 'px');
        if (data.hero_btn1_bg) root.style.setProperty('--hero-btn1-bg', data.hero_btn1_bg);
        if (data.hero_btn1_text_color) root.style.setProperty('--hero-btn1-text', data.hero_btn1_text_color);
        if (data.hero_btn2_bg) root.style.setProperty('--hero-btn2-bg', data.hero_btn2_bg);
        if (data.hero_btn2_text_color) root.style.setProperty('--hero-btn2-text', data.hero_btn2_text_color);
      })
      .catch(console.error);

    // Carrega o favicon das configurações gerais
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const url = data.favicon_url?.value;
        if (url) {
          let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = url;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/vem-pra-mundonet" element={<LandingPage />} />
      <Route path="/indique-e-ganhe" element={<IndiqueGanhe />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="plans" element={<ManagePlans />} />
        <Route path="hero" element={<ManageHero />} />
        <Route path="entertainment" element={<ManageEntertainment />} />
        <Route path="contact" element={<ManageContact />} />
        <Route path="settings" element={<ManageSettings />} />
        <Route path="site-settings" element={<ManageSiteCustomization />} />
        <Route path="header-footer" element={<ManageHeaderFooter />} />
        <Route path="home-sections" element={<ManageHomeSections />} />
        <Route path="landing-page" element={<ManageLandingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
