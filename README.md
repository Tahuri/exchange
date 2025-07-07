<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Exchange API

API de exchange desarrollada con NestJS, TypeORM y PostgreSQL.

## Características

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL con TypeORM
- **Contenedores**: Docker Compose para desarrollo
- **Módulos**: Users, Orders, Instruments, Portfolio

## Módulos Disponibles

### 1. Users
- Gestión de usuarios
- Endpoints: `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

### 2. Orders
- Gestión de órdenes de compra/venta
- Tipos: MARKET, LIMIT
- Estados: PENDING, FILLED, CANCELLED, REJECTED
- Endpoints: `GET /orders`, `GET /orders/:id`, `POST /orders`, `PUT /orders/:id`, `DELETE /orders/:id`

### 3. Instruments
- Búsqueda de instrumentos financieros
- Filtros por ticker, nombre, tipo
- Endpoints: `GET /instruments`, `GET /instruments/search`

### 4. Portfolio
- Gestión de portfolios de usuarios
- Cálculo de rendimientos y valores de mercado
- Endpoints: `GET /portfolio/:userId`, `GET /portfolio/:userId/summary`, `GET /portfolio/:userId/position/:instrumentId`

## Instalación

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd exchange
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con los valores apropiados:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=exchange_user
DB_PASSWORD=exchange_password
DB_DATABASE=exchange_db
NODE_ENV=development
```

4. **Levantar servicios con Docker**
```bash
docker-compose up -d
```

5. **Ejecutar migraciones**
```bash
npm run migration:run
```

6. **Iniciar la aplicación**
```bash
npm run start:dev
```

## Uso

### Endpoints Principales

#### Users
```bash
# Obtener todos los usuarios
curl -X GET "http://localhost:3000/users"

# Obtener usuario específico
curl -X GET "http://localhost:3000/users/1"

# Crear usuario
curl -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","accountNumber":"10001"}'
```

#### Orders
```bash
# Obtener todas las órdenes
curl -X GET "http://localhost:3000/orders"

# Crear orden
curl -X POST "http://localhost:3000/orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"instrumentId":47,"side":"BUY","type":"MARKET","quantity":100}'
```

#### Instruments
```bash
# Buscar instrumentos
curl -X GET "http://localhost:3000/instruments/search?q=YPFD"

# Obtener todos los instrumentos
curl -X GET "http://localhost:3000/instruments"
```

#### Portfolio
```bash
# Obtener portfolio completo
curl -X GET "http://localhost:3000/portfolio/1"

# Obtener resumen del portfolio
curl -X GET "http://localhost:3000/portfolio/1/summary"

# Obtener detalles de una posición
curl -X GET "http://localhost:3000/portfolio/1/position/47"
```

## Colección de Postman

Para facilitar las pruebas de la API, se incluye una colección completa de Postman:

### 📥 Importar Colección
1. Descarga el archivo `Exchange_API.postman_collection.json`
2. Abre Postman
3. Haz clic en **"Import"**
4. Selecciona el archivo descargado
5. Configura la variable `base_url` en tu environment

### 🔧 Configuración Rápida
1. Crea un environment en Postman llamado **"Exchange API Local"**
2. Agrega la variable: `base_url = http://localhost:3000`
3. Selecciona el environment en el dropdown superior derecho

### 📋 Requests Incluidos
- **Users**: CRUD completo de usuarios
- **Orders**: Crear órdenes de compra/venta (MARKET/LIMIT)
- **Instruments**: Búsqueda con filtros y paginación
- **Portfolio**: Portfolio completo, resumen y detalles de posiciones
- **Health Check**: Verificación del estado de la API

### 🚀 Flujo de Pruebas Recomendado
1. **Health Check** - Verificar que la API esté funcionando
2. **Get All Users** - Ver usuarios existentes
3. **Search Instruments** - Buscar instrumentos disponibles
4. **Create Market Buy Order** - Crear una orden de compra
5. **Get User Portfolio** - Ver el portfolio actualizado

Para más detalles sobre el uso de la colección, consulta: [Documentación de Postman](docs/POSTMAN_COLLECTION.md)

## Estructura de la Base de Datos

### Tablas Principales

- **users**: Información de usuarios
- **instruments**: Instrumentos financieros
- **orders**: Órdenes de compra/venta
- **marketdata**: Datos históricos de precios
- **positions**: Posiciones de usuarios

### Datos Iniciales

El sistema incluye datos de ejemplo:
- Usuarios de prueba
- Instrumentos financieros argentinos
- Datos históricos de precios
- Posiciones iniciales

## Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Migraciones
npm run migration:generate
npm run migration:run
npm run migration:revert

# Testing
npm run test
npm run test:e2e
```

### Estructura del Proyecto

```
src/
├── entities/          # Entidades de TypeORM
├── users/            # Módulo de usuarios
├── orders/           # Módulo de órdenes
├── instruments/      # Módulo de instrumentos
├── portfolio/        # Módulo de portfolio
├── app.module.ts     # Módulo principal
└── main.ts          # Punto de entrada
```

## Documentación

- [API de Users](docs/USERS_API.md)
- [API de Orders](docs/ORDERS_API.md)
- [API de Instruments](docs/INSTRUMENTS_API.md)
- [API de Portfolio](docs/PORTFOLIO_API.md)
- [Colección de Postman](docs/POSTMAN_COLLECTION.md)

## Características del Portfolio

### Cálculos Automáticos
- **Valor total del portfolio**: Suma de posiciones + pesos disponibles
- **Rendimientos**: Calculados en tiempo real basados en precios de mercado
- **Pesos disponibles**: Obtenidos de la posición en ARS
- **Rendimientos diarios**: Basados en precios anterior vs actual

### Información por Posición
- Cantidad de acciones
- Precio promedio de compra
- Precio actual de mercado
- Valor total de la posición
- Rendimiento total (pesos y porcentaje)
- Rendimiento diario (pesos y porcentaje)

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
