import { useEffect, useState } from 'react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'

const sel = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, background: '#fff', minWidth: 180 }

function StatusBadge({ situacao }) {
  const ok = situacao === 'APROVADO'
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: ok ? '#f0fdf4' : '#fff1f2',
      color: ok ? '#16a34a' : '#dc2626',
    }}>{situacao}</span>
  )
}

function MediaBall({ valor }) {
  if (valor == null) return <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
  const n = Number(valor)
  const color = n >= 7 ? '#16a34a' : n >= 5 ? '#f59e0b' : '#dc2626'
  return (
    <span style={{
      display: 'inline-block', width: 36, height: 36, borderRadius: '50%',
      background: color + '18', color, fontWeight: 700, fontSize: 13,
      textAlign: 'center', lineHeight: '36px', border: `2px solid ${color}40`,
    }}>{n.toFixed(1)}</span>
  )
}

export default function Boletim() {
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [boletim, setBoletim] = useState([])

  const [selTurma, setSelTurma] = useState('')
  const [selAluno, setSelAluno] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get('/turmas').then(r => setTurmas(r.data)) }, [])

  const onTurmaChange = tid => {
    setSelTurma(tid); setSelAluno(''); setBoletim([]); setAlunos([])
    if (tid) api.get('/vinculos/aluno-turma/' + tid).then(r => setAlunos(r.data.map(v => v.aluno)))
  }

  const onAlunoChange = async aid => {
    setSelAluno(aid); setBoletim([])
    if (!aid) return
    setLoading(true)
    const data = await api.get(`/notas/boletim/${aid}/${selTurma}`).then(r => r.data).catch(() => [])
    setBoletim(data)
    setLoading(false)
  }

  const alunoNome = alunos.find(a => a.id === Number(selAluno))?.nome || ''
  const turmaInfo = turmas.find(t => t.id === Number(selTurma))

  return (
    <div>
      <PageHeader title="Boletim Escolar" subtitle="Consulte as médias, frequência e situação final do aluno" />

      <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>TURMA</label>
            <select style={sel} value={selTurma} onChange={e => onTurmaChange(e.target.value)}>
              <option value="">Selecione...</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie?.nome})</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>ALUNO</label>
            <select style={sel} value={selAluno} onChange={e => onAlunoChange(e.target.value)} disabled={!selTurma}>
              <option value="">Selecione...</option>
              {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Carregando boletim...</div>}

      {!loading && boletim.length > 0 && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{alunoNome}</h2>
            <span style={{ color: '#64748b', fontSize: 13 }}>{turmaInfo?.nome} — {turmaInfo?.serie?.nome} ({turmaInfo?.anoLetivo})</span>
          </div>

          {boletim.map(mat => (
            <div key={mat.materiaId} style={{
              background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08)',
              marginBottom: 16, overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{mat.materiaNome}</span>
                  <StatusBadge situacao={mat.situacao} />
                </div>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Média Anual</div>
                    <div style={{ marginTop: 4 }}><MediaBall valor={mat.mediaAnual} /></div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Frequência</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: Number(mat.frequencia) >= 75 ? '#16a34a' : '#dc2626', marginTop: 4 }}>
                      {mat.frequencia}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 20px', gap: 16 }}>
                {mat.bimestres.map(bim => (
                  <div key={bim.numero}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>{bim.numero}º BIMESTRE</div>
                    <div style={{ marginBottom: 8 }}><MediaBall valor={bim.media} /></div>
                    {bim.notas.map((n, i) => (
                      <div key={i} style={{ fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>{n.descricao}</span>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{n.valor != null ? Number(n.valor).toFixed(1) : '—'}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selAluno && boletim.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>
          Nenhuma matéria vinculada à turma ou sem avaliações cadastradas.
        </div>
      )}
    </div>
  )
}
