# Documentação do Sistema de Estacionamento

## Descrição
Este sistema permite que usuários realizem cadastro e login, além de visualizarem suas informações de estacionamento, incluindo tempo decorrido desde a entrada. Além disso, exibe uma tabela com os carros cadastrados no sistema.

## Desafios Encontrados
- **Gerenciamento do tempo de estacionamento**: Foi necessário garantir que o tempo decorrido fosse atualizado em tempo real.

## Requisitos Funcionais
- Permitir o cadastro de novos usuários.
- Autenticar usuários com credenciais armazenadas.
- Exibir nome, placa e preferência do usuário.
- Calcular e atualizar automaticamente o tempo de estacionamento.
- Carregar e exibir uma lista de carros cadastrados na API.
- Permitir que o usuário finalize sua sessão e seja redirecionado.

## Requisitos Não-Funcionais
- Atualização automática do tempo sem impactar o desempenho.
- Interface intuitiva para exibição das informações.
- Tratamento de erros ao buscar dados da API.
- Segurança no armazenamento de credenciais e autenticação.

## Estrutura do Código

### 1. Cadastro e Login
- **Cadastro**: Os usuários podem se registrar informando nome, placa e preferência de vaga.
- **Login**: O sistema verifica as credenciais e armazena os dados do usuário no `localStorage`.

### 2. Exibição das Informações do Usuário
- Nome, placa e preferência do usuário são exibidos na tela.
- O tempo de estacionamento é atualizado automaticamente a cada segundo.

### 3. Listagem de Carros Cadastrados
- Uma tabela exibe os carros cadastrados, incluindo placa, nome do motorista e horário de entrada.

## Tecnologias Utilizadas
- **HTML, CSS e JavaScript** para interface e funcionalidades.
- **LocalStorage** para armazenar dados do usuário.
- **Fetch API** para comunicação com o backend.

## Melhorias Futuras
- Implementação de um sistema de permissões para diferentes tipos de usuários.
- Melhor gerenciamento de sessões para evitar acesso não autorizado.
- Interface mais dinâmica com notificações e alertas.
- Definir processo de pagamento.