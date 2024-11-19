# Backend El mago
Para executar o projeto é nescessário que tenha o node instalado e configurar o projeto como descrito abaixo.

## Configuração

### Variáveis de ambiente 

As variáveis de ambiente são constantes que o sistema operacional da para que amplicações executem, nelas estã  informções como conexções entre bancos de dados e serviços terceiros como pagamentos e muito mais. Seu uso se deve ao fato principalmente para dar mais seguraça a aplicação impedindo que o credenciais importantes sejam exposas no projeto.

Antes de iniciar o projeto, na pasta root do backend crie um arquivo chamado **.env** esse arquivo tem que ter as propriedades abaixo. Caso venha a não passar alguma propriedade, a aplicação vai crachar automaticamente.

```env
# Self backend
BACKEND_BASE_URL=
BACKEND_PORT=

JWT_SECRET= 

# Postgres
POSTGRES_HOST= 
POSTGRES_PORT= 
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD=
```
### Banco de dados
Para executar o banco de dados exsitem duas formas, a primeira instalando no sistema operacional o postgres e redis e a segunda é executando eles em forma de container no arquivo docker-compose.yml declarado na raiz do projeto.

#### via docker

```terminal
docker compose up -d 
```

## Executando o projeto
Para executar o projeto rode o comando para produção:

```terminal
npm run start
```

E para desenvolvimento:

```terminal
npm run start:dev
```