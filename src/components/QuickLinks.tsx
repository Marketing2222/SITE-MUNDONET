import { useState, useEffect } from 'react';
import '../styles/QuickLinks.css';
import { API_BASE_URL } from '../config/api';

interface QuickLink {
  id: number;
  title: string;
  description: string;
  url: string;
  button_text: string;
  icon_type: string;
  card_bg?: string;
  icon_bg?: string;
  icon_color?: string;
  title_color?: string;
  title_font_size?: string;
  desc_color?: string;
  desc_font_size?: string;
  btn_color?: string;
}

const renderIcon = (type: string) => {
  if (type === 'document') return <svg viewBox="0 0 384 512" className="link-icon"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l9.7 9.8c4.5 4.5 7 10.6 7 17zM96 280c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16z"/></svg>;
  if (type === 'chat') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M256 32C132.3 32 32 120.2 32 228.8c0 38.6 12.8 74.3 34.6 103.5L34.1 445.4c-3.4 10.2 6.1 20 16.2 16.2l113.8-42.3c27 15.6 57.7 24.5 91.9 24.5 123.7 0 224-88.2 224-196.8S379.7 32 256 32zm0 320c-15.5 0-28-12.5-28-28s12.5-28 28-28 28 12.5 28 28-12.5 28-28 28zm28-96h-56v-96h56v96z"/></svg>;
  if (type === 'speed') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 336c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112zm-32-112c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm45.3-77.3c6.2-6.2 16.4-6.2 22.6 0l22.6 22.6c6.2 6.2 6.2 16.4 0 22.6l-58 58c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6l46.7-49.3z"/></svg>;
  if (type === 'star') return <svg viewBox="0 0 576 512" className="link-icon"><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.4 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L380.9 150.3 316.9 18z"/></svg>;
  if (type === 'globe') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.3-20.8 3.2-42.3 3.2-64s-.9-43.2-3.2-64zm112.6-32H376.7c-7.1-26.8-16.5-52.3-28.4-75.5 44.1 10.2 81.4 36.9 106.2 75.5zm-288.7 0H44.7c24.8-38.6 62.1-65.3 106.2-75.5C139 69.7 129.6 95.2 122.5 122.5zM119.2 192c2.3 20.8 3.2 42.3 3.2 64s-.9 43.2-3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64H119.2zm6.3 160H256v128H186.3c-5.9-10.9-14-29.2-19.9-53.8C156.6 393.2 144.3 352 125.5 352zm181.5 0H386.5c-18.8 0-31.1 41.2-40.8 74.2-5.9 24.6-14 42.9-19.9 53.8H256V352zm0-320V0h69.7c5.9 10.9 14 29.2 19.9 53.8 9.7 33 22 74.2 40.8 74.2H256zM256 0v32H186.3c5.9-10.9 14-29.2 19.9-53.8C215.4-10.8 227.7-32 256-32V0zm0 128c18.8 0 31.1-41.2 40.8-74.2 5.9-24.6 14-42.9 19.9-53.8H256V32v96zm0 384h69.7c-5.9 10.9-14 29.2-19.9 53.8-9.7 33-22 74.2-40.8 74.2H256v-96v-32z"/></svg>;
  if (type === 'shield') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/></svg>;
  if (type === 'phone') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>;
  if (type === 'mail') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>;
  if (type === 'clock') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zm152 248c0 8.8-7.2 16-16 16H272V312c0 61.9-50.1 112-112 112s-112-50.1-112-112s50.1-112 112-112c30.1 0 57.4 11.9 77.6 31.2l12.8-12.8c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L248 248h-8c-48.6 0-88 39.4-88 88s39.4 88 88 88 88-39.4 88-88v-80c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16z"/></svg>;
  if (type === 'download') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56c0 13.3-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24z"/></svg>;
  if (type === 'gift') return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M190.5 68.8L225.3 128H224 176c-17.7 0-32-14.3-32-32s14.3-32 32-32h16.5c5.5 0 10.9 1.3 15.8 3.8zM288 160v-32.2c0-35.3-28.7-64-64-64s-64 28.7-64 64H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32V448c0 35.3 28.7 64 64 64H416c35.3 0 64-28.7 64-64V288c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32H288zM352 160V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v32H352zM224 288V448H128V288h96zm160 0V448H288V288h96z"/></svg>;
  return <svg viewBox="0 0 512 512" className="link-icon"><path fill="currentColor" d="M256 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96z"/></svg>;
};

export const QuickLinks: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [title, setTitle] = useState('Como podemos te ajudar hoje?');
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/quicklinks`)
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(console.error);

    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.quicklinks_title?.value) {
          setTitle(data.quicklinks_title.value);
        }
        if (data.quicklinks_bg_color?.value) setBgColor(data.quicklinks_bg_color.value);
      })
      .catch(console.error);
  }, []);

  if (links.length === 0) return null;

  return (
    <section className="quicklinks-section" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="container">
        <h2 className="site-section-title text-center">{title}</h2>
        <div className="quicklinks-grid">
          {links.map((link) => {
            const cardStyle: React.CSSProperties = {};
            if (link.card_bg) cardStyle.backgroundColor = link.card_bg;
            const iconWrapperStyle: React.CSSProperties = {};
            if (link.icon_bg) iconWrapperStyle.backgroundColor = link.icon_bg;
            if (link.icon_color) iconWrapperStyle.color = link.icon_color;
            const titleStyle: React.CSSProperties = {};
            if (link.title_color) titleStyle.color = link.title_color;
            if (link.title_font_size) titleStyle.fontSize = link.title_font_size;
            const descStyle: React.CSSProperties = {};
            if (link.desc_color) descStyle.color = link.desc_color;
            if (link.desc_font_size) descStyle.fontSize = link.desc_font_size;
            const btnStyle: React.CSSProperties = {};
            if (link.btn_color) btnStyle.color = link.btn_color;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="quicklink-card animate-zoom-in"
                style={cardStyle}
              >
                <div className="card-header">
                  <div className="icon-wrapper" style={iconWrapperStyle}>{renderIcon(link.icon_type)}</div>
                  <h3 style={titleStyle}>{link.title}</h3>
                </div>
                <p className="card-desc" style={descStyle}>{link.description}</p>
                <div className="card-footer">
                  <span className="card-btn-text" style={btnStyle}>{link.button_text}</span>
                  <svg viewBox="0 0 256 512" className="arrow-icon" width="10" height="10">
                    <path fill="currentColor" d="M224.3 273l-192 184c-6.2 6-16.3 5.6-22-1l-15-15.6c-5.7-6-5.2-16 .9-21.6L171.2 256 9.8 95.8c-6-5.6-6.5-15.6-.9-21.6l15-15.6c5.7-6.6 15.8-7 22-1l192 184c7.6 7 7.6 17 0 24z"/>
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default QuickLinks;