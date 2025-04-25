ARG PORT
# ---------------------------- Build Stage ----------------------------
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependências para cache eficiente
COPY package*.json ./
COPY tsconfig*.json ./
#COPY ormconfig*.json ./
# COPY .env ./

# Instala todas as dependências incluindo devDependencies
RUN npm ci

# Copia todo o código fonte
COPY . .

# Gera a build de produção
RUN npm run build

# ---------------------------- Production Stage ----------------------------
FROM node:20-slim AS prod

WORKDIR /app

# Instala apenas dependências de produção
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install

# Copia os arquivos construídos e configurações do TypeORM
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/ormconfig*.json ./
COPY --from=builder /usr/src/app/.env ./

# Configurações de segurança e saúde
#HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#  CMD curl -f http://localhost:3333/api/health || exit 1

#USER node
EXPOSE $PORT

# Comando para executar migrations antes de iniciar (opcional)
CMD ["node", "dist/src/main.js"]

# ---------------------------- Development Stage ----------------------------
FROM node:20 AS dev

WORKDIR /usr/src/app

# Instala todas as dependências
COPY package*.json ./
COPY tsconfig*.json ./
#COPY ormconfig*.json ./
RUN npm install

# Instala o NestJS CLI globalmente para hot-reload
RUN npm install -g @nestjs/cli

# Copia todo o código fonte
COPY . .

# Configuração para debug e hot-reload
#ENV NODE_ENV=development
EXPOSE $PORT 9229

CMD ["npm", "run", "start:debug", "--", "--poll=1000"]