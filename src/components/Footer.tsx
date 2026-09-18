import { useState, useEffect } from 'react';
import '../styles/Footer.css';
import { API_BASE_URL } from '../config/api';

type Settings = Record<string, { value: string; label: string }>;

export const Footer: React.FC<{ prefix?: string }> = ({ prefix = '' }) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  if (!settings) return null;

  const s = settings;
  const g = (key: string) => s[prefix + key]?.value;

  const footerBg = g('footer_bg_color') || '#001a3d';
  const aboveText = g('footer_above_text') || '';
  const subtext = g('footer_subtext') || '';
  const logoUrl = g('footer_logo_url') || g('logo_url') || '';
  const campaignLogo = g('footer_campaign_logo') || '';

  return (
    <footer className="site-footer" style={{ backgroundColor: footerBg }}>
      <div className="footer-container">
        <div className="footer-left">
          {logoUrl && (
            <a href="#" className="footer-logo-link">
              <img src={logoUrl} alt="Mundonet Telecom" className="footer-logo-img" loading="lazy" />
            </a>
          )}
          <div className="footer-info">
            {aboveText && <p className="footer-subtext-line">{aboveText}</p>}
            {subtext && <p className="footer-subtext-line">{subtext}</p>}
          </div>
        </div>
        <div className="footer-right">
          {campaignLogo && (
            <img src={campaignLogo} alt="Campanha" className="footer-campaign-logo" loading="lazy" />
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
