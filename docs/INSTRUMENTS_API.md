# API de Instrumentos - Documentación

## Endpoints de Búsqueda de Activos

### 1. Buscar Instrumentos

**GET** `/instruments/search`

Busca instrumentos por ticker, nombre o tipo. Soporta búsqueda general y específica.

#### Parámetros de consulta:

- `query`: Búsqueda general en ticker y nombre
- `ticker`: Búsqueda específica por ticker
- `name`: Búsqueda específica por nombre
- `type`: Búsqueda por tipo de instrumento
- `limit`: Límite de resultados (default: 50)
- `offset`: Desplazamiento para paginación (default: 0)

#### Ejemplos de uso:

**Búsqueda general:**
```bash
curl -X GET "http://localhost:3000/instruments/search?query=YPFD"
```

**Búsqueda por ticker:**
```bash
curl -X GET "http://localhost:3000/instruments/search?ticker=YPFD"
```

**Búsqueda por nombre:**
```bash
curl -X GET "http://localhost:3000/instruments/search?name=Y.P.F"
```

**Búsqueda por tipo:**
```bash
curl -X GET "http://localhost:3000/instruments/search?type=ACCIONES"
```

**Búsqueda con paginación:**
```bash
curl -X GET "http://localhost:3000/instruments/search?query=Banco&limit=10&offset=0"
```

### 2. Buscar por Ticker

**GET** `/instruments/ticker/:ticker`

Busca instrumentos que contengan el ticker especificado.

```bash
curl -X GET "http://localhost:3000/instruments/ticker/YPFD"
```

### 3. Buscar por Nombre

**GET** `/instruments/name/:name`

Busca instrumentos que contengan el nombre especificado.

```bash
curl -X GET "http://localhost:3000/instruments/name/Y.P.F"
```

### 4. Buscar por Tipo

**GET** `/instruments/type/:type`

Busca instrumentos por tipo (ACCIONES, MONEDA, etc.).

```bash
curl -X GET "http://localhost:3000/instruments/type/ACCIONES"
```

### 5. Instrumentos Populares

**GET** `/instruments/popular`

Obtiene los instrumentos más populares (primeros 10 de tipo ACCIONES).

```bash
curl -X GET "http://localhost:3000/instruments/popular"
```

### 6. Obtener Instrumento por ID

**GET** `/instruments/:id`

Obtiene un instrumento específico por su ID.

```bash
curl -X GET "http://localhost:3000/instruments/47"
```

### 7. Obtener Instrumento con Datos de Mercado

**GET** `/instruments/:id/market-data`

Obtiene un instrumento con su último dato de mercado.

```bash
curl -X GET "http://localhost:3000/instruments/47/market-data"
```

### 8. Listar Todos los Instrumentos

**GET** `/instruments`

Obtiene todos los instrumentos ordenados por ticker.

```bash
curl -X GET "http://localhost:3000/instruments"
```

## Respuestas de Ejemplo

### Búsqueda General
```json
[
  {
    "id": 47,
    "ticker": "YPFD",
    "name": "Y.P.F. S.A.",
    "type": "ACCIONES"
  },
  {
    "id": 48,
    "ticker": "YPF",
    "name": "Y.P.F. S.A. ADR",
    "type": "ACCIONES"
  }
]
```

### Instrumento con Datos de Mercado
```json
{
  "id": 47,
  "ticker": "YPFD",
  "name": "Y.P.F. S.A.",
  "type": "ACCIONES",
  "latestMarketData": {
    "id": 123,
    "instrumentId": 47,
    "high": 950.50,
    "low": 930.00,
    "open": 940.00,
    "close": 945.25,
    "previousClose": 935.00,
    "date": "2024-01-15"
  }
}
```

### Instrumentos Populares
```json
[
  {
    "id": 47,
    "ticker": "YPFD",
    "name": "Y.P.F. S.A.",
    "type": "ACCIONES"
  },
  {
    "id": 35,
    "ticker": "GGAL",
    "name": "Grupo Financiero Galicia",
    "type": "ACCIONES"
  },
  {
    "id": 32,
    "ticker": "BBAR",
    "name": "Banco Frances",
    "type": "ACCIONES"
  }
]
```

## Casos de Uso Comunes

### 1. Búsqueda de Acciones Bancarias
```bash
curl -X GET "http://localhost:3000/instruments/search?name=Banco&type=ACCIONES"
```

### 2. Búsqueda de Energía
```bash
curl -X GET "http://localhost:3000/instruments/search?query=energía"
```

### 3. Búsqueda por Ticker Parcial
```bash
curl -X GET "http://localhost:3000/instruments/search?ticker=YP"
```

### 4. Obtener Datos de Mercado de un Instrumento
```bash
curl -X GET "http://localhost:3000/instruments/47/market-data"
```

## Características de Búsqueda

### Búsqueda Insensible a Mayúsculas
- "YPFD", "ypfd", "Ypfd" devuelven los mismos resultados

### Búsqueda Parcial
- "YP" encontrará "YPFD", "YPF", etc.
- "Banco" encontrará "Banco Frances", "Banco Macro", etc.

### Búsqueda Múltiple
- El parámetro `query` busca tanto en ticker como en nombre
- Los parámetros específicos (`ticker`, `name`, `type`) buscan solo en ese campo

### Paginación
- `limit`: Controla cuántos resultados devolver
- `offset`: Controla desde qué resultado empezar
- Útil para implementar paginación en el frontend

## Códigos de Error

- `200 OK`: Búsqueda exitosa
- `400 Bad Request`: Parámetros inválidos
- `500 Internal Server Error`: Error interno del servidor

## Notas Importantes

1. **Búsqueda flexible**: Soporta búsqueda parcial y múltiples campos
2. **Ordenamiento**: Los resultados se ordenan por ticker por defecto
3. **Límites**: Por defecto devuelve máximo 50 resultados
4. **Datos de mercado**: Solo se incluyen en el endpoint específico
5. **Paginación**: Soporta paginación para grandes volúmenes de datos 