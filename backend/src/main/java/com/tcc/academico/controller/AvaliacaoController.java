package com.tcc.academico.controller;

import com.tcc.academico.entity.*;
import com.tcc.academico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
public class AvaliacaoController {

    private final AvaliacaoRepository avaliacaoRepo;
    private final TurmaRepository turmaRepo;
    private final MateriaRepository materiaRepo;

    @GetMapping
    public List<Avaliacao> listar(
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long materiaId) {
        if (turmaId != null && materiaId != null) {
            return avaliacaoRepo.findByTurmaIdAndMateriaId(turmaId, materiaId);
        } else if (turmaId != null) {
            return avaliacaoRepo.findByTurmaId(turmaId);
        }
        return avaliacaoRepo.findAll();
    }

    @PostMapping
    public Avaliacao criar(@RequestBody Map<String, Object> body) {
        Turma turma = turmaRepo.findById(Long.valueOf(body.get("turmaId").toString()))
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Materia materia = materiaRepo.findById(Long.valueOf(body.get("materiaId").toString()))
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        Avaliacao av = Avaliacao.builder()
                .turma(turma)
                .materia(materia)
                .tipo(TipoAvaliacao.valueOf(body.get("tipo").toString()))
                .descricao(body.getOrDefault("descricao", "").toString())
                .dataAplicacao(LocalDate.parse(body.get("dataAplicacao").toString()))
                .peso(new BigDecimal(body.get("peso").toString()))
                .bimestre(Integer.valueOf(body.get("bimestre").toString()))
                .build();
        return avaliacaoRepo.save(av);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        avaliacaoRepo.deleteById(id);
    }
}
