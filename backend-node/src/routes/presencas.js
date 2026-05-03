const { Router } = require('express')
const db = require('../db')

const router = Router()

// POST /api/presencas/lancar
// Body: { turmaId, materiaId, data, chamada: { "alunoId": true/false } }
router.post('/lancar', async (req, res) => {
  try {
    const { turmaId, materiaId, data, chamada } = req.body
    const dataDate = new Date(data)

    const resultados = []

    for (const [alunoIdStr, presente] of Object.entries(chamada)) {
      const alunoId = Number(alunoIdStr)

      const presenca = await db.presenca.upsert({
        where: {
          alunoId_turmaId_materiaId_data: {
            alunoId,
            turmaId: Number(turmaId),
            materiaId: Number(materiaId),
            data: dataDate,
          },
        },
        update: { presente: Boolean(presente) },
        create: {
          alunoId,
          turmaId: Number(turmaId),
          materiaId: Number(materiaId),
          data: dataDate,
          presente: Boolean(presente),
        },
        include: { aluno: true },
      })

      resultados.push(presenca)
    }

    res.json(resultados)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/presencas/aluno/:alunoId/turma/:turmaId/materia/:materiaId
router.get('/aluno/:alunoId/turma/:turmaId/materia/:materiaId', async (req, res) => {
  try {
    const { alunoId, turmaId, materiaId } = req.params
    const presencas = await db.presenca.findMany({
      where: {
        alunoId: Number(alunoId),
        turmaId: Number(turmaId),
        materiaId: Number(materiaId),
      },
      orderBy: { data: 'asc' },
    })

    const total = presencas.length
    const presentes = presencas.filter(p => p.presente).length
    const faltas = total - presentes
    const frequencia = total > 0 ? Math.round((presentes * 100 / total) * 10) / 10 : 100.0

    res.json({ totalAulas: total, presentes, faltas, frequencia, registros: presencas })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/presencas/turma/:turmaId/materia/:materiaId?data=YYYY-MM-DD
router.get('/turma/:turmaId/materia/:materiaId', async (req, res) => {
  try {
    const { turmaId, materiaId } = req.params
    const data = req.query.data ? new Date(req.query.data) : new Date()

    const presencas = await db.presenca.findMany({
      where: {
        turmaId: Number(turmaId),
        materiaId: Number(materiaId),
        data,
      },
      include: { aluno: true },
    })

    const resultado = presencas.map(p => ({
      alunoId: p.alunoId,
      alunoNome: p.aluno.nome,
      presente: p.presente,
    }))

    res.json(resultado)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
