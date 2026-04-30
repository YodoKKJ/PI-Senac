package com.tcc.academico.repository;

import com.tcc.academico.entity.ProfessorTurmaMateria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorTurmaMateriaRepository extends JpaRepository<ProfessorTurmaMateria, Long> {
    List<ProfessorTurmaMateria> findByTurmaId(Long turmaId);
    List<ProfessorTurmaMateria> findByProfessorId(Long professorId);
    void deleteByProfessorIdAndTurmaIdAndMateriaId(Long professorId, Long turmaId, Long materiaId);
}
