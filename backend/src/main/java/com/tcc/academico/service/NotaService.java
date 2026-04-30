package com.tcc.academico.service;

import com.tcc.academico.dto.BoletimMateriaDTO;
import com.tcc.academico.entity.*;
import com.tcc.academico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotaService {

    private static final BigDecimal MEDIA_MINIMA = new BigDecimal("6.0");
    private static final BigDecimal FREQ_MINIMA = new BigDecimal("75.0");

    private final NotaRepository notaRepo;
    private final AvaliacaoRepository avaliacaoRepo;
    private final PresencaRepository presencaRepo;
    private final AlunoTurmaRepository alunoTurmaRepo;
    private final ProfessorTurmaMateriaRepository ptmRepo;

    @Transactional
    public Nota lancarNota(Long avaliacaoId, Long alunoId, BigDecimal valor, AlunoRepository alunoRepo, AvaliacaoRepository avalRepo) {
        Avaliacao avaliacao = avalRepo.findById(avaliacaoId)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
        Aluno aluno = alunoRepo.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Nota nota = notaRepo.findByAvaliacaoIdAndAlunoId(avaliacaoId, alunoId)
                .orElse(Nota.builder().avaliacao(avaliacao).aluno(aluno).build());
        nota.setValor(valor);
        nota.setLancadoEm(java.time.LocalDateTime.now());
        return notaRepo.save(nota);
    }

    public List<BoletimMateriaDTO> gerarBoletim(Long alunoId, Long turmaId, MateriaRepository materiaRepo) {
        // Pega todas as matérias da turma via vínculos professor-turma-materia
        List<Long> materiaIds = ptmRepo.findByTurmaId(turmaId).stream()
                .map(ptm -> ptm.getMateria().getId())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<BoletimMateriaDTO> boletim = new ArrayList<>();

        for (Long materiaId : materiaIds) {
            Materia materia = materiaRepo.findById(materiaId).orElse(null);
            if (materia == null) continue;

            List<BoletimMateriaDTO.BimestreDTO> bimestres = new ArrayList<>();
            BigDecimal somaMedias = BigDecimal.ZERO;
            int bimestresComNota = 0;

            for (int b = 1; b <= 4; b++) {
                List<Avaliacao> avaliacoes = avaliacaoRepo.findByTurmaIdAndMateriaIdAndBimestre(turmaId, materiaId, b);
                List<BoletimMateriaDTO.NotaItemDTO> notaItems = new ArrayList<>();
                BigDecimal somaPonderada = BigDecimal.ZERO;
                BigDecimal somaPesos = BigDecimal.ZERO;
                BigDecimal bonificacao = BigDecimal.ZERO;
                BigDecimal mediaRecuperacao = null;

                for (Avaliacao av : avaliacoes) {
                    Optional<Nota> notaOpt = notaRepo.findByAvaliacaoIdAndAlunoId(av.getId(), alunoId);
                    BigDecimal valor = notaOpt.map(Nota::getValor).orElse(null);

                    notaItems.add(BoletimMateriaDTO.NotaItemDTO.builder()
                            .descricao(av.getDescricao() != null ? av.getDescricao() : av.getTipo().name())
                            .tipo(av.getTipo().name())
                            .valor(valor)
                            .peso(av.getPeso())
                            .build());

                    if (valor == null) continue;

                    if (av.getTipo() == TipoAvaliacao.SIMULADO) {
                        bonificacao = bonificacao.add(valor);
                    } else if (av.getTipo() == TipoAvaliacao.RECUPERACAO) {
                        mediaRecuperacao = valor;
                    } else {
                        somaPonderada = somaPonderada.add(valor.multiply(av.getPeso()));
                        somaPesos = somaPesos.add(av.getPeso());
                    }
                }

                BigDecimal mediaBim = BigDecimal.ZERO;
                if (somaPesos.compareTo(BigDecimal.ZERO) > 0) {
                    mediaBim = somaPonderada.divide(somaPesos, 2, RoundingMode.HALF_UP);
                    mediaBim = mediaBim.add(bonificacao.min(BigDecimal.ONE));
                    mediaBim = mediaBim.min(new BigDecimal("10.0"));

                    if (mediaRecuperacao != null) {
                        mediaBim = mediaBim.max(mediaRecuperacao);
                    }

                    somaMedias = somaMedias.add(mediaBim);
                    bimestresComNota++;
                }

                bimestres.add(BoletimMateriaDTO.BimestreDTO.builder()
                        .numero(b)
                        .media(somaPesos.compareTo(BigDecimal.ZERO) > 0 ? mediaBim : null)
                        .notas(notaItems)
                        .build());
            }

            BigDecimal mediaAnual = bimestresComNota > 0
                    ? somaMedias.divide(new BigDecimal(bimestresComNota), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            // Frequência
            List<Presenca> presencas = presencaRepo.findByAlunoIdAndTurmaIdAndMateriaId(alunoId, turmaId, materiaId);
            long total = presencas.size();
            long faltas = presencas.stream().filter(p -> !p.getPresente()).count();
            BigDecimal frequencia = total > 0
                    ? new BigDecimal(total - faltas).multiply(new BigDecimal("100"))
                            .divide(new BigDecimal(total), 1, RoundingMode.HALF_UP)
                    : new BigDecimal("100.0");

            boolean aprovado = mediaAnual.compareTo(MEDIA_MINIMA) >= 0 && frequencia.compareTo(FREQ_MINIMA) >= 0;

            boletim.add(BoletimMateriaDTO.builder()
                    .materiaId(materiaId)
                    .materiaNome(materia.getNome())
                    .bimestres(bimestres)
                    .mediaAnual(mediaAnual)
                    .frequencia(frequencia)
                    .situacao(aprovado ? "APROVADO" : "REPROVADO")
                    .build());
        }

        return boletim;
    }
}
