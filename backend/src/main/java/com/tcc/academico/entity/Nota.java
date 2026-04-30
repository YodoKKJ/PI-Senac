package com.tcc.academico.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas",
       uniqueConstraints = @UniqueConstraint(columnNames = {"avaliacao_id", "aluno_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "avaliacao_id", nullable = false)
    private Avaliacao avaliacao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal valor;

    @Builder.Default
    private LocalDateTime lancadoEm = LocalDateTime.now();
}
