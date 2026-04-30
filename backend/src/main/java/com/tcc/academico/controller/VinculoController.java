package com.tcc.academico.controller;

import com.tcc.academico.entity.*;
import com.tcc.academico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vinculos")
@RequiredArgsConstructor
public class VinculoController {

    private final AlunoTurmaRepository alunoTurmaRepo;
    private final ProfessorTurmaMateriaRepository ptmRepo;
    private final AlunoRepository alunoRepo;
    private final TurmaRepository turmaRepo;
    private final ProfessorRepository professorRepo;
    private final MateriaRepository materiaRepo;

    // ---- Aluno-Turma ----

    @GetMapping("/aluno-turma/{turmaId}")
    public List<AlunoTurma> alunosDaTurma(@PathVariable Long turmaId) {
        return alunoTurmaRepo.findByIdTurmaId(turmaId);
    }

    @GetMapping("/aluno-turma/aluno/{alunoId}")
    public List<AlunoTurma> turmasDoAluno(@PathVariable Long alunoId) {
        return alunoTurmaRepo.findByIdAlunoId(alunoId);
    }

    @PostMapping("/aluno-turma")
    public AlunoTurma vincularAlunoTurma(@RequestBody Map<String, Long> body) {
        Long alunoId = body.get("alunoId");
        Long turmaId = body.get("turmaId");
        AlunoTurmaId id = new AlunoTurmaId(alunoId, turmaId);
        Aluno aluno = alunoRepo.findById(alunoId).orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Turma turma = turmaRepo.findById(turmaId).orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        AlunoTurma at = AlunoTurma.builder().id(id).aluno(aluno).turma(turma).build();
        return alunoTurmaRepo.save(at);
    }

    @DeleteMapping("/aluno-turma")
    @Transactional
    public void desvincularAlunoTurma(@RequestParam Long alunoId, @RequestParam Long turmaId) {
        alunoTurmaRepo.deleteByIdAlunoIdAndIdTurmaId(alunoId, turmaId);
    }

    // ---- Professor-Turma-Materia ----

    @GetMapping("/professor-turma-materia/{turmaId}")
    public List<ProfessorTurmaMateria> vincsTurma(@PathVariable Long turmaId) {
        return ptmRepo.findByTurmaId(turmaId);
    }

    @GetMapping("/professor-turma-materia/professor/{professorId}")
    public List<ProfessorTurmaMateria> vincsProfessor(@PathVariable Long professorId) {
        return ptmRepo.findByProfessorId(professorId);
    }

    @PostMapping("/professor-turma-materia")
    public ProfessorTurmaMateria vincularPTM(@RequestBody Map<String, Long> body) {
        Professor professor = professorRepo.findById(body.get("professorId"))
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        Turma turma = turmaRepo.findById(body.get("turmaId"))
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Materia materia = materiaRepo.findById(body.get("materiaId"))
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        ProfessorTurmaMateria ptm = ProfessorTurmaMateria.builder()
                .professor(professor).turma(turma).materia(materia).build();
        return ptmRepo.save(ptm);
    }

    @DeleteMapping("/professor-turma-materia/{id}")
    public void deletarPTM(@PathVariable Long id) {
        ptmRepo.deleteById(id);
    }
}
