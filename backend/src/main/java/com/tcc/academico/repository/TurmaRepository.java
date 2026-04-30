package com.tcc.academico.repository;

import com.tcc.academico.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByAnoLetivo(Integer anoLetivo);
    List<Turma> findBySerieId(Long serieId);
}
