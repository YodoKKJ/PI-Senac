/* ── app.js — Roteador, topbar e navegação ──────────────────────────────── */

/* Estrutura de navegação idêntica ao AppShell.jsx original */
var NAV_TOP = [
  { id: 'inicio',      label: 'Início',       icon: 'dashboard' },
  { id: 'academico',   label: 'Acadêmico',    icon: 'school',    hasSub: true },
  { id: 'pessoas',     label: 'Pessoas',      icon: 'users',     hasSub: true },
  { id: 'lancamentos', label: 'Lançamentos',  icon: 'notas',     hasSub: true }
];

var NAV_SUB = {
  academico: [
    { route: 'turmas',    label: 'Turmas',    icon: 'turmas'    },
    { route: 'series',    label: 'Séries',    icon: 'series'    },
    { route: 'materias',  label: 'Matérias',  icon: 'materias'  },
    { route: 'vinculos',  label: 'Vínculos',  icon: 'vinculos'  }
  ],
  pessoas: [
    { route: 'alunos',      label: 'Alunos',      icon: 'alunos'      },
    { route: 'professores', label: 'Professores', icon: 'professores' }
  ],
  lancamentos: [
    { route: 'avaliacoes', label: 'Avaliações', icon: 'avaliacoes' },
    { route: 'notas',      label: 'Notas',      icon: 'notas'      },
    { route: 'chamada',    label: 'Chamada',    icon: 'chamada'    },
    { route: 'boletim',    label: 'Boletim',    icon: 'boletim'    }
  ]
};

/* Página padrão de cada seção ao clicar no topnav */
var SECTION_DEFAULT = {
  inicio:      'dashboard',
  academico:   'turmas',
  pessoas:     'alunos',
  lancamentos: 'avaliacoes'
};

/* Qual seção cada rota pertence */
var ROUTE_SECTION = {
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

/* ── Ícones de tema ──────────────────────────────────────────────────────── */
var ICON_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
var ICON_SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

/* ── Tema escuro ─────────────────────────────────────────────────────────── */
var isDark = localStorage.getItem('academico_theme') === 'dark';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  var btn = document.getElementById('btn-theme');
  if (btn) btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('academico_theme', isDark ? 'dark' : 'light');
  applyTheme();
}

/* ── Roteamento ──────────────────────────────────────────────────────────── */
function getRoute() {
  var h = window.location.hash.replace(/^#\/?/, '').trim();
  return h || 'dashboard';
}

function navigate(route) {
  window.location.hash = route;
}

/* ── Renderizar topnav ───────────────────────────────────────────────────── */
function renderTopnav() {
  var route   = getRoute();
  var section = ROUTE_SECTION[route] || 'inicio';

  /* Topnav principal */
  var topnav = document.getElementById('topnav');
  topnav.innerHTML = NAV_TOP.map(function(n) {
    var active = section === n.id ? ' active' : '';
    return '<button class="tnav' + active + '" data-section="' + n.id + '">'
      + icon(n.icon, 14) + ' ' + n.label
      + '</button>';
  }).join('');

  topnav.querySelectorAll('.tnav').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigate(SECTION_DEFAULT[this.dataset.section] || 'dashboard');
    });
  });

  /* Subnav */
  var subnav = document.getElementById('subnav');
  var subs   = NAV_SUB[section] || [];
  if (subs.length === 0) {
    subnav.innerHTML = '';
  } else {
    subnav.innerHTML = subs.map(function(s) {
      var active = route === s.route ? ' active' : '';
      return '<button class="snav' + active + '" data-route="' + s.route + '">'
        + icon(s.icon, 13) + ' ' + s.label
        + '</button>';
    }).join('');
    subnav.querySelectorAll('.snav').forEach(function(btn) {
      btn.addEventListener('click', function() { navigate(this.dataset.route); });
    });
  }

  /* Mobile bottom nav */
  var mobileNav = document.getElementById('mobile-nav');
  mobileNav.innerHTML = NAV_TOP.map(function(n) {
    var active = section === n.id ? ' active' : '';
    return '<button class="mobile-nav-btn' + active + '" data-section="' + n.id + '">'
      + icon(n.icon, 22)
      + '<span>' + n.label.split(' ')[0] + '</span>'
      + '</button>';
  }).join('');
  mobileNav.querySelectorAll('.mobile-nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigate(SECTION_DEFAULT[this.dataset.section] || 'dashboard');
    });
  });
}

/* ── Renderizar página ───────────────────────────────────────────────────── */
function renderPage() {
  var route = getRoute();
  var container = document.getElementById('page');
  container.innerHTML = '';

  renderTopnav();

  var fn = Pages[route];
  if (fn) {
    fn(container);
  } else {
    container.innerHTML = '<div class="page-header"><h1 class="page-title">Página não encontrada</h1></div>';
  }

  window.scrollTo(0, 0);
}

/* ── Inicialização ───────────────────────────────────────────────────────── */
applyTheme();

initDB().then(function() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  /* Botão de tema */
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);

  renderPage();
  window.addEventListener('hashchange', renderPage);

}).catch(function(err) {
  document.getElementById('loading-screen').innerHTML =
    '<div class="loading-inner" style="color:var(--bad)">'
    + '<p style="margin-bottom:8px">Erro ao iniciar o banco de dados.</p>'
    + '<p style="font-size:11px;color:var(--ink-3)">Verifique se há conexão com a internet<br>(necessária para carregar o SQL.js via CDN).</p>'
    + '<p style="font-size:10px;margin-top:8px;font-family:var(--font-mono)">' + String(err) + '</p>'
    + '</div>';
});
