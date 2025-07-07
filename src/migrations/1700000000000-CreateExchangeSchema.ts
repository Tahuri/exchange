import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExchangeSchema1700000000000 implements MigrationInterface {
  name = 'CreateExchangeSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla users
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        accountNumber VARCHAR(20)
      )
    `);

    // Crear tabla instruments
    await queryRunner.query(`
      CREATE TABLE instruments (
        id SERIAL PRIMARY KEY,
        ticker VARCHAR(10),
        name VARCHAR(255),
        type VARCHAR(10)
      )
    `);

    // Crear tabla orders
    await queryRunner.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        instrumentId INT,
        userId INT,
        size INT,
        price NUMERIC(10, 2),
        type VARCHAR(10),
        side VARCHAR(10),
        status VARCHAR(20),
        datetime TIMESTAMP,
        FOREIGN KEY (instrumentId) REFERENCES instruments(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Crear tabla marketdata
    await queryRunner.query(`
      CREATE TABLE marketdata (
        id SERIAL PRIMARY KEY,
        instrumentId INT,
        high NUMERIC(10, 2),
        low NUMERIC(10, 2),
        open NUMERIC(10, 2),
        close NUMERIC(10, 2),
        previousClose NUMERIC(10, 2),
        date DATE,
        FOREIGN KEY (instrumentId) REFERENCES instruments(id)
      )
    `);

    // Insertar datos de usuarios
    await queryRunner.query(`
      INSERT INTO users (email, accountNumber) VALUES
        ('emiliano@test.com', '10001'),
        ('jose@test.com', '10002'),
        ('francisco@test.com', '10003'),
        ('juan@test.com', '10004')
    `);

    // Insertar datos de instrumentos
    await queryRunner.query(`
      INSERT INTO instruments (ticker, name, type) VALUES
        ('DYCA', 'Dycasa S.A.', 'ACCIONES'),
        ('CAPX', 'Capex S.A.', 'ACCIONES'),
        ('PGR', 'Phoenix Global Resources', 'ACCIONES'),
        ('MOLA', 'Molinos Agro S.A.', 'ACCIONES'),
        ('MIRG', 'Mirgor', 'ACCIONES'),
        ('PATA', 'Importadora y Exportadora de la Patagonia', 'ACCIONES'),
        ('TECO2', 'Telecom', 'ACCIONES'),
        ('FERR', 'Ferrum S.A.', 'ACCIONES'),
        ('SAMI', 'S.A San Miguel', 'ACCIONES'),
        ('IRCP', 'IRSA Propiedades Comerciales S.A.', 'ACCIONES'),
        ('GAMI', 'Boldt Gaming S.A.', 'ACCIONES'),
        ('DOME', 'Domec', 'ACCIONES'),
        ('INTR', 'Compañía Introductora de Buenos Aires S.A.', 'ACCIONES'),
        ('MTR', 'Matba Rofex S.A.', 'ACCIONES'),
        ('FIPL', 'Fiplasto', 'ACCIONES'),
        ('GARO', 'Garovaglio Y Zorraquín', 'ACCIONES'),
        ('SEMI', 'Molinos Juan Semino', 'ACCIONES'),
        ('HARG', 'Holcim (Argentina) S.A.', 'ACCIONES'),
        ('BPAT', 'Banco Patagonia', 'ACCIONES'),
        ('RIGO', 'Rigolleau S.A.', 'ACCIONES'),
        ('CVH', 'Cablevision Holding', 'ACCIONES'),
        ('BBAR', 'Banco Frances', 'ACCIONES'),
        ('LEDE', 'Ledesma', 'ACCIONES'),
        ('CELU', 'Celulosa Argentina S.A.', 'ACCIONES'),
        ('CECO2', 'Central Costanera', 'ACCIONES'),
        ('AGRO', 'Agrometal', 'ACCIONES'),
        ('AUSO', 'Autopistas del Sol', 'ACCIONES'),
        ('BHIP', 'Banco Hipotecario S.A.', 'ACCIONES'),
        ('BOLT', 'Boldt S.A.', 'ACCIONES'),
        ('CARC', 'Carboclor S.A.', 'ACCIONES'),
        ('BMA', 'Banco Macro S.A.', 'ACCIONES'),
        ('CRES', 'Cresud S.A.', 'ACCIONES'),
        ('EDN', 'Edenor S.A.', 'ACCIONES'),
        ('GGAL', 'Grupo Financiero Galicia', 'ACCIONES'),
        ('DGCU2', 'Distribuidora De Gas Cuyano S.A.', 'ACCIONES'),
        ('GBAN', 'Gas Natural Ban S.A.', 'ACCIONES'),
        ('CGPA2', 'Camuzzi Gas del Sur', 'ACCIONES'),
        ('CADO', 'Carlos Casado', 'ACCIONES'),
        ('GCLA', 'Grupo Clarin S.A.', 'ACCIONES'),
        ('GRIM', 'Grimoldi', 'ACCIONES'),
        ('RICH', 'Laboratorios Richmond', 'ACCIONES'),
        ('MOLI', 'Molinos Río de la Plata', 'ACCIONES'),
        ('VALO', 'BCO DE VALORES ACCIONES ORD.', 'ACCIONES'),
        ('TGNO4', 'Transportadora de Gas del Norte', 'ACCIONES'),
        ('LOMA', 'Loma Negra S.A.', 'ACCIONES'),
        ('IRSA', 'IRSA Inversiones y Representaciones S.A.', 'ACCIONES'),
        ('PAMP', 'Pampa Holding S.A.', 'ACCIONES'),
        ('TGSU2', 'Transportadora de Gas del Sur', 'ACCIONES'),
        ('TXAR', 'Ternium Argentina S.A', 'ACCIONES'),
        ('YPFD', 'Y.P.F. S.A.', 'ACCIONES'),
        ('MORI', 'Morixe Hermanos S.A.C.I.', 'ACCIONES'),
        ('INVJ', 'Inversora Juramento S.A.', 'ACCIONES'),
        ('POLL', 'Polledo S.A.', 'ACCIONES'),
        ('METR', 'MetroGAS S.A.', 'ACCIONES'),
        ('LONG', 'Longvie', 'ACCIONES'),
        ('SUPV', 'Grupo Supervielle S.A.', 'ACCIONES'),
        ('ROSE', 'Instituto Rosenbusch', 'ACCIONES'),
        ('OEST', 'Oeste Grupo Concesionario', 'ACCIONES'),
        ('COME', 'Sociedad Comercial Del Plata', 'ACCIONES'),
        ('CEPU', 'Central Puerto', 'ACCIONES'),
        ('ALUA', 'Aluar Aluminio Argentino S.A.I.C.', 'ACCIONES'),
        ('CTIO', 'Consultatio S.A.', 'ACCIONES'),
        ('TRAN', 'Transener S.A.', 'ACCIONES'),
        ('HAVA', 'Havanna Holding', 'ACCIONES'),
        ('BYMA', 'Bolsas y Mercados Argentinos S.A.', 'ACCIONES'),
        ('ARS', 'PESOS', 'MONEDA')
    `);

    // Insertar datos de marketdata (solo algunos ejemplos para no hacer la migración muy larga)
    await queryRunner.query(`
      INSERT INTO marketdata (instrumentId, date, open, high, low, close, previousClose) VALUES
        (12, '2023-07-13', NULL, NULL, NULL, 20.50000000, 20.50000000),
        (35, '2023-07-13', 337.50000000, 342.50000000, 328.50000000, 341.50000000, 335.00000000),
        (54, '2023-07-13', 232.00000000, 232.00000000, 222.50000000, 232.00000000, 229.00000000),
        (51, '2023-07-13', 35.90000000, 36.55000000, 35.75000000, 35.95000000, 35.90000000),
        (52, '2023-07-13', 105.00000000, 105.00000000, 98.50000000, 99.70000000, 103.00000000),
        (60, '2023-07-13', 358.00000000, 365.95000000, 354.45000000, 364.80000000, 353.45000000),
        (31, '2023-07-13', 1425.00000000, 1541.00000000, 1415.00000000, 1520.25000000, 1413.50000000),
        (40, '2023-07-13', 400.00000000, 400.00000000, 395.00000000, 397.50000000, 400.00000000),
        (4, '2023-07-13', 6940.00000000, 7044.00000000, 6561.00000000, 6621.50000000, 6659.50000000),
        (37, '2023-07-13', 407.00000000, 409.00000000, 388.50000000, 400.50000000, 408.00000000)
    `);

    // Insertar datos de orders (solo algunos ejemplos)
    await queryRunner.query(`
      INSERT INTO orders (instrumentId, userId, size, price, side, status, type, datetime) VALUES
        (66, 1, 1000000, 1, 'CASH_IN', 'FILLED', 'MARKET', '2023-07-12 12:11:20'),
        (47, 1, 50, 930, 'BUY', 'FILLED', 'MARKET', '2023-07-12 12:31:20'),
        (47, 1, 50, 920, 'BUY', 'CANCELLED', 'LIMIT', '2023-07-12 14:21:20'),
        (47, 1, 10, 940, 'SELL', 'FILLED', 'MARKET', '2023-07-12 14:51:20'),
        (45, 1, 50, 710, 'BUY', 'NEW', 'LIMIT', '2023-07-12 15:14:20'),
        (47, 1, 100, 950, 'SELL', 'REJECTED', 'MARKET', '2023-07-12 16:11:20'),
        (31, 1, 60, 1500, 'BUY', 'NEW', 'LIMIT', '2023-07-13 11:13:20'),
        (66, 1, 100000, 1, 'CASH_OUT', 'FILLED', 'MARKET', '2023-07-13 12:31:20'),
        (31, 1, 20, 1540, 'BUY', 'FILLED', 'LIMIT', '2023-07-13 12:51:20'),
        (54, 1, 500, 250, 'BUY', 'FILLED', 'MARKET', '2023-07-13 14:11:20'),
        (31, 1, 30, 1530, 'SELL', 'FILLED', 'MARKET', '2023-07-13 15:13:20')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tablas en orden inverso debido a las foreign keys
    await queryRunner.query(`DROP TABLE marketdata`);
    await queryRunner.query(`DROP TABLE orders`);
    await queryRunner.query(`DROP TABLE instruments`);
    await queryRunner.query(`DROP TABLE users`);
  }
} 