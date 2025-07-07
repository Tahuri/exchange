# API de Portfolio - Documentación

## Endpoints de Portfolio

### 1. Obtener Portfolio Completo

**GET** `/portfolio/:userId`

Obtiene el portfolio completo de un usuario, incluyendo valor total, pesos disponibles y todas las posiciones con rendimientos.

```bash
curl -X GET "http://localhost:3000/portfolio/1"
```

### 2. Obtener Resumen del Portfolio

**GET** `/portfolio/:userId/summary`

Obtiene un resumen del portfolio sin el detalle de las posiciones.

```bash
curl -X GET "http://localhost:3000/portfolio/1/summary"
```

### 3. Obtener Detalles de una Posición

**GET** `/portfolio/:userId/position/:instrumentId`

Obtiene los detalles de una posición específica del usuario.

```bash
curl -X GET "http://localhost:3000/portfolio/1/position/47"
```

## Respuestas de Ejemplo

### Portfolio Completo
```json
{
  "userId": 1,
  "userEmail": "emiliano@test.com",
  "accountNumber": "10001",
  "totalPortfolioValue": 1050000,
  "availableCash": 953500,
  "totalInvestedValue": 46500,
  "totalReturn": 1500,
  "totalReturnPercentage": 3.23,
  "positions": [
    {
      "id": 2,
      "instrumentId": 47,
      "ticker": "YPFD",
      "name": "Y.P.F. S.A.",
      "type": "ACCIONES",
      "quantity": 50,
      "averagePrice": 930,
      "currentPrice": 945.25,
      "marketValue": 47262.5,
      "totalReturn": 762.5,
      "totalReturnPercentage": 1.64,
      "dailyReturn": 762.5,
      "dailyReturnPercentage": 1.64
    }
  ]
}
```

### Resumen del Portfolio
```json
{
  "userId": 1,
  "userEmail": "emiliano@test.com",
  "accountNumber": "10001",
  "totalPortfolioValue": 1050000,
  "availableCash": 953500,
  "totalInvestedValue": 46500,
  "totalReturn": 1500,
  "totalReturnPercentage": 3.23,
  "positionsCount": 1
}
```

### Detalles de una Posición
```json
{
  "id": 2,
  "instrumentId": 47,
  "ticker": "YPFD",
  "name": "Y.P.F. S.A.",
  "type": "ACCIONES",
  "quantity": 50,
  "averagePrice": 930,
  "currentPrice": 945.25,
  "marketValue": 47262.5,
  "totalReturn": 762.5,
  "totalReturnPercentage": 1.64,
  "dailyReturn": 762.5,
  "dailyReturnPercentage": 1.64
}
```

## Cálculos Realizados

### Valor Total del Portfolio
- **totalPortfolioValue**: Suma del valor de mercado de todas las posiciones + pesos disponibles
- **availableCash**: Cantidad de pesos disponibles para operar
- **totalInvestedValue**: Valor total invertido (cantidad × precio promedio)

### Rendimientos
- **totalReturn**: Ganancia/pérdida total en pesos
- **totalReturnPercentage**: Rendimiento total en porcentaje
- **dailyReturn**: Ganancia/pérdida del día en pesos
- **dailyReturnPercentage**: Rendimiento del día en porcentaje

### Por Posición
- **marketValue**: Valor actual de la posición (cantidad × precio actual)
- **averagePrice**: Precio promedio de compra
- **currentPrice**: Último precio de mercado
- **quantity**: Cantidad de acciones poseídas

## Casos de Uso

### 1. Dashboard Principal
```bash
# Obtener resumen para mostrar en dashboard
curl -X GET "http://localhost:3000/portfolio/1/summary"
```

### 2. Vista Detallada del Portfolio
```bash
# Obtener portfolio completo con todas las posiciones
curl -X GET "http://localhost:3000/portfolio/1"
```

### 3. Análisis de una Posición Específica
```bash
# Obtener detalles de una posición específica
curl -X GET "http://localhost:3000/portfolio/1/position/47"
```

## Características del Portfolio

### Cálculo de Precios
- **Precio actual**: Último precio de cierre del instrumento
- **Precio promedio**: Promedio ponderado de todas las compras
- **Valor de mercado**: Cantidad × precio actual

### Rendimientos
- **Total**: Basado en precio promedio vs precio actual
- **Diario**: Basado en precio anterior vs precio actual
- **Porcentual**: Calculado sobre el valor invertido

### Pesos Disponibles
- Se obtiene de la posición en ARS (instrumentId: 66)
- No se incluye en el cálculo de rendimientos
- Se suma al valor total del portfolio

## Códigos de Error

- `200 OK`: Portfolio obtenido exitosamente
- `404 Not Found`: Usuario no encontrado
- `500 Internal Server Error`: Error interno del servidor

## Notas Importantes

1. **Precios actualizados**: Los precios se obtienen del último dato de mercado disponible
2. **Rendimientos reales**: Se calculan basándose en precios reales de mercado
3. **Pesos disponibles**: Se obtienen de la posición en ARS (instrumentId: 66)
4. **Posiciones vacías**: Solo se incluyen posiciones con cantidad > 0
5. **Cálculos precisos**: Todos los cálculos se realizan con precisión decimal 