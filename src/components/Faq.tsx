import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useReveal } from '../hooks/useReveal';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export const Faq: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useReveal();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faq`)
      .then(res => res.json())
      .then(data => setItems(data.filter((i: FaqItem) => i.active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="faq-section" style={{ padding: '60px 20px', background: '#0a0a1a' }}>
      <div className="container" ref={ref} style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 className="site-section-title text-center" style={{ color: '#fff', marginBottom: 40 }}>
          Perguntas Frequentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12,
                border: openId === item.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
              }}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  gap: 12,
                }}
              >
                <span>{item.question}</span>
                <span
                  style={{
                    fontSize: 20,
                    color: '#7c3aed',
                    transition: 'transform 0.3s ease',
                    transform: openId === item.id ? 'rotate(45deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: openId === item.id ? 500 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease, padding 0.35s ease',
                  padding: openId === item.id ? '0 20px 18px' : '0 20px',
                }}
              >
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
