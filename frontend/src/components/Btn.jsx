export default function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style: extra }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none',
    borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 500,
    transition: 'all .15s', opacity: disabled ? .6 : 1,
    padding: size === 'sm' ? '6px 12px' : '9px 18px',
    fontSize: size === 'sm' ? 12.5 : 13.5,
    ...extra,
  }
  const variants = {
    primary: { background: '#3b82f6', color: '#fff' },
    danger:  { background: '#ef4444', color: '#fff' },
    ghost:   { background: '#f1f5f9', color: '#475569' },
    success: { background: '#22c55e', color: '#fff' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}
