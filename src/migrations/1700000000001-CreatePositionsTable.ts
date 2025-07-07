import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePositionsTable1700000000001 implements MigrationInterface {
  name = 'CreatePositionsTable1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla positions
    await queryRunner.query(`
      CREATE TABLE positions (
        id SERIAL PRIMARY KEY,
        userId INT,
        instrumentId INT,
        quantity double precision DEFAULT 0,
        averagePrice NUMERIC(10, 2) DEFAULT 0,
        marketValue NUMERIC(10, 2) DEFAULT 0,
        dailyReturn NUMERIC(10, 2) DEFAULT 0,
        totalReturn NUMERIC(10, 2) DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (instrumentId) REFERENCES instruments(id),
        UNIQUE(userId, instrumentId)
      )
    `);

    // Insertar posiciones iniciales de pesos para los usuarios
    await queryRunner.query(`
      INSERT INTO positions (userId, instrumentId, quantity, averagePrice, marketValue, dailyReturn, totalReturn) VALUES
        (1, 66, 1000000, 1, 1000000, 0, 0),
        (2, 66, 500000, 1, 500000, 0, 0),
        (3, 66, 750000, 1, 750000, 0, 0),
        (4, 66, 250000, 1, 250000, 0, 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE positions`);
  }
} 