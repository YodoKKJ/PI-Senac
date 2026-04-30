package com.tcc.academico.repository;

import com.tcc.academico.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PresencaRepository extends JpaRepository<Presenca, Long> {
    List<Presenca> findByAlunoIdAndTurmaIdAndMateriaId(Long alunoId, Long turmaId, Long materiaId);
    List<Presenca> findByTurmaIdAndMateriaIdAndData(Long turmaId, Long materiaId, LocalDate data);
    List<Presenca> findByTurmaIdAndMateriaId(Long turmaId, Long materiaId);
    Optional<Presenca> findByAlunoIdAndTurmaIdAndMateriaIdAndData(Long alunoId, Long turmaId, Long materiaId, LocalDate data);
}
