const { Router } = require('express')
const db = require('../db')

const router = Router()

// GET /api/notas/avaliacao/:avaliacaoId
router.get('/avaliacao/:avaliacaoId', async (req, res) => {
  try {
    const notas = await db.nota.findMany({
      where: { avaliacaoId: Number(req.params.avaliacaoId) },
      include: { aluno: true, avaliacao: true },
    })
    res.json(notas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/notas/lancar
// Body: { avaliacaoId, alunoId, valor }
router.post('/lancar', async (req, res) => {
  try {
    const { avaliacaoId, alunoId, valor } = req.body

    const nota = await db.nota.upsert({
      where: {
        avaliacaoId_alunoId: {
          avaliacaoId: Number(avaliacaoId),
          alunoId: Number(alunoId),
        },
      },
      update: {
        valor: Number(valor),
        lancadoEm: new Date(),
      },
      create: {
        avaliacaoId: Number(avaliacaoId),
        alunoId: Number(alunoId),
        valor: Number(valor),
      },
      include: { aluno: true, avaliacao: true },
    })

    res.json(nota)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/notas/boletim/:alunoId/:turmaId
router.get('/boletim/:alunoId/:turmaId', async (req, res) => {
  try {
    const alunoId = Number(req.params.alunoId)
    const turmaId = Number(req.params.turmaId)

    // Materias vinculadas à turma via professor_turma_materia
    const ptms = await db.professorTurmaMateria.findMany({
      where: { turmaId },
      include: { materia: true },
      orderBy: { materiaId: 'asc' },
    })

    // IDs únicos de matéria
    const materiasMap = new Map()
    for (const ptm of ptms) {
      if (!materiasMap.has(ptm.materiaId)) {
        materiasMap.set(ptm.materiaId, ptm.materia)
      }
    }

    const boletim = []

    for (const [materiaId, materia] of materiasMap) {
      const bimestres = []
      let somaMedias = 0
      let bimestresComNota = 0

      for (let b = 1; b <= 4; b++) {
        const avaliacoes = await db.avaliacao.findMany({
          where: { turmaId, materiaId, bimestre: b },
        })

        const notaItems = []
        let somaPonderada = 0
        let somaPesos = 0
        let bonificacao = 0
        let mediaRecuperacao = null

        for (const av of avaliacoes) {
          const notaRecord = await db.nota.findFirst({
            where: { avaliacaoId: av.id, alunoId },
          })
          const valor = notaRecord ? parseFloat(notaRecord.valor) : null

          notaItems.push({
            descricao: av.descricao || av.tipo,
            tipo: av.tipo,
            valor,
            peso: parseFloat(av.peso),
          })

          if (valor === null) continue

          if (av.tipo === 'SIMULADO') {
            bonificacao += valor
          } else if (av.tipo === 'RECUPERACAO') {
            mediaRecuperacao = valor
          } else {
            somaPonderada += valor * parseFloat(av.peso)
            somaPesos += parseFloat(av.peso)
          }
        }

        let mediaBim = null
        if (somaPesos > 0) {
          mediaBim = somaPonderada / somaPesos
          mediaBim += Math.min(bonificacao, 1.0)
          mediaBim = Math.min(mediaBim, 10.0)
          if (mediaRecuperacao !== null) {
            mediaBim = Math.max(mediaBim, mediaRecuperacao)
          }
          mediaBim = Math.round(mediaBim * 100) / 100
          somaMedias += mediaBim
          bimestresComNota++
        }

        bimestres.push({ numero: b, media: mediaBim, notas: notaItems })
      }

      const mediaAnual = bimestresComNota > 0
        ? Math.round((somaMedias / bimestresComNota) * 100) / 100
        : 0

      // Frequência
      const presencas = await db.presenca.findMany({
        where: { alunoId, turmaId, materiaId },
      })
      const total = presencas.length
      const faltas = presencas.filter(p => !p.presente).length
      const frequencia = total > 0
        ? Math.round(((total - faltas) * 100 / total) * 10) / 10
        : 100.0

      const aprovado = mediaAnual >= 6.0 && frequencia >= 75.0

      boletim.push({
        materiaId,
        materiaNome: materia.nome,
        bimestres,
        mediaAnual,
        frequencia,
        situacao: aprovado ? 'APROVADO' : 'REPROVADO',
      })
    }

    res.json(boletim)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
