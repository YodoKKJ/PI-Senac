package com.tcc.academico.repository;

import com.tcc.academico.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByAvaliacaoId(Long avaliacaoId);
    Optional<Nota> findByAvaliacaoIdAndAlunoId(Long avaliacaoId, Long alunoId);
    List<Nota> findByAlunoIdAndAvaliacaoTurmaIdAndAvaliacaoMateriaId(Long alunoId, Long turmaId, Long materiaId);
    List<Nota> findByAlunoIdAndAvaliacaoTurmaId(Long alunoId, Long turmaId);
}
