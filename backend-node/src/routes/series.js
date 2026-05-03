const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/series
router.get('/', async (req, res) => {
  try {
    const series = await db.serie.findMany({ orderBy: { id: 'asc' } })
    res.json(series)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/series
router.post('/', async (req, res) => {
  try {
    const serie = await db.serie.create({ data: { nome: req.body.nome } })
    res.status(201).json(serie)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/series/:id
router.put('/:id', async (req, res) => {
  try {
    const serie = await db.serie.update({
      where: { id: Number(req.params.id) },
      data: { nome: req.body.nome },
    })
    res.json(serie)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/series/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.serie.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
