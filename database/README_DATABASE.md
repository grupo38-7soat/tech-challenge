# DATABASE

### Modelagem
O banco foi modelado utilizando o [draw.io](https://drive.google.com/file/d/1EN4aZpU4J_ryK1Lc9rKOV2g5yFNplNvv/view?usp=sharing)
---
### Criando imagem docker
Para criar a imagem postgres no docker, basta rodar o seguinte comando:

```
docker run --name tech-challenge -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=tech_challenge_123 -e POSTGRES_DB=techchallengedb -d postgres
```
---
### Configurando Banco de Dados
Apos a configuração da imagem docker, recomenda-se utilizar algum programa que possibilita manipular banco de dados (Ex: Dbeaver). Uma vez que instale o programa, basta adicionar as seguintes informações para se conectar ao db:
```
Host: localhost
Database: techchallengedb
User: admin
Password: tech_challenge_123
Porta: 5432
```
---
### Criando schema e tabelas
Uma vez que o banco de dados já esteja configurado, basta rodar os scripts ```create_database.sql```.
Caso queira realizar um teste, é possivel adicionar alguns dados dentro do banco, utilizando o script ```insert_exemplo.sql```, e utilizando a query presente no arquivo ```query_batimento.sql``` para validar os dados.
