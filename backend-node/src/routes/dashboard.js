const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [totalAlunos, totalProfessores, totalTurmas, totalMaterias, totalAvaliacoes] =
      await Promise.all([
        db.aluno.count(),
        db.professor.count(),
        db.turma.count(),
        db.materia.count(),
        db.avaliacao.count(),
      ])

    res.json({ totalAlunos, totalProfessores, totalTurmas, totalMaterias, totalAvaliacoes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
