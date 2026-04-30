# Sistema Acadêmico — TCC

Sistema de gestão acadêmica escolar desenvolvido como Trabalho de Conclusão de Curso.

## Stack

- **Backend:** Spring Boot 3.2.5 + Java 17 + PostgreSQL
- **Frontend:** React 19 + Vite + React Router v6

## Funcionalidades

- Cadastro de Séries, Turmas e Matérias
- Cadastro de Alunos e Professores
- Matrícula de alunos em turmas
- Atribuição de professores a turmas/matérias
- Lançamento de Avaliações e Notas (com pesos por bimestre)
- Chamada / Frequência diária
- Boletim com média ponderada, frequência e situação final

## Como executar

### Pré-requisitos

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL rodando localmente

### Banco de dados

Crie o banco `tcc_academico` no PostgreSQL:

```sql
CREATE DATABASE tcc_academico;
```

O Hibernate cria as tabelas automaticamente na primeira execução (`ddl-auto=update`).

### Backend

```bash
cd backend
./mvnw spring-boot:run
# ou: mvn spring-boot:run
```

O servidor sobe em `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Estrutura do projeto

```
tcc-academico/
├── backend/          # Spring Boot API REST
│   └── src/main/java/com/tcc/academico/
│       ├── entity/       # Entidades JPA
│       ├── repository/   # Spring Data repositories
│       ├── service/      # Lógica de negócio
│       └── controller/   # Endpoints REST (/api/*)
└── frontend/         # React SPA
    └── src/
        ├── pages/        # Telas da aplicação
        └── components/   # Componentes reutilizáveis
```

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/dashboard` | Resumo geral |
| GET/POST/PUT/DELETE | `/api/alunos` | CRUD de alunos |
| GET/POST/PUT/DELETE | `/api/professores` | CRUD de professores |
| GET/POST/PUT/DELETE | `/api/series` | CRUD de séries |
| GET/POST/PUT/DELETE | `/api/turmas` | CRUD de turmas |
| GET/POST/PUT/DELETE | `/api/materias` | CRUD de matérias |
| GET/POST/DELETE | `/api/vinculos/aluno-turma` | Matrículas |
| GET/POST/DELETE | `/api/vinculos/professor-turma-materia` | Atribuições |
| GET/POST/DELETE | `/api/avaliacoes` | Avaliações |
| POST | `/api/notas/lancar` | Lançar nota |
| GET | `/api/notas/boletim/{alunoId}/{turmaId}` | Boletim |
| POST | `/api/presencas/lancar` | Registrar chamada |
