package com.tcc.academico.controller;

import com.tcc.academico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AlunoRepository alunoRepo;
    private final ProfessorRepository professorRepo;
    private final TurmaRepository turmaRepo;
    private final MateriaRepository materiaRepo;
    private final AvaliacaoRepository avaliacaoRepo;

    @GetMapping
    public Map<String, Object> resumo() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalAlunos", alunoRepo.count());
        data.put("totalProfessores", professorRepo.count());
        data.put("totalTurmas", turmaRepo.count());
        data.put("totalMaterias", materiaRepo.count());
        data.put("totalAvaliacoes", avaliacaoRepo.count());
        return data;
    }
}
