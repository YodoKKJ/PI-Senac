import { useEffect, useState } from 'react'
import { Save, CheckCircle, XCircle } from 'lucide-react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import Btn from '../components/Btn.jsx'

const sel = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, background: '#fff', minWidth: 180 }

export default function Chamada() {
  const [turmas, setTurmas] = useState([])
  const [materias, setMaterias] = useState([])
  const [alunos, setAlunos] = useState([])

  const [selTurma, setSelTurma] = useState('')
  const [selMateria, setSelMateria] = useState('')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [chamada, setChamada] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/turmas').then(r => setTurmas(r.data))
    api.get('/materias').then(r => setMaterias(r.data))
  }, [])

  const onTurmaChange = tid => {
    setSelTurma(tid); setAlunos([]); setChamada({})
    if (tid) api.get('/vinculos/aluno-turma/' + tid).then(r => {
      const als = r.data.map(v => v.aluno)
      setAlunos(als)
      const map = {}
      als.forEach(a => { map[a.id] = true })
      setChamada(map)
    })
  }

  const onMateriaChange = mid => {
    setSelMateria(mid)
  }

  const loadChamadaExistente = async () => {
    if (!selTurma || !selMateria || !data) return
    const res = await api.get(`/presencas/turma/${selTurma}/materia/${selMateria}`, { params: { data } }).then(r => r.data).catch(() => [])
    if (res.length > 0) {
      const map = {}
      res.forEach(r => { map[r.alunoId] = r.presente })
      setChamada(prev => ({ ...prev, ...map }))
    }
  }

  useEffect(() => { loadChamadaExistente() }, [selMateria, data])

  const toggle = alunoId => setChamada(p => ({ ...p, [alunoId]: !p[alunoId] }))

  const marcarTodos = v => {
    const map = {}
    alunos.forEach(a => { map[a.id] = v })
    setChamada(map)
  }

  const save = async () => {
    if (!selTurma || !selMateria || !data) return
    setSaving(true); setMsg('')
    await api.post('/presencas/lancar', { turmaId: Number(selTurma), materiaId: Number(selMateria), data, chamada })
    setSaving(false)
    setMsg('Chamada salva!')
    setTimeout(() => setMsg(''), 3000)
  }

  const presentes = Object.values(chamada).filter(Boolean).length
  const total = alunos.length

  return (
    <div>
      <PageHeader title="Chamada / Frequência" subtitle="Registre a presença dos alunos por aula" />

      <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>TURMA</label>
            <select style={sel} value={selTurma} onChange={e => onTurmaChange(e.target.value)}>
              <option value="">Selecione...</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie?.nome})</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>MATÉRIA</label>
            <select style={sel} value={selMateria} onChange={e => onMateriaChange(e.target.value)} disabled={!selTurma}>
              <option value="">Selecione...</option>
              {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>DATA</label>
            <input type="date" style={sel} value={data} onChange={e => setData(e.target.value)} />
          </div>
        </div>
      </div>

      {selTurma && selMateria && alunos.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>Chamada — {data}</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {presentes}/{total} presentes
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Btn size="sm" variant="success" onClick={() => marcarTodos(true)}>Todos Presentes</Btn>
              <Btn size="sm" variant="danger" onClick={() => marcarTodos(false)}>Todos Ausentes</Btn>
              {msg && <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>{msg}</span>}
              <Btn onClick={save} disabled={saving}><Save size={14} />{saving ? 'Salvando...' : 'Salvar'}</Btn>
            </div>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            {alunos.map(aluno => {
              const presente = chamada[aluno.id] !== false
              return (
                <div key={aluno.id}
                  onClick={() => toggle(aluno.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 8, cursor: 'pointer', transition: 'all .15s',
                    border: `2px solid ${presente ? '#86efac' : '#fca5a5'}`,
                    background: presente ? '#f0fdf4' : '#fff1f2',
                  }}>
                  {presente
                    ? <CheckCircle size={18} color="#16a34a" />
                    : <XCircle size={18} color="#dc2626" />}
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: presente ? '#15803d' : '#b91c1c' }}>
                    {aluno.nome}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
