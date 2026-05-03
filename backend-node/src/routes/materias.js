const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/materias
router.get('/', async (req, res) => {
  try {
    const materias = await db.materia.findMany({ orderBy: { nome: 'asc' } })
    res.json(materias)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/materias
router.post('/', async (req, res) => {
  try {
    const materia = await db.materia.create({ data: { nome: req.body.nome } })
    res.status(201).json(materia)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/materias/:id
router.put('/:id', async (req, res) => {
  try {
    const materia = await db.materia.update({
      where: { id: Number(req.params.id) },
      data: { nome: req.body.nome },
    })
    res.json(materia)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/materias/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.materia.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
