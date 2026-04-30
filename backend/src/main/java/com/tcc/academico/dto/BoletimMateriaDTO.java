package com.tcc.academico.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BoletimMateriaDTO {
    private Long materiaId;
    private String materiaNome;
    private List<BimestreDTO> bimestres;
    private BigDecimal mediaAnual;
    private BigDecimal frequencia;
    private String situacao;

    @Data
    @Builder
    public static class BimestreDTO {
        private Integer numero;
        private BigDecimal media;
        private List<NotaItemDTO> notas;
    }

    @Data
    @Builder
    public static class NotaItemDTO {
        private String descricao;
        private String tipo;
        private BigDecimal valor;
        private BigDecimal peso;
    }
}
