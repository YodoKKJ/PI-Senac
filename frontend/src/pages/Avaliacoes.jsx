import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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

const TIPO_COLOR = { PROVA: '#3b82f6', TRABALHO: '#8b5cf6', SIMULADO: '#f59e0b', RECUPERACAO: '#ef4444' }

function Form({ turmas, materias, onSave, onClose }) {
  const [f, setF] = useState({ turmaId: '', materiaId: '', tipo: 'PROVA', descricao: '', dataAplicacao: '', peso: '1', bimestre: '1' })
  const upd = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    await api.post('/avaliacoes', { ...f, turmaId: Number(f.turmaId), materiaId: Number(f.materiaId), peso: Number(f.peso), bimestre: Number(f.bimestre) })
    onSave()
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={L.label}>Turma *</label>
          <select style={L.select} value={f.turmaId} onChange={upd('turmaId')} required>
            <option value="">Selecione...</option>
            {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie?.nome})</option>)}
          </select>
        </div>
        <div>
          <label style={L.label}>Matéria *</label>
          <select style={L.select} value={f.materiaId} onChange={upd('materiaId')} required>
            <option value="">Selecione...</option>
            {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={L.label}>Tipo *</label>
          <select style={L.select} value={f.tipo} onChange={upd('tipo')}>
            <option value="PROVA">Prova</option>
            <option value="TRABALHO">Trabalho</option>
            <option value="SIMULADO">Simulado</option>
            <option value="RECUPERACAO">Recuperação</option>
          </select>
        </div>
        <div>
          <label style={L.label}>Bimestre *</label>
          <select style={L.select} value={f.bimestre} onChange={upd('bimestre')}>
            {[1,2,3,4].map(b => <option key={b} value={b}>{b}º Bimestre</option>)}
          </select>
        </div>
      </div>
      <label style={L.label}>Descrição</label>
      <input style={L.input} value={f.descricao} onChange={upd('descricao')} placeholder="Ex: Prova de Álgebra" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={L.label}>Data de Aplicação *</label>
          <input style={L.input} type="date" value={f.dataAplicacao} onChange={upd('dataAplicacao')} required />
        </div>
        <div>
          <label style={L.label}>Peso *</label>
          <input style={L.input} type="number" min="0.1" max="10" step="0.1" value={f.peso} onChange={upd('peso')} required />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn>Salvar</Btn>
      </div>
    </form>
  )
}

export default function Avaliacoes() {
  const [items, setItems] = useState([])
  const [turmas, setTurmas] = useState([])
  const [materias, setMaterias] = useState([])
  const [modal, setModal] = useState(false)
  const [filtroTurma, setFiltroTurma] = useState('')

  const load = tid => {
    const params = tid ? { turmaId: tid } : {}
    api.get('/avaliacoes', { params }).then(r => setItems(r.data))
  }
  useEffect(() => {
    load('')
    api.get('/turmas').then(r => setTurmas(r.data))
    api.get('/materias').then(r => setMaterias(r.data))
  }, [])

  const del = async id => {
    if (!confirm('Excluir avaliação?')) return
    await api.delete(`/avaliacoes/${id}`)
    load(filtroTurma)
  }

  const cols = [
    { key: 'desc', label: 'Descrição', render: r => r.descricao || r.tipo },
    { key: 'tipo', label: 'Tipo', render: r => (
      <span style={{ padding: '2px 8px', borderRadius: 4, background: TIPO_COLOR[r.tipo] + '22', color: TIPO_COLOR[r.tipo], fontSize: 11, fontWeight: 600 }}>
        {r.tipo}
      </span>
    )},
    { key: 'turma', label: 'Turma', render: r => `${r.turma?.nome} (${r.turma?.serie?.nome})` },
    { key: 'materia', label: 'Matéria', render: r => r.materia?.nome },
    { key: 'bimestre', label: 'Bimestre', render: r => `${r.bimestre}º` },
    { key: 'data', label: 'Data', render: r => r.dataAplicacao },
    { key: 'peso', label: 'Peso' },
    { key: 'acoes', label: '', render: r => (
      <Btn size="sm" variant="danger" onClick={() => del(r.id)}><Trash2 size={13} /></Btn>
    )},
  ]

  return (
    <div>
      <PageHeader title="Avaliações" subtitle="Provas, trabalhos e atividades avaliativas"
        action={<Btn onClick={() => setModal(true)}><Plus size={14} />Nova Avaliação</Btn>} />
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>Filtrar por turma:</span>
        <select style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, background: '#fff' }}
          value={filtroTurma} onChange={e => { setFiltroTurma(e.target.value); load(e.target.value) }}>
          <option value="">Todas as turmas</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie?.nome})</option>)}
        </select>
      </div>
      <Table columns={cols} rows={items} />
      {modal && (
        <Modal title="Nova Avaliação" onClose={() => setModal(false)} width={600}>
          <Form turmas={turmas} materias={materias} onSave={() => { setModal(false); load(filtroTurma) }} onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  )
}
