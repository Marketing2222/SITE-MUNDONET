import { useRef } from 'react';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../hooks/useAuth';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export const ImageUpload = ({ value, onChange, accept = 'image/*' }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
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
    </div>
  );
};

export default ImageUpload;
