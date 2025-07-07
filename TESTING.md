# Testing Documentation

Este documento describe la estructura y ejecución de los tests unitarios del sistema de exchange.

## Estructura de Tests

Los tests están organizados por módulos siguiendo la estructura del proyecto:

```
src/
├── users/
│   ├── users.service.spec.ts
│   └── users.controller.spec.ts
├── instruments/
│   ├── instruments.service.spec.ts
│   └── instruments.controller.spec.ts
├── orders/
│   ├── orders.service.spec.ts
│   └── orders.controller.spec.ts
├── portfolio/
│   ├── portfolio.service.spec.ts
│   └── portfolio.controller.spec.ts
└── test/
    └── setup.ts
```

## Comandos de Testing

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:cov
```

### Ejecutar tests específicos
```bash
npm test -- --testNamePattern="UsersService"
```

## Cobertura de Tests

### Users Module
- **UsersService**: Tests completos para CRUD operations
- **UsersController**: Tests para todos los endpoints

### Instruments Module
- **InstrumentsService**: Tests para búsqueda, filtrado y operaciones CRUD
- **InstrumentsController**: Tests para todos los endpoints de instrumentos

### Orders Module
- **OrdersService**: Tests para creación de órdenes, validaciones y gestión de posiciones
- **OrdersController**: Tests para todos los endpoints de órdenes

### Portfolio Module
- **PortfolioService**: Tests para cálculos de portfolio, posiciones y rendimientos
- **PortfolioController**: Tests para todos los endpoints de portfolio

## Casos de Prueba Cubiertos

### Users
- ✅ Crear usuario
- ✅ Obtener todos los usuarios
- ✅ Obtener usuario por ID
- ✅ Actualizar usuario
- ✅ Eliminar usuario
- ✅ Manejo de errores

### Instruments
- ✅ Obtener todos los instrumentos
- ✅ Buscar instrumentos por query
- ✅ Buscar por ticker
- ✅ Buscar por nombre
- ✅ Buscar por tipo
- ✅ Obtener instrumento con datos de mercado
- ✅ Obtener instrumentos populares
- ✅ Manejo de errores

### Orders
- ✅ Crear orden de mercado (BUY/SELL)
- ✅ Crear orden limit (BUY/SELL)
- ✅ Crear transferencias (CASH_IN/CASH_OUT)
- ✅ Validar fondos/acciones disponibles
- ✅ Calcular cantidad desde monto
- ✅ Obtener órdenes del usuario
- ✅ Obtener órdenes pendientes
- ✅ Cancelar órdenes
- ✅ Obtener posiciones del usuario
- ✅ Manejo de errores y validaciones

### Portfolio
- ✅ Obtener portfolio completo del usuario
- ✅ Calcular valor total del portfolio
- ✅ Calcular efectivo disponible
- ✅ Calcular rendimientos totales y diarios
- ✅ Obtener resumen del portfolio
- ✅ Obtener detalles de posición específica
- ✅ Manejo de usuarios sin posiciones
- ✅ Manejo de datos de mercado faltantes

## Configuración de Tests

### Jest Configuration
Los tests están configurados en `jest.config.js` con:
- Soporte para TypeScript
- Cobertura de código
- Mapeo de módulos
- Configuración de entorno

### Setup Global
El archivo `src/test/setup.ts` contiene la configuración global para todos los tests.

## Mocking Strategy

### Repositories
Todos los repositorios están mockeados para evitar dependencias de base de datos:
```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

### Services
Los servicios dependientes están mockeados en los tests de controladores:
```typescript
const mockService = {
  methodName: jest.fn(),
};
```

## Patrones de Testing

### Arrange-Act-Assert
Todos los tests siguen el patrón AAA:
```typescript
describe('methodName', () => {
  it('should do something', async () => {
    // Arrange
    const input = {...};
    mockService.method.mockResolvedValue(expectedOutput);
    
    // Act
    const result = await service.method(input);
    
    // Assert
    expect(result).toEqual(expectedOutput);
    expect(mockService.method).toHaveBeenCalledWith(input);
  });
});
```

### Error Handling
Todos los tests incluyen casos para manejo de errores:
```typescript
it('should handle service errors', async () => {
  const error = new Error('Service error');
  mockService.method.mockRejectedValue(error);
  
  await expect(service.method(input)).rejects.toThrow('Service error');
});
```

## Métricas de Calidad

### Cobertura Mínima
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Tipos de Tests
- **Unit Tests**: Para servicios y controladores individuales
- **Integration Tests**: Para flujos completos (futuro)

## Mejores Prácticas

1. **Nombres descriptivos**: Los tests tienen nombres claros que describen el comportamiento
2. **Tests aislados**: Cada test es independiente y no depende de otros
3. **Mocks consistentes**: Los mocks se reutilizan y son consistentes
4. **Cleanup**: Se limpian los mocks después de cada test
5. **Error scenarios**: Se prueban tanto casos exitosos como de error

## Ejecución Continua

Los tests se ejecutan automáticamente en:
- Pre-commit hooks (configurar)
- CI/CD pipeline (configurar)

## Troubleshooting

### Problemas Comunes

1. **Tests fallando por dependencias**: Verificar que todos los mocks estén configurados
2. **Timeout en tests**: Aumentar el timeout en Jest si es necesario
3. **Cobertura baja**: Agregar más casos de prueba para métodos no cubiertos

### Debugging
```bash
# Ejecutar tests con debug
npm run test:debug

# Ejecutar test específico con verbose
npm test -- --verbose --testNamePattern="specific test name"
``` 