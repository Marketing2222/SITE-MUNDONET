import { useState, useEffect } from 'react';
import '../styles/Footer.css';
import { API_BASE_URL } from '../config/api';

type Settings = Record<string, { value: string; label: string }>;
type ContactInfo = Record<string, { value: string; label: string }>;

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [contacts, setContacts] = useState<ContactInfo | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/settings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/contact`).then(res => res.json())
    ]).then(([settingsData, contactsData]) => {
      setSettings(settingsData);
      setContacts(contactsData);
      // Load footer font if set
      if (settingsData?.footer_font?.value) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${settingsData.footer_font.value.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }).catch(console.error);
  }, []);

  if (!settings || !contacts) return null;

  const s = settings;
  const footerBg = s.footer_bg_color?.value || '#002D72';
  const footerText = s.footer_text_color?.value || '#cbd5e1';
  const footerHeading = s.footer_heading_color?.value || '#ffffff';
  const footerLink = s.footer_link_color?.value || '#93c5fd';
  const footerAbout = s.footer_about_text?.value || 'Conectando você com o mundo através de conexões de ultravelocidade 100% fibra óptica com tecnologia Wi-Fi 6 de ponta.';
  const col2Title = s.footer_col2_title?.value || 'CONTATO';
  const col3Title = s.footer_col3_title?.value || 'ATALHOS';
  const col4Title = s.footer_col4_title?.value || 'ONDE NOS ENCONTRAR';
  const subbarBg = s.footer_subbar_bg?.value || '#001240';
  const subbarText = s.footer_subbar_text?.value || '#94a3b8';
  const anatelLogo = s.footer_anatel_logo_url?.value || 'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/anatel-logo-1024x248.png';
  const footerFont = s.footer_font?.value || '';
  const footerPadding = s.footer_padding?.value || '60px 0';

  return (
    <footer className="site-footer" style={{ backgroundColor: footerBg, fontFamily: footerFont || undefined, padding: footerPadding } as React.CSSProperties}>
      <div className="container footer-grid">
        <div className="footer-col branding-col">
          <a href="#" className="footer-logo">
            <img src={s.footer_logo_url?.value || s.logo_url?.value || 'https://mundonetbandalarga.com.br/wp-content/uploads/2023/10/logo-mundonet.png'} alt="Mundonet Telecom Logo" />
          </a>
          <p className="footer-about" style={{ color: footerText }}>
            {footerAbout}
          </p>
        </div>

        <div className="footer-col">
          <h3 style={{ color: footerHeading }}>{col2Title}</h3>
          <ul className="footer-list">
            <li><a href={`tel:${contacts.phone_raw?.value || ''}`} style={{ color: footerLink }}>{contacts.phone?.value}</a></li>
            <li><a href={contacts.whatsapp?.value} target="_blank" rel="noreferrer" style={{ color: footerLink }}>WhatsApp: {contacts.phone?.value}</a></li>
            <li><a href={`mailto:${contacts.email?.value}`} style={{ color: footerLink }}>{contacts.email?.value}</a></li>
            <li><a href={contacts.maps_url?.value} target="_blank" rel="noreferrer" style={{ color: footerLink }}>{contacts.address?.value}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 style={{ color: footerHeading }}>{col3Title}</h3>
          <ul className="footer-list">
            <li><a href="#" style={{ color: footerLink }}>Início</a></li>
            <li><a href="#internet" style={{ color: footerLink }}>Planos de Internet</a></li>
            <li><a href="https://drive.google.com/file/d/1HFTbp_ISg_4flLS33RzgpcLR9INaZPfq/view?usp=sharing" target="_blank" rel="noreferrer" style={{ color: footerLink }}>Guia do Assinante</a></li>
            <li><a href="https://indique.mundonetbandalarga.com.br" target="_blank" rel="noreferrer" style={{ color: footerLink }}>Vem pra Mundonet</a></li>
            <li><a href="https://play.google.com/store/apps/details?id=com.r3r.mundonet" target="_blank" rel="noreferrer" style={{ color: footerLink }}>App Mundonet+</a></li>
            <li><a href="https://www.linkedin.com/company/mundonettelecom" target="_blank" rel="noreferrer" style={{ color: footerLink }}>Trabalhe Conosco</a></li>
            <li><a href="https://ixc.mundonetbandalarga.com.br/central_assinante_web/login" target="_blank" rel="noreferrer" style={{ color: footerLink }}>Central do Assinante</a></li>
          </ul>
        </div>

        <div className="footer-col socials-col">
          <h3 style={{ color: footerHeading }}>{col4Title}</h3>
          <div className="footer-social-icons">
            <a href={contacts.whatsapp?.value} target="_blank" rel="noreferrer" aria-label="WhatsApp" style={{ color: footerLink }}>
              <svg viewBox="0 0 448 512" width="20" height="20"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
            </a>
            <a href={contacts.instagram?.value} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: footerLink }}>
              <svg viewBox="0 0 448 512" width="20" height="20"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
            <a href={contacts.maps_url?.value} target="_blank" rel="noreferrer" aria-label="Google Business" style={{ color: footerLink }}>
              <svg viewBox="0 0 488 512" width="20" height="20"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
            </a>
          </div>
          <div className="anatel-container">
            {anatelLogo && <img src={anatelLogo} alt="Homologado Anatel" className="anatel-logo" />}
          </div>
        </div>
      </div>

      <div className="footer-sub-bar" style={{ backgroundColor: subbarBg }}>
        <div className="container sub-bar-container">
          <p className="cnpj-info" style={{ color: subbarText }}>{s.site_name?.value} | CNPJ {s.footer_cnpj?.value}</p>
          <p className="copyright-info" style={{ color: subbarText }}>© {new Date().getFullYear()} Mundonet Telecom. Todos os direitos reservados. Anatel: {s.footer_anatel?.value}</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
