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
