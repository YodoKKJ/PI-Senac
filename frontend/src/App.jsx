import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, School,
  Link2, ClipboardList, FileText, CheckSquare, BarChart2
} from 'lucide-react'
import Dashboard from './pages/Dashboard.jsx'
import Alunos from './pages/Alunos.jsx'
import Professores from './pages/Professores.jsx'
import Series from './pages/Series.jsx'
import Turmas from './pages/Turmas.jsx'
import Materias from './pages/Materias.jsx'
import Vinculos from './pages/Vinculos.jsx'
import Avaliacoes from './pages/Avaliacoes.jsx'
import Notas from './pages/Notas.jsx'
import Chamada from './pages/Chamada.jsx'
import Boletim from './pages/Boletim.jsx'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alunos', icon: Users, label: 'Alunos' },
  { to: '/professores', icon: GraduationCap, label: 'Professores' },
  { to: '/series', icon: School, label: 'Séries' },
  { to: '/turmas', icon: BookOpen, label: 'Turmas' },
  { to: '/materias', icon: ClipboardList, label: 'Matérias' },
  { to: '/vinculos', icon: Link2, label: 'Vínculos' },
  { to: '/avaliacoes', icon: FileText, label: 'Avaliações' },
  { to: '/notas', icon: BarChart2, label: 'Notas' },
  { to: '/chamada', icon: CheckSquare, label: 'Chamada' },
  { to: '/boletim', icon: BarChart2, label: 'Boletim' },
]

const S = {
  app: { display: 'flex', height: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f1f5f9' },
  sidebar: {
    width: 220, background: '#1e293b', display: 'flex', flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(0,0,0,.3)', flexShrink: 0
  },
  logo: {
    padding: '20px 16px 16px', borderBottom: '1px solid #334155',
    color: '#f8fafc', fontWeight: 700, fontSize: 16, letterSpacing: .3
  },
  logoSub: { fontSize: 11, color: '#94a3b8', fontWeight: 400, marginTop: 2 },
  nav: { flex: 1, overflowY: 'auto', padding: '8px 0' },
  main: { flex: 1, overflow: 'auto', padding: 28 },
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} end={to === '/'} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
      color: isActive ? '#f8fafc' : '#94a3b8',
      background: isActive ? '#334155' : 'transparent',
      textDecoration: 'none', fontSize: 13.5, borderRadius: 6, margin: '1px 8px',
      transition: 'all .15s',
    })}>
      <Icon size={16} />
      {label}
    </NavLink>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={S.app}>
        <aside style={S.sidebar}>
          <div style={S.logo}>
            Sistema Acadêmico
            <div style={S.logoSub}>TCC — Gestão Escolar</div>
          </div>
          <nav style={S.nav}>
            {NAV.map(item => <NavItem key={item.to} {...item} />)}
          </nav>
        </aside>
        <main style={S.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/series" element={<Series />} />
            <Route path="/turmas" element={<Turmas />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/vinculos" element={<Vinculos />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/notas" element={<Notas />} />
            <Route path="/chamada" element={<Chamada />} />
            <Route path="/boletim" element={<Boletim />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
