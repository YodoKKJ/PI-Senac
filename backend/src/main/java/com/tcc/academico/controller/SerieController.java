package com.tcc.academico.controller;

import com.tcc.academico.entity.Serie;
import com.tcc.academico.repository.SerieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
@RequiredArgsConstructor
public class SerieController {

    private final SerieRepository repo;

    @GetMapping
    public List<Serie> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Serie criar(@RequestBody Serie serie) {
        return repo.save(serie);
    }

    @PutMapping("/{id}")
    public Serie atualizar(@PathVariable Long id, @RequestBody Serie serie) {
        serie.setId(id);
        return repo.save(serie);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
