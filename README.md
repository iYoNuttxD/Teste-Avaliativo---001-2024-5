# Signo

Um site de enquetes full-stack, com frontend em React (Vite) e backend em Express + MySQL. A API HTTP expoe comandos que delegam para os scripts em `src/sql`, responsaveis por acessar o banco.

## Requisitos

- Node.js 18 ou superior
- npm 9+
- Servidor MySQL instalado localmente (recomendado 8.0)

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar acesso ao banco

As credenciais ficam em `src/sql/dbconfig.json`:

```json
{
  "user": "root",
  "password": "sua-senha"
}
```

A API assume conexao com `localhost` e controla automaticamente o schema `signo`. Ajuste usuario/senha conforme necessario.

## 3. Subir o ambiente de desenvolvimento

```bash
npm run dev
```

Este comando inicia os dois servicos em paralelo:

- Frontend: http://localhost:5173
- API: http://localhost:3001

Na primeira execucao, o servidor verifica se o banco `signo` existe. Caso contrario, roda `CreateDB.js` para criar a base e as tabelas (`polls`, `poll_options`, `votes`).

## Scripts npm disponiveis

| Script | Descricao |
| --- | --- |
| `npm run dev` | Sobe frontend e API juntos (usa `concurrently`). |
| `npm run dev:front` | Apenas o servidor Vite. |
| `npm run dev:server` | Apenas a API Express (`src/sql/Server.js`). |
| `npm run build` | Gera o bundle de producao com Vite. |
| `npm run preview` | Faz preview local do bundle gerado. |
| `npm run lint` | Roda ESLint no projeto. |

## Estrutura do projeto

```
src/
  components/   Componentes React reutilizaveis (inputs, editores, etc.)
  pages/        Paginas/rotas principais (home, editor, detalhes)
  sql/          Scripts Node que conversam com o MySQL
```

Scripts principais em `src/sql`:

- `Server.js` API Express; garante o banco e despacha os comandos.
- `CreateDB.js` Cria schema e tabelas.
- `CreatePoll.js`, `EditPoll.js`, `DeletePoll.js`, `LoadPoll.js`, `LoadPolls.js`, `VoteOption.js` Operacoes de CRUD chamadas pela API.

## Esquema do banco (resumo)

- `polls`: id, title, starts_at, ends_at
- `poll_options`: id, poll_id, text
- `votes`: id, poll_id, option_id

As FKs estao configuradas com delete em cascata.

## Como usar

1. Abra http://localhost:5173.
2. Crie uma enquete informando titulo, datas de inicio/fim e pelo menos tres opcoes.
3. Edite enquetes para alterar textos, adicionar ou remover opcoes.
4. Na pagina da enquete, registre votos para ver os totais atualizados.

## Solucao de problemas

- **Falha na conexao MySQL**: cheque se o servico esta ativo e se `dbconfig.json` possui usuario/senha corretos.
- **Conflito de portas**: Vite usa 5173 e a API usa 3001. Interrompa servicos que estejam ocupando essas portas ou ajuste os scripts.
- **Banco existente com estrutura diferente**: remova ou renomeie o schema `signo`, ou adapte os scripts SQL para sua estrutura.

## Build de produção

1. Gere o bundle do frontend: `npm run build` (saida em `dist/`).
2. Sirva a API (`npm run dev:server` ou outro gerenciador). O bundle estatico deve ser servido separadamente (por exemplo, Nginx, Vercel, S3, etc.).

Personalize os scripts em `src/sql` conforme o ambiente (Docker, MySQL gerenciado, variaveis de ambiente, e assim por diante).
