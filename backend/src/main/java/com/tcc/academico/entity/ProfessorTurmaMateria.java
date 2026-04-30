package com.tcc.academico.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professor_turma_materia",
       uniqueConstraints = @UniqueConstraint(columnNames = {"professor_id", "turma_id", "materia_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfessorTurmaMateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;
}
