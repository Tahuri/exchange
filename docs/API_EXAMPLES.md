# Ejemplos de uso de la API

## Endpoints disponibles

### Usuarios

#### Crear un usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "password": "password123"
  }'
```

#### Obtener todos los usuarios
```bash
curl -X GET http://localhost:3000/users
```

#### Obtener un usuario por ID
```bash
curl -X GET http://localhost:3000/users/{id}
```

#### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/users/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan Carlos",
    "lastName": "Pérez García"
  }'
```

#### Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/users/{id}
```

## Ejemplos con JavaScript/TypeScript

### Usando fetch
```javascript
// Crear usuario
const createUser = async (userData) => {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Obtener usuarios
const getUsers = async () => {
  const response = await fetch('http://localhost:3000/users');
  return response.json();
};

// Ejemplo de uso
const newUser = await createUser({
  email: 'usuario@ejemplo.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  password: 'password123'
});

const users = await getUsers();
console.log(users);
```

### Usando axios
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Crear usuario
const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

// Obtener usuarios
const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

// Actualizar usuario
const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
};

// Eliminar usuario
const deleteUser = async (id) => {
  await axios.delete(`${API_BASE_URL}/users/${id}`);
};
```

## Respuestas de ejemplo

### Crear usuario (POST /users)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Lista de usuarios (GET /users)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "otro@ejemplo.com",
    "firstName": "María",
    "lastName": "García",
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

## Códigos de estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Recurso eliminado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor 