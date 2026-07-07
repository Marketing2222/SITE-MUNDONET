import { useState } from 'react';

const DEFAULT_PRESETS = [
  '#002D72', '#005CFF', '#1E40AF', '#2563EB', '#3B82F6',
  '#DC2626', '#EF4444', '#F59E0B', '#F97316',
  '#16A34A', '#22C55E', '#10B981',
  '#7C3AED', '#8B5CF6', '#A855F7',
  '#1E293B', '#475569', '#94A3B8',
  '#FFFFFF', '#F8FAFC', '#F1F5F9',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

export const ColorPicker = ({ value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) => {
  const [input, setInput] = useState(value);

  const handleHex = (v: string) => {
    setInput(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {presets.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => { onChange(c); setInput(c); }}
            style={{
              width: 28, height: 28, borderRadius: 6, border: '2px solid',
              borderColor: value === c ? 'var(--adm-accent)' : 'var(--adm-border)',
              background: c, cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            title={c}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => { onChange(e.target.value); setInput(e.target.value); }}
          style={{ height: 34, width: 44, padding: 0, cursor: 'pointer', borderRadius: 6 }}
        />
        <input
          value={input}
          onChange={e => handleHex(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
