import { DataSource } from 'typeorm';
import { ImcEntity } from './imc/entities/imc.entity'; // Ajusta la ruta según tu entity
import { isDevelopment } from './utils/env-checker';
import { config } from 'dotenv';

// Load environment variables
config();

const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || 'imc_db',
}

// Configuración de TypeORM
const AppDataSource = new DataSource({
  type: 'mysql',
  ...databaseConfig,
  entities: [ImcEntity],
  synchronize: isDevelopment(),
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Base de datos conectada');

    const imcRepository = AppDataSource.getRepository(ImcEntity);

    // Datos de prueba
    const datosPrueba = [
      { nombre: 'Juan', altura: 1.75, peso: 70 },
      { nombre: 'Ana', altura: 1.60, peso: 55 },
      { nombre: 'Carlos', altura: 1.82, peso: 90 },
      { nombre: 'Lucía', altura: 1.68, peso: 65 },
      { nombre: 'Marcos', altura: 1.70, peso: 50 },
      { nombre: 'Sofía', altura: 1.55, peso: 48 },
      { nombre: 'Diego', altura: 1.90, peso: 110 },
      { nombre: 'Valentina', altura: 1.62, peso: 75 },
      { nombre: 'Ricardo', altura: 1.78, peso: 85 },
      { nombre: 'Camila', altura: 1.65, peso: 60 },
      { nombre: 'Fernando', altura: 1.72, peso: 95 },
      { nombre: 'Marta', altura: 1.58, peso: 53 },
    ];

    for (const dato of datosPrueba) {
      // Calcular IMC
      const imcValue = dato.peso / (dato.altura * dato.altura);

      // Determinar categoría
      const categoria =
        imcValue < 18.5 ? 'Bajo peso' :
          imcValue < 25 ? 'Normal' :
            imcValue < 30 ? 'Sobrepeso' :
              'Obesidad';

      // Crear entidad con todos los campos obligatorios
      const imcEntity = imcRepository.create({
        ...dato,
        imc: parseFloat(imcValue.toFixed(2)), // opcional: redondea a 2 decimales
        categoria,
        fecha: new Date(),
      });

      await imcRepository.save(imcEntity);
    }

    console.log('Datos de prueba insertados correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Ejecutar el seed
seed();

// npx ts-node src/seed.ts