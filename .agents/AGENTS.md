# Regras do Projeto (pillararq)

## Formulários de Criação e Edição Unificados

- **Arquivo Único**: Por padrão, todo formulário de cadastro deve ter apenas **um** arquivo (componente) para criação e edição.
- **Detecção de Modo**: 
  - Se estiver sendo passado o parâmetro contendo o `id` do registro na URL (ex: `route.params.id`), o componente deve abrir em modo de **edição**.
  - Caso contrário (sem parâmetro de `id`), deve abrir em modo de **criação**.
- **Segurança Multi-tenant**:
  - Em modo de edição, os dados do registro devem ser validados quanto ao tenant atual.
  - Se o registro com o ID fornecido não pertencer ao cliente/tenant logado (ou não existir), a visualização/edição **não deve ser permitida**. O sistema deve disparar erro, alertar o usuário e redirecioná-lo para a listagem ou tela segura correspondente.
- **Validações de Campo**:
  - Campos específicos de criação (ex: senhas) devem ser exibidos/exigidos condicionalmente apenas no modo de criação, ou ocultados/opcionais no modo de edição.

## Padrão de Mensagens de Commit (Conventional Commits)

Sempre que gerar mensagens de commit, siga rigorosamente as diretrizes abaixo:

1. **Uso de Conventional Commits**:
   - Tipos permitidos: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`.
   - O título do commit deve seguir o formato: `<tipo>(<escopo>): <resumo curto>` (ex: `feat(auth): prevent session expiration issue`).
   - O título deve ser escrito em inglês, no tempo presente (present tense), de forma concisa e com no máximo 72 caracteres.

2. **Detalhamento no Corpo do Commit**:
   - Após o título, inclua uma linha em branco e em seguida descreva a alteração em inglês estruturada da seguinte forma:
     ```markdown
     Why:
     * Explicação da motivação técnica ou de negócio para a mudança.

     Changes:
     * Descrição das principais modificações realizadas, focando na intenção e não apenas nos arquivos.

     Impact:
     * Explicação de como o comportamento do sistema foi alterado.
     ```
