import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface Plan {
  id?: number;
  name: string;
  speed: string;
  price: string;
  highlight: string;
  highlight_icon: string;
  button_text: string;
  whatsapp_msg: string;
  features: string[];
  popular: boolean;
  active: boolean;
  sort_order: number;
  card_bg_color: string;
  card_text_color: string;
  button_bg_color: string;
  button_text_color: string;
}

const EMPTY_PLAN = {
  name: '',
  speed: '',
  price: '',
  highlight: '',
  highlight_icon: '🏢',
  button_text: 'CONSULTAR',
  whatsapp_msg: 'Olá, gostaria de saber mais sobre os planos empresariais.',
  features: [''],
  popular: false,
  active: true,
  sort_order: 0,
  card_bg_color: '',
  card_text_color: '',
  button_bg_color: '#005CFF',
  button_text_color: '#ffffff',
};

export const ManageEnterprisePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [edit, setEdit] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch('/enterprise-plans/all');
      setPlans(data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => { load(); }, []);

  const save = async (plan: Plan) => {
    setSaving(true);
    try {
      const method = plan.id ? 'PUT' : 'POST';
      const url = plan.id ? `/enterprise-plans/${plan.id}` : '/enterprise-plans';
      await apiFetch(url, { method, body: JSON.stringify(plan) });
      await load();
      setEdit(null);
      setMsg('Plano salvo!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Remover plano?')) return;
    await apiFetch(`/enterprise-plans/${id}`, { method: 'DELETE' });
    await load();
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...plans];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((p, i) => { p.sort_order = i; });
    setPlans(next);
    Promise.all(next.map(p =>
      apiFetch(`/enterprise-plans/${p.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: p.sort_order }) })
    ));
  };

  const editForm = edit || { ...EMPTY_PLAN, features: [''] };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>🏢 Planos Empresariais</h2>
          <p>Gerencie os planos exibidos na página Para Empresas.</p>
        </div>
        <button className="admin-btn primary" onClick={() => setEdit({ ...EMPTY_PLAN, id: 0 } as unknown as Plan)}>
          + Novo Plano
        </button>
      </div>

      {msg && <div className="admin-alert success">{msg}</div>}

      {/* Tabela */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <table className="admin-table">
          <thead>
            <tr><th>Plano</th><th>Velocidade</th><th>Preço</th><th>Popular</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5 }}>
                <td><strong>{p.name}</strong></td>
                <td>{p.speed} Mbps</td>
                <td>R$ {p.price}</td>
                <td>{p.popular ? '⭐' : ''}</td>
                <td><span style={{ color: p.active ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{p.active ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="admin-btn ghost" disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                    <button className="admin-btn ghost" disabled={i === plans.length - 1} onClick={() => move(i, 1)}>▼</button>
                    <button className="admin-btn ghost" onClick={() => setEdit(p)}>✏️</button>
                    <button className="admin-btn ghost" style={{ color: '#ef4444' }} onClick={() => remove(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário */}
      {edit !== null && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
            {edit.id ? `Editar: ${edit.name}` : 'Novo Plano'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { k: 'name', l: 'Nome do Plano', ph: 'Ex: Link Dedicado 100MB' },
              { k: 'speed', l: 'Velocidade (Mbps)', ph: 'Ex: 100' },
              { k: 'price', l: 'Preço', ph: 'Ex: 199,90 ou Sob Consulta' },
              { k: 'highlight', l: 'Destaque', ph: 'Ex: Performance máxima' },
              { k: 'highlight_icon', l: 'Ícone Destaque', ph: 'Ex: 🚀' },
              { k: 'button_text', l: 'Texto do Botão', ph: 'Ex: CONTRATAR' },
            ].map(f => (
              <div key={f.k}>
                <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>{f.l}</label>
                <input value={(editForm as any)[f.k] || ''} onChange={e => setEdit({ ...editForm, [f.k]: e.target.value })}
                  placeholder={f.ph} style={{ width: '100%', padding: '8px 10px', fontSize: 13 }} />
              </div>
            ))}
            {/* WhatsApp Message */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>Mensagem WhatsApp</label>
              <input value={editForm.whatsapp_msg} onChange={e => setEdit({ ...editForm, whatsapp_msg: e.target.value })}
                placeholder="Mensagem pré-preenchida" style={{ width: '100%', padding: '8px 10px', fontSize: 13 }} />
            </div>
            {/* Features */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>Características (uma por linha)</label>
              <textarea value={editForm.features.join('\n')} onChange={e => setEdit({ ...editForm, features: e.target.value.split('\n') })}
                rows={4} style={{ width: '100%', padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
            </div>
            {/* Cores */}
            {[
              { k: 'card_bg_color', l: 'Fundo do Card', d: '#ffffff' },
              { k: 'card_text_color', l: 'Cor Texto', d: '#1a0533' },
              { k: 'button_bg_color', l: 'Fundo Botão', d: '#005CFF' },
              { k: 'button_text_color', l: 'Cor Texto Botão', d: '#ffffff' },
            ].map(f => (
              <div key={f.k}>
                <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>{f.l}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={(editForm as any)[f.k] || f.d} onChange={e => setEdit({ ...editForm, [f.k]: e.target.value })}
                    style={{ width: 36, height: 32, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                  <input value={(editForm as any)[f.k] || ''} onChange={e => setEdit({ ...editForm, [f.k]: e.target.value })}
                    placeholder={f.d} style={{ flex: 1, padding: '6px 8px', fontSize: 12, fontFamily: 'monospace' }} />
                </div>
              </div>
            ))}
            {/* Toggles */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>Popular</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={editForm.popular} onChange={e => setEdit({ ...editForm, popular: e.target.checked })} />
                <span style={{ fontSize: 13 }}>{editForm.popular ? '⭐ Destaque' : 'Normal'}</span>
              </label>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--adm-text2)', display: 'block', marginBottom: 4 }}>Status</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={editForm.active} onChange={e => setEdit({ ...editForm, active: e.target.checked })} />
                <span style={{ fontSize: 13, color: editForm.active ? '#16a34a' : '#ef4444' }}>{editForm.active ? 'Ativo' : 'Inativo'}</span>
              </label>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <button className="admin-btn primary" onClick={() => save(editForm)} disabled={saving}>
              {saving ? 'Salvando...' : '💾 Salvar'}
            </button>
            <button className="admin-btn ghost" onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEnterprisePlans;
