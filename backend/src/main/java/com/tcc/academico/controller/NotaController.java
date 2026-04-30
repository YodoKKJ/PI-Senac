package com.tcc.academico.controller;

import com.tcc.academico.dto.BoletimMateriaDTO;
import com.tcc.academico.entity.Nota;
import com.tcc.academico.repository.*;
import com.tcc.academico.service.NotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notas")
@RequiredArgsConstructor
public class NotaController {

    private final NotaService notaService;
    private final NotaRepository notaRepo;
    private final AvaliacaoRepository avaliacaoRepo;
    private final AlunoRepository alunoRepo;
    private final MateriaRepository materiaRepo;

    @GetMapping("/avaliacao/{avaliacaoId}")
    public List<Nota> notasDaAvaliacao(@PathVariable Long avaliacaoId) {
        return notaRepo.findByAvaliacaoId(avaliacaoId);
    }

    @PostMapping("/lancar")
    public Nota lancar(@RequestBody Map<String, Object> body) {
        Long avaliacaoId = Long.valueOf(body.get("avaliacaoId").toString());
        Long alunoId = Long.valueOf(body.get("alunoId").toString());
        BigDecimal valor = new BigDecimal(body.get("valor").toString());
        return notaService.lancarNota(avaliacaoId, alunoId, valor, alunoRepo, avaliacaoRepo);
    }

    @GetMapping("/boletim/{alunoId}/{turmaId}")
    public List<BoletimMateriaDTO> boletim(@PathVariable Long alunoId, @PathVariable Long turmaId) {
        return notaService.gerarBoletim(alunoId, turmaId, materiaRepo);
    }
}
