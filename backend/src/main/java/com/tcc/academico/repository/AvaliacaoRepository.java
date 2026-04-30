package com.tcc.academico.repository;

import com.tcc.academico.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByTurmaIdAndMateriaId(Long turmaId, Long materiaId);
    List<Avaliacao> findByTurmaId(Long turmaId);
    List<Avaliacao> findByTurmaIdAndMateriaIdAndBimestre(Long turmaId, Long materiaId, Integer bimestre);
}
