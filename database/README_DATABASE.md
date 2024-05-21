# DATABASE

### Modelagem
O banco foi modelado utilizando o [draw.io](https://drive.google.com/file/d/1EN4aZpU4J_ryK1Lc9rKOV2g5yFNplNvv/view?usp=sharing)
---
### Build
Para criar a imagem postgres no docker, basta rodar o seguinte comando dentro da pasta './database':
```
docker build -t tech_challenge:v.1.0.0 .
```

Para listar as imagens já criadas
```
docker image ls
```

Para deletar as imagens já criadas
```
docker rmi ID_DA_IMAGEM
```

Para criar o container da aplicação basta rodar o seguinte comando
```
docker run --name db_tech_challenge -d -p 5432:5432 tech_challenge:v.1.0.0
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

