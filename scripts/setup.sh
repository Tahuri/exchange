#!/bin/bash

echo "🚀 Configurando proyecto Exchange API..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "✅ Archivo .env creado. Revisa y ajusta las variables según necesites."
else
    echo "✅ Archivo .env ya existe."
fi

# Levantar PostgreSQL
echo "🐘 Levantando PostgreSQL con Docker..."
docker compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Verificar conexión a la base de datos
echo "🔍 Verificando conexión a la base de datos..."
docker compose exec postgres pg_isready -U exchange_user -d exchange_db

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL está listo!"
else
    echo "❌ Error conectando a PostgreSQL. Revisa los logs con: docker-compose logs postgres"
    exit 1
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "  npm run start:dev"
echo ""
echo "Para ver los logs de PostgreSQL:"
echo "  docker-compose logs postgres"
echo ""
echo "Para detener PostgreSQL:"
echo "  docker-compose down" 