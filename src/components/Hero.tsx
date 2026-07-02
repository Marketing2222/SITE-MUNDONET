import { useState, useEffect } from 'react';
import '../styles/Hero.css';

interface Slide {
  id: number;
  url: string;
  title: string;
  subtitle: string;
}

interface SiteSettings {
  hero_show_buttons?: boolean;
  hero_transition?: string;
  hero_btn1_text?: string;
  hero_btn1_link?: string;
  hero_btn1_bg?: string;
  hero_btn1_text_color?: string;
  hero_btn2_text?: string;
  hero_btn2_link?: string;
  hero_btn2_bg?: string;
  hero_btn2_text_color?: string;
}

export const Hero: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetch('http://localhost:3001/api/hero')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(console.error);

    fetch('http://localhost:3001/api/site-settings')
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  const showButtons = siteSettings.hero_show_buttons !== false;
  const transition = siteSettings.hero_transition || 'fade';
  const btn1Text = siteSettings.hero_btn1_text || 'Ver Planos';
  const btn1Link = siteSettings.hero_btn1_link || '#internet';
  const btn1Bg = siteSettings.hero_btn1_bg || '#ff6a00';
  const btn1Color = siteSettings.hero_btn1_text_color || '#ffffff';
  const btn2Text = siteSettings.hero_btn2_text || 'Falar com Atendente';
  const btn2Link = siteSettings.hero_btn2_link || 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.';
  const btn2Bg = siteSettings.hero_btn2_bg || 'rgba(255, 255, 255, 0.15)';
  const btn2Color = siteSettings.hero_btn2_text_color || '#ffffff';

  return (
    <section className={`hero-section hero-transition-${transition}`}>
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.url} alt={slide.title} className="slide-img" />
            <div className="slide-overlay"></div>
            <div className="container slide-content-container">
              <div className="slide-text">
                <h1 className="animate-slide-up">{slide.title}</h1>
                <p className="animate-fade-in">{slide.subtitle}</p>
                {showButtons && (
                  <div className="hero-ctas animate-slide-up">
                    <a href={btn1Link} className="hero-primary-btn" style={{ backgroundColor: btn1Bg, color: btn1Color }}>
                      {btn1Text}
                    </a>
                    <a
                      href={btn2Link}
                      target="_blank"
                      rel="noreferrer"
                      className="hero-secondary-btn"
                      style={{ backgroundColor: btn2Bg, color: btn2Color }}
                    >
                      {btn2Text}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous Slide">
            <svg viewBox="0 0 256 512" width="16" height="16">
              <path fill="currentColor" d="M31.7 244l192-184c6.2-6 16.3-5.6 22 1l15 15.6c5.7 6 5.2 16-.9 21.6L84.8 256l175 161.8c6 5.6 6.5 15.6.9 21.6l-15 15.6c-5.7 6.6-15.8 7-22 1L31.7 268c-7.6-7-7.6-17 0-24z"/>
            </svg>
          </button>
          <button className="carousel-control next" onClick={nextSlide} aria-label="Next Slide">
            <svg viewBox="0 0 256 512" width="16" height="16">
              <path fill="currentColor" d="M224.3 273l-192 184c-6.2 6-16.3 5.6-22-1l-15-15.6c-5.7-6-5.2-16 .9-21.6L171.2 256 9.8 95.8c-6-5.6-6.5-15.6-.9-21.6l15-15.6c5.7-6.6 15.8-7 22-1l192 184c7.6 7 7.6 17 0 24z"/>
            </svg>
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
export default Hero;
