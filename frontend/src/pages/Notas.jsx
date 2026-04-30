import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import Btn from '../components/Btn.jsx'

const sel = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, background: '#fff', minWidth: 180 }

export default function Notas() {
  const [turmas, setTurmas] = useState([])
  const [materias, setMaterias] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])
  const [alunos, setAlunos] = useState([])
  const [notasMap, setNotasMap] = useState({})

  const [selTurma, setSelTurma] = useState('')
  const [selMateria, setSelMateria] = useState('')
  const [selAval, setSelAval] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/turmas').then(r => setTurmas(r.data))
    api.get('/materias').then(r => setMaterias(r.data))
  }, [])

  const onTurmaChange = tid => {
    setSelTurma(tid); setSelMateria(''); setSelAval(''); setAlunos([]); setAvaliacoes([]); setNotasMap({})
    if (tid) api.get('/vinculos/aluno-turma/' + tid).then(r => setAlunos(r.data.map(v => v.aluno)))
  }

  const onMateriaChange = mid => {
    setSelMateria(mid); setSelAval(''); setNotasMap({})
    if (selTurma && mid)
      api.get('/avaliacoes', { params: { turmaId: selTurma, materiaId: mid } }).then(r => setAvaliacoes(r.data))
  }

  const onAvalChange = async avId => {
    setSelAval(avId); setNotasMap({})
    if (!avId) return
    const notas = await api.get(`/notas/avaliacao/${avId}`).then(r => r.data)
    const map = {}
    notas.forEach(n => { map[n.aluno.id] = n.valor })
    setNotasMap(map)
  }

  const save = async () => {
    if (!selAval) return
    setSaving(true); setMsg('')
    for (const [alunoId, valor] of Object.entries(notasMap)) {
      if (valor !== '' && valor !== undefined) {
        await api.post('/notas/lancar', { avaliacaoId: Number(selAval), alunoId: Number(alunoId), valor: Number(valor) })
      }
    }
    setSaving(false)
    setMsg('Notas salvas com sucesso!')
    setTimeout(() => setMsg(''), 3000)
  }

  const avalSelected = avaliacoes.find(a => a.id === Number(selAval))

  return (
    <div>
      <PageHeader title="Lançamento de Notas" subtitle="Registre as notas das avaliações por turma e matéria" />

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
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>AVALIAÇÃO</label>
            <select style={sel} value={selAval} onChange={e => onAvalChange(e.target.value)} disabled={!selMateria}>
              <option value="">Selecione...</option>
              {avaliacoes.map(a => <option key={a.id} value={a.id}>{a.descricao || a.tipo} — {a.bimestre}º Bim</option>)}
            </select>
          </div>
        </div>
      </div>

      {selAval && alunos.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                {avalSelected?.descricao || avalSelected?.tipo} — {avalSelected?.bimestre}º Bimestre
              </span>
              <span style={{ marginLeft: 12, color: '#64748b', fontSize: 12 }}>Peso: {avalSelected?.peso}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {msg && <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>{msg}</span>}
              <Btn onClick={save} disabled={saving}><Save size={14} />{saving ? 'Salvando...' : 'Salvar Notas'}</Btn>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Aluno</th>
                <th style={{ padding: '10px 20px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', width: 120 }}>Nota (0–10)</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(aluno => (
                <tr key={aluno.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 20px', fontSize: 13.5, color: '#334155' }}>{aluno.nome}</td>
                  <td style={{ padding: '8px 20px', textAlign: 'center' }}>
                    <input
                      type="number" min="0" max="10" step="0.1"
                      value={notasMap[aluno.id] ?? ''}
                      onChange={e => setNotasMap(p => ({ ...p, [aluno.id]: e.target.value }))}
                      style={{ width: 80, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, textAlign: 'center', fontSize: 14 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selAval && alunos.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>
          Nenhum aluno matriculado nesta turma.
        </div>
      )}
    </div>
  )
}
