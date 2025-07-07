# Colección de Postman - Exchange API

## 📥 Importar la Colección

### Método 1: Importar desde archivo
1. Abre Postman
2. Haz clic en **"Import"** en la esquina superior izquierda
3. Selecciona **"Upload Files"**
4. Busca y selecciona el archivo `Exchange_API.postman_collection.json`
5. Haz clic en **"Import"**

### Método 2: Importar desde URL
1. Abre Postman
2. Haz clic en **"Import"**
3. Selecciona **"Link"**
4. Pega la URL del archivo JSON (si está en un repositorio)
5. Haz clic en **"Continue"** y luego **"Import"**

## 🔧 Configuración Inicial

### Variables de Entorno
La colección usa variables para facilitar el cambio de configuración:

1. **Crear un Environment en Postman:**
   - Haz clic en el ícono de engranaje (⚙️) en la esquina superior derecha
   - Selecciona **"Add"** para crear un nuevo environment
   - Nombra el environment como **"Exchange API Local"**

2. **Configurar Variables:**
   ```
   Variable: base_url
   Initial Value: http://localhost:3000
   Current Value: http://localhost:3000
   ```

3. **Seleccionar el Environment:**
   - En el dropdown de la esquina superior derecha, selecciona **"Exchange API Local"**

## 🚀 Uso de la Colección

### Estructura de la Colección

#### 1. **Users** - Gestión de Usuarios
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### 2. **Orders** - Gestión de Órdenes
- `GET /orders` - Obtener todas las órdenes
- `GET /orders/:id` - Obtener orden por ID
- `POST /orders` - Crear órdenes (MARKET/LIMIT, BUY/SELL)
- `PUT /orders/:id` - Actualizar orden
- `DELETE /orders/:id` - Eliminar orden

#### 3. **Instruments** - Búsqueda de Instrumentos
- `GET /instruments` - Obtener todos los instrumentos
- `GET /instruments/search` - Buscar instrumentos con filtros
- Búsquedas por: query, ticker, name, type, pagination

#### 4. **Portfolio** - Gestión de Portfolios
- `GET /portfolio/:userId` - Portfolio completo
- `GET /portfolio/:userId/summary` - Resumen del portfolio
- `GET /portfolio/:userId/position/:instrumentId` - Detalles de posición

#### 5. **Health Check**
- `GET /` - Verificar estado de la API

## 📋 Ejemplos de Uso

### 1. Crear un Usuario
```bash
POST {{base_url}}/users
Content-Type: application/json

{
  "email": "nuevo@test.com",
  "accountNumber": "10005"
}
```

### 2. Crear una Orden de Compra
```bash
POST {{base_url}}/orders
Content-Type: application/json

{
  "userId": 1,
  "instrumentId": 47,
  "side": "BUY",
  "type": "MARKET",
  "quantity": 100
}
```

### 3. Buscar Instrumentos
```bash
GET {{base_url}}/instruments/search?q=YPFD
```

### 4. Obtener Portfolio
```bash
GET {{base_url}}/portfolio/1
```

## 🔄 Flujo de Pruebas Recomendado

### 1. Verificar Estado de la API
1. Ejecuta **"Health Check"** para verificar que la API esté funcionando

### 2. Gestión de Usuarios
1. **"Get All Users"** - Ver usuarios existentes
2. **"Create User"** - Crear un nuevo usuario
3. **"Get User by ID"** - Verificar el usuario creado

### 3. Búsqueda de Instrumentos
1. **"Get All Instruments"** - Ver todos los instrumentos
2. **"Search Instruments by Query"** - Buscar por YPFD
3. **"Search Instruments by Type"** - Buscar solo acciones

### 4. Crear Órdenes
1. **"Create Market Buy Order"** - Orden de compra de mercado
2. **"Create Limit Sell Order"** - Orden de venta limitada
3. **"Get All Orders"** - Verificar las órdenes creadas

### 5. Verificar Portfolio
1. **"Get User Portfolio"** - Ver portfolio completo
2. **"Get Portfolio Summary"** - Ver resumen
3. **"Get Position Details"** - Ver detalles de una posición

## 📊 Datos de Prueba Incluidos

### Usuarios de Prueba
- **ID 1**: emiliano@test.com (Cuenta: 10001)
- **ID 2**: jose@test.com (Cuenta: 10002)
- **ID 3**: francisco@test.com (Cuenta: 10003)
- **ID 4**: juan@test.com (Cuenta: 10004)

### Instrumentos Populares
- **ID 47**: YPFD (Y.P.F. S.A.)
- **ID 48**: GGAL (Grupo Galicia)
- **ID 49**: BBAR (Banco Macro)
- **ID 66**: ARS (Pesos Argentinos)

### Órdenes de Ejemplo
- Órdenes de compra y venta ya ejecutadas
- Diferentes tipos: MARKET, LIMIT
- Diferentes estados: FILLED, CANCELLED, PENDING

## 🛠️ Personalización

### Cambiar URL Base
Si tu API está en un puerto diferente:
1. Ve a **"Manage Environments"**
2. Selecciona tu environment
3. Cambia el valor de `base_url` a tu URL

### Agregar Headers Globales
Si necesitas headers adicionales:
1. Selecciona la colección
2. Ve a la pestaña **"Authorization"** o **"Headers"**
3. Agrega headers como `Authorization: Bearer <token>`

### Crear Variables Dinámicas
Para usar IDs dinámicos:
1. En el **"Tests"** tab de una request:
```javascript
pm.test("Save user ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("userId", jsonData.id);
});
```

2. En otras requests usar: `{{userId}}`

## 🔍 Troubleshooting

### Error de Conexión
- Verifica que la API esté corriendo en `http://localhost:3000`
- Asegúrate de que Docker esté ejecutándose
- Verifica que PostgreSQL esté activo

### Error 404
- Verifica que las rutas estén correctas
- Asegúrate de que los IDs existan en la base de datos

### Error 500
- Revisa los logs de la aplicación
- Verifica que la base de datos esté configurada correctamente

## 📝 Notas Importantes

1. **Datos de Prueba**: La colección incluye datos de ejemplo que ya están en la base de datos
2. **IDs Fijos**: Algunos requests usan IDs fijos (1, 47, etc.) que corresponden a datos de prueba
3. **Variables**: Usa las variables de environment para cambiar configuraciones fácilmente
4. **Headers**: Los requests POST/PUT incluyen `Content-Type: application/json`
5. **Respuestas**: Las respuestas se guardan automáticamente en Postman para referencia

## 🎯 Casos de Uso Comunes

### Desarrollo
- Usar para probar nuevos endpoints
- Verificar que las respuestas sean correctas
- Debuggear problemas de API

### Testing
- Crear tests automatizados
- Verificar flujos completos
- Validar regresiones

### Documentación
- Compartir con el equipo
- Documentar la API
- Entrenar nuevos desarrolladores 