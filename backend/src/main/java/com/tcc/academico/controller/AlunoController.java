package com.tcc.academico.controller;

import com.tcc.academico.entity.Aluno;
import com.tcc.academico.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoRepository repo;

    @GetMapping
    public List<Aluno> listar(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.isBlank()) {
            return repo.buscarPorNome(nome);
        }
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Aluno buscar(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    @PostMapping
    public Aluno criar(@RequestBody Aluno aluno) {
        aluno.setId(null);
        return repo.save(aluno);
    }

    @PutMapping("/{id}")
    public Aluno atualizar(@PathVariable Long id, @RequestBody Aluno aluno) {
        aluno.setId(id);
        return repo.save(aluno);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
