# Como executar o projeto usando Kubernetes

- Fazer build da imagem Docker localmente com o comando abaixo:

```bash
❯ docker build -t tech-challenge:latest .
```

- Caso esteja usando o Kind (https://kind.sigs.k8s.io/) para os testes, execute os passos abaixo:

```bash
❯ kind create cluster --config=kind-api-cluster.yml
❯ kind load docker-image tech-challenge:latest --name kind
```

- Criar o deployment do database:

```bash
❯ kubectl apply -f database-configmap.yaml
❯ kubectl apply -f database-service.yaml
❯ kubectl apply -f database-deployment.yaml
```

> Observação: as tabelas são criadas automaticamente junto com os dados iniciais.

- Criar o deployment da aplicação:

```bash
❯ kubectl apply -f tech-challenge-configmap.yaml
❯ kubectl apply -f tech-challenge-service.yaml
❯ kubectl apply -f tech-challenge-deployment.yaml
❯ kubectl apply -f tech-challenge-hpa.yaml
```

- Verificar se a aplicação está ativa em: http://localhost:31000/api-docs