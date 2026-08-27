import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const Block = ({ value, label }: { value: number; label: string }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: 'rgba(124,58,237,0.15)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 10,
        padding: '10px 14px',
        minWidth: 56,
        fontWeight: 800,
        fontSize: '1.5rem',
        color: '#7c3aed',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Block value={timeLeft.days} label="dias" />
      <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem', paddingBottom: 18 }}>:</span>
      <Block value={timeLeft.hours} label="horas" />
      <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem', paddingBottom: 18 }}>:</span>
      <Block value={timeLeft.minutes} label="min" />
      <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem', paddingBottom: 18 }}>:</span>
      <Block value={timeLeft.seconds} label="seg" />
    </div>
  );
};
