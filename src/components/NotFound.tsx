import { useReveal } from '../hooks/useReveal';

export const NotFound: React.FC = () => {
  const ref = useReveal();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#002D72',
      color: '#fff',
      textAlign: 'center',
      padding: 40,
    }}>
      <div ref={ref} className="reveal">
        <div style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1, opacity: 0.15, marginBottom: -20 }}>404</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 12px' }}>Página não encontrada</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          O link que você acessou não existe ou foi movido. Volte para a página inicial e encontre o que precisa.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: '#7c3aed',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: 50,
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};
