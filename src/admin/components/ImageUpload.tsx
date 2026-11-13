import { useRef, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../hooks/useAuth';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

/** Detecta PNG-8 (paleta de 256 cores) — provoca granulado/banding em fotos. */
const isPalettePng = async (file: File): Promise<boolean> => {
  if (file.type !== 'image/png' && !/\.png$/i.test(file.name)) return false;
  try {
    const buf = new Uint8Array(await file.slice(0, 30).arrayBuffer());
    // Assinatura PNG + chunk IHDR: offset 24 = bit depth, offset 25 = color type (3 = paleta)
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[25] === 3;
  } catch {
    return false;
  }
};

export const ImageUpload = ({ value, onChange, accept = 'image/*' }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState('');

  const handleFile = async (file: File) => {
    setWarn('');
    if (await isPalettePng(file)) {
      setWarn('⚠️ Esta imagem é PNG-8 (apenas 256 cores) — pode exibir granulado na tela. Envie a imagem original em PNG-24 ou JPG para melhor qualidade.');
    }
    const fd = new FormData();
    fd.append('image', file);
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: fd,
    });
    const data = await res.json();
    if (data.url) onChange(data.url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value && (
        <div style={{
          background: 'var(--adm-bg)', border: '1px solid var(--adm-border)',
          borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 60,
        }}>
          <img src={value} alt="" style={{ maxHeight: 56, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... ou faça upload"
          style={{ flex: 1 }}
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
        <button
          type="button"
          className="admin-btn ghost small"
          onClick={() => inputRef.current?.click()}
          style={{ whiteSpace: 'nowrap' }}
        >
          Upload
        </button>
      </div>
      {warn && (
        <div style={{ fontSize: 12, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '6px 10px', lineHeight: 1.4 }}>
          {warn}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
