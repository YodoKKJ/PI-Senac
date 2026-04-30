package com.tcc.academico.repository;

import com.tcc.academico.entity.AlunoTurma;
import com.tcc.academico.entity.AlunoTurmaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlunoTurmaRepository extends JpaRepository<AlunoTurma, AlunoTurmaId> {
    List<AlunoTurma> findByIdTurmaId(Long turmaId);
    List<AlunoTurma> findByIdAlunoId(Long alunoId);
    void deleteByIdAlunoIdAndIdTurmaId(Long alunoId, Long turmaId);
}
