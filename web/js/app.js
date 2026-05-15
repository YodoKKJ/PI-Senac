/* app.js - esse arquivo controla a navegacao do sistema */

/* aqui eu coloco os botoes do menu de cima */
var botoes_do_topo = [
  { id: 'inicio',      label: 'Início',       icon: 'dashboard' },
  { id: 'academico',   label: 'Acadêmico',    icon: 'school',    temSubmenu: true },
  { id: 'pessoas',     label: 'Pessoas',      icon: 'users',     temSubmenu: true },
  { id: 'lancamentos', label: 'Lançamentos',  icon: 'notas',     temSubmenu: true }
];

/* aqui ficam os submenus de cada secao */
var submenus_das_secoes = {
  academico: [
    { rota: 'turmas',    label: 'Turmas',    icon: 'turmas'    },
    { rota: 'series',    label: 'Séries',    icon: 'series'    },
    { rota: 'materias',  label: 'Matérias',  icon: 'materias'  },
    { rota: 'vinculos',  label: 'Vínculos',  icon: 'vinculos'  }
  ],
  pessoas: [
    { rota: 'alunos',      label: 'Alunos',      icon: 'alunos'      },
    { rota: 'professores', label: 'Professores', icon: 'professores' }
  ],
  lancamentos: [
    { rota: 'avaliacoes', label: 'Avaliações', icon: 'avaliacoes' },
    { rota: 'notas',      label: 'Notas',      icon: 'notas'      },
    { rota: 'chamada',    label: 'Chamada',    icon: 'chamada'    },
    { rota: 'boletim',    label: 'Boletim',    icon: 'boletim'    }
  ]
};

/* qual pagina mostrar quando clicar em cada secao */
var pagina_padrao_da_secao = {
  inicio:      'dashboard',
  academico:   'turmas',
  pessoas:     'alunos',
  lancamentos: 'avaliacoes'
};

/* qual secao cada rota pertence */
var secao_de_cada_rota = {
  dashboard:   'inicio',
  turmas:      'academico',
  series:      'academico',
  materias:    'academico',
  vinculos:    'academico',
  alunos:      'pessoas',
  professores: 'pessoas',
  avaliacoes:  'lancamentos',
  notas:       'lancamentos',
  chamada:     'lancamentos',
  boletim:     'lancamentos'
};

/* pegar qual pagina esta na url */
function pegarRotaAtual() {
  var hash_da_url = window.location.hash;
  var rota = hash_da_url.replace('#', '').replace('/', '').trim();
  if (rota == '') {
    rota = 'dashboard';
  }
  return rota;
}

/* ir para uma pagina */
function irParaPagina(nome_da_rota) {
  window.location.hash = nome_da_rota;
}

/* desenhar a barra de navegacao do topo */
function desenharNavegacao() {
  var rota_atual = pegarRotaAtual();
  var secao_atual = secao_de_cada_rota[rota_atual];
  if (secao_atual == undefined) {
    secao_atual = 'inicio';
  }

  /* montar os botoes do menu principal */
  var html_botoes_topo = '';
  for (var i = 0; i < botoes_do_topo.length; i++) {
    var botao_info = botoes_do_topo[i];
    var classe_ativa = '';
    if (secao_atual == botao_info.id) {
      classe_ativa = ' active';
    }
    html_botoes_topo += '<button class="tnav' + classe_ativa + '" data-secao="' + botao_info.id + '">';
    html_botoes_topo += icon(botao_info.icon, 14) + ' ' + botao_info.label;
    html_botoes_topo += '</button>';
  }

  var div_topnav = document.getElementById('topnav');
  div_topnav.innerHTML = html_botoes_topo;

  /* adicionar evento de clique nos botoes do topo */
  var todos_botoes_topo = div_topnav.querySelectorAll('.tnav');
  for (var j = 0; j < todos_botoes_topo.length; j++) {
    todos_botoes_topo[j].addEventListener('click', function() {
      var qual_secao = this.dataset.secao;
      var pagina_para_ir = pagina_padrao_da_secao[qual_secao];
      if (pagina_para_ir == undefined) {
        pagina_para_ir = 'dashboard';
      }
      irParaPagina(pagina_para_ir);
    });
  }

  /* montar o submenu da secao atual */
  var div_subnav = document.getElementById('subnav');
  var itens_submenu = submenus_das_secoes[secao_atual];

  if (itens_submenu == undefined || itens_submenu.length == 0) {
    div_subnav.innerHTML = '';
  } else {
    var html_submenu = '';
    for (var k = 0; k < itens_submenu.length; k++) {
      var item_sub = itens_submenu[k];
      var classe_sub_ativa = '';
      if (rota_atual == item_sub.rota) {
        classe_sub_ativa = ' active';
      }
      html_submenu += '<button class="snav' + classe_sub_ativa + '" data-rota="' + item_sub.rota + '">';
      html_submenu += icon(item_sub.icon, 13) + ' ' + item_sub.label;
      html_submenu += '</button>';
    }
    div_subnav.innerHTML = html_submenu;

    /* evento de clique no submenu */
    var botoes_sub = div_subnav.querySelectorAll('.snav');
    for (var m = 0; m < botoes_sub.length; m++) {
      botoes_sub[m].addEventListener('click', function() {
        irParaPagina(this.dataset.rota);
      });
    }
  }

  /* nav mobile embaixo da tela */
  var nav_mobile = document.getElementById('mobile-nav');
  var html_mobile = '';
  for (var n = 0; n < botoes_do_topo.length; n++) {
    var item_mobile = botoes_do_topo[n];
    var classe_mobile = '';
    if (secao_atual == item_mobile.id) {
      classe_mobile = ' active';
    }
    var nome_curto = item_mobile.label.split(' ')[0];
    html_mobile += '<button class="mobile-nav-btn' + classe_mobile + '" data-secao="' + item_mobile.id + '">';
    html_mobile += icon(item_mobile.icon, 22);
    html_mobile += '<span>' + nome_curto + '</span>';
    html_mobile += '</button>';
  }
  nav_mobile.innerHTML = html_mobile;

  /* evento de clique no nav mobile */
  var botoes_mobile = nav_mobile.querySelectorAll('.mobile-nav-btn');
  for (var p = 0; p < botoes_mobile.length; p++) {
    botoes_mobile[p].addEventListener('click', function() {
      var qual_secao_mobile = this.dataset.secao;
      var pagina_mobile = pagina_padrao_da_secao[qual_secao_mobile];
      if (pagina_mobile == undefined) {
        pagina_mobile = 'dashboard';
      }
      irParaPagina(pagina_mobile);
    });
  }
}

/* funcao principal que mostra a pagina certa */
function mostrarPagina() {
  var rota_atual = pegarRotaAtual();
  var div_pagina = document.getElementById('page');
  div_pagina.innerHTML = '';

  /* atualizar navegacao */
  desenharNavegacao();

  /* chamar a funcao da pagina certa */
  var funcao_da_pagina = Paginas[rota_atual];
  if (funcao_da_pagina != undefined) {
    funcao_da_pagina(div_pagina);
  } else {
    div_pagina.innerHTML = '<div class="page-header"><h1 class="page-title">Página não encontrada</h1></div>';
  }

  /* voltar pro topo da pagina */
  window.scrollTo(0, 0);
}

/* iniciar o banco de dados e depois mostrar o app */
initDB().then(function() {
  /* esconder a tela de carregamento */
  document.getElementById('loading-screen').style.display = 'none';
  /* mostrar o app */
  document.getElementById('app').style.display = 'flex';

  /* mostrar a primeira pagina */
  mostrarPagina();

  /* quando mudar a url mostrar a pagina nova */
  window.addEventListener('hashchange', mostrarPagina);

}).catch(function(erro_que_aconteceu) {
  /* se der erro mostrar mensagem */
  var div_loading = document.getElementById('loading-screen');
  div_loading.innerHTML = '<div class="loading-inner" style="color:var(--bad)">'
    + '<p style="margin-bottom:8px">Erro ao iniciar o banco de dados.</p>'
    + '<p style="font-size:11px;color:var(--ink-3)">Verifique se há conexão com a internet<br>(necessária para carregar o SQL.js via CDN).</p>'
    + '<p style="font-size:10px;margin-top:8px;font-family:var(--font-mono)">' + String(erro_que_aconteceu) + '</p>'
    + '</div>';
});
