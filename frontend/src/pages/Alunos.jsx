import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Btn from '../components/Btn.jsx'

const L = {
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .4 },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13.5, boxSizing: 'border-box', marginBottom: 14 },
}
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }

function Form({ initial, onSave, onClose }) {
  const [f, setF] = useState({
    nome: '', matricula: '', dataNascimento: '', nomePai: '', nomeMae: '', telefone: '', email: '',
    ...initial
  })
  const upd = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    const body = { ...f, dataNascimento: f.dataNascimento || null }
    if (initial?.id) await api.put(`/alunos/${initial.id}`, body)
    else await api.post('/alunos', body)
    onSave()
  }

  return (
    <form onSubmit={submit}>
      <label style={L.label}>Nome Completo *</label>
      <input style={L.input} value={f.nome} onChange={upd('nome')} required placeholder="Nome do aluno" />
      <div style={row2}>
        <div>
          <label style={L.label}>Matrícula</label>
          <input style={L.input} value={f.matricula} onChange={upd('matricula')} placeholder="Ex: 2024001" />
        </div>
        <div>
          <label style={L.label}>Data de Nascimento</label>
          <input style={L.input} type="date" value={f.dataNascimento ?? ''} onChange={upd('dataNascimento')} />
        </div>
      </div>
      <div style={row2}>
        <div>
          <label style={L.label}>Nome do Pai</label>
          <input style={L.input} value={f.nomePai ?? ''} onChange={upd('nomePai')} />
        </div>
        <div>
          <label style={L.label}>Nome da Mãe</label>
          <input style={L.input} value={f.nomeMae ?? ''} onChange={upd('nomeMae')} />
        </div>
      </div>
      <div style={row2}>
        <div>
          <label style={L.label}>Telefone</label>
          <input style={L.input} value={f.telefone ?? ''} onChange={upd('telefone')} />
        </div>
        <div>
          <label style={L.label}>E-mail</label>
          <input style={L.input} value={f.email ?? ''} onChange={upd('email')} type="email" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn>Salvar</Btn>
      </div>
    </form>
  )
}

export default function Alunos() {
  const [items, setItems] = useState([])
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)

  const load = (q = '') => api.get('/alunos', { params: q ? { nome: q } : {} }).then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const del = async id => {
    if (!confirm('Excluir aluno?')) return
    await api.delete(`/alunos/${id}`)
    load(busca)
  }

  const cols = [
    { key: 'id', label: '#', render: r => <span style={{ color: '#94a3b8', fontSize: 12 }}>{r.id}</span> },
    { key: 'nome', label: 'Nome' },
    { key: 'matricula', label: 'Matrícula', render: r => r.matricula || '—' },
    { key: 'email', label: 'E-mail', render: r => r.email || '—' },
    { key: 'telefone', label: 'Telefone', render: r => r.telefone || '—' },
    { key: 'acoes', label: 'Ações', render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn size="sm" variant="ghost" onClick={() => setModal({ type: 'edit', item: r })}><Pencil size={13} />Editar</Btn>
        <Btn size="sm" variant="danger" onClick={() => del(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Alunos" subtitle="Cadastro de alunos da instituição"
        action={<Btn onClick={() => setModal({ type: 'new' })}><Plus size={14} />Novo Aluno</Btn>} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => { setBusca(e.target.value); load(e.target.value) }}
          />
        </div>
      </div>
      <Table columns={cols} rows={items} />
      {modal && (
        <Modal title={modal.type === 'new' ? 'Novo Aluno' : 'Editar Aluno'} onClose={() => setModal(null)} width={560}>
          <Form initial={modal.item} onSave={() => { setModal(null); load(busca) }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
