import { useEffect, useState } from 'react'
import { Users, GraduationCap, BookOpen, ClipboardList, FileText } from 'lucide-react'
import api from '../api.js'

const CARDS = [
  { key: 'totalAlunos',     label: 'Alunos',      icon: Users,          color: '#3b82f6' },
  { key: 'totalProfessores', label: 'Professores', icon: GraduationCap,  color: '#8b5cf6' },
  { key: 'totalTurmas',     label: 'Turmas',       icon: BookOpen,       color: '#f59e0b' },
  { key: 'totalMaterias',   label: 'Matérias',     icon: ClipboardList,  color: '#10b981' },
  { key: 'totalAvaliacoes', label: 'Avaliações',   icon: FileText,       color: '#ef4444' },
]

export default function Dashboard() {
  const [data, setData] = useState({})

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b' }}>Dashboard</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Visão geral do sistema acadêmico</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} style={{
            background: '#fff', borderRadius: 12, padding: '20px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,.08)',
            borderLeft: `4px solid ${color}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: .4 }}>
                {label}
              </span>
              <div style={{ background: color + '18', borderRadius: 8, padding: 7, color }}>
                <Icon size={16} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>
              {data[key] ?? '—'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Como começar</h2>
        <ol style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 13.5, lineHeight: 2 }}>
          <li>Cadastre as <strong>Séries</strong> (ex: 1º Ano, 2º Ano)</li>
          <li>Crie as <strong>Turmas</strong> vinculadas às séries</li>
          <li>Cadastre as <strong>Matérias</strong> (ex: Matemática, Português)</li>
          <li>Cadastre <strong>Alunos</strong> e <strong>Professores</strong></li>
          <li>Acesse <strong>Vínculos</strong> para matricular alunos e atribuir professores às turmas</li>
          <li>Crie <strong>Avaliações</strong> e lance <strong>Notas</strong></li>
          <li>Registre a <strong>Chamada</strong> e consulte o <strong>Boletim</strong></li>
        </ol>
      </div>
    </div>
  )
}
