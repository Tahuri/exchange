#!/bin/bash

echo "🚀 Ejecutando migración del esquema de Exchange..."

# Verificar si PostgreSQL está corriendo
echo "🔍 Verificando conexión a PostgreSQL..."
docker compose exec postgres pg_isready -U exchange_user -d exchange_db

if [ $? -ne 0 ]; then
    echo "❌ PostgreSQL no está disponible. Iniciando PostgreSQL..."
    docker compose up -d postgres
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 10
fi

# Ejecutar la migración
echo "📊 Ejecutando migración..."
npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migración ejecutada exitosamente!"
    echo ""
    echo "📋 Resumen de lo que se creó:"
    echo "   - Tabla 'users' con 4 usuarios de ejemplo"
    echo "   - Tabla 'instruments' con 66 instrumentos financieros"
    echo "   - Tabla 'orders' con 11 órdenes de ejemplo"
    echo "   - Tabla 'marketdata' con datos de mercado de ejemplo"
    echo ""
    echo "🌐 Para probar la API:"
    echo "   curl http://localhost:3000/users"
    echo ""
    echo "💾 Para ver los datos en PostgreSQL:"
    echo "   docker-compose exec postgres psql -U exchange_user -d exchange_db -c 'SELECT * FROM users;'"
else
    echo "❌ Error ejecutando la migración. Revisa los logs."
    exit 1
fi 