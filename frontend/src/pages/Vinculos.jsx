import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import Table from '../components/Table.jsx'
import Btn from '../components/Btn.jsx'

const sel = {
  padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7,
  fontSize: 13, background: '#fff', minWidth: 180
}

export default function Vinculos() {
  const [tab, setTab] = useState('aluno')
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [professores, setProfessores] = useState([])
  const [materias, setMaterias] = useState([])

  const [selTurma, setSelTurma] = useState('')
  const [vincAT, setVincAT] = useState([])
  const [vincPTM, setVincPTM] = useState([])

  const [addAlunoId, setAddAlunoId] = useState('')
  const [addProfId, setAddProfId] = useState('')
  const [addMatId, setAddMatId] = useState('')

  useEffect(() => {
    api.get('/turmas').then(r => setTurmas(r.data))
    api.get('/alunos').then(r => setAlunos(r.data))
    api.get('/professores').then(r => setProfessores(r.data))
    api.get('/materias').then(r => setMaterias(r.data))
  }, [])

  const loadVincAT = tid => api.get(`/vinculos/aluno-turma/${tid}`).then(r => setVincAT(r.data))
  const loadVincPTM = tid => api.get(`/vinculos/professor-turma-materia/${tid}`).then(r => setVincPTM(r.data))

  const onTurmaChange = tid => {
    setSelTurma(tid)
    if (!tid) return
    loadVincAT(tid)
    loadVincPTM(tid)
  }

  const vincularAluno = async () => {
    if (!selTurma || !addAlunoId) return
    await api.post('/vinculos/aluno-turma', { alunoId: Number(addAlunoId), turmaId: Number(selTurma) })
    setAddAlunoId('')
    loadVincAT(selTurma)
  }

  const desvincularAluno = async alunoId => {
    await api.delete('/vinculos/aluno-turma', { params: { alunoId, turmaId: selTurma } })
    loadVincAT(selTurma)
  }

  const vincularPTM = async () => {
    if (!selTurma || !addProfId || !addMatId) return
    await api.post('/vinculos/professor-turma-materia', {
      professorId: Number(addProfId), turmaId: Number(selTurma), materiaId: Number(addMatId)
    })
    setAddProfId(''); setAddMatId('')
    loadVincPTM(selTurma)
  }

  const desvincularPTM = async id => {
    await api.delete(`/vinculos/professor-turma-materia/${id}`)
    loadVincPTM(selTurma)
  }

  const tabStyle = active => ({
    padding: '8px 20px', border: 'none', cursor: 'pointer', borderRadius: '7px 7px 0 0',
    fontWeight: 600, fontSize: 13,
    background: active ? '#fff' : 'transparent',
    color: active ? '#3b82f6' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  return (
    <div>
      <PageHeader title="Vínculos" subtitle="Matricule alunos em turmas e atribua professores às matérias" />

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>Turma:</span>
        <select style={sel} value={selTurma} onChange={e => onTurmaChange(e.target.value)}>
          <option value="">Selecione uma turma...</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} — {t.serie?.nome} ({t.anoLetivo})</option>)}
        </select>
      </div>

      {selTurma && (
        <>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
            <button style={tabStyle(tab === 'aluno')} onClick={() => setTab('aluno')}>Alunos Matriculados</button>
            <button style={tabStyle(tab === 'prof')} onClick={() => setTab('prof')}>Professores / Matérias</button>
          </div>

          {tab === 'aluno' && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                <select style={sel} value={addAlunoId} onChange={e => setAddAlunoId(e.target.value)}>
                  <option value="">Selecionar aluno...</option>
                  {alunos.filter(a => !vincAT.some(v => v.aluno?.id === a.id))
                         .map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <Btn onClick={vincularAluno} disabled={!addAlunoId}><Plus size={14} />Matricular</Btn>
              </div>
              <Table
                columns={[
                  { key: 'nome', label: 'Aluno', render: r => r.aluno?.nome },
                  { key: 'matricula', label: 'Matrícula', render: r => r.aluno?.matricula || '—' },
                  { key: 'acoes', label: 'Ações', render: r => (
                    <Btn size="sm" variant="danger" onClick={() => desvincularAluno(r.aluno?.id)}>
                      <Trash2 size={13} />Remover
                    </Btn>
                  )},
                ]}
                rows={vincAT}
              />
            </>
          )}

          {tab === 'prof' && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <select style={sel} value={addProfId} onChange={e => setAddProfId(e.target.value)}>
                  <option value="">Selecionar professor...</option>
                  {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <select style={sel} value={addMatId} onChange={e => setAddMatId(e.target.value)}>
                  <option value="">Selecionar matéria...</option>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
                <Btn onClick={vincularPTM} disabled={!addProfId || !addMatId}><Plus size={14} />Vincular</Btn>
              </div>
              <Table
                columns={[
                  { key: 'professor', label: 'Professor', render: r => r.professor?.nome },
                  { key: 'materia', label: 'Matéria', render: r => r.materia?.nome },
                  { key: 'acoes', label: 'Ações', render: r => (
                    <Btn size="sm" variant="danger" onClick={() => desvincularPTM(r.id)}>
                      <Trash2 size={13} />Remover
                    </Btn>
                  )},
                ]}
                rows={vincPTM}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
