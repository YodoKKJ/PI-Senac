package com.tcc.academico.controller;

import com.tcc.academico.entity.Serie;
import com.tcc.academico.entity.Turma;
import com.tcc.academico.repository.SerieRepository;
import com.tcc.academico.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaRepository turmaRepo;
    private final SerieRepository serieRepo;

    @GetMapping
    public List<Turma> listar() {
        return turmaRepo.findAll();
    }

    @PostMapping
    public Turma criar(@RequestBody Map<String, Object> body) {
        Serie serie = serieRepo.findById(Long.valueOf(body.get("serieId").toString()))
                .orElseThrow(() -> new RuntimeException("Série não encontrada"));
        Turma turma = Turma.builder()
                .nome(body.get("nome").toString())
                .serie(serie)
                .anoLetivo(Integer.valueOf(body.get("anoLetivo").toString()))
                .build();
        return turmaRepo.save(turma);
    }

    @PutMapping("/{id}")
    public Turma atualizar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Turma turma = turmaRepo.findById(id).orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Serie serie = serieRepo.findById(Long.valueOf(body.get("serieId").toString()))
                .orElseThrow(() -> new RuntimeException("Série não encontrada"));
        turma.setNome(body.get("nome").toString());
        turma.setSerie(serie);
        turma.setAnoLetivo(Integer.valueOf(body.get("anoLetivo").toString()));
        return turmaRepo.save(turma);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        turmaRepo.deleteById(id);
    }
}
