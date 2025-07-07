# API de Trading - Documentación

## Endpoints de Órdenes

### 1. Crear Orden

**POST** `/orders`

Crea una nueva orden de compra, venta o transferencia.

#### Parámetros del body:

```json
{
  "userId": 1,
  "instrumentId": 47,
  "size": 100,
  "type": "MARKET",
  "side": "BUY"
}
```

#### Ejemplos de uso:

**Orden de compra por cantidad (MARKET):**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "size": 50,
    "type": "MARKET",
    "side": "BUY"
  }'
```

**Orden de compra por monto (MARKET):**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "amount": 50000,
    "type": "MARKET",
    "side": "BUY"
  }'
```

**Orden límite (requiere precio):**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "size": 100,
    "price": 950,
    "type": "LIMIT",
    "side": "BUY"
  }'
```

**Orden límite por monto:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "amount": 50000,
    "price": 950,
    "type": "LIMIT",
    "side": "BUY"
  }'
```

**Transferencia entrante:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 66,
    "size": 100000,
    "type": "MARKET",
    "side": "CASH_IN"
  }'
```

### 2. Cancelar Orden

**DELETE** `/orders/:id`

Cancela una orden con estado NEW.

```bash
curl -X DELETE http://localhost:3000/orders/123 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }'
```

### 3. Obtener Órdenes del Usuario

**GET** `/orders/user/:userId`

Obtiene todas las órdenes de un usuario.

```bash
curl -X GET http://localhost:3000/orders/user/1
```

### 4. Obtener Órdenes Pendientes del Usuario

**GET** `/orders/user/:userId/pending`

Obtiene solo las órdenes pendientes (NEW) de un usuario.

```bash
curl -X GET http://localhost:3000/orders/user/1/pending
```

### 5. Obtener Posiciones del Usuario

**GET** `/orders/positions/:userId`

Obtiene todas las posiciones de un usuario.

```bash
curl -X GET http://localhost:3000/orders/positions/1
```

## Tipos de Órdenes

### MARKET
- Se ejecutan inmediatamente al precio de mercado (precio de cierre)
- Estado: FILLED
- No requiere precio específico
- Se valida disponibilidad de fondos/acciones antes de ejecutar
- Actualiza posiciones inmediatamente

### LIMIT
- Se envían al mercado con un precio específico
- Estado: NEW (queda pendiente de ejecución)
- **Requiere precio específico obligatorio**
- No se valida disponibilidad de fondos/acciones al crear
- No actualiza posiciones hasta que se ejecute
- Solo se pueden cancelar órdenes con estado NEW

## Estados de Órdenes

- **NEW**: Orden límite enviada al mercado (pendiente de ejecución)
- **FILLED**: Orden ejecutada
- **REJECTED**: Orden rechazada (fondos insuficientes - solo MARKET)
- **CANCELLED**: Orden cancelada por el usuario

## Tipos de Operaciones

### BUY (Compra)
- **MARKET**: Requiere fondos suficientes en pesos, se ejecuta inmediatamente
- **LIMIT**: No valida fondos al crear, queda pendiente de ejecución

### SELL (Venta)
- **MARKET**: Requiere cantidad suficiente del instrumento, se ejecuta inmediatamente
- **LIMIT**: No valida cantidad al crear, queda pendiente de ejecución

### CASH_IN (Transferencia entrante)
- Aumenta saldo en pesos
- instrumentId debe ser 66 (ARS)
- Se ejecuta inmediatamente

### CASH_OUT (Transferencia saliente)
- Disminuye saldo en pesos
- instrumentId debe ser 66 (ARS)
- Se ejecuta inmediatamente

## Validaciones

### Órdenes MARKET
- Valida fondos/acciones disponibles antes de ejecutar
- Si no hay fondos suficientes, la orden se rechaza (REJECTED)

### Órdenes LIMIT
- **No valida fondos/acciones al crear**
- Requiere precio obligatorio
- Se guarda con estado NEW
- La validación se hará cuando se ejecute la orden

### Fondos Insuficientes (solo MARKET)
Si un usuario intenta comprar por un monto mayor al disponible:
```json
{
  "id": 123,
  "userId": 1,
  "instrumentId": 47,
  "size": 1000,
  "price": 950,
  "type": "MARKET",
  "side": "BUY",
  "status": "REJECTED",
  "datetime": "2024-01-15T10:30:00.000Z"
}
```

### Acciones Insuficientes (solo MARKET)
Si un usuario intenta vender más acciones de las que tiene:
```json
{
  "id": 124,
  "userId": 1,
  "instrumentId": 47,
  "size": 1000,
  "price": 950,
  "type": "MARKET",
  "side": "SELL",
  "status": "REJECTED",
  "datetime": "2024-01-15T10:30:00.000Z"
}
```

## Respuestas de Ejemplo

### Orden MARKET Creada Exitosamente
```json
{
  "id": 125,
  "userId": 1,
  "instrumentId": 47,
  "size": 50,
  "price": 930,
  "type": "MARKET",
  "side": "BUY",
  "status": "FILLED",
  "datetime": "2024-01-15T10:30:00.000Z"
}
```

### Orden LIMIT Creada Exitosamente
```json
{
  "id": 126,
  "userId": 1,
  "instrumentId": 47,
  "size": 100,
  "price": 950,
  "type": "LIMIT",
  "side": "BUY",
  "status": "NEW",
  "datetime": "2024-01-15T10:30:00.000Z"
}
```

### Posiciones del Usuario
```json
[
  {
    "id": 1,
    "userId": 1,
    "instrumentId": 66,
    "quantity": 953500,
    "averagePrice": 1,
    "marketValue": 953500,
    "dailyReturn": 0,
    "totalReturn": 0,
    "instrument": {
      "id": 66,
      "ticker": "ARS",
      "name": "PESOS",
      "type": "MONEDA"
    }
  },
  {
    "id": 2,
    "userId": 1,
    "instrumentId": 47,
    "quantity": 50,
    "averagePrice": 930,
    "marketValue": 46500,
    "dailyReturn": 0,
    "totalReturn": 0,
    "instrument": {
      "id": 47,
      "ticker": "YPFD",
      "name": "Y.P.F. S.A.",
      "type": "ACCIONES"
    }
  }
]
```

## Códigos de Error

- `400 Bad Request`: Datos inválidos o validaciones fallidas
- `404 Not Found`: Usuario o instrumento no encontrado
- `500 Internal Server Error`: Error interno del servidor

## Notas Importantes

1. **Precios en pesos**: Todos los precios están en pesos argentinos
2. **Sin fracciones**: No se permiten fracciones de acciones
3. **Transacciones atómicas**: Las actualizaciones de posiciones son atómicas
4. **Precio de mercado**: Las órdenes MARKET usan el último precio de cierre
5. **Validación diferida**: Las órdenes LIMIT no validan fondos al crear, solo al ejecutar
6. **Órdenes pendientes**: Las órdenes LIMIT quedan con estado NEW hasta que se ejecuten
7. **Cancelación**: Solo se pueden cancelar órdenes con estado NEW 