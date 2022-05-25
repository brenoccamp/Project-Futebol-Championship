# Project Futebol Championship

Esta aplicação foi um dos projetos avaliativos do módulo de backend no curso de desenvolvimento web na Trybe. Nele recebi um frontend react pronto que exibe informações sobre partidas e classificações de futebol.

"E de onde essas informações virão?", você deve estar se perguntando. Vem tudo do Backend!

Exatamente, minha missão nesse projeto foi, a partir de um frontend sem lógica (apenas exibe informações), desenvolver uma API na arquitetura MSC e utilizando princípios SOLID com TypeScript e OOP que seria responsável por:

- Criar e manipular um banco de dados MySQL para armazenar todos os dados;
- Autenticar usuários cadastrados através do login;
- Listar clubes cadastrados;
- Listar partidas em andamento e partidas finalizadas;
- Adicionar partidas em andamento;
- Atualizar o placar das partidas em andamento;
- Finalizar partidas;
- Gerar leaderboards ranqueadas e ordenadas baseadas no desempenho dos clubes nas partidas cadastradas, utilizando 5 critérios avaliativos e separando em 3 tipos de classificação (geral, mandante e visitante);
- Orquestrar tudo isso (banco de dados, backend e frontend) em containers `Docker` e executá-los de forma conjunta através de uma orquestração com `Docker-Compose`.

Também foi desenvolvido em TDD uma cobertura de testes de 100% em todas as camadas utilizando ChaiHttp e Sinon.

Ps: Caso seu navegador tente acessar a página através do protocolo HTTPS e acuse erro, será necessário alterar manualmente a URL para o protocolo HTTP.

Ps2: Para realizar o login na aplicação basta usar as seguintes credenciais:

    login: admin@admin.com
    senha: secret_admin 

## Stacks utilizadas

- Node.js
- TypeScript
- Object-Oriented Programming
- Express
- MySQL
- Sequelize
- Docker
- ChaiHttp + Sinon

#### Além das Stacks citadas acima, também foram utilizadas as seguintes bibliotecas:

- `JWT` para fazer a autenticação dos usuários logados;
- `bcrypt` para fazer hashing e verificação das senhas armazenadas no banco de dados.

## Rodando localmente

***Para rodar a API localmente certifique-se de ter [Docker](https://docs.docker.com/get-docker/) 
e [Docker-Compose](https://docs.docker.com/compose/install/) instalados em sua maquina.***

Obs: Docker e Docker-Compose utilizados no desenvolvimento e execução deste projeto estavam nas versões `20.10.13` e `1.29.2` respectivamente.

Clone o projeto

```bash
  git@github.com:brenoccamp/Project-Futebol-Championship.git
```

Entre no diretório do projeto

```bash
  cd Trybe-Futebol-Clube
```

Suba a orquestração de containers

```bash
  docker-compose up --build -d
```

A API estará pronta para uso quando a saída no seu terminal ficar assim

```bash
  Creating tfc_database ... done
  Creating tfc_backend ... done
  Creating tfc_frontend ... done
```

A aplicação poderá ser acessada através de

```bash
  Front-end: localhost:3000
  Back-end: localhost:3001
```

Para rodar a bateria de testes basta executar

```bash
  docker-compose exec backend npm test
```

Para encerrar a API basta executar o comando

```bash
  docker-compose down --rmi local --volumes --remove-orphans
```

## Experiência

Embora parecesse simples no começo, esse projeto se mostrou um desafio muito interessante e engrandecedor. Foi minha primeira vez desenvolvendo uma API utilizando a "programação orientada a objetos" e, embora tenha levado um tempinho até me acostumar, facilitou bastante a refatoração e implementação de princípios SOLID.

O primeiro passo foi preparar toda a parte de banco de dados, pra isso adicionei um container MySQL no Docker-Compose e parti pra fazer a preparação do Sequelize. Agora era preparar a API em si com Express.

Como era um estilo de desenvolvimento que não estava acostumado, decidi não fugir do básico e usei o bom e velho TDD pra garantir que meus endpoints estavam funcionando como esperado após desenvolvê-los. Fiz todo o setup do Express e as camadas da arquitetura MSC (Model, Service, Controller).

No fim gostei do resultado, embora possa ser considerado um projeto simples, foi um projeto que apliquei a maioria das stacks, padrões e princípios mais importantes para desenvolver um código de qualidade.

## Requisições

### Realizar Login

* Para realizar o login, devemos acessar o endpoint `POST /login`
* O endpoint deve receber a estrutura com os seguintes dados:
```bash
{
  "email": "admin@admin.com",
  "password": "secret_admin"
}
```
* Este endpoint te retornará um `Token`

### Validação do Login

* Para realizar a validação do login, devemos acessar o endpoint `GET /login/validate`
* A requisição deve conter no Header o `token` gerado no login 

### Listar todos os Clubs

* Para listar todos os Clubs, devemos acessar o endpoint `GET /clubs`.
* A requisição deve conter no Header o `token` gerado no login 

### Listar um Club

* Para listar um club, devemos acessar o endpoint `GET /user/:id` passando na `URL` o `ID` do club que desejamos buscar.
* A requisição deve conter no Header o `token` gerado no login 

### Listar todas Partidas

* Para listar todas as partidas , devemos acessar o endpoint `GET /matchs`
* A requisição deve conter no Header o `token` gerado no login 

### Listar Partidas em Progresso

* Para listar as partidas em progresso, devemos acessar o endpoint `GET /matchs/?inProgress=true` passando na `URL` o parâmetro.
* A requisição deve conter no Header o `token` gerado no login 

### Listar Partidas em Finalizadas

* Para listar as partidas em progresso, devemos acessar o endpoint `GET /matchs/?inProgress=false` passando na `URL` o parâmetro.
* A requisição deve conter no Header o `token` gerado no login 

### Adicionar Partidas

* Para adicionar partidas, devemos acessar o endpoint `POST /matchs`
* O endpoint deve receber a estrutura com os seguintes dados:
```bash
{
  "homeTeam": 16, // O valor deve ser o id do time
  "awayTeam": 8, // O valor deve ser o id do time
  "homeTeamGoals": 2,
  "awayTeamGoals": 2,
  "inProgress": true // a partida deve ser criada como em progresso
}
```
* A requisição deve conter no Header o `token` gerado no login 

### Finalizar Partidas

* Para finalizar partidas, devemos acessar o endpoint `PATCH /matchs/:id/finish` passando na `URL` o `ID` da partida a ser finalizada.
* A requisição deve conter no Header o `token` gerado no login 

### Atualizar Partidas em Andamento

* Para atualizar partidas em andamento, devemos acessar o endpoint `PATCH /matchs/:id` passando na `URL` o `ID` da partida a ser atualizada.
* O endpoint deve receber a estrutura com os seguintes dados:
```bash
{
  "homeTeamGoals": 3,
  "awayTeamGoals": 1
}
```
* A requisição deve conter no Header o `token` gerado no login 


### Filtrar a Classificação dos Times da Casa

* Para filtrar a classificação, devemos acessar o endpoint `GET /leaderboard/home`.
* A requisição deve conter no Header o `token` gerado no login 

## Observações:

* O front-end deste projeto já foi provido pela @Trybe.
