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
}

function Form({ initial, onSave, onClose }) {
  const [f, setF] = useState({ nome: '', email: '', telefone: '', especialidade: '', ...initial })
  const upd = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (initial?.id) await api.put(`/professores/${initial.id}`, f)
    else await api.post('/professores', f)
    onSave()
  }

  return (
    <form onSubmit={submit}>
      <label style={L.label}>Nome Completo *</label>
      <input style={L.input} value={f.nome} onChange={upd('nome')} required placeholder="Nome do professor" />
      <label style={L.label}>Especialidade</label>
      <input style={L.input} value={f.especialidade ?? ''} onChange={upd('especialidade')} placeholder="Ex: Matemática / Ciências" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={L.label}>E-mail</label>
          <input style={L.input} value={f.email ?? ''} onChange={upd('email')} type="email" />
        </div>
        <div>
          <label style={L.label}>Telefone</label>
          <input style={L.input} value={f.telefone ?? ''} onChange={upd('telefone')} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn>Salvar</Btn>
      </div>
    </form>
  )
}

export default function Professores() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)

  const load = () => api.get('/professores').then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const del = async id => {
    if (!confirm('Excluir professor?')) return
    await api.delete(`/professores/${id}`)
    load()
  }

  const cols = [
    { key: 'id', label: '#', render: r => <span style={{ color: '#94a3b8', fontSize: 12 }}>{r.id}</span> },
    { key: 'nome', label: 'Nome' },
    { key: 'especialidade', label: 'Especialidade', render: r => r.especialidade || '—' },
    { key: 'email', label: 'E-mail', render: r => r.email || '—' },
    { key: 'acoes', label: 'Ações', render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn size="sm" variant="ghost" onClick={() => setModal({ type: 'edit', item: r })}><Pencil size={13} />Editar</Btn>
        <Btn size="sm" variant="danger" onClick={() => del(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Professores" subtitle="Corpo docente da instituição"
        action={<Btn onClick={() => setModal({ type: 'new' })}><Plus size={14} />Novo Professor</Btn>} />
      <Table columns={cols} rows={items} />
      {modal && (
        <Modal title={modal.type === 'new' ? 'Novo Professor' : 'Editar Professor'} onClose={() => setModal(null)} width={520}>
          <Form initial={modal.item} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
