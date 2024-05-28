# tech-challenge - Grupo 38-7SOAT

## Docker

Para iniciar os serviços com o docker-compose, utilize o comando abaixo na raiz do repositório do projeto:

```sh
docker compose up -d
```

O Docker compose irá criar 2 containers, sendo o primeiro com o database e o segundo com a nossa aplicação em Node.

O container do database será automaticamente inicializado com as tabelas necessárias e alguns dados para testes.

O container com a aplicação será gerado por uma build usando o `node:20.13.1-alpine` e o mesmo utilizará a porta `3000` para os endpoints.

Todas as variáveis de ambiente necessárias estão expostas no arquivo `.env`. Nenhuma alteração nesse arquivo é necessária para a total execução da versão 1.0.

Para facilitar a comunicação entre a aplicação e o banco de dados, foi criado uma network no docker-compose.

## Swagger

Todos os endpoints estão disponíveis para consulta via [Swagger](http://localhost:3000/api-docs/).

## Miro

A documentação do sistema (DDD) com Event Storming está disponível no [Miro](https://miro.com/app/board/uXjVKUHWBkY=/?share_link_id=42148422473).