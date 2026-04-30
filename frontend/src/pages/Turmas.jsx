import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Btn from '../components/Btn.jsx'

const L = {
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .4 },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13.5, boxSizing: 'border-box', marginBottom: 14 },
  select: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13.5, boxSizing: 'border-box', marginBottom: 14, background: '#fff' },
}

function Form({ initial, series, onSave, onClose }) {
  const [nome, setNome] = useState(initial?.nome ?? '')
  const [serieId, setSerieId] = useState(initial?.serie?.id ?? '')
  const [anoLetivo, setAnoLetivo] = useState(initial?.anoLetivo ?? new Date().getFullYear())

  const submit = async e => {
    e.preventDefault()
    const body = { nome, serieId: Number(serieId), anoLetivo: Number(anoLetivo) }
    if (initial?.id) await api.put(`/turmas/${initial.id}`, body)
    else await api.post('/turmas', body)
    onSave()
  }

  return (
    <form onSubmit={submit}>
      <label style={L.label}>Nome da Turma *</label>
      <input style={L.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: 9A" required />
      <label style={L.label}>Série *</label>
      <select style={L.select} value={serieId} onChange={e => setSerieId(e.target.value)} required>
        <option value="">Selecione...</option>
        {series.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
      </select>
      <label style={L.label}>Ano Letivo *</label>
      <input style={L.input} type="number" value={anoLetivo} onChange={e => setAnoLetivo(e.target.value)} required />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn>Salvar</Btn>
      </div>
    </form>
  )
}

export default function Turmas() {
  const [items, setItems] = useState([])
  const [series, setSeries] = useState([])
  const [modal, setModal] = useState(null)

  const load = () => api.get('/turmas').then(r => setItems(r.data))
  useEffect(() => {
    load()
    api.get('/series').then(r => setSeries(r.data))
  }, [])

  const del = async id => {
    if (!confirm('Excluir turma?')) return
    await api.delete(`/turmas/${id}`)
    load()
  }

  const cols = [
    { key: 'id', label: '#', render: r => <span style={{ color: '#94a3b8', fontSize: 12 }}>{r.id}</span> },
    { key: 'nome', label: 'Turma' },
    { key: 'serie', label: 'Série', render: r => r.serie?.nome },
    { key: 'anoLetivo', label: 'Ano Letivo' },
    { key: 'acoes', label: 'Ações', render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn size="sm" variant="ghost" onClick={() => setModal({ type: 'edit', item: r })}><Pencil size={13} />Editar</Btn>
        <Btn size="sm" variant="danger" onClick={() => del(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Turmas" subtitle="Grupos de alunos por série e ano letivo"
        action={<Btn onClick={() => setModal({ type: 'new' })}><Plus size={14} />Nova Turma</Btn>} />
      <Table columns={cols} rows={items} />
      {modal && (
        <Modal title={modal.type === 'new' ? 'Nova Turma' : 'Editar Turma'} onClose={() => setModal(null)}>
          <Form initial={modal.item} series={series} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
