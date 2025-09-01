Com certeza\! Analisando a estrutura e os arquivos do seu projeto, preparei um `README.md` detalhado com o passo a passo para configurar e executar a aplicação.

-----

# Atividade 5: Consumo de API com ReactJS

Este projeto é uma aplicação web desenvolvida em React que utiliza a API do The Movie Database (TMDB) para permitir que os usuários busquem informações sobre filmes, vejam detalhes e gerenciem uma lista de favoritos.

## Funcionalidades

  * **Página de Busca**: Campo para pesquisar filmes por título.
  * **Listagem de Filmes**: Exibição dos resultados da busca com pôster, título e ano de lançamento.
  * **Paginação**: Navegação entre as diferentes páginas de resultados.
  * **Página de Detalhes**: Ao clicar em um filme, são exibidas informações completas como sinopse, elenco, diretor e avaliação.
  * **Lista de Favoritos**: Funcionalidade para adicionar ou remover filmes de uma lista de favoritos, que fica salva no navegador (`localStorage`).
  * **Feedback ao Usuário**: Exibição de indicadores de carregamento (`loading`) e mensagens de erro.

## Tecnologias Utilizadas

  * [React](https://reactjs.org/)
  * [Vite](https://vitejs.dev/)
  * [React Router](https://reactrouter.com/)
  * [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

## Pré-requisitos

Antes de começar, você precisará ter o [Node.js](https://nodejs.org/en/) (que inclui o npm) instalado em sua máquina.

## Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### 1\. Clone o Repositório

Primeiro, clone o repositório para a sua máquina local (ou simplesmente descompacte os arquivos em uma pasta).

```bash
git clone https://github.com/williamjmrosa/atividade-5-consumo-de-API-com-ReactJS.git
```

### 2\. Instale as Dependências

Dentro da pasta do projeto, execute o comando abaixo para instalar todas as dependências listadas no arquivo `package.json`.

```bash
npm install
```

### 3\. Configure a Chave da API (Variável de Ambiente)

A aplicação precisa de uma chave de API para acessar os dados do TMDB.

1.  Crie um arquivo chamado `.env` na raiz do projeto.

2.  Dentro deste arquivo, adicione a seguinte linha, substituindo `SUA_CHAVE_DE_API_AQUI` pela sua chave obtida no site do TMDB:

    ```
    VITE_API_KEY=SUA_CHAVE_DE_API_AQUI
    ```

> **Nota:** Você pode obter uma chave de API gratuitamente se cadastrando no site do [The Movie Database (TMDB)](https://www.themoviedb.org/signup).

### 4\. Execute a Aplicação

Com tudo configurado, inicie o servidor de desenvolvimento com o comando:

```bash
npm run dev
```

Após a execução, o terminal mostrará o endereço local para acessar a aplicação, geralmente `http://localhost:5173`. Abra este endereço em seu navegador para ver o projeto em funcionamento.

## Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

  * `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Module Replacement (HMR).
  * `npm run build`: Compila e otimiza a aplicação para produção, gerando os arquivos na pasta `dist`.
  * `npm run lint`: Executa o ESLint para analisar o código em busca de problemas.
  * `npm run preview`: Inicia um servidor local para visualizar a versão de produção (após executar `npm run build`).