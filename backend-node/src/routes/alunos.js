const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/alunos?nome=
router.get('/', async (req, res) => {
  try {
    const where = req.query.nome
      ? { nome: { contains: req.query.nome, mode: 'insensitive' } }
      : {}
    const alunos = await db.aluno.findMany({ where, orderBy: { nome: 'asc' } })
    res.json(alunos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/alunos/:id
router.get('/:id', async (req, res) => {
  try {
    const aluno = await db.aluno.findUniqueOrThrow({ where: { id: Number(req.params.id) } })
    res.json(aluno)
  } catch (err) {
    res.status(404).json({ error: 'Aluno não encontrado' })
  }
})

// POST /api/alunos
router.post('/', async (req, res) => {
  try {
    const { nome, matricula, dataNascimento, nomePai, nomeMae, telefone, email } = req.body
    const aluno = await db.aluno.create({
      data: {
        nome,
        matricula: matricula || null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        nomePai: nomePai || null,
        nomeMae: nomeMae || null,
        telefone: telefone || null,
        email: email || null,
      },
    })
    res.status(201).json(aluno)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/alunos/:id
router.put('/:id', async (req, res) => {
  try {
    const { nome, matricula, dataNascimento, nomePai, nomeMae, telefone, email } = req.body
    const aluno = await db.aluno.update({
      where: { id: Number(req.params.id) },
      data: {
        nome,
        matricula: matricula || null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        nomePai: nomePai || null,
        nomeMae: nomeMae || null,
        telefone: telefone || null,
        email: email || null,
      },
    })
    res.json(aluno)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/alunos/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.aluno.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
