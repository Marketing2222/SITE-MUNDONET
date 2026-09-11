import { useState, useEffect } from 'react';
import '../styles/Campaign.css';
import { API_BASE_URL } from '../config/api';

export const Campaign: React.FC = () => {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {};
        for (const [key, obj] of Object.entries(data)) {
          map[key] = (obj as any).value;
        }
        setS(map);
      })
      .catch(console.error);
  }, []);

  const sectionBgColor = s.campaign_section_bg_color || '';
  const bgImage = s.campaign_bg_image || '';
  const overlayColor = s.campaign_overlay_color || 'rgba(0,0,0,0.75)';
  const logoUrl = s.campaign_logo_url || '';
  const logo2Url = s.campaign_logo2_url || '';
  const title = s.campaign_title || 'Campanha Especial';
  const subtitle = s.campaign_subtitle || 'Aproveite nossas ofertas exclusivas';
  const btnText = s.campaign_btn_text || 'Saiba Mais';
  const btnLink = s.campaign_btn_link || '#';
  const btnBg = s.campaign_btn_bg || '#ffffff';
  const btnColor = s.campaign_btn_color || '#1a0a2e';
  const textColor = s.campaign_text_color || '#ffffff';
  const subtitleColor = s.campaign_subtitle_color || '#d1d5db';
  const videoUrl = s.campaign_video_url || '';
  const contentPosition = s.campaign_content_position || 'left';

  const getVideoEmbed = (url: string): string => {
    if (!url) return '';
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  const videoEmbed = getVideoEmbed(videoUrl);

  const containerStyle: React.CSSProperties = {
    background: bgImage
      ? `linear-gradient(to right, ${overlayColor} 0%, ${overlayColor}cc 50%, transparent 100%), url(${bgImage}) center/cover no-repeat`
      : `linear-gradient(135deg, #1a0a2e 0%, #2d1b69 100%)`,
    backgroundColor: bgImage ? undefined : sectionBgColor || '#1a0a2e',
  };

  const isRight = contentPosition === 'right';

  return (
    <section className="campaign-section" style={{ backgroundColor: sectionBgColor || undefined }}>
      <div className="campaign-container" style={containerStyle}>
        <div className="campaign-inner" style={{ flexDirection: isRight ? 'row-reverse' : 'row' }}>
          <div className="campaign-content">
            <div className="campaign-logos">
              {logoUrl && <img src={logoUrl} alt="Logo Campanha" className="campaign-logo" />}
              {logo2Url && <img src={logo2Url} alt="Logo 2" className="campaign-logo campaign-logo--secondary" />}
            </div>
            <h2 className="campaign-title" style={{ color: textColor }}>{title}</h2>
            {subtitle && <p className="campaign-subtitle" style={{ color: subtitleColor }}>{subtitle}</p>}
            {btnText && (
              <a
                href={btnLink}
                target="_blank"
                rel="noreferrer"
                className="campaign-btn"
                style={{ backgroundColor: btnBg, color: btnColor }}
              >
                {btnText}
              </a>
            )}
          </div>
          {videoEmbed && (
            <div className="campaign-video-wrapper">
              <iframe
                src={videoEmbed}
                title="Vídeo da Campanha"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="campaign-video"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Campaign;
