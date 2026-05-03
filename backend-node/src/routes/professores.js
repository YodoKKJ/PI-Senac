const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/professores
router.get('/', async (req, res) => {
  try {
    const professores = await db.professor.findMany({ orderBy: { nome: 'asc' } })
    res.json(professores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/professores/:id
router.get('/:id', async (req, res) => {
  try {
    const professor = await db.professor.findUniqueOrThrow({ where: { id: Number(req.params.id) } })
    res.json(professor)
  } catch (err) {
    res.status(404).json({ error: 'Professor não encontrado' })
  }
})

// POST /api/professores
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, especialidade } = req.body
    const professor = await db.professor.create({
      data: {
        nome,
        email: email || null,
        telefone: telefone || null,
        especialidade: especialidade || null,
      },
    })
    res.status(201).json(professor)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/professores/:id
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, telefone, especialidade } = req.body
    const professor = await db.professor.update({
      where: { id: Number(req.params.id) },
      data: {
        nome,
        email: email || null,
        telefone: telefone || null,
        especialidade: especialidade || null,
      },
    })
    res.json(professor)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/professores/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.professor.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
