const { Router } = require('express')
const db = require('../db')

const router = Router()

const include = {
  turma: { include: { serie: true } },
  materia: true,
}

// GET /api/avaliacoes?turmaId=&materiaId=
router.get('/', async (req, res) => {
  try {
    const where = {}
    if (req.query.turmaId)   where.turmaId   = Number(req.query.turmaId)
    if (req.query.materiaId) where.materiaId = Number(req.query.materiaId)

    const avaliacoes = await db.avaliacao.findMany({
      where,
      include,
      orderBy: [{ bimestre: 'asc' }, { dataAplicacao: 'asc' }],
    })
    res.json(avaliacoes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/avaliacoes
router.post('/', async (req, res) => {
  try {
    const { turmaId, materiaId, tipo, descricao, dataAplicacao, peso, bimestre } = req.body
    const avaliacao = await db.avaliacao.create({
      data: {
        turmaId: Number(turmaId),
        materiaId: Number(materiaId),
        tipo,
        descricao: descricao || null,
        dataAplicacao: new Date(dataAplicacao),
        peso: Number(peso),
        bimestre: Number(bimestre),
      },
      include,
    })
    res.status(201).json(avaliacao)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/avaliacoes/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.avaliacao.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
