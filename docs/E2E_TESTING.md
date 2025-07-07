# Tests Funcionales (E2E) - Sistema de Exchange

## Descripción

Los tests funcionales (end-to-end) prueban la integración completa del sistema, desde las peticiones HTTP hasta la base de datos PostgreSQL. Estos tests verifican que todos los componentes trabajen correctamente juntos.

## Configuración

### 1. Base de Datos de Test

Los tests e2e utilizan una base de datos PostgreSQL separada (`exchange_test`) para no interferir con los datos de desarrollo.

#### Opción A: Ejecutar con configuración automática
```bash
# Configurar base de datos y ejecutar tests
npm run test:e2e:run
```

#### Opción B: Configuración manual
```bash
# Solo configurar la base de datos
npm run test:e2e:setup

# Ejecutar tests
npm run test:e2e
```

### 2. Variables de Entorno

Los tests e2e utilizan las siguientes variables de entorno por defecto:

- `DB_HOST`: localhost
- `DB_PORT`: 5432
- `DB_USERNAME`: postgres
- `DB_PASSWORD`: postgres
- `DB_DATABASE`: exchange_test

## Ejecución

### Ejecutar todos los tests e2e
```bash
npm run test:e2e:run
```

### Ejecutar tests específicos
```bash
# Tests de órdenes
npm run test:e2e -- --testNamePattern="Orders"

# Tests específicos
npm run test:e2e -- --testNamePattern="should create a MARKET BUY order"
```

## Estructura de Tests

### Tests de Órdenes (`test/orders.e2e-spec.ts`)

#### Creación de Órdenes
- **MARKET BUY**: Verifica la creación y ejecución de órdenes de compra a mercado
- **LIMIT BUY**: Verifica la creación de órdenes limitadas
- **CASH_IN**: Verifica la carga de dinero en la cuenta
- **Cálculo de tamaño**: Verifica el cálculo automático de cantidad basado en monto

#### Validaciones
- Usuario no encontrado
- Instrumento no encontrado
- Fondos insuficientes
- Órdenes LIMIT sin precio

#### Consultas
- Listar órdenes de usuario
- Órdenes pendientes
- Posiciones del usuario

#### Cancelación
- Cancelar órdenes NEW
- Rechazar cancelación de órdenes no-NEW
- Órdenes inexistentes

#### Integración con Portfolio
- Verificar actualización de posiciones después de ejecutar órdenes
- Verificar cambios en el portfolio

## Datos de Prueba

Los tests utilizan los siguientes datos de prueba:

### Usuarios
- `test@example.com` (ID: 1) - Con cash inicial de 1,000,000 ARS
- `user2@example.com` (ID: 2) - Sin cash inicial

### Instrumentos
- **YPFD** (ID: 47) - Y.P.F. S.A. - Precio: 1063.25
- **GGAL** (ID: 48) - Grupo Galicia - Precio: 1250.50
- **ARS** (ID: 66) - PESOS - Precio: 1

### Posiciones Iniciales
- Usuario 1: 1,000,000 ARS en cash

## Casos de Prueba Cubiertos

### 1. Creación de Órdenes
- ✅ Órdenes MARKET con ejecución inmediata
- ✅ Órdenes LIMIT con status NEW
- ✅ Cálculo automático de cantidad por monto
- ✅ Validación de fondos suficientes
- ✅ Validación de instrumentos y usuarios

### 2. Gestión de Órdenes
- ✅ Listado de órdenes por usuario
- ✅ Filtrado de órdenes pendientes
- ✅ Cancelación de órdenes NEW
- ✅ Validación de estados para cancelación

### 3. Posiciones
- ✅ Actualización automática de posiciones
- ✅ Cálculo correcto de cantidades
- ✅ Gestión de cash (ARS)

### 4. Integración
- ✅ Actualización de portfolio después de órdenes
- ✅ Cálculo correcto de valores totales
- ✅ Persistencia en base de datos

## Debugging

### Ver logs detallados
```bash
npm run test:e2e -- --verbose
```

### Ejecutar un test específico con debug
```bash
npm run test:e2e -- --testNamePattern="should create a MARKET BUY order" --verbose
```

### Verificar estado de la base de datos
```bash
# Conectar a la base de datos de test
psql -h localhost -p 5432 -U postgres -d exchange_test

# Verificar tablas
\dt

# Verificar datos
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM positions;
```

## Mejores Prácticas

1. **Limpieza de datos**: Cada test limpia la base de datos antes de ejecutarse
2. **Datos de prueba**: Se utilizan datos consistentes y predecibles
3. **Validaciones**: Se prueban tanto casos exitosos como casos de error
4. **Integración**: Se verifica que los cambios se reflejen en todas las entidades relacionadas
5. **Base de datos separada**: Se usa `exchange_test` para no interferir con datos de desarrollo

## Troubleshooting

### Error: Base de datos no encontrada
```bash
npm run test:e2e:setup
```

### Error: Conexión rechazada
Verificar que PostgreSQL esté ejecutándose:
```bash
docker-compose up -d
```

### Error: Timeout en tests
Los tests tienen un timeout de 30 segundos configurado en `test/jest-e2e.json`

### Error: Permisos de base de datos
Asegurarse de que el usuario `postgres` tenga permisos para crear bases de datos:
```sql
ALTER USER postgres CREATEDB;
```

## Configuración Avanzada

### Usar variables de entorno personalizadas
```bash
DB_HOST=localhost DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=postgres DB_DATABASE=exchange_test npm run test:e2e:run
```

### Ejecutar tests en paralelo
```bash
npm run test:e2e -- --maxWorkers=2
```

### Generar reporte de cobertura
```bash
npm run test:e2e -- --coverage
``` 