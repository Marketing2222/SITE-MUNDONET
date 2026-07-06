import { useRef, useEffect, useCallback } from 'react';

interface RichTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FONTS = [
  'Arial', 'Georgia', 'Tahoma', 'Times New Roman', 'Verdana',
  'Montserrat', 'Inter', 'Roboto', 'Poppins', 'Outfit',
  'Open Sans', 'Lato', 'Nunito', 'Raleway', 'Ubuntu',
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

const btnStyle = (active?: boolean): React.CSSProperties => ({
  padding: '4px 10px', border: `1px solid var(--adm-border)`, borderRadius: 4,
  background: active ? 'var(--adm-accent)' : 'var(--adm-bg)',
  color: active ? '#fff' : 'var(--adm-text)',
  cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
  lineHeight: 1.4, minWidth: 32,
});

const selectStyle: React.CSSProperties = {
  padding: '4px 6px', border: `1px solid var(--adm-border)`, borderRadius: 4,
  background: 'var(--adm-bg)', color: 'var(--adm-text)',
  cursor: 'pointer', fontSize: '0.78rem', maxWidth: 130,
};

export const RichTextField = ({ value, onChange, placeholder }: RichTextFieldProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fromSelf = useRef(false);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  useEffect(() => {
    if (fromSelf.current) { fromSelf.current = false; return; }
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    fromSelf.current = true;
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand('styleWithCSS', false, true as unknown as string);
    document.execCommand(cmd, false, val);
    handleInput();
  }, [handleInput]);

  const applyFontSize = useCallback((size: string) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = size;
    try { range.surroundContents(span); }
    catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    sel.addRange(range);
    handleInput();
  }, [handleInput]);

  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    if (font) exec('fontName', font);
    e.target.value = '';
  }, [exec]);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (size) applyFontSize(size);
    e.target.value = '';
  }, [applyFontSize]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div style={{ border: `1px solid var(--adm-border)`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 4, padding: '6px 8px', flexWrap: 'wrap', alignItems: 'center',
        background: 'var(--adm-bg)', borderBottom: `1px solid var(--adm-border)`,
      }}>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('bold'); }} style={btnStyle()} title="Negrito (Ctrl+B)"><b>B</b></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('italic'); }} style={{ ...btnStyle(), fontStyle: 'italic', fontFamily: 'serif' }} title="Itálico (Ctrl+I)"><i>I</i></button>
        <div style={{ width: 1, height: 24, background: 'var(--adm-border)', margin: '0 4px' }} />
        <select onChange={handleFontChange} style={selectStyle} defaultValue="">
          <option value="" disabled>Fonte</option>
          {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>
        <select onChange={handleSizeChange} style={{ ...selectStyle, maxWidth: 90 }} defaultValue="">
          <option value="" disabled>Tamanho</option>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          minHeight: 100, padding: 12, outline: 'none',
          fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
          color: 'var(--adm-text)',
        }}
      />
      {!value && placeholder && (
        <div style={{
          position: 'relative', height: 0, top: -80, left: 12,
          fontSize: '0.9rem', color: 'var(--adm-text2)', pointerEvents: 'none', opacity: 0.5,
        }}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextField;