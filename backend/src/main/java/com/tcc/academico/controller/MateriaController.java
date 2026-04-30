package com.tcc.academico.controller;

import com.tcc.academico.entity.Materia;
import com.tcc.academico.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaRepository repo;

    @GetMapping
    public List<Materia> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Materia criar(@RequestBody Materia materia) {
        return repo.save(materia);
    }

    @PutMapping("/{id}")
    public Materia atualizar(@PathVariable Long id, @RequestBody Materia materia) {
        materia.setId(id);
        return repo.save(materia);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
