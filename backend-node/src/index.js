const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use(express.json())

// Rotas da API
app.use('/api/series',     require('./routes/series'))
app.use('/api/turmas',     require('./routes/turmas'))
app.use('/api/alunos',     require('./routes/alunos'))
app.use('/api/professores',require('./routes/professores'))
app.use('/api/materias',   require('./routes/materias'))
app.use('/api/vinculos',   require('./routes/vinculos'))
app.use('/api/avaliacoes', require('./routes/avaliacoes'))
app.use('/api/notas',      require('./routes/notas'))
app.use('/api/presencas',  require('./routes/presencas'))
app.use('/api/dashboard',  require('./routes/dashboard'))

// Serve o frontend React (build) se existir
const distPath = path.join(__dirname, '../../frontend/dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  // SPA fallback — qualquer rota não-API retorna o index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
