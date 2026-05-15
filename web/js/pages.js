// =====================================================
// paginas do sistema academico
// cada funcao monta o html de uma pagina
// =====================================================

var Paginas = {};

// cores dos avatares (cicla pelo id do usuario)
var coresAvatar = ['c1','c2','c3','c4','c5','c6','c7','c8'];

// pega as iniciais do nome (ex: "João Silva" -> "JS")
function pegarIniciais(nome) {
  if (nome == undefined || nome == '') return '?';
  var partes = nome.trim().split(' ');
  var primeira = partes[0][0] || '';
  var ultima = '';
  if (partes.length > 1) {
    ultima = partes[partes.length - 1][0] || '';
  }
  return (primeira + ultima).toUpperCase();
}

// protege o html contra caracteres especiais
function escaparHtml(texto) {
  if (texto == undefined || texto == null) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// mostra o modal na tela
function abrirModal(htmlDoModal) {
  document.getElementById('modal-root').innerHTML = htmlDoModal;
  var overlay = document.getElementById('modal-root').querySelector('.modal-overlay');
  if (overlay != null) {
    overlay.addEventListener('click', function(e) {
      if (e.target == overlay) fecharModal();
    });
  }
}

// fecha o modal
function fecharModal() {
  document.getElementById('modal-root').innerHTML = '';
}

// mostra uma mensagem rapida na tela
function mostrarMensagem(texto, tipo) {
  var root = document.getElementById('toast-root');
  var msg = document.createElement('div');
  if (tipo == undefined) tipo = 'ok';
  msg.className = 'toast ' + tipo;
  msg.textContent = texto;
  root.appendChild(msg);
  // remove depois de 3 segundos
  setTimeout(function() {
    if (msg.parentNode != null) {
      msg.parentNode.removeChild(msg);
    }
  }, 3000);
}

// monta html do estado vazio (quando nao tem dados)
function htmlVazio(titulo, subtitulo) {
  return '<div class="empty"><div class="t">' + escaparHtml(titulo) + '</div><div class="s">' + escaparHtml(subtitulo) + '</div></div>';
}

// define cor da nota (verde, amarelo ou vermelho)
function corDaNota(nota) {
  if (nota == null) return 'var(--ink-3)';
  if (nota >= 7) return 'var(--ok)';
  if (nota >= 5) return 'var(--warn)';
  return 'var(--bad)';
}

// formata nota com uma casa decimal
function formatarNota(nota) {
  if (nota == null) return '—';
  return Number(nota).toFixed(1);
}

// ========================================================
// DASHBOARD
// ========================================================
Paginas.dashboard = function(div) {
  var dados = pegarResumo();

  // monta os cards de totais
  var htmlCards = '';
  htmlCards += '<div class="card kpi"><div class="label">Alunos</div><div class="value">' + dados.totalAlunos + '</div><div class="delta">' + icon('users', 11) + ' cadastrados no sistema</div></div>';
  htmlCards += '<div class="card kpi"><div class="label">Professores</div><div class="value">' + dados.totalProfessores + '</div><div class="delta">' + icon('school', 11) + ' cadastrados no sistema</div></div>';
  htmlCards += '<div class="card kpi"><div class="label">Turmas</div><div class="value">' + dados.totalTurmas + '</div><div class="delta">' + icon('turmas', 11) + ' cadastradas no sistema</div></div>';
  htmlCards += '<div class="card kpi"><div class="label">Matérias</div><div class="value">' + dados.totalMaterias + '</div><div class="delta">' + icon('materias', 11) + ' cadastradas no sistema</div></div>';
  htmlCards += '<div class="card kpi"><div class="label">Avaliações</div><div class="value">' + dados.totalAvaliacoes + '</div><div class="delta">' + icon('avaliacoes', 11) + ' criadas</div></div>';

  var html = '';
  html += '<div class="page-header">';
  html += '  <div>';
  html += '    <div class="page-eyebrow">Sistema Acadêmico</div>';
  html += '    <h1 class="page-title">Dashboard</h1>';
  html += '    <div class="page-subtitle">Visão geral da instituição de ensino</div>';
  html += '  </div>';
  html += '</div>';
  html += '<div class="grid g-5 mb-4">' + htmlCards + '</div>';
  html += '<div class="card">';
  html += '  <div class="card-header"><div class="card-title">Como começar</div></div>';
  html += '  <ol>';
  html += '    <li>Cadastre as <strong>Séries</strong> (ex: 1º Ano, 2º Ano)</li>';
  html += '    <li>Crie as <strong>Turmas</strong> vinculadas às séries</li>';
  html += '    <li>Cadastre as <strong>Matérias</strong> do currículo</li>';
  html += '    <li>Cadastre <strong>Alunos</strong> e <strong>Professores</strong></li>';
  html += '    <li>Use <strong>Vínculos</strong> para matricular alunos e atribuir professores</li>';
  html += '    <li>Crie <strong>Avaliações</strong> e lance as <strong>Notas</strong></li>';
  html += '    <li>Registre a <strong>Chamada</strong> diária e consulte o <strong>Boletim</strong></li>';
  html += '  </ol>';
  html += '</div>';

  div.innerHTML = html;
};

// ========================================================
// ALUNOS
// ========================================================
Paginas.alunos = function(div) {
  var textoBusca = '';

  function mostrarLista() {
    var listaAlunos = pegarTodosAlunos(textoBusca);

    // monta as linhas da tabela
    var linhasTabela = '';
    for (var i = 0; i < listaAlunos.length; i++) {
      var aluno = listaAlunos[i];
      var corIdx = aluno.id % 8;
      var cor = coresAvatar[corIdx];
      var iniciais = pegarIniciais(aluno.nome);

      linhasTabela += '<tr>';
      linhasTabela += '<td><span class="row"><span class="avatar sm ' + cor + '">' + escaparHtml(iniciais) + '</span>';
      linhasTabela += '<span class="strong">' + escaparHtml(aluno.nome) + '</span></span></td>';
      linhasTabela += '<td class="num">' + escaparHtml(aluno.matricula || '—') + '</td>';
      linhasTabela += '<td>' + escaparHtml(aluno.email || '—') + '</td>';
      linhasTabela += '<td>' + escaparHtml(aluno.telefone || '—') + '</td>';
      linhasTabela += '<td><span class="row">';
      linhasTabela += '<button class="icon-btn" id="editar-' + aluno.id + '" title="Editar">' + icon('edit') + '</button>';
      linhasTabela += '<button class="icon-btn" id="deletar-' + aluno.id + '" style="color:var(--bad)" title="Excluir">' + icon('trash') + '</button>';
      linhasTabela += '</span></td>';
      linhasTabela += '</tr>';
    }

    // decide se mostra tabela ou mensagem vazia
    var conteudoTabela = '';
    if (listaAlunos.length == 0) {
      conteudoTabela = htmlVazio('Nenhum aluno cadastrado', 'CLIQUE EM "NOVO ALUNO" PARA COMEÇAR');
    } else {
      conteudoTabela = '<table class="table">';
      conteudoTabela += '<thead><tr><th>Aluno</th><th>Matrícula</th><th>E-mail</th><th>Telefone</th><th style="width:80px"></th></tr></thead>';
      conteudoTabela += '<tbody>' + linhasTabela + '</tbody>';
      conteudoTabela += '</table>';
    }

    var quantTexto = listaAlunos.length + ' aluno';
    if (listaAlunos.length != 1) quantTexto += 's';
    quantTexto += ' cadastrado';
    if (listaAlunos.length != 1) quantTexto += 's';

    var html = '';
    html += '<div class="page-header">';
    html += '  <div>';
    html += '    <div class="page-eyebrow">Pessoas · Alunos</div>';
    html += '    <h1 class="page-title">Alunos</h1>';
    html += '    <div class="page-subtitle">' + quantTexto + '</div>';
    html += '  </div>';
    html += '  <button class="btn accent" id="btn-novo-aluno">' + icon('plus') + ' Novo aluno</button>';
    html += '</div>';
    html += '<div class="filter-row">';
    html += '  <div class="search-wrap">' + icon('search');
    html += '    <input class="input" id="campo-busca" placeholder="Buscar por nome…" value="' + escaparHtml(textoBusca) + '">';
    html += '  </div>';
    html += '</div>';
    html += '<div class="card overflow-hidden" style="padding:0">' + conteudoTabela + '</div>';

    div.innerHTML = html;

    // botao novo aluno
    document.getElementById('btn-novo-aluno').onclick = function() {
      abrirFormAluno(null);
    };

    // campo de busca
    document.getElementById('campo-busca').oninput = function() {
      textoBusca = this.value;
      mostrarLista();
    };

    // botoes de editar e deletar de cada aluno
    for (var j = 0; j < listaAlunos.length; j++) {
      var idDoAluno = listaAlunos[j].id;

      // precisa usar uma funcao para fechar o escopo corretamente
      (function(idAluno) {
        document.getElementById('editar-' + idAluno).onclick = function() {
          abrirFormAluno(pegarAlunoPorId(idAluno));
        };
        document.getElementById('deletar-' + idAluno).onclick = function() {
          if (confirm('Excluir este aluno?')) {
            deletarAluno(idAluno);
            mostrarLista();
          }
        };
      })(idDoAluno);
    }
  }

  function abrirFormAluno(alunoParaEditar) {
    var editando = alunoParaEditar != null;
    var dados = alunoParaEditar || {};

    var tituloModal = editando ? 'Editar aluno' : 'Novo aluno';
    var subtituloModal = editando ? escaparHtml(alunoParaEditar.nome) : 'Cadastrar aluno';
    var textoBotao = editando ? 'Salvar alterações' : 'Criar aluno';

    var htmlModal = '';
    htmlModal += '<div class="modal-overlay">';
    htmlModal += '<form class="modal" id="form-aluno">';
    htmlModal += '<div class="modal-header">';
    htmlModal += '  <div><div class="card-eyebrow">' + tituloModal + '</div>';
    htmlModal += '  <div class="modal-title">' + subtituloModal + '</div></div>';
    htmlModal += '  <button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button>';
    htmlModal += '</div>';
    htmlModal += '<div class="modal-body">';
    htmlModal += '  <div class="field"><label>Nome completo *</label>';
    htmlModal += '    <input class="input" name="nome" required placeholder="Nome do aluno" value="' + escaparHtml(dados.nome || '') + '"></div>';
    htmlModal += '  <div class="form-grid">';
    htmlModal += '    <div class="field"><label>Matrícula</label><input class="input" name="matricula" placeholder="Ex: 2024001" value="' + escaparHtml(dados.matricula || '') + '"></div>';
    htmlModal += '    <div class="field"><label>Data de nascimento</label><input class="input" type="date" name="dataNascimento" value="' + escaparHtml(dados.data_nascimento || '') + '"></div>';
    htmlModal += '    <div class="field"><label>Nome do pai</label><input class="input" name="nomePai" value="' + escaparHtml(dados.nome_pai || '') + '"></div>';
    htmlModal += '    <div class="field"><label>Nome da mãe</label><input class="input" name="nomeMae" value="' + escaparHtml(dados.nome_mae || '') + '"></div>';
    htmlModal += '    <div class="field"><label>Telefone</label><input class="input" name="telefone" value="' + escaparHtml(dados.telefone || '') + '"></div>';
    htmlModal += '    <div class="field"><label>E-mail</label><input class="input" type="email" name="email" value="' + escaparHtml(dados.email || '') + '"></div>';
    htmlModal += '  </div>';
    htmlModal += '  <div class="erro" id="msg-erro"></div>';
    htmlModal += '</div>';
    htmlModal += '<div class="modal-footer">';
    htmlModal += '  <button type="button" class="btn" id="btn-cancelar">Cancelar</button>';
    htmlModal += '  <button type="submit" class="btn accent">' + textoBotao + '</button>';
    htmlModal += '</div>';
    htmlModal += '</form>';
    htmlModal += '</div>';

    abrirModal(htmlModal);

    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-aluno').onsubmit = function(e) {
      e.preventDefault();
      var camposForm = new FormData(e.target);
      var dadosAluno = {
        nome: camposForm.get('nome'),
        matricula: camposForm.get('matricula'),
        dataNascimento: camposForm.get('dataNascimento'),
        nomePai: camposForm.get('nomePai'),
        nomeMae: camposForm.get('nomeMae'),
        telefone: camposForm.get('telefone'),
        email: camposForm.get('email')
      };

      if (dadosAluno.nome.trim() == '') {
        document.getElementById('msg-erro').textContent = 'Informe o nome do aluno.';
        return;
      }

      if (editando) {
        editarAluno(alunoParaEditar.id, dadosAluno);
        mostrarMensagem('Aluno atualizado!');
      } else {
        criarAluno(dadosAluno);
        mostrarMensagem('Aluno criado!');
      }

      fecharModal();
      mostrarLista();
    };
  }

  mostrarLista();
};

// ========================================================
// PROFESSORES
// ========================================================
Paginas.professores = function(div) {

  function mostrarLista() {
    var listaProfessores = pegarTodosProfessores();

    var linhas = '';
    for (var i = 0; i < listaProfessores.length; i++) {
      var prof = listaProfessores[i];
      var cor = coresAvatar[prof.id % 8];

      linhas += '<tr>';
      linhas += '<td><span class="row"><span class="avatar sm ' + cor + '">' + escaparHtml(pegarIniciais(prof.nome)) + '</span>';
      linhas += '<span class="strong">' + escaparHtml(prof.nome) + '</span></span></td>';
      linhas += '<td>' + escaparHtml(prof.especialidade || '—') + '</td>';
      linhas += '<td>' + escaparHtml(prof.email || '—') + '</td>';
      linhas += '<td>' + escaparHtml(prof.telefone || '—') + '</td>';
      linhas += '<td><span class="row">';
      linhas += '<button class="icon-btn" id="editar-' + prof.id + '">' + icon('edit') + '</button>';
      linhas += '<button class="icon-btn" id="deletar-' + prof.id + '" style="color:var(--bad)">' + icon('trash') + '</button>';
      linhas += '</span></td></tr>';
    }

    var tabelaHtml = '';
    if (listaProfessores.length == 0) {
      tabelaHtml = htmlVazio('Nenhum professor cadastrado', 'CLIQUE EM "NOVO PROFESSOR" PARA COMEÇAR');
    } else {
      tabelaHtml = '<table class="table"><thead><tr><th>Professor</th><th>Especialidade</th><th>E-mail</th><th>Telefone</th><th style="width:80px"></th></tr></thead><tbody>' + linhas + '</tbody></table>';
    }

    var qtdTexto = listaProfessores.length + ' professor';
    if (listaProfessores.length != 1) qtdTexto += 'es';
    qtdTexto += ' no corpo docente';

    div.innerHTML = ''
      + '<div class="page-header">'
      + '<div><div class="page-eyebrow">Pessoas · Professores</div>'
      + '<h1 class="page-title">Professores</h1>'
      + '<div class="page-subtitle">' + qtdTexto + '</div></div>'
      + '<button class="btn accent" id="btn-novo-prof">' + icon('plus') + ' Novo professor</button>'
      + '</div>'
      + '<div class="card overflow-hidden" style="padding:0">' + tabelaHtml + '</div>';

    document.getElementById('btn-novo-prof').onclick = function() { abrirFormProf(null); };

    for (var j = 0; j < listaProfessores.length; j++) {
      (function(idProf) {
        document.getElementById('editar-' + idProf).onclick = function() {
          var todos = pegarTodosProfessores();
          var profEncontrado = null;
          for (var k = 0; k < todos.length; k++) {
            if (todos[k].id == idProf) { profEncontrado = todos[k]; break; }
          }
          abrirFormProf(profEncontrado);
        };
        document.getElementById('deletar-' + idProf).onclick = function() {
          if (confirm('Excluir este professor?')) {
            deletarProfessor(idProf);
            mostrarLista();
          }
        };
      })(listaProfessores[j].id);
    }
  }

  function abrirFormProf(profParaEditar) {
    var editando = profParaEditar != null;
    var dados = profParaEditar || {};

    var htmlModal = '<div class="modal-overlay"><form class="modal" id="form-prof">'
      + '<div class="modal-header"><div>'
      + '<div class="card-eyebrow">' + (editando ? 'Editar professor' : 'Novo professor') + '</div>'
      + '<div class="modal-title">' + (editando ? escaparHtml(profParaEditar.nome) : 'Cadastrar professor') + '</div>'
      + '</div><button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button></div>'
      + '<div class="modal-body">'
      + '<div class="field"><label>Nome completo *</label><input class="input" name="nome" required value="' + escaparHtml(dados.nome || '') + '" placeholder="Nome do professor"></div>'
      + '<div class="field"><label>Especialidade</label><input class="input" name="especialidade" value="' + escaparHtml(dados.especialidade || '') + '" placeholder="Ex: Matemática"></div>'
      + '<div class="form-grid">'
      + '<div class="field"><label>E-mail</label><input class="input" type="email" name="email" value="' + escaparHtml(dados.email || '') + '"></div>'
      + '<div class="field"><label>Telefone</label><input class="input" name="telefone" value="' + escaparHtml(dados.telefone || '') + '"></div>'
      + '</div>'
      + '<div class="erro" id="msg-erro"></div>'
      + '</div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn" id="btn-cancelar">Cancelar</button>'
      + '<button type="submit" class="btn accent">' + (editando ? 'Salvar alterações' : 'Criar professor') + '</button>'
      + '</div></form></div>';

    abrirModal(htmlModal);
    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-prof').onsubmit = function(e) {
      e.preventDefault();
      var campos = new FormData(e.target);
      var dadosProf = { nome: campos.get('nome'), especialidade: campos.get('especialidade'), email: campos.get('email'), telefone: campos.get('telefone') };
      if (dadosProf.nome.trim() == '') { document.getElementById('msg-erro').textContent = 'Informe o nome.'; return; }
      if (editando) { editarProfessor(profParaEditar.id, dadosProf); mostrarMensagem('Professor atualizado!'); }
      else { criarProfessor(dadosProf); mostrarMensagem('Professor criado!'); }
      fecharModal();
      mostrarLista();
    };
  }

  mostrarLista();
};

// ========================================================
// SERIES
// ========================================================
Paginas.series = function(div) {

  function mostrarLista() {
    var listaSeries = pegarTodasSeries();

    var linhas = '';
    for (var i = 0; i < listaSeries.length; i++) {
      var serie = listaSeries[i];
      linhas += '<tr>';
      linhas += '<td class="num" style="color:var(--ink-4)">' + serie.id + '</td>';
      linhas += '<td class="strong">' + escaparHtml(serie.nome) + '</td>';
      linhas += '<td><span class="row">';
      linhas += '<button class="icon-btn" id="editar-' + serie.id + '">' + icon('edit') + '</button>';
      linhas += '<button class="icon-btn" id="deletar-' + serie.id + '" style="color:var(--bad)">' + icon('trash') + '</button>';
      linhas += '</span></td></tr>';
    }

    var tabelaHtml = listaSeries.length == 0
      ? htmlVazio('Nenhuma série cadastrada', 'EX: 1º ANO, 2º ANO, 3º ANO')
      : '<table class="table"><thead><tr><th style="width:60px">#</th><th>Nome</th><th style="width:80px"></th></tr></thead><tbody>' + linhas + '</tbody></table>';

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Acadêmico · Séries</div>'
      + '<h1 class="page-title">Séries</h1>'
      + '<div class="page-subtitle">Níveis de ensino da instituição</div>'
      + '</div><button class="btn accent" id="btn-nova-serie">' + icon('plus') + ' Nova série</button></div>'
      + '<div class="card overflow-hidden" style="padding:0">' + tabelaHtml + '</div>';

    document.getElementById('btn-nova-serie').onclick = function() { abrirFormSerie(null, ''); };

    for (var j = 0; j < listaSeries.length; j++) {
      (function(idSerie, nomeSerie) {
        document.getElementById('editar-' + idSerie).onclick = function() { abrirFormSerie(idSerie, nomeSerie); };
        document.getElementById('deletar-' + idSerie).onclick = function() {
          if (confirm('Excluir esta série?')) { deletarSerie(idSerie); mostrarLista(); }
        };
      })(listaSeries[j].id, listaSeries[j].nome);
    }
  }

  function abrirFormSerie(idSerie, nomeAtual) {
    var editando = idSerie != null;

    var htmlModal = '<div class="modal-overlay"><form class="modal" id="form-serie" style="width:420px">'
      + '<div class="modal-header"><div>'
      + '<div class="card-eyebrow">' + (editando ? 'Editar série' : 'Nova série') + '</div>'
      + '<div class="modal-title">' + (editando ? escaparHtml(nomeAtual) : 'Cadastrar série') + '</div>'
      + '</div><button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button></div>'
      + '<div class="modal-body">'
      + '<div class="field"><label>Nome da série *</label>'
      + '<input class="input" name="nome" required placeholder="Ex: 1º Ano" value="' + escaparHtml(nomeAtual || '') + '"></div>'
      + '<div class="erro" id="msg-erro"></div>'
      + '</div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn" id="btn-cancelar">Cancelar</button>'
      + '<button type="submit" class="btn accent">' + (editando ? 'Salvar' : 'Criar série') + '</button>'
      + '</div></form></div>';

    abrirModal(htmlModal);
    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-serie').onsubmit = function(e) {
      e.preventDefault();
      var nomeNovo = new FormData(e.target).get('nome').trim();
      if (nomeNovo == '') { document.getElementById('msg-erro').textContent = 'Informe o nome.'; return; }
      if (editando) { editarSerie(idSerie, nomeNovo); mostrarMensagem('Série atualizada!'); }
      else { criarSerie(nomeNovo); mostrarMensagem('Série criada!'); }
      fecharModal();
      mostrarLista();
    };
  }

  mostrarLista();
};

// ========================================================
// TURMAS
// ========================================================
Paginas.turmas = function(div) {

  function mostrarLista() {
    var listaTurmas = pegarTodasTurmas();

    var linhas = '';
    for (var i = 0; i < listaTurmas.length; i++) {
      var turma = listaTurmas[i];
      var cor = coresAvatar[turma.id % 8];
      var letraInicial = turma.nome[0].toUpperCase();

      linhas += '<tr>';
      linhas += '<td><span class="row"><span class="avatar sm ' + cor + '">' + letraInicial + '</span>';
      linhas += '<span class="strong">' + escaparHtml(turma.nome) + '</span></span></td>';
      linhas += '<td>' + escaparHtml(turma.serie_nome || '—') + '</td>';
      linhas += '<td class="num">' + escaparHtml(turma.ano_letivo || '—') + '</td>';
      linhas += '<td><span class="row">';
      linhas += '<button class="icon-btn" id="editar-' + turma.id + '">' + icon('edit') + '</button>';
      linhas += '<button class="icon-btn" id="deletar-' + turma.id + '" style="color:var(--bad)">' + icon('trash') + '</button>';
      linhas += '</span></td></tr>';
    }

    var tabelaHtml = listaTurmas.length == 0
      ? htmlVazio('Nenhuma turma cadastrada', 'CRIE SÉRIES PRIMEIRO, DEPOIS AS TURMAS')
      : '<table class="table"><thead><tr><th>Turma</th><th>Série</th><th>Ano letivo</th><th style="width:80px"></th></tr></thead><tbody>' + linhas + '</tbody></table>';

    var qtdTexto = listaTurmas.length + ' turma';
    if (listaTurmas.length != 1) qtdTexto += 's';

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Acadêmico · Turmas</div>'
      + '<h1 class="page-title">Turmas</h1>'
      + '<div class="page-subtitle">' + qtdTexto + ' cadastrada' + (listaTurmas.length != 1 ? 's' : '') + '</div>'
      + '</div><button class="btn accent" id="btn-nova-turma">' + icon('plus') + ' Nova turma</button></div>'
      + '<div class="card overflow-hidden" style="padding:0">' + tabelaHtml + '</div>';

    document.getElementById('btn-nova-turma').onclick = function() { abrirFormTurma(null); };

    for (var j = 0; j < listaTurmas.length; j++) {
      (function(turmaDaVez) {
        document.getElementById('editar-' + turmaDaVez.id).onclick = function() { abrirFormTurma(turmaDaVez); };
        document.getElementById('deletar-' + turmaDaVez.id).onclick = function() {
          if (confirm('Excluir esta turma?')) { deletarTurma(turmaDaVez.id); mostrarLista(); }
        };
      })(listaTurmas[j]);
    }
  }

  function abrirFormTurma(turmaParaEditar) {
    var editando = turmaParaEditar != null;
    var dados = turmaParaEditar || {};
    var listaSeries = pegarTodasSeries();
    var anoAtual = new Date().getFullYear();

    // monta as opcoes do select de series
    var opcoesSeriesHtml = '<option value="">Selecionar…</option>';
    for (var i = 0; i < listaSeries.length; i++) {
      var selecionado = '';
      if (dados.serie_id == listaSeries[i].id) selecionado = ' selected';
      opcoesSeriesHtml += '<option value="' + listaSeries[i].id + '"' + selecionado + '>' + escaparHtml(listaSeries[i].nome) + '</option>';
    }

    var htmlModal = '<div class="modal-overlay"><form class="modal" id="form-turma">'
      + '<div class="modal-header"><div>'
      + '<div class="card-eyebrow">' + (editando ? 'Editar turma' : 'Nova turma') + '</div>'
      + '<div class="modal-title">' + (editando ? escaparHtml(dados.nome) : 'Cadastrar turma') + '</div>'
      + '</div><button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button></div>'
      + '<div class="modal-body">'
      + '<div class="field"><label>Nome da turma *</label><input class="input" name="nome" required value="' + escaparHtml(dados.nome || '') + '" placeholder="Ex: 3º A"></div>'
      + '<div class="form-grid">'
      + '<div class="field"><label>Série *</label><select class="select" name="serieId" required>' + opcoesSeriesHtml + '</select></div>'
      + '<div class="field"><label>Ano letivo *</label><input class="input" type="number" name="anoLetivo" required value="' + escaparHtml(dados.ano_letivo || anoAtual) + '"></div>'
      + '</div>'
      + '<div class="erro" id="msg-erro"></div>'
      + '</div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn" id="btn-cancelar">Cancelar</button>'
      + '<button type="submit" class="btn accent">' + (editando ? 'Salvar alterações' : 'Criar turma') + '</button>'
      + '</div></form></div>';

    abrirModal(htmlModal);
    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-turma').onsubmit = function(e) {
      e.preventDefault();
      var campos = new FormData(e.target);
      var nomeTurma = campos.get('nome').trim();
      var idSerie = campos.get('serieId');
      var anoLetivo = campos.get('anoLetivo');
      if (nomeTurma == '') { document.getElementById('msg-erro').textContent = 'Informe o nome.'; return; }
      if (idSerie == '') { document.getElementById('msg-erro').textContent = 'Selecione a série.'; return; }
      if (editando) { editarTurma(dados.id, nomeTurma, Number(idSerie), Number(anoLetivo)); mostrarMensagem('Turma atualizada!'); }
      else { criarTurma(nomeTurma, Number(idSerie), Number(anoLetivo)); mostrarMensagem('Turma criada!'); }
      fecharModal();
      mostrarLista();
    };
  }

  mostrarLista();
};

// ========================================================
// MATERIAS
// ========================================================
Paginas.materias = function(div) {

  function mostrarLista() {
    var listaMaterias = pegarTodasMaterias();

    var linhas = '';
    for (var i = 0; i < listaMaterias.length; i++) {
      var mat = listaMaterias[i];
      linhas += '<tr>';
      linhas += '<td class="num" style="color:var(--ink-4)">' + mat.id + '</td>';
      linhas += '<td class="strong">' + escaparHtml(mat.nome) + '</td>';
      linhas += '<td><span class="row">';
      linhas += '<button class="icon-btn" id="editar-' + mat.id + '">' + icon('edit') + '</button>';
      linhas += '<button class="icon-btn" id="deletar-' + mat.id + '" style="color:var(--bad)">' + icon('trash') + '</button>';
      linhas += '</span></td></tr>';
    }

    var tabelaHtml = listaMaterias.length == 0
      ? htmlVazio('Nenhuma matéria cadastrada', 'EX: MATEMÁTICA, PORTUGUÊS, CIÊNCIAS')
      : '<table class="table"><thead><tr><th style="width:60px">#</th><th>Nome</th><th style="width:80px"></th></tr></thead><tbody>' + linhas + '</tbody></table>';

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Acadêmico · Matérias</div>'
      + '<h1 class="page-title">Matérias</h1>'
      + '<div class="page-subtitle">Disciplinas do currículo escolar</div>'
      + '</div><button class="btn accent" id="btn-nova-materia">' + icon('plus') + ' Nova matéria</button></div>'
      + '<div class="card overflow-hidden" style="padding:0">' + tabelaHtml + '</div>';

    document.getElementById('btn-nova-materia').onclick = function() { abrirFormMateria(null, ''); };

    for (var j = 0; j < listaMaterias.length; j++) {
      (function(idMat, nomeMat) {
        document.getElementById('editar-' + idMat).onclick = function() { abrirFormMateria(idMat, nomeMat); };
        document.getElementById('deletar-' + idMat).onclick = function() {
          if (confirm('Excluir esta matéria?')) { deletarMateria(idMat); mostrarLista(); }
        };
      })(listaMaterias[j].id, listaMaterias[j].nome);
    }
  }

  function abrirFormMateria(idMateria, nomeAtual) {
    var editando = idMateria != null;

    var htmlModal = '<div class="modal-overlay"><form class="modal" id="form-materia" style="width:420px">'
      + '<div class="modal-header"><div>'
      + '<div class="card-eyebrow">' + (editando ? 'Editar matéria' : 'Nova matéria') + '</div>'
      + '<div class="modal-title">' + (editando ? escaparHtml(nomeAtual) : 'Cadastrar matéria') + '</div>'
      + '</div><button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button></div>'
      + '<div class="modal-body">'
      + '<div class="field"><label>Nome da matéria *</label>'
      + '<input class="input" name="nome" required placeholder="Ex: Matemática" value="' + escaparHtml(nomeAtual || '') + '"></div>'
      + '<div class="erro" id="msg-erro"></div>'
      + '</div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn" id="btn-cancelar">Cancelar</button>'
      + '<button type="submit" class="btn accent">' + (editando ? 'Salvar' : 'Criar matéria') + '</button>'
      + '</div></form></div>';

    abrirModal(htmlModal);
    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-materia').onsubmit = function(e) {
      e.preventDefault();
      var nomeNovo = new FormData(e.target).get('nome').trim();
      if (nomeNovo == '') { document.getElementById('msg-erro').textContent = 'Informe o nome.'; return; }
      if (editando) { editarMateria(idMateria, nomeNovo); mostrarMensagem('Matéria atualizada!'); }
      else { criarMateria(nomeNovo); mostrarMensagem('Matéria criada!'); }
      fecharModal();
      mostrarLista();
    };
  }

  mostrarLista();
};

// ========================================================
// VINCULOS
// ========================================================
Paginas.vinculos = function(div) {
  var turmaSelecionadaId = '';
  var abaAtiva = 'alunos'; // pode ser 'alunos' ou 'professores'

  function mostrarPagina() {
    var todasTurmas  = pegarTodasTurmas();
    var todosAlunos  = pegarTodosAlunos();
    var todosProfessores = pegarTodosProfessores();
    var todasMaterias = pegarTodasMaterias();

    // pega os vinculos da turma selecionada
    var alunosNaTurma = [];
    var professoresNaTurma = [];
    if (turmaSelecionadaId != '') {
      alunosNaTurma     = pegarAlunosDaTurma(Number(turmaSelecionadaId));
      professoresNaTurma = pegarProfessoresDaTurma(Number(turmaSelecionadaId));
    }

    // alunos que ainda nao estao na turma
    var alunosDisponiveis = [];
    for (var i = 0; i < todosAlunos.length; i++) {
      var jaEsta = false;
      for (var j = 0; j < alunosNaTurma.length; j++) {
        if (alunosNaTurma[j].id == todosAlunos[i].id) { jaEsta = true; break; }
      }
      if (jaEsta == false) alunosDisponiveis.push(todosAlunos[i]);
    }

    // monta select de turmas
    var opcoesTodasTurmas = '<option value="">Selecione uma turma…</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      var selTurma = turmaSelecionadaId == String(todasTurmas[t].id) ? ' selected' : '';
      opcoesTodasTurmas += '<option value="' + todasTurmas[t].id + '"' + selTurma + '>' + escaparHtml(todasTurmas[t].nome) + ' — ' + escaparHtml(todasTurmas[t].serie_nome) + ' (' + todasTurmas[t].ano_letivo + ')</option>';
    }

    // monta painel de alunos
    var htmlAlunosDisponiveis = '<option value="">Adicionar aluno…</option>';
    for (var a = 0; a < alunosDisponiveis.length; a++) {
      htmlAlunosDisponiveis += '<option value="' + alunosDisponiveis[a].id + '">' + escaparHtml(alunosDisponiveis[a].nome) + '</option>';
    }

    var tabelaAlunos = '';
    if (alunosNaTurma.length == 0) {
      tabelaAlunos = '<div style="padding:24px;color:var(--ink-3);font-size:13px;text-align:center">Nenhum aluno matriculado.</div>';
    } else {
      tabelaAlunos = '<table class="table"><thead><tr><th>Aluno</th><th>Matrícula</th><th style="width:100px"></th></tr></thead><tbody>';
      for (var al = 0; al < alunosNaTurma.length; al++) {
        tabelaAlunos += '<tr><td class="strong">' + escaparHtml(alunosNaTurma[al].nome) + '</td>';
        tabelaAlunos += '<td class="num">' + escaparHtml(alunosNaTurma[al].matricula || '—') + '</td>';
        tabelaAlunos += '<td><button class="btn sm" id="desmatricular-' + alunosNaTurma[al].id + '" style="color:var(--bad)">' + icon('x', 11) + ' Remover</button></td></tr>';
      }
      tabelaAlunos += '</tbody></table>';
    }

    var painelAlunos = '<div style="padding:14px;border-bottom:1px solid var(--line);display:flex;gap:8px">'
      + '<select class="select" id="sel-aluno-add" style="flex:1">' + htmlAlunosDisponiveis + '</select>'
      + '<button class="btn accent" id="btn-matricular">' + icon('plus') + ' Matricular</button>'
      + '</div>' + tabelaAlunos;

    // monta painel de professores
    var opcoesProfessores = '<option value="">Professor…</option>';
    for (var p = 0; p < todosProfessores.length; p++) {
      opcoesProfessores += '<option value="' + todosProfessores[p].id + '">' + escaparHtml(todosProfessores[p].nome) + '</option>';
    }
    var opcoesMaterias = '<option value="">Matéria…</option>';
    for (var m = 0; m < todasMaterias.length; m++) {
      opcoesMaterias += '<option value="' + todasMaterias[m].id + '">' + escaparHtml(todasMaterias[m].nome) + '</option>';
    }

    var tabelaProfessores = '';
    if (professoresNaTurma.length == 0) {
      tabelaProfessores = '<div style="padding:24px;color:var(--ink-3);font-size:13px;text-align:center">Nenhum professor vinculado.</div>';
    } else {
      tabelaProfessores = '<table class="table"><thead><tr><th>Professor</th><th>Matéria</th><th style="width:100px"></th></tr></thead><tbody>';
      for (var pr = 0; pr < professoresNaTurma.length; pr++) {
        tabelaProfessores += '<tr><td class="strong">' + escaparHtml(professoresNaTurma[pr].prof_nome) + '</td>';
        tabelaProfessores += '<td>' + escaparHtml(professoresNaTurma[pr].mat_nome) + '</td>';
        tabelaProfessores += '<td><button class="btn sm" id="desvincular-' + professoresNaTurma[pr].id + '" style="color:var(--bad)">' + icon('x', 11) + ' Remover</button></td></tr>';
      }
      tabelaProfessores += '</tbody></table>';
    }

    var painelProfessores = '<div style="padding:14px;border-bottom:1px solid var(--line);display:flex;gap:8px;flex-wrap:wrap">'
      + '<select class="select" id="sel-prof-add" style="flex:1;min-width:160px">' + opcoesProfessores + '</select>'
      + '<select class="select" id="sel-mat-add" style="flex:1;min-width:160px">' + opcoesMaterias + '</select>'
      + '<button class="btn accent" id="btn-vincular-prof">' + icon('plus') + ' Vincular</button>'
      + '</div>' + tabelaProfessores;

    var turmaInfo = null;
    for (var ti = 0; ti < todasTurmas.length; ti++) {
      if (String(todasTurmas[ti].id) == turmaSelecionadaId) { turmaInfo = todasTurmas[ti]; break; }
    }

    var htmlPrincipal = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Acadêmico · Vínculos</div>'
      + '<h1 class="page-title">Vínculos</h1>'
      + '<div class="page-subtitle">Matricule alunos e atribua professores às turmas</div>'
      + '</div></div>'
      + '<div class="card mb-4" style="padding:18px">'
      + '<div class="field" style="margin:0"><label>Turma</label>'
      + '<select class="select" id="sel-turma" style="max-width:400px">' + opcoesTodasTurmas + '</select>'
      + '</div></div>';

    if (turmaSelecionadaId == '') {
      htmlPrincipal += htmlVazio('Selecione uma turma acima', 'PARA GERENCIAR ALUNOS E PROFESSORES');
    } else {
      var classeAbaAlunos   = abaAtiva == 'alunos'      ? ' on' : '';
      var classeAbaProfessores = abaAtiva == 'professores' ? ' on' : '';

      htmlPrincipal += '<div class="card overflow-hidden" style="padding:0">'
        + '<div class="section-head"><div>'
        + '<div class="t">' + escaparHtml(turmaInfo ? turmaInfo.nome : '') + '</div>'
        + '<div class="s">' + escaparHtml(turmaInfo ? turmaInfo.serie_nome + ' · ' + turmaInfo.ano_letivo : '') + '</div>'
        + '</div></div>'
        + '<div class="drawer-tabs">'
        + '<button id="aba-alunos" class="' + classeAbaAlunos + '">Alunos matriculados (' + alunosNaTurma.length + ')</button>'
        + '<button id="aba-professores" class="' + classeAbaProfessores + '">Professores / Matérias (' + professoresNaTurma.length + ')</button>'
        + '</div>'
        + (abaAtiva == 'alunos' ? painelAlunos : painelProfessores)
        + '</div>';
    }

    div.innerHTML = htmlPrincipal;

    // evento do select de turma
    document.getElementById('sel-turma').onchange = function() {
      turmaSelecionadaId = this.value;
      mostrarPagina();
    };

    if (turmaSelecionadaId == '') return; // se nao tem turma selecionada nao precisa dos outros eventos

    // troca de aba
    document.getElementById('aba-alunos').onclick = function() { abaAtiva = 'alunos'; mostrarPagina(); };
    document.getElementById('aba-professores').onclick = function() { abaAtiva = 'professores'; mostrarPagina(); };

    if (abaAtiva == 'alunos') {
      // botao matricular
      document.getElementById('btn-matricular').onclick = function() {
        var idAlunoEscolhido = document.getElementById('sel-aluno-add').value;
        if (idAlunoEscolhido == '') return;
        matricularAluno(Number(idAlunoEscolhido), Number(turmaSelecionadaId));
        mostrarMensagem('Aluno matriculado!');
        mostrarPagina();
      };
      // botoes de desmatricular
      for (var da = 0; da < alunosNaTurma.length; da++) {
        (function(idAl) {
          var btnDesmatricular = document.getElementById('desmatricular-' + idAl);
          if (btnDesmatricular != null) {
            btnDesmatricular.onclick = function() {
              desmatricularAluno(idAl, Number(turmaSelecionadaId));
              mostrarPagina();
            };
          }
        })(alunosNaTurma[da].id);
      }
    } else {
      // botao vincular professor
      document.getElementById('btn-vincular-prof').onclick = function() {
        var idProfEscolhido = document.getElementById('sel-prof-add').value;
        var idMatEscolhida  = document.getElementById('sel-mat-add').value;
        if (idProfEscolhido == '' || idMatEscolhida == '') {
          mostrarMensagem('Selecione o professor e a matéria.', 'bad');
          return;
        }
        vincularProfessor(Number(idProfEscolhido), Number(turmaSelecionadaId), Number(idMatEscolhida));
        mostrarMensagem('Professor vinculado!');
        mostrarPagina();
      };
      // botoes de desvincular professor
      for (var dp = 0; dp < professoresNaTurma.length; dp++) {
        (function(idVinc) {
          var btnDesvincular = document.getElementById('desvincular-' + idVinc);
          if (btnDesvincular != null) {
            btnDesvincular.onclick = function() {
              desvincularProfessor(idVinc);
              mostrarPagina();
            };
          }
        })(professoresNaTurma[dp].id);
      }
    }
  }

  mostrarPagina();
};

// ========================================================
// AVALIACOES
// ========================================================
Paginas.avaliacoes = function(div) {
  var idTurmaFiltro = '';

  var tiposPillInfo = {
    PROVA:       { classe: 'info', texto: 'Prova' },
    TRABALHO:    { classe: 'ok',   texto: 'Trabalho' },
    SIMULADO:    { classe: 'warn', texto: 'Simulado' },
    RECUPERACAO: { classe: 'err',  texto: 'Recuperação' }
  };

  function mostrarLista() {
    var todasTurmas = pegarTodasTurmas();
    var listaAvaliacoes = pegarAvaliacoes(idTurmaFiltro || null, null);

    var linhas = '';
    for (var i = 0; i < listaAvaliacoes.length; i++) {
      var aval = listaAvaliacoes[i];
      var pillInfo = tiposPillInfo[aval.tipo] || { classe: '', texto: aval.tipo };

      linhas += '<tr>';
      linhas += '<td class="strong">' + escaparHtml(aval.descricao || aval.tipo) + '</td>';
      linhas += '<td><span class="pill ' + pillInfo.classe + '"><span class="dot"></span>' + pillInfo.texto + '</span></td>';
      linhas += '<td>' + escaparHtml(aval.turma_nome) + ' <span style="color:var(--ink-4);font-size:11px">(' + escaparHtml(aval.serie_nome) + ')</span></td>';
      linhas += '<td>' + escaparHtml(aval.materia_nome) + '</td>';
      linhas += '<td class="num">' + aval.bimestre + 'º</td>';
      linhas += '<td class="num">' + escaparHtml(aval.data_aplicacao || '—') + '</td>';
      linhas += '<td class="num">' + aval.peso + '</td>';
      linhas += '<td><button class="icon-btn" id="deletar-' + aval.id + '" style="color:var(--bad)">' + icon('trash') + '</button></td>';
      linhas += '</tr>';
    }

    var tabelaHtml = listaAvaliacoes.length == 0
      ? htmlVazio('Nenhuma avaliação encontrada', 'CRIE A PRIMEIRA AVALIAÇÃO ACIMA')
      : '<table class="table"><thead><tr><th>Descrição</th><th>Tipo</th><th>Turma</th><th>Matéria</th><th>Bim.</th><th>Data</th><th>Peso</th><th style="width:60px"></th></tr></thead><tbody>' + linhas + '</tbody></table>';

    var opcoesTurmasFiltro = '<option value="">Todas as turmas</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      var selFiltro = idTurmaFiltro == String(todasTurmas[t].id) ? ' selected' : '';
      opcoesTurmasFiltro += '<option value="' + todasTurmas[t].id + '"' + selFiltro + '>' + escaparHtml(todasTurmas[t].nome) + ' (' + escaparHtml(todasTurmas[t].serie_nome) + ')</option>';
    }

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Lançamentos · Avaliações</div>'
      + '<h1 class="page-title">Avaliações</h1>'
      + '<div class="page-subtitle">Provas, trabalhos e atividades avaliativas</div>'
      + '</div><button class="btn accent" id="btn-nova-aval">' + icon('plus') + ' Nova avaliação</button></div>'
      + '<div class="filter-row"><select class="select" id="sel-filtro-turma" style="width:auto;max-width:280px">' + opcoesTurmasFiltro + '</select></div>'
      + '<div class="card overflow-hidden" style="padding:0">' + tabelaHtml + '</div>';

    document.getElementById('btn-nova-aval').onclick = function() { abrirFormAvaliacao(); };
    document.getElementById('sel-filtro-turma').onchange = function() {
      idTurmaFiltro = this.value;
      mostrarLista();
    };

    for (var j = 0; j < listaAvaliacoes.length; j++) {
      (function(idAval) {
        var btnDel = document.getElementById('deletar-' + idAval);
        if (btnDel != null) {
          btnDel.onclick = function() {
            if (confirm('Excluir esta avaliação?')) { deletarAvaliacao(idAval); mostrarLista(); }
          };
        }
      })(listaAvaliacoes[j].id);
    }
  }

  function abrirFormAvaliacao() {
    var todasTurmas   = pegarTodasTurmas();
    var todasMaterias = pegarTodasMaterias();
    var hoje = new Date().toISOString().slice(0, 10);

    var opcoesTurmas = '<option value="">Selecionar…</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      opcoesTurmas += '<option value="' + todasTurmas[t].id + '">' + escaparHtml(todasTurmas[t].nome) + ' (' + escaparHtml(todasTurmas[t].serie_nome) + ')</option>';
    }
    var opcoesMaterias = '<option value="">Selecionar…</option>';
    for (var m = 0; m < todasMaterias.length; m++) {
      opcoesMaterias += '<option value="' + todasMaterias[m].id + '">' + escaparHtml(todasMaterias[m].nome) + '</option>';
    }

    var htmlModal = '<div class="modal-overlay"><form class="modal wide" id="form-avaliacao">'
      + '<div class="modal-header"><div>'
      + '<div class="card-eyebrow">Nova avaliação</div>'
      + '<div class="modal-title">Cadastrar avaliação</div>'
      + '</div><button type="button" class="icon-btn" id="btn-fechar-modal">' + icon('x') + '</button></div>'
      + '<div class="modal-body"><div class="form-grid">'
      + '<div class="field"><label>Turma *</label><select class="select" name="turmaId" required>' + opcoesTurmas + '</select></div>'
      + '<div class="field"><label>Matéria *</label><select class="select" name="materiaId" required>' + opcoesMaterias + '</select></div>'
      + '<div class="field"><label>Tipo *</label><select class="select" name="tipo">'
      + '<option value="PROVA">Prova</option><option value="TRABALHO">Trabalho</option>'
      + '<option value="SIMULADO">Simulado</option><option value="RECUPERACAO">Recuperação</option>'
      + '</select></div>'
      + '<div class="field"><label>Bimestre *</label><select class="select" name="bimestre">'
      + '<option value="1">1º Bimestre</option><option value="2">2º Bimestre</option>'
      + '<option value="3">3º Bimestre</option><option value="4">4º Bimestre</option>'
      + '</select></div>'
      + '<div class="field" style="grid-column:span 2"><label>Descrição</label><input class="input" name="descricao" placeholder="Ex: Prova de Álgebra"></div>'
      + '<div class="field"><label>Data *</label><input class="input" type="date" name="dataAplicacao" required value="' + hoje + '"></div>'
      + '<div class="field"><label>Peso *</label><input class="input" type="number" name="peso" min="0.1" max="10" step="0.1" required value="1"></div>'
      + '</div><div class="erro" id="msg-erro"></div></div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn" id="btn-cancelar">Cancelar</button>'
      + '<button type="submit" class="btn accent">Criar avaliação</button>'
      + '</div></form></div>';

    abrirModal(htmlModal);
    document.getElementById('btn-fechar-modal').onclick = fecharModal;
    document.getElementById('btn-cancelar').onclick = fecharModal;

    document.getElementById('form-avaliacao').onsubmit = function(e) {
      e.preventDefault();
      var campos = new FormData(e.target);
      var dadosAval = {
        turmaId: campos.get('turmaId'),
        materiaId: campos.get('materiaId'),
        tipo: campos.get('tipo'),
        descricao: campos.get('descricao'),
        dataAplicacao: campos.get('dataAplicacao'),
        peso: Number(campos.get('peso')),
        bimestre: Number(campos.get('bimestre'))
      };
      if (dadosAval.turmaId == '' || dadosAval.materiaId == '') {
        document.getElementById('msg-erro').textContent = 'Selecione turma e matéria.';
        return;
      }
      criarAvaliacao(dadosAval);
      fecharModal();
      mostrarLista();
      mostrarMensagem('Avaliação criada!');
    };
  }

  mostrarLista();
};

// ========================================================
// NOTAS
// ========================================================
Paginas.notas = function(div) {
  var turmaSelecionada  = '';
  var materiaSelecionada = '';
  var avaliacaoSelecionada = '';
  var listaAlunosDaTurma = [];
  var listaAvaliacoesDaMateria = [];
  var notasDigitadas = {}; // armazena as notas enquanto o usuario digita

  function mostrarPagina() {
    var todasTurmas  = pegarTodasTurmas();
    var todasMaterias = pegarTodasMaterias();

    var avaliacaoAtual = null;
    for (var i = 0; i < listaAvaliacoesDaMateria.length; i++) {
      if (String(listaAvaliacoesDaMateria[i].id) == avaliacaoSelecionada) {
        avaliacaoAtual = listaAvaliacoesDaMateria[i];
        break;
      }
    }

    // monta select de turmas
    var opcoesTurmas = '<option value="">Selecione…</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      var sel = String(todasTurmas[t].id) == turmaSelecionada ? ' selected' : '';
      opcoesTurmas += '<option value="' + todasTurmas[t].id + '"' + sel + '>' + escaparHtml(todasTurmas[t].nome) + ' (' + escaparHtml(todasTurmas[t].serie_nome) + ')</option>';
    }

    // monta select de materias
    var opcoesMaterias = '<option value="">Selecione…</option>';
    for (var m = 0; m < todasMaterias.length; m++) {
      var selM = String(todasMaterias[m].id) == materiaSelecionada ? ' selected' : '';
      opcoesMaterias += '<option value="' + todasMaterias[m].id + '"' + selM + '>' + escaparHtml(todasMaterias[m].nome) + '</option>';
    }

    // monta select de avaliacoes
    var opcoesAvaliacoes = '<option value="">Selecione…</option>';
    for (var a = 0; a < listaAvaliacoesDaMateria.length; a++) {
      var aval = listaAvaliacoesDaMateria[a];
      var selA = String(aval.id) == avaliacaoSelecionada ? ' selected' : '';
      opcoesAvaliacoes += '<option value="' + aval.id + '"' + selA + '>' + escaparHtml(aval.descricao || aval.tipo) + ' — ' + aval.bimestre + 'º Bim</option>';
    }

    // monta tabela de notas (se tiver avaliacao selecionada)
    var htmlTabelaNotas = '';
    if (avaliacaoSelecionada != '' && listaAlunosDaTurma.length > 0) {
      var linhasNotas = '';
      for (var al = 0; al < listaAlunosDaTurma.length; al++) {
        var aluno = listaAlunosDaTurma[al];
        var notaAtual = '';
        if (notasDigitadas[aluno.id] != undefined) {
          notaAtual = notasDigitadas[aluno.id];
        }
        linhasNotas += '<tr><td class="strong">' + escaparHtml(aluno.nome) + '</td>';
        linhasNotas += '<td style="text-align:center">';
        linhasNotas += '<input type="number" min="0" max="10" step="0.1" class="input" id="nota-' + aluno.id + '" style="width:90px;text-align:center" value="' + escaparHtml(String(notaAtual)) + '" placeholder="—">';
        linhasNotas += '</td></tr>';
      }

      var infoAval = avaliacaoAtual ? (escaparHtml(avaliacaoAtual.descricao || avaliacaoAtual.tipo) + ' — ' + avaliacaoAtual.bimestre + 'º Bimestre') : '';
      var infoPeso = avaliacaoAtual ? ('Peso: ' + avaliacaoAtual.peso + ' · ' + listaAlunosDaTurma.length + ' alunos') : '';

      htmlTabelaNotas = '<div class="card overflow-hidden mb-4" style="padding:0">'
        + '<div class="section-head"><div>'
        + '<div class="t">' + infoAval + '</div>'
        + '<div class="s">' + infoPeso + '</div>'
        + '</div>'
        + '<button class="btn accent" id="btn-salvar-notas">' + icon('check', 13) + ' Salvar notas</button>'
        + '</div>'
        + '<table class="table"><thead><tr><th>Aluno</th><th style="width:150px;text-align:center">Nota (0–10)</th></tr></thead><tbody>' + linhasNotas + '</tbody></table>'
        + '</div>';
    } else if (avaliacaoSelecionada != '' && listaAlunosDaTurma.length == 0) {
      htmlTabelaNotas = htmlVazio('Nenhum aluno matriculado nesta turma', 'ACESSE VÍNCULOS PARA MATRICULAR ALUNOS');
    } else {
      htmlTabelaNotas = htmlVazio('Selecione turma, matéria e avaliação', 'PARA LANÇAR AS NOTAS');
    }

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Lançamentos · Notas</div>'
      + '<h1 class="page-title">Lançamento de Notas</h1>'
      + '<div class="page-subtitle">Registre as notas por turma, matéria e avaliação</div>'
      + '</div></div>'
      + '<div class="card mb-4" style="padding:18px">'
      + '<div class="row" style="gap:12px;flex-wrap:wrap;align-items:flex-end">'
      + '<div class="field" style="margin:0;min-width:200px"><label>Turma</label><select class="select" id="sel-turma">' + opcoesTurmas + '</select></div>'
      + '<div class="field" style="margin:0;min-width:180px"><label>Matéria</label><select class="select" id="sel-materia"' + (turmaSelecionada == '' ? ' disabled' : '') + '>' + opcoesMaterias + '</select></div>'
      + '<div class="field" style="margin:0;min-width:220px"><label>Avaliação</label><select class="select" id="sel-avaliacao"' + (materiaSelecionada == '' ? ' disabled' : '') + '>' + opcoesAvaliacoes + '</select></div>'
      + '</div></div>'
      + htmlTabelaNotas;

    // evento turma
    document.getElementById('sel-turma').onchange = function() {
      turmaSelecionada = this.value;
      materiaSelecionada = '';
      avaliacaoSelecionada = '';
      listaAlunosDaTurma = [];
      listaAvaliacoesDaMateria = [];
      notasDigitadas = {};
      if (turmaSelecionada != '') {
        listaAlunosDaTurma = pegarAlunosDaTurma(Number(turmaSelecionada));
      }
      mostrarPagina();
    };

    // evento materia
    document.getElementById('sel-materia').onchange = function() {
      materiaSelecionada = this.value;
      avaliacaoSelecionada = '';
      listaAvaliacoesDaMateria = [];
      notasDigitadas = {};
      if (turmaSelecionada != '' && materiaSelecionada != '') {
        listaAvaliacoesDaMateria = pegarAvaliacoes(Number(turmaSelecionada), Number(materiaSelecionada));
      }
      mostrarPagina();
    };

    // evento avaliacao
    document.getElementById('sel-avaliacao').onchange = function() {
      avaliacaoSelecionada = this.value;
      notasDigitadas = {};
      if (avaliacaoSelecionada != '') {
        // carrega as notas ja salvas
        var notasSalvas = pegarNotasDaAvaliacao(Number(avaliacaoSelecionada));
        for (var ns = 0; ns < notasSalvas.length; ns++) {
          notasDigitadas[notasSalvas[ns].aluno_id] = notasSalvas[ns].valor;
        }
      }
      mostrarPagina();
    };

    // botao salvar notas
    if (avaliacaoSelecionada != '' && listaAlunosDaTurma.length > 0) {
      document.getElementById('btn-salvar-notas').onclick = function() {
        // salva o que esta digitado nos inputs
        for (var sa = 0; sa < listaAlunosDaTurma.length; sa++) {
          var inputNota = document.getElementById('nota-' + listaAlunosDaTurma[sa].id);
          if (inputNota != null && inputNota.value != '') {
            salvarNota(Number(avaliacaoSelecionada), listaAlunosDaTurma[sa].id, Number(inputNota.value));
          }
        }
        mostrarMensagem('Notas salvas!');
      };

      // guarda o valor digitado no input em tempo real
      for (var inp = 0; inp < listaAlunosDaTurma.length; inp++) {
        (function(idAluno) {
          var campoNota = document.getElementById('nota-' + idAluno);
          if (campoNota != null) {
            campoNota.oninput = function() {
              notasDigitadas[idAluno] = this.value;
            };
          }
        })(listaAlunosDaTurma[inp].id);
      }
    }
  }

  mostrarPagina();
};

// ========================================================
// CHAMADA
// ========================================================
Paginas.chamada = function(div) {
  var turmaSelecionada  = '';
  var materiaSelecionada = '';
  var dataDeHoje = new Date().toISOString().slice(0, 10);
  var listaAlunos = [];
  var statusPresenca = {}; // true = presente, false = ausente

  function mostrarPagina() {
    var todasTurmas   = pegarTodasTurmas();
    var todasMaterias = pegarTodasMaterias();

    var countPresentes = 0;
    for (var cp = 0; cp < listaAlunos.length; cp++) {
      if (statusPresenca[listaAlunos[cp].id] != false) countPresentes++;
    }

    // opcoes dos selects
    var opcoesTurmas = '<option value="">Selecione…</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      var sel = String(todasTurmas[t].id) == turmaSelecionada ? ' selected' : '';
      opcoesTurmas += '<option value="' + todasTurmas[t].id + '"' + sel + '>' + escaparHtml(todasTurmas[t].nome) + ' (' + escaparHtml(todasTurmas[t].serie_nome) + ')</option>';
    }
    var opcoesMaterias = '<option value="">Selecione…</option>';
    for (var m = 0; m < todasMaterias.length; m++) {
      var selM = String(todasMaterias[m].id) == materiaSelecionada ? ' selected' : '';
      opcoesMaterias += '<option value="' + todasMaterias[m].id + '"' + selM + '>' + escaparHtml(todasMaterias[m].nome) + '</option>';
    }

    // monta os cards de presenca
    var htmlCardsChamada = '';
    for (var i = 0; i < listaAlunos.length; i++) {
      var aluno = listaAlunos[i];
      var presente = statusPresenca[aluno.id] != false; // por padrao true
      var classeCard = presente ? 'presente' : 'ausente';
      var iconeCard  = presente ? icon('check', 16) : icon('x', 16);
      htmlCardsChamada += '<div class="chamada-card ' + classeCard + '" id="card-aluno-' + aluno.id + '">' + iconeCard + '<span>' + escaparHtml(aluno.nome) + '</span></div>';
    }

    // painel de chamada (so aparece se turma e materia estiverem selecionadas)
    var htmlPainelChamada = '';
    if (turmaSelecionada != '' && materiaSelecionada != '' && listaAlunos.length > 0) {
      htmlPainelChamada = '<div class="card overflow-hidden mb-4" style="padding:0">'
        + '<div class="section-head">'
        + '<div class="row" style="gap:12px">'
        + '<div class="t">Chamada — ' + escaparHtml(dataDeHoje) + '</div>'
        + '<span class="pill ok"><span class="dot"></span>' + countPresentes + '/' + listaAlunos.length + ' presentes</span>'
        + '</div>'
        + '<div class="row" style="gap:8px">'
        + '<button class="btn sm" id="btn-todos-presentes">' + icon('check', 11) + ' Todos presentes</button>'
        + '<button class="btn sm" id="btn-todos-ausentes" style="color:var(--bad)">' + icon('x', 11) + ' Todos ausentes</button>'
        + '<button class="btn accent" id="btn-salvar-chamada">' + icon('check', 13) + ' Salvar chamada</button>'
        + '</div>'
        + '</div>'
        + '<div class="chamada-grid">' + htmlCardsChamada + '</div>'
        + '</div>';
    } else if (turmaSelecionada != '' && materiaSelecionada != '' && listaAlunos.length == 0) {
      htmlPainelChamada = htmlVazio('Nenhum aluno matriculado nesta turma', 'ACESSE VÍNCULOS PARA MATRICULAR ALUNOS');
    } else {
      htmlPainelChamada = htmlVazio('Selecione turma e matéria', 'PARA REGISTRAR A CHAMADA');
    }

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Lançamentos · Chamada</div>'
      + '<h1 class="page-title">Chamada / Frequência</h1>'
      + '<div class="page-subtitle">Registre a presença dos alunos por aula</div>'
      + '</div></div>'
      + '<div class="card mb-4" style="padding:18px">'
      + '<div class="row" style="gap:12px;flex-wrap:wrap;align-items:flex-end">'
      + '<div class="field" style="margin:0;min-width:200px"><label>Turma</label><select class="select" id="sel-turma">' + opcoesTurmas + '</select></div>'
      + '<div class="field" style="margin:0;min-width:180px"><label>Matéria</label><select class="select" id="sel-materia"' + (turmaSelecionada == '' ? ' disabled' : '') + '>' + opcoesMaterias + '</select></div>'
      + '<div class="field" style="margin:0"><label>Data</label><input class="input" type="date" id="input-data" value="' + escaparHtml(dataDeHoje) + '" style="width:160px"></div>'
      + '</div></div>'
      + htmlPainelChamada;

    // eventos dos selects
    document.getElementById('sel-turma').onchange = function() {
      turmaSelecionada = this.value;
      materiaSelecionada = '';
      listaAlunos = [];
      statusPresenca = {};
      if (turmaSelecionada != '') {
        listaAlunos = pegarAlunosDaTurma(Number(turmaSelecionada));
        // começa todo mundo como presente
        for (var ini = 0; ini < listaAlunos.length; ini++) {
          statusPresenca[listaAlunos[ini].id] = true;
        }
      }
      mostrarPagina();
    };

    document.getElementById('sel-materia').onchange = function() {
      materiaSelecionada = this.value;
      if (turmaSelecionada != '' && materiaSelecionada != '') {
        carregarChamadaDodia();
      } else {
        mostrarPagina();
      }
    };

    document.getElementById('input-data').onchange = function() {
      dataDeHoje = this.value;
      if (turmaSelecionada != '' && materiaSelecionada != '') {
        carregarChamadaDodia();
      } else {
        mostrarPagina();
      }
    };

    // eventos dos cards e botoes (so se tiver chamada aberta)
    if (turmaSelecionada != '' && materiaSelecionada != '' && listaAlunos.length > 0) {
      // clique em cada card de aluno
      for (var ca = 0; ca < listaAlunos.length; ca++) {
        (function(idAluno) {
          var cardDoAluno = document.getElementById('card-aluno-' + idAluno);
          if (cardDoAluno != null) {
            cardDoAluno.onclick = function() {
              // inverte presenca
              if (statusPresenca[idAluno] == false) {
                statusPresenca[idAluno] = true;
              } else {
                statusPresenca[idAluno] = false;
              }
              mostrarPagina();
            };
          }
        })(listaAlunos[ca].id);
      }

      document.getElementById('btn-todos-presentes').onclick = function() {
        for (var tp = 0; tp < listaAlunos.length; tp++) {
          statusPresenca[listaAlunos[tp].id] = true;
        }
        mostrarPagina();
      };

      document.getElementById('btn-todos-ausentes').onclick = function() {
        for (var ta = 0; ta < listaAlunos.length; ta++) {
          statusPresenca[listaAlunos[ta].id] = false;
        }
        mostrarPagina();
      };

      document.getElementById('btn-salvar-chamada').onclick = function() {
        for (var sc = 0; sc < listaAlunos.length; sc++) {
          var estaPresente = statusPresenca[listaAlunos[sc].id] != false;
          salvarPresenca(Number(turmaSelecionada), Number(materiaSelecionada), listaAlunos[sc].id, dataDeHoje, estaPresente);
        }
        mostrarMensagem('Chamada salva!');
      };
    }
  }

  function carregarChamadaDodia() {
    // verifica se ja tem chamada salva para esse dia
    var chamadaSalva = pegarChamada(Number(turmaSelecionada), Number(materiaSelecionada), dataDeHoje);
    if (chamadaSalva.length > 0) {
      for (var cs = 0; cs < chamadaSalva.length; cs++) {
        statusPresenca[chamadaSalva[cs].aluno_id] = chamadaSalva[cs].presente == 1;
      }
    }
    mostrarPagina();
  }

  mostrarPagina();
};

// ========================================================
// BOLETIM
// ========================================================
Paginas.boletim = function(div) {
  var turmaSelecionada = '';
  var alunoSelecionado = '';
  var todasTurmas = pegarTodasTurmas();
  var alunosDaTurma = [];
  var dadosBoletim = [];

  function mostrarPagina() {
    var turmaInfo = null;
    for (var ti = 0; ti < todasTurmas.length; ti++) {
      if (String(todasTurmas[ti].id) == turmaSelecionada) { turmaInfo = todasTurmas[ti]; break; }
    }

    var alunoInfo = null;
    for (var ai = 0; ai < alunosDaTurma.length; ai++) {
      if (String(alunosDaTurma[ai].id) == alunoSelecionado) { alunoInfo = alunosDaTurma[ai]; break; }
    }

    // selects
    var opcoesTurmas = '<option value="">Selecione…</option>';
    for (var t = 0; t < todasTurmas.length; t++) {
      var sel = String(todasTurmas[t].id) == turmaSelecionada ? ' selected' : '';
      opcoesTurmas += '<option value="' + todasTurmas[t].id + '"' + sel + '>' + escaparHtml(todasTurmas[t].nome) + ' (' + escaparHtml(todasTurmas[t].serie_nome) + ')</option>';
    }
    var opcoesAlunos = '<option value="">Selecione…</option>';
    for (var a = 0; a < alunosDaTurma.length; a++) {
      var selA = String(alunosDaTurma[a].id) == alunoSelecionado ? ' selected' : '';
      opcoesAlunos += '<option value="' + alunosDaTurma[a].id + '"' + selA + '>' + escaparHtml(alunosDaTurma[a].nome) + '</option>';
    }

    // monta o boletim (se tiver dados)
    var htmlBoletim = '';
    if (alunoSelecionado != '' && dadosBoletim.length > 0) {
      var corAvatar = coresAvatar[Number(alunoSelecionado) % 8];
      var iniciaisAluno = alunoInfo ? pegarIniciais(alunoInfo.nome) : '?';
      var nomeAluno = alunoInfo ? alunoInfo.nome : '';
      var infoTurma = turmaInfo ? (turmaInfo.nome + ' — ' + turmaInfo.serie_nome + ' (' + turmaInfo.ano_letivo + ')') : '';

      htmlBoletim += '<div class="row mb-6" style="gap:14px">';
      htmlBoletim += '<div class="avatar ' + corAvatar + '" style="width:44px;height:44px;font-size:15px">' + escaparHtml(iniciaisAluno) + '</div>';
      htmlBoletim += '<div>';
      htmlBoletim += '<div style="font-size:18px;font-weight:600;font-family:var(--font-display);color:var(--ink)">' + escaparHtml(nomeAluno) + '</div>';
      htmlBoletim += '<div style="font-family:var(--font-mono);font-size:11px;color:var(--ink-3);margin-top:2px">' + escaparHtml(infoTurma) + '</div>';
      htmlBoletim += '</div></div>';

      // uma div por materia
      for (var mat = 0; mat < dadosBoletim.length; mat++) {
        var materia = dadosBoletim[mat];
        var classePill = materia.situacao == 'APROVADO' ? 'ok' : 'err';

        // monta os 4 bimestres
        var htmlBimestres = '';
        for (var bim = 0; bim < materia.bimestres.length; bim++) {
          var dadosBim = materia.bimestres[bim];
          var corMedia = corDaNota(dadosBim.media != null ? Number(dadosBim.media) : null);

          htmlBimestres += '<div>';
          htmlBimestres += '<div class="card-eyebrow" style="margin-bottom:8px">' + dadosBim.numero + 'º Bimestre</div>';
          htmlBimestres += '<div class="bim-media" style="color:' + corMedia + '">' + formatarNota(dadosBim.media) + '</div>';

          // notas do bimestre
          for (var nn = 0; nn < dadosBim.notas.length; nn++) {
            var notaItem = dadosBim.notas[nn];
            htmlBimestres += '<div class="nota-row"><span class="nd">' + escaparHtml(notaItem.desc) + '</span><span class="nv">' + formatarNota(notaItem.valor) + '</span></div>';
          }
          htmlBimestres += '</div>';
        }

        var corMediaAnual = corDaNota(materia.mediaAnual != null ? Number(materia.mediaAnual) : null);
        var corFreq = materia.frequencia >= 75 ? 'var(--ok)' : 'var(--bad)';

        htmlBoletim += '<div class="card mb-4 overflow-hidden" style="padding:0">';
        htmlBoletim += '<div class="section-head">';
        htmlBoletim += '<div class="row" style="gap:12px">';
        htmlBoletim += '<div class="t">' + escaparHtml(materia.materiaNome) + '</div>';
        htmlBoletim += '<span class="pill ' + classePill + '"><span class="dot"></span>' + escaparHtml(materia.situacao) + '</span>';
        htmlBoletim += '</div>';
        htmlBoletim += '<div class="row" style="gap:20px">';
        htmlBoletim += '<div style="text-align:center"><div class="card-eyebrow" style="margin-bottom:2px">Média anual</div>';
        htmlBoletim += '<div style="font-family:var(--font-display);font-size:22px;line-height:1;color:' + corMediaAnual + '">' + formatarNota(materia.mediaAnual) + '</div></div>';
        htmlBoletim += '<div style="text-align:center"><div class="card-eyebrow" style="margin-bottom:2px">Frequência</div>';
        htmlBoletim += '<div style="font-family:var(--font-display);font-size:22px;line-height:1;color:' + corFreq + '">' + materia.frequencia + '%</div></div>';
        htmlBoletim += '</div></div>';
        htmlBoletim += '<div class="bim-grid">' + htmlBimestres + '</div>';
        htmlBoletim += '</div>';
      }

    } else if (alunoSelecionado != '' && dadosBoletim.length == 0) {
      htmlBoletim = htmlVazio('Sem dados para este aluno', 'NENHUMA MATÉRIA VINCULADA OU SEM AVALIAÇÕES');
    } else {
      htmlBoletim = htmlVazio('Selecione turma e aluno', 'PARA VISUALIZAR O BOLETIM');
    }

    div.innerHTML = '<div class="page-header"><div>'
      + '<div class="page-eyebrow">Lançamentos · Boletim</div>'
      + '<h1 class="page-title">Boletim Escolar</h1>'
      + '<div class="page-subtitle">Consulte médias, frequência e situação final do aluno</div>'
      + '</div></div>'
      + '<div class="card mb-4" style="padding:18px">'
      + '<div class="row" style="gap:12px;flex-wrap:wrap;align-items:flex-end">'
      + '<div class="field" style="margin:0;min-width:220px"><label>Turma</label><select class="select" id="sel-turma">' + opcoesTurmas + '</select></div>'
      + '<div class="field" style="margin:0;min-width:260px"><label>Aluno</label><select class="select" id="sel-aluno"' + (turmaSelecionada == '' ? ' disabled' : '') + '>' + opcoesAlunos + '</select></div>'
      + '</div></div>'
      + htmlBoletim;

    document.getElementById('sel-turma').onchange = function() {
      turmaSelecionada = this.value;
      alunoSelecionado = '';
      alunosDaTurma = [];
      dadosBoletim = [];
      if (turmaSelecionada != '') {
        alunosDaTurma = pegarAlunosDaTurma(Number(turmaSelecionada));
      }
      mostrarPagina();
    };

    document.getElementById('sel-aluno').onchange = function() {
      alunoSelecionado = this.value;
      dadosBoletim = [];
      if (alunoSelecionado != '' && turmaSelecionada != '') {
        dadosBoletim = pegarBoletim(Number(alunoSelecionado), Number(turmaSelecionada));
      }
      mostrarPagina();
    };
  }

  mostrarPagina();
};
