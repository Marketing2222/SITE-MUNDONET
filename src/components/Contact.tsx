import { useState, useEffect } from 'react';
import '../styles/Contact.css';
import { API_BASE_URL } from '../config/api';

type ContactInfo = Record<string, { value: string; label: string }>;

export const Contact: React.FC = () => {
  const [contacts, setContacts] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact`)
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(console.error);
  }, []);

  if (!contacts) return null;

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container contact-grid">
        <div className="contact-info-col animate-slide-up">
          <span className="subtitle-badge">Fale Conosco</span>
          <h2 className="site-section-title">Central de Atendimento Mundonet</h2>
          <p className="site-section-subtitle">{contacts.intro_text?.value || 'Precisa tirar dúvidas, contratar um plano ou solicitar suporte? Nossa equipe está pronta para atendê-lo da melhor forma possível. Escolha um dos nossos canais de atendimento:'}</p>

          <ul className="contact-details-list">
            {contacts.phone && (
              <li>
                <div className="contact-item-icon">
                  <svg viewBox="0 0 512 512" width="18" height="18">
                    <path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>{contacts.phone.label}</strong>
                  <a href={`tel:${contacts.phone_raw?.value || ''}`}>{contacts.phone.value}</a>
                </div>
              </li>
            )}
            {contacts.whatsapp && (
              <li>
                <div className="contact-item-icon whatsapp">
                  <svg viewBox="0 0 448 512" width="18" height="18">
                    <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>{contacts.whatsapp.label}</strong>
                  <a href={contacts.whatsapp.value} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
                </div>
              </li>
            )}
            {contacts.instagram && (
              <li>
                <div className="contact-item-icon instagram">
                  <svg viewBox="0 0 448 512" width="18" height="18">
                    <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>{contacts.instagram.label}</strong>
                  <a href={contacts.instagram.value} target="_blank" rel="noreferrer">{contacts.instagram_handle?.value || '@_mundonet'}</a>
                </div>
              </li>
            )}
            {contacts.email && (
              <li>
                <div className="contact-item-icon">
                  <svg viewBox="0 0 512 512" width="18" height="18">
                    <path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.9V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5.1 5.7-8 9.7-4.9L256 342.4l246.3-151.6zM256 294.4L11.7 144.5c-4.1-2.5-4.2-8.5-.1-11L244 4c7.6-4.7 17.4-4.7 25 0l232.4 129.5c4.1 2.5 4 8.5-.1 11L256 294.4z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>{contacts.email.label}</strong>
                  <a href={`mailto:${contacts.email.value}`}>{contacts.email.value}</a>
                </div>
              </li>
            )}
            {contacts.address && (
              <li>
                <div className="contact-item-icon">
                  <svg viewBox="0 0 384 512" width="18" height="18">
                    <path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>{contacts.address.label}</strong>
                  <a href={contacts.maps_url?.value} target="_blank" rel="noreferrer">{contacts.address.value}</a>
                </div>
              </li>
            )}
          </ul>
        </div>

        {contacts.maps_embed && (
          <div className="contact-map-col animate-zoom-in">
            <div className="map-container">
              <iframe 
                src={contacts.maps_embed.value}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mundonet Telecom Map"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Contact;
