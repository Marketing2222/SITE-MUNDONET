import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useReveal } from '../hooks/useReveal';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  photo: string;
  sort_order: number;
  active: boolean;
}

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useReveal();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setItems(data.filter((i: Testimonial) => i.active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section style={{ padding: '60px 20px', background: '#f5f0ff' }}>
      <div className="container" ref={ref}>
        <h2 className="site-section-title text-center" style={{ marginBottom: 40 }}>
          O que nossos clientes dizem
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ display: 'flex', gap: 4, color: '#f59e0b', fontSize: 16 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ opacity: i < item.rating ? 1 : 0.25 }}>★</span>
                ))}
              </div>
              <p style={{ color: '#374151', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, flex: 1 }}>
                "{item.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
                {item.photo ? (
                  <img src={item.photo} alt={item.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{item.name}</div>
                  {item.role && <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
