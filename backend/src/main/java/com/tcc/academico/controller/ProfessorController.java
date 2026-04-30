package com.tcc.academico.controller;

import com.tcc.academico.entity.Professor;
import com.tcc.academico.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorRepository repo;

    @GetMapping
    public List<Professor> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Professor buscar(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }

    @PostMapping
    public Professor criar(@RequestBody Professor professor) {
        professor.setId(null);
        return repo.save(professor);
    }

    @PutMapping("/{id}")
    public Professor atualizar(@PathVariable Long id, @RequestBody Professor professor) {
        professor.setId(id);
        return repo.save(professor);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
