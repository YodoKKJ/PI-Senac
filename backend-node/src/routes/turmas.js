const { Router } = require('express')
const db = require('../db')

const router = Router()

const include = { serie: true }

// GET /api/turmas
router.get('/', async (req, res) => {
  try {
    const turmas = await db.turma.findMany({ include, orderBy: { id: 'asc' } })
    res.json(turmas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/turmas
router.post('/', async (req, res) => {
  try {
    const { nome, serieId, anoLetivo } = req.body
    const turma = await db.turma.create({
      data: { nome, serieId: Number(serieId), anoLetivo: Number(anoLetivo) },
      include,
    })
    res.status(201).json(turma)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/turmas/:id
router.put('/:id', async (req, res) => {
  try {
    const { nome, serieId, anoLetivo } = req.body
    const turma = await db.turma.update({
      where: { id: Number(req.params.id) },
      data: { nome, serieId: Number(serieId), anoLetivo: Number(anoLetivo) },
      include,
    })
    res.json(turma)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/turmas/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.turma.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
