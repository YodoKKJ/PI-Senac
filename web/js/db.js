// ============================================================
// banco de dados do sistema usando sql.js (sqlite no browser)
// ============================================================

var db = null; // variavel principal do banco

// lista de comandos sql para criar as tabelas do sistema
var tabelasParaCriar = [
  'CREATE TABLE IF NOT EXISTS series (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS turmas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, serie_id INTEGER NOT NULL, ano_letivo INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, matricula TEXT, data_nascimento TEXT, nome_pai TEXT, nome_mae TEXT, telefone TEXT, email TEXT)',
  'CREATE TABLE IF NOT EXISTS professores (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, especialidade TEXT, email TEXT, telefone TEXT)',
  'CREATE TABLE IF NOT EXISTS materias (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS aluno_turma (aluno_id INTEGER NOT NULL, turma_id INTEGER NOT NULL, PRIMARY KEY (aluno_id, turma_id))',
  'CREATE TABLE IF NOT EXISTS prof_turma_materia (id INTEGER PRIMARY KEY AUTOINCREMENT, professor_id INTEGER NOT NULL, turma_id INTEGER NOT NULL, materia_id INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS avaliacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, turma_id INTEGER NOT NULL, materia_id INTEGER NOT NULL, tipo TEXT NOT NULL, descricao TEXT, data_aplicacao TEXT, peso REAL NOT NULL DEFAULT 1, bimestre INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, avaliacao_id INTEGER NOT NULL, aluno_id INTEGER NOT NULL, valor REAL NOT NULL, UNIQUE(avaliacao_id, aluno_id))',
  'CREATE TABLE IF NOT EXISTS presencas (id INTEGER PRIMARY KEY AUTOINCREMENT, turma_id INTEGER NOT NULL, materia_id INTEGER NOT NULL, aluno_id INTEGER NOT NULL, data TEXT NOT NULL, presente INTEGER NOT NULL DEFAULT 1, UNIQUE(turma_id, materia_id, aluno_id, data))'
];

// salva o banco no localStorage para nao perder os dados quando fechar o browser
function salvarDados() {
  if (db == null) return;
  var dadosParaSalvar = db.export();
  var arr = Array.from(dadosParaSalvar);
  localStorage.setItem('dados_escola_v2', JSON.stringify(arr));
}

// inicia o banco de dados
function initDB() {
  return initSqlJs({
    locateFile: function(nomeArquivo) {
      // precisa de internet para carregar o sql.js
      return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + nomeArquivo;
    }
  }).then(function(SQL) {

    // verifica se ja tem dados salvos no browser
    var dadosSalvos = localStorage.getItem('dados_escola_v2');

    if (dadosSalvos != null) {
      try {
        var bytesDosBanco = new Uint8Array(JSON.parse(dadosSalvos));
        db = new SQL.Database(bytesDosBanco);
      } catch (erroAoCarregar) {
        // se der erro carrega banco vazio
        db = new SQL.Database();
      }
    } else {
      // primeira vez usando o sistema
      db = new SQL.Database();
    }

    // cria todas as tabelas (se nao existirem ainda)
    for (var i = 0; i < tabelasParaCriar.length; i++) {
      db.run(tabelasParaCriar[i]);
    }

    salvarDados();
    return db;
  });
}

// roda um SELECT e retorna uma lista de objetos
function rodarConsulta(sql, params) {
  if (params == undefined) params = [];
  var stmt = db.prepare(sql);
  stmt.bind(params);
  var lista = [];
  while (stmt.step()) {
    lista.push(stmt.getAsObject());
  }
  stmt.free();
  return lista;
}

// roda INSERT / UPDATE / DELETE
function rodarComando(sql, params) {
  if (params == undefined) params = [];
  db.run(sql, params);
  salvarDados();
}

// pega so o primeiro resultado de uma consulta
function rodarConsultaUm(sql, params) {
  var lista = rodarConsulta(sql, params);
  if (lista.length > 0) return lista[0];
  return null;
}

// pega o id do ultimo registro inserido
function pegarUltimoId() {
  var resultado = db.exec('SELECT last_insert_rowid()');
  return resultado[0].values[0][0];
}

// ==================== SERIES ====================

function pegarTodasSeries() {
  return rodarConsulta('SELECT * FROM series ORDER BY nome');
}

function criarSerie(nome) {
  rodarComando('INSERT INTO series (nome) VALUES (?)', [nome]);
  return pegarUltimoId();
}

function editarSerie(id, nomeNovo) {
  rodarComando('UPDATE series SET nome = ? WHERE id = ?', [nomeNovo, id]);
}

function deletarSerie(id) {
  rodarComando('DELETE FROM series WHERE id = ?', [id]);
}

// ==================== TURMAS ====================

function pegarTodasTurmas() {
  var sql = 'SELECT t.*, s.nome as serie_nome FROM turmas t LEFT JOIN series s ON s.id = t.serie_id ORDER BY t.nome';
  return rodarConsulta(sql);
}

function criarTurma(nome, idSerie, anoLetivo) {
  rodarComando('INSERT INTO turmas (nome, serie_id, ano_letivo) VALUES (?, ?, ?)', [nome, idSerie, anoLetivo]);
  return pegarUltimoId();
}

function editarTurma(id, nome, idSerie, anoLetivo) {
  rodarComando('UPDATE turmas SET nome = ?, serie_id = ?, ano_letivo = ? WHERE id = ?', [nome, idSerie, anoLetivo, id]);
}

function deletarTurma(id) {
  rodarComando('DELETE FROM turmas WHERE id = ?', [id]);
}

// ==================== ALUNOS ====================

function pegarTodosAlunos(textoBusca) {
  if (textoBusca != undefined && textoBusca != '') {
    return rodarConsulta('SELECT * FROM alunos WHERE nome LIKE ? ORDER BY nome', ['%' + textoBusca + '%']);
  }
  return rodarConsulta('SELECT * FROM alunos ORDER BY nome');
}

function pegarAlunoPorId(id) {
  return rodarConsultaUm('SELECT * FROM alunos WHERE id = ?', [id]);
}

function criarAluno(dados) {
  rodarComando(
    'INSERT INTO alunos (nome, matricula, data_nascimento, nome_pai, nome_mae, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [dados.nome, dados.matricula || null, dados.dataNascimento || null, dados.nomePai || null, dados.nomeMae || null, dados.telefone || null, dados.email || null]
  );
  return pegarUltimoId();
}

function editarAluno(id, dados) {
  rodarComando(
    'UPDATE alunos SET nome = ?, matricula = ?, data_nascimento = ?, nome_pai = ?, nome_mae = ?, telefone = ?, email = ? WHERE id = ?',
    [dados.nome, dados.matricula || null, dados.dataNascimento || null, dados.nomePai || null, dados.nomeMae || null, dados.telefone || null, dados.email || null, id]
  );
}

function deletarAluno(id) {
  rodarComando('DELETE FROM alunos WHERE id = ?', [id]);
}

// ==================== PROFESSORES ====================

function pegarTodosProfessores() {
  return rodarConsulta('SELECT * FROM professores ORDER BY nome');
}

function criarProfessor(dados) {
  rodarComando(
    'INSERT INTO professores (nome, especialidade, email, telefone) VALUES (?, ?, ?, ?)',
    [dados.nome, dados.especialidade || null, dados.email || null, dados.telefone || null]
  );
  return pegarUltimoId();
}

function editarProfessor(id, dados) {
  rodarComando(
    'UPDATE professores SET nome = ?, especialidade = ?, email = ?, telefone = ? WHERE id = ?',
    [dados.nome, dados.especialidade || null, dados.email || null, dados.telefone || null, id]
  );
}

function deletarProfessor(id) {
  rodarComando('DELETE FROM professores WHERE id = ?', [id]);
}

// ==================== MATERIAS ====================

function pegarTodasMaterias() {
  return rodarConsulta('SELECT * FROM materias ORDER BY nome');
}

function criarMateria(nome) {
  rodarComando('INSERT INTO materias (nome) VALUES (?)', [nome]);
  return pegarUltimoId();
}

function editarMateria(id, nomeNovo) {
  rodarComando('UPDATE materias SET nome = ? WHERE id = ?', [nomeNovo, id]);
}

function deletarMateria(id) {
  rodarComando('DELETE FROM materias WHERE id = ?', [id]);
}

// ==================== VINCULOS ====================

function pegarAlunosDaTurma(idTurma) {
  var sql = 'SELECT a.* FROM alunos a JOIN aluno_turma at ON at.aluno_id = a.id WHERE at.turma_id = ? ORDER BY a.nome';
  return rodarConsulta(sql, [idTurma]);
}

function matricularAluno(idAluno, idTurma) {
  rodarComando('INSERT OR IGNORE INTO aluno_turma (aluno_id, turma_id) VALUES (?, ?)', [idAluno, idTurma]);
}

function desmatricularAluno(idAluno, idTurma) {
  rodarComando('DELETE FROM aluno_turma WHERE aluno_id = ? AND turma_id = ?', [idAluno, idTurma]);
}

function pegarProfessoresDaTurma(idTurma) {
  var sql = 'SELECT ptm.id, p.nome as prof_nome, m.nome as mat_nome FROM prof_turma_materia ptm JOIN professores p ON p.id = ptm.professor_id JOIN materias m ON m.id = ptm.materia_id WHERE ptm.turma_id = ?';
  return rodarConsulta(sql, [idTurma]);
}

function vincularProfessor(idProf, idTurma, idMateria) {
  rodarComando('INSERT INTO prof_turma_materia (professor_id, turma_id, materia_id) VALUES (?, ?, ?)', [idProf, idTurma, idMateria]);
}

function desvincularProfessor(id) {
  rodarComando('DELETE FROM prof_turma_materia WHERE id = ?', [id]);
}

// ==================== AVALIACOES ====================

function pegarAvaliacoes(idTurma, idMateria) {
  var sql = 'SELECT a.*, t.nome as turma_nome, s.nome as serie_nome, m.nome as materia_nome FROM avaliacoes a JOIN turmas t ON t.id = a.turma_id JOIN series s ON s.id = t.serie_id JOIN materias m ON m.id = a.materia_id WHERE 1=1';
  var params = [];
  if (idTurma) {
    sql = sql + ' AND a.turma_id = ?';
    params.push(idTurma);
  }
  if (idMateria) {
    sql = sql + ' AND a.materia_id = ?';
    params.push(idMateria);
  }
  sql = sql + ' ORDER BY a.data_aplicacao DESC';
  return rodarConsulta(sql, params);
}

function criarAvaliacao(dados) {
  rodarComando(
    'INSERT INTO avaliacoes (turma_id, materia_id, tipo, descricao, data_aplicacao, peso, bimestre) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [dados.turmaId, dados.materiaId, dados.tipo, dados.descricao || null, dados.dataAplicacao || null, dados.peso, dados.bimestre]
  );
}

function deletarAvaliacao(id) {
  rodarComando('DELETE FROM avaliacoes WHERE id = ?', [id]);
}

// ==================== NOTAS ====================

function pegarNotasDaAvaliacao(idAvaliacao) {
  var sql = 'SELECT n.*, a.nome as aluno_nome FROM notas n JOIN alunos a ON a.id = n.aluno_id WHERE n.avaliacao_id = ?';
  return rodarConsulta(sql, [idAvaliacao]);
}

function salvarNota(idAvaliacao, idAluno, valor) {
  rodarComando('INSERT OR REPLACE INTO notas (avaliacao_id, aluno_id, valor) VALUES (?, ?, ?)', [idAvaliacao, idAluno, valor]);
}

// ==================== CHAMADA ====================

function pegarChamada(idTurma, idMateria, dataAula) {
  return rodarConsulta('SELECT * FROM presencas WHERE turma_id = ? AND materia_id = ? AND data = ?', [idTurma, idMateria, dataAula]);
}

function salvarPresenca(idTurma, idMateria, idAluno, dataAula, presente) {
  var valorPresente = 0;
  if (presente == true) valorPresente = 1;
  rodarComando('INSERT OR REPLACE INTO presencas (turma_id, materia_id, aluno_id, data, presente) VALUES (?, ?, ?, ?, ?)', [idTurma, idMateria, idAluno, dataAula, valorPresente]);
}

// ==================== DASHBOARD ====================

function pegarResumo() {
  var totalAlunos      = rodarConsultaUm('SELECT COUNT(*) as total FROM alunos').total;
  var totalProfessores = rodarConsultaUm('SELECT COUNT(*) as total FROM professores').total;
  var totalTurmas      = rodarConsultaUm('SELECT COUNT(*) as total FROM turmas').total;
  var totalMaterias    = rodarConsultaUm('SELECT COUNT(*) as total FROM materias').total;
  var totalAvaliacoes  = rodarConsultaUm('SELECT COUNT(*) as total FROM avaliacoes').total;

  return {
    totalAlunos: totalAlunos,
    totalProfessores: totalProfessores,
    totalTurmas: totalTurmas,
    totalMaterias: totalMaterias,
    totalAvaliacoes: totalAvaliacoes
  };
}

// ==================== BOLETIM ====================

function pegarBoletim(idAluno, idTurma) {
  // busca as materias que tem professor nessa turma
  var materiasDaTurma = rodarConsulta(
    'SELECT DISTINCT m.id, m.nome FROM materias m JOIN prof_turma_materia ptm ON ptm.materia_id = m.id WHERE ptm.turma_id = ? ORDER BY m.nome',
    [idTurma]
  );

  var boletimCompleto = [];

  for (var i = 0; i < materiasDaTurma.length; i++) {
    var materia = materiasDaTurma[i];
    var bimestres = [];

    // calcula media de cada bimestre
    for (var bim = 1; bim <= 4; bim++) {
      var notasDoBim = rodarConsulta(
        'SELECT n.valor, a.descricao, a.tipo, a.peso FROM notas n JOIN avaliacoes a ON a.id = n.avaliacao_id WHERE n.aluno_id = ? AND a.turma_id = ? AND a.materia_id = ? AND a.bimestre = ?',
        [idAluno, idTurma, materia.id, bim]
      );

      var mediaBim = null;
      if (notasDoBim.length > 0) {
        var somaPesos = 0;
        var somaNotasPeso = 0;
        for (var k = 0; k < notasDoBim.length; k++) {
          somaPesos = somaPesos + notasDoBim[k].peso;
          somaNotasPeso = somaNotasPeso + (notasDoBim[k].valor * notasDoBim[k].peso);
        }
        if (somaPesos > 0) {
          mediaBim = somaNotasPeso / somaPesos;
        }
      }

      var notasFormatadas = [];
      for (var n = 0; n < notasDoBim.length; n++) {
        notasFormatadas.push({
          desc: notasDoBim[n].descricao || notasDoBim[n].tipo,
          valor: notasDoBim[n].valor
        });
      }

      bimestres.push({ numero: bim, media: mediaBim, notas: notasFormatadas });
    }

    // calcula media anual
    var todasAsNotas = rodarConsulta(
      'SELECT n.valor, a.peso FROM notas n JOIN avaliacoes a ON a.id = n.avaliacao_id WHERE n.aluno_id = ? AND a.turma_id = ? AND a.materia_id = ?',
      [idAluno, idTurma, materia.id]
    );

    var mediaAnual = null;
    if (todasAsNotas.length > 0) {
      var spTotal = 0;
      var snpTotal = 0;
      for (var t = 0; t < todasAsNotas.length; t++) {
        spTotal = spTotal + todasAsNotas[t].peso;
        snpTotal = snpTotal + (todasAsNotas[t].valor * todasAsNotas[t].peso);
      }
      if (spTotal > 0) mediaAnual = snpTotal / spTotal;
    }

    // calcula frequencia
    var totalAulas   = rodarConsultaUm('SELECT COUNT(*) as total FROM presencas WHERE turma_id = ? AND materia_id = ? AND aluno_id = ?', [idTurma, materia.id, idAluno]).total;
    var aulasPresente = rodarConsultaUm('SELECT COUNT(*) as total FROM presencas WHERE turma_id = ? AND materia_id = ? AND aluno_id = ? AND presente = 1', [idTurma, materia.id, idAluno]).total;

    var frequencia = 100;
    if (totalAulas > 0) {
      frequencia = Math.round((aulasPresente / totalAulas) * 100);
    }

    var situacao = '—';
    if (mediaAnual != null) {
      if (mediaAnual >= 5) {
        situacao = 'APROVADO';
      } else {
        situacao = 'REPROVADO';
      }
    }

    boletimCompleto.push({
      materiaId: materia.id,
      materiaNome: materia.nome,
      bimestres: bimestres,
      mediaAnual: mediaAnual,
      frequencia: frequencia,
      situacao: situacao
    });
  }

  return boletimCompleto;
}
