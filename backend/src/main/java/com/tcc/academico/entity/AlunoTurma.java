package com.tcc.academico.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aluno_turma")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlunoTurma {

    @EmbeddedId
    private AlunoTurmaId id;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("alunoId")
    @JoinColumn(name = "aluno_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("turmaId")
    @JoinColumn(name = "turma_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Turma turma;
}
