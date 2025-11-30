# Areal HR System Stack

### Инструменты
- **Операционная система**: Ubuntu Desktop 24.04
- **IDE**: Visual Studio Code + DBeaver
- **База данных**: PostgreSQL 17 (Docker контейнер)
- **Docker** + **Docker Compose**
- **Nginx**

### Frontend
- **Vue.js 3.5.24**
- **Vite 7.2.2**

### Backend
- **Node.js 22.21.0**
- **NestJS 10.4.20**
- **Пакеты**:
  - `pg`
  - `node-pg-migrate`
  - `@nestjs/passport`
  - `joi`
  - `argon2`

## Инструкция по сборке проекта:
- **Создать .env по образцу .env.example в корне проекта**
- **Запустить команду docker-compose up --build**
- **Открыть ссылку http://localhost**