interface ToggleSwitchProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export const ToggleSwitch = ({ value, onChange, label }: ToggleSwitchProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: value ? 'var(--adm-accent)' : 'var(--adm-surface2)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
    {label && <span style={{ fontSize: '0.85rem', color: 'var(--adm-text)', fontWeight: 500 }}>{label}</span>}
  </div>
);

export default ToggleSwitch;
