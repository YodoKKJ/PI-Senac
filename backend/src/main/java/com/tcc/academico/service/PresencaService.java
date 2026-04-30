package com.tcc.academico.service;

import com.tcc.academico.entity.*;
import com.tcc.academico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepo;
    private final AlunoRepository alunoRepo;
    private final TurmaRepository turmaRepo;
    private final MateriaRepository materiaRepo;

    @Transactional
    public List<Presenca> lancarChamada(Long turmaId, Long materiaId, LocalDate data, Map<Long, Boolean> chamada) {
        Turma turma = turmaRepo.findById(turmaId).orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Materia materia = materiaRepo.findById(materiaId).orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        List<Presenca> result = new ArrayList<>();
        for (Map.Entry<Long, Boolean> entry : chamada.entrySet()) {
            Long alunoId = entry.getKey();
            Boolean presente = entry.getValue();
            Aluno aluno = alunoRepo.findById(alunoId).orElse(null);
            if (aluno == null) continue;

            Presenca p = presencaRepo
                    .findByAlunoIdAndTurmaIdAndMateriaIdAndData(alunoId, turmaId, materiaId, data)
                    .orElse(Presenca.builder().aluno(aluno).turma(turma).materia(materia).data(data).build());
            p.setPresente(presente);
            result.add(presencaRepo.save(p));
        }
        return result;
    }

    public Map<String, Object> frequenciaAluno(Long alunoId, Long turmaId, Long materiaId) {
        List<Presenca> presencas = presencaRepo.findByAlunoIdAndTurmaIdAndMateriaId(alunoId, turmaId, materiaId);
        long total = presencas.size();
        long presentes = presencas.stream().filter(Presenca::getPresente).count();
        long faltas = total - presentes;
        double freq = total > 0 ? (presentes * 100.0 / total) : 100.0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalAulas", total);
        result.put("presentes", presentes);
        result.put("faltas", faltas);
        result.put("frequencia", Math.round(freq * 10.0) / 10.0);
        result.put("registros", presencas);
        return result;
    }

    public List<Map<String, Object>> chamadaPorData(Long turmaId, Long materiaId, LocalDate data) {
        List<Presenca> presencas = presencaRepo.findByTurmaIdAndMateriaIdAndData(turmaId, materiaId, data);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Presenca p : presencas) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("alunoId", p.getAluno().getId());
            item.put("alunoNome", p.getAluno().getNome());
            item.put("presente", p.getPresente());
            result.add(item);
        }
        return result;
    }
}
