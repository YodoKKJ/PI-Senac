package com.tcc.academico.controller;

import com.tcc.academico.entity.Presenca;
import com.tcc.academico.service.PresencaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presencas")
@RequiredArgsConstructor
public class PresencaController {

    private final PresencaService presencaService;

    @PostMapping("/lancar")
    public List<Presenca> lancar(@RequestBody Map<String, Object> body) {
        Long turmaId = Long.valueOf(body.get("turmaId").toString());
        Long materiaId = Long.valueOf(body.get("materiaId").toString());
        LocalDate data = LocalDate.parse(body.get("data").toString());

        @SuppressWarnings("unchecked")
        Map<String, Object> chamadaRaw = (Map<String, Object>) body.get("chamada");
        Map<Long, Boolean> chamada = new java.util.LinkedHashMap<>();
        chamadaRaw.forEach((k, v) -> chamada.put(Long.valueOf(k), Boolean.parseBoolean(v.toString())));

        return presencaService.lancarChamada(turmaId, materiaId, data, chamada);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/materia/{materiaId}")
    public Map<String, Object> frequenciaAluno(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId,
            @PathVariable Long materiaId) {
        return presencaService.frequenciaAluno(alunoId, turmaId, materiaId);
    }

    @GetMapping("/turma/{turmaId}/materia/{materiaId}")
    public List<Map<String, Object>> chamadaPorData(
            @PathVariable Long turmaId,
            @PathVariable Long materiaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return presencaService.chamadaPorData(turmaId, materiaId, data);
    }
}
