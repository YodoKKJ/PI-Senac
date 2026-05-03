const { Router } = require('express')
const db = require('../db')

const router = Router()

const includeAT = {
  aluno: true,
  turma: { include: { serie: true } },
}

const includePTM = {
  professor: true,
  turma: { include: { serie: true } },
  materia: true,
}

// ---- Aluno-Turma ----

// GET /api/vinculos/aluno-turma/:turmaId
router.get('/aluno-turma/:turmaId', async (req, res) => {
  try {
    const vinculos = await db.alunoTurma.findMany({
      where: { turmaId: Number(req.params.turmaId) },
      include: includeAT,
    })
    res.json(vinculos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/vinculos/aluno-turma/aluno/:alunoId
router.get('/aluno-turma/aluno/:alunoId', async (req, res) => {
  try {
    const vinculos = await db.alunoTurma.findMany({
      where: { alunoId: Number(req.params.alunoId) },
      include: includeAT,
    })
    res.json(vinculos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/vinculos/aluno-turma
router.post('/aluno-turma', async (req, res) => {
  try {
    const { alunoId, turmaId } = req.body
    const vinculo = await db.alunoTurma.create({
      data: { alunoId: Number(alunoId), turmaId: Number(turmaId) },
      include: includeAT,
    })
    res.status(201).json(vinculo)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/vinculos/aluno-turma?alunoId=&turmaId=
router.delete('/aluno-turma', async (req, res) => {
  try {
    await db.alunoTurma.delete({
      where: {
        alunoId_turmaId: {
          alunoId: Number(req.query.alunoId),
          turmaId: Number(req.query.turmaId),
        },
      },
    })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ---- Professor-Turma-Materia ----

// GET /api/vinculos/professor-turma-materia/:turmaId
router.get('/professor-turma-materia/:turmaId', async (req, res) => {
  try {
    const vinculos = await db.professorTurmaMateria.findMany({
      where: { turmaId: Number(req.params.turmaId) },
      include: includePTM,
    })
    res.json(vinculos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/vinculos/professor-turma-materia/professor/:professorId
router.get('/professor-turma-materia/professor/:professorId', async (req, res) => {
  try {
    const vinculos = await db.professorTurmaMateria.findMany({
      where: { professorId: Number(req.params.professorId) },
      include: includePTM,
    })
    res.json(vinculos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/vinculos/professor-turma-materia
router.post('/professor-turma-materia', async (req, res) => {
  try {
    const { professorId, turmaId, materiaId } = req.body
    const vinculo = await db.professorTurmaMateria.create({
      data: {
        professorId: Number(professorId),
        turmaId: Number(turmaId),
        materiaId: Number(materiaId),
      },
      include: includePTM,
    })
    res.status(201).json(vinculo)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/vinculos/professor-turma-materia/:id
router.delete('/professor-turma-materia/:id', async (req, res) => {
  try {
    await db.professorTurmaMateria.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
