package com.tcc.academico.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoTurmaId implements Serializable {
    private Long alunoId;
    private Long turmaId;
}
