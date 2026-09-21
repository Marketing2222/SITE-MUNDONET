import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../hooks/useAuth';

interface CepSearch {
  id: number;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
  result: string;
  created_at: string;
}

interface CepStats {
  total: number;
  covered: number;
  notCovered: number;
  invalid: number;
  todayCount: number;
  topCeps: { cep: string; count: number }[];
  topNeighborhoods: { name: string; count: number }[];
}

interface PagedResult {
  data: CepSearch[];
  total: number;
  page: number;
  limit: number;
}

const ManageCepHistory = () => {
  const [data, setData] = useState<PagedResult | null>(null);
  const [stats, setStats] = useState<CepStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterCep, setFilterCep] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      if (filterCep) params.set('cep', filterCep);
      if (filterResult) params.set('result', filterResult);
      if (filterDateFrom) params.set('dateFrom', filterDateFrom);
      if (filterDateTo) params.set('dateTo', filterDateTo);
      if (filterSearch) params.set('search', filterSearch);

      const [searchData, statsData] = await Promise.all([
        apiFetch(`/cep-searches?${params.toString()}`),
        apiFetch('/cep-searches/stats'),
      ]);
      setData(searchData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filterCep, filterResult, filterDateFrom, filterDateTo, filterSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/cep-searches/${id}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await apiFetch('/cep-searches', { method: 'DELETE' });
      setClearConfirm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!data?.data.length) return;
    const headers = ['CEP', 'Rua', 'Bairro', 'Cidade', 'UF', 'Resultado', 'Data/Hora'];
    const rows = data.data.map(r => [
      r.cep, r.street, r.neighborhood, r.city, r.uf,
      r.result === 'success' ? 'Atendido' : r.result === 'fail' ? 'Não atendido' : 'Inválido',
      new Date(r.created_at).toLocaleString('pt-BR'),
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cep-searches-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = data ? Math.ceil(data.total / 50) : 1;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const resultBadge = (r: string) => {
    if (r === 'success') return <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Atendido</span>;
    if (r === 'fail') return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Não atendido</span>;
    return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Inválido</span>;
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={statCardStyle}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#005CFF' }}>{stats.total}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Total de buscas</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{stats.covered}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Atendidos</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{stats.notCovered}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Não atendidos</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{stats.todayCount}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Buscas hoje</div>
          </div>
        </div>
      )}

      {/* Top Bairros */}
      {stats && stats.topNeighborhoods.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Top 10 CEPs mais buscados</h3>
            {stats.topCeps.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.cep.slice(0,5)}-{item.cep.slice(5)}</span>
                <span style={{ color: '#64748b' }}>{item.count}x</span>
              </div>
            ))}
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Top 10 Bairros mais buscados</h3>
            {stats.topNeighborhoods.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                <span>{item.name}</span>
                <span style={{ color: '#64748b' }}>{item.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', marginBottom: 0 }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={labelStyle}>CEP</label>
            <input
              style={inputStyle}
              placeholder="Filtrar por CEP..."
              value={filterCep}
              onChange={e => { setFilterCep(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Buscar (rua, bairro...)</label>
            <input
              style={inputStyle}
              placeholder="Buscar por endereço..."
              value={filterSearch}
              onChange={e => { setFilterSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={labelStyle}>Resultado</label>
            <select
              style={inputStyle}
              value={filterResult}
              onChange={e => { setFilterResult(e.target.value); setPage(1); }}
            >
              <option value="">Todos</option>
              <option value="success">Atendido</option>
              <option value="fail">Não atendido</option>
              <option value="invalid">Inválido</option>
            </select>
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={labelStyle}>Data inicial</label>
            <input
              style={inputStyle}
              type="date"
              value={filterDateFrom}
              onChange={e => { setFilterDateFrom(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={labelStyle}>Data final</label>
            <input
              style={inputStyle}
              type="date"
              value={filterDateTo}
              onChange={e => { setFilterDateTo(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 2 }}>
            <button
              onClick={() => { setFilterCep(''); setFilterResult(''); setFilterDateFrom(''); setFilterDateTo(''); setFilterSearch(''); setPage(1); }}
              style={{ ...btnStyle, background: '#f1f5f9', color: '#475569' }}
            >
              Limpar
            </button>
            <button onClick={exportCSV} style={{ ...btnStyle, background: '#005CFF' }}>
              Exportar CSV
            </button>
            <button onClick={() => setClearConfirm(true)} style={{ ...btnStyle, background: '#fee2e2', color: '#991b1b' }}>
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginTop: 16 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Carregando...</div>
        ) : !data?.data.length ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Nenhum registro encontrado</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={thStyle}>CEP</th>
                  <th style={thStyle}>Rua</th>
                  <th style={thStyle}>Bairro</th>
                  <th style={thStyle}>Cidade/UF</th>
                  <th style={thStyle}>Resultado</th>
                  <th style={thStyle}>Data/Hora</th>
                  <th style={{ ...thStyle, width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.data.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{item.cep}</code></td>
                    <td style={tdStyle}>{item.street || '—'}</td>
                    <td style={tdStyle}>{item.neighborhood || '—'}</td>
                    <td style={tdStyle}>{item.city && item.uf ? `${item.city}/${item.uf}` : '—'}</td>
                    <td style={tdStyle}>{resultBadge(item.result)}</td>
                    <td style={{ ...tdStyle, color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(item.created_at)}</td>
                    <td style={tdStyle}>
                      {deleteConfirm === item.id ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => handleDelete(item.id)} style={{ ...smallBtn, background: '#fee2e2', color: '#991b1b' }}>Sim</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ ...smallBtn, background: '#f1f5f9' }}>Não</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(item.id)} style={{ ...smallBtn, background: '#fee2e2', color: '#991b1b' }}>Excluir</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Página {data.page} de {totalPages} — {data.total} registros
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ ...smallBtn, opacity: page <= 1 ? 0.4 : 1 }}>Anterior</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ ...smallBtn, opacity: page >= totalPages ? 0.4 : 1 }}>Próxima</button>
            </div>
          </div>
        )}
      </div>

      {/* Clear All Confirm Modal */}
      {clearConfirm && (
        <div style={overlayStyle} onClick={() => setClearConfirm(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Limpar todo o histórico?</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 14 }}>Esta ação não pode ser desfeita. Todos os registros de busca de CEP serão removidos.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setClearConfirm(false)} style={{ ...btnStyle, background: '#f1f5f9', color: '#475569' }}>Cancelar</button>
              <button onClick={handleClearAll} style={{ ...btnStyle, background: '#ef4444' }}>Sim, limpar tudo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const statCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '20px 24px',
  border: '1px solid #e2e8f0',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  border: '1px solid #e2e8f0',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#64748b',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 13,
  outline: 'none',
  background: '#fff',
  color: '#1e293b',
  boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  color: '#fff',
  whiteSpace: 'nowrap',
};

const smallBtn: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 6,
  border: 'none',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  background: '#f1f5f9',
  color: '#475569',
};

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#475569',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  color: '#1e293b',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 28,
  maxWidth: 420,
  width: '90%',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

export default ManageCepHistory;
