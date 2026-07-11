import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Benefits.css';
import { API_BASE_URL } from '../config/api';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon_type: string;
  icon_bg?: string;
  icon_color?: string;
  title_color?: string;
  desc_color?: string;
}

const renderIcon = (type: string) => {
  const s = "benefit-svg-icon";
  switch (type) {
    case 'star': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    case 'speed': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-.27-10.44zm-9.79 6.84a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z"/></svg>;
    case 'clock': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1h4.5V7h1v6z"/></svg>;
    case 'globe': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
    case 'download': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>;
    case 'chat': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>;
    case 'shield': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>;
    case 'gift': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/></svg>;
    case 'wifi': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12.01 21.49L23.64 7c-3.45-3.19-8.84-5.12-11.62-5.12S3.83 3.81.38 7l11.63 14.49.01-.01z"/></svg>;
    case 'dollar': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
    case 'signal': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M2 22h20V2z" opacity=".3"/><path fill="currentColor" d="M2 22h20V2L2 22zm18-2H6.83L20 6.83V20z"/></svg>;
    case 'wrench': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>;
    case 'gear': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>;
    case 'gamepad': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>;
    case 'router': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M20.2 5.9l.8-.6C17.1 1.7 12 1.7 7 3.5L7.8 4.1c4.3-1.5 9.2-1.5 13.4 0l-1-.2zM12 7.5c-3 0-5.7 1.1-7.8 2.9l.8.6C6.8 9.4 9.3 8.5 12 8.5s5.2.9 7 2.5l.8-.6c-2.1-1.8-4.8-2.9-7.8-2.9zm0 4c-1.8 0-3.5.7-4.8 1.8l.8.6C9.2 12.8 10.5 12.5 12 12.5s2.8.3 4 1.4l.8-.6c-1.3-1.1-3-1.8-4.8-1.8zM12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>;
    case 'chip': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"/></svg>;
    case 'handshake': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12.22 19.85c-.18.18-.5.18-.67 0l-3.5-3.5c-.18-.18-.18-.5 0-.68l.35-.35c.18-.18.5-.18.68 0l2.82 2.83 6.36-6.36c.18-.18.5-.18.68 0l.35.35c.18.18.18.5 0 .68l-7.07 7.03zM7.5 14.5l-2.12-2.12-1.42 1.42 2.12 2.12 1.42-1.42zM20 4l-6 6-2.12-2.12L16 2h4v2zM2 20l6-6 2.12 2.12L6 22H2v-2z"/></svg>;
    case 'heart': return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
    default: return <svg viewBox="0 0 24 24" className={s}><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
  }
};

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 256 512">
    <path fill="#94A3B8" d="M224.3 273l-192 184c-6.2 6-16.3 5.6-22-1l-15-15.6c-5.7-6-5.2-16 .9-21.6L171.2 256 9.8 95.8c-6-5.6-6.5-15.6-.9-21.6l15-15.6c5.7-6.6 15.8-7 22-1l192 184c7.6 7 7.6 17 0 24z"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 256 512">
    <path fill="#94A3B8" d="M224.3 273l-192 184c-6.2 6-16.3 5.6-22-1l-15-15.6c-5.7-6-5.2-16 .9-21.6L171.2 256 9.8 95.8c-6-5.6-6.5-15.6-.9-21.6l15-15.6c5.7-6.6 15.8-7 22-1l192 184c7.6 7 7.6 17 0 24z"/>
  </svg>
);

export const Benefits: React.FC = () => {
  const [items, setItems] = useState<Benefit[]>([]);
  const [title, setTitle] = useState('Benefícios e vantagens de ser cliente Mundonet');
  const [bgColor, setBgColor] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/benefits`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(console.error);

    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.benefits_title?.value) setTitle(data.benefits_title.value);
        if (data.benefits_bg_color?.value) setBgColor(data.benefits_bg_color.value);
      })
      .catch(console.error);
  }, []);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, items]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 240;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="benefits-section" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="container">
        <h2 className="site-section-title text-center">{title}</h2>
        <div className="benefits-scroll-container">
          <button className="benefits-scroll-btn" onClick={() => scroll('left')} disabled={!canScrollLeft}><ArrowLeft /></button>
          <div className="benefits-scroll-wrapper" ref={scrollRef}>
            <div className="benefits-grid">
              {items.map(item => {
                const iwStyle: React.CSSProperties = {};
                if (item.icon_bg) iwStyle.backgroundColor = item.icon_bg;
                if (item.icon_color) iwStyle.color = item.icon_color;
                const titleStyle: React.CSSProperties = {};
                if (item.title_color) titleStyle.color = item.title_color;
                const descStyle: React.CSSProperties = {};
                if (item.desc_color) descStyle.color = item.desc_color;
                return (
                  <div key={item.id} className="benefit-card animate-zoom-in">
                    <div className="benefit-icon-wrapper" style={iwStyle}>{renderIcon(item.icon_type)}</div>
                    <h3 style={titleStyle}>{item.title}</h3>
                    <p className="benefit-description" style={descStyle}>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <button className="benefits-scroll-btn" onClick={() => scroll('right')} disabled={!canScrollRight}><ArrowRight /></button>
        </div>
      </div>
    </section>
  );
};
export default Benefits;