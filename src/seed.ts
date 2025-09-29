import { DataSource } from 'typeorm';
import { ImcEntity } from './imc/entities/imc.entity'; // Ajusta la ruta según tu entity
import { config } from 'dotenv';

// Load environment variables
config({ path:'.env'});

const databaseConfig = {
  url: process.env.DB_URL
}

// Configuración de TypeORM
const AppDataSource = new DataSource({
  type: 'mongodb',
  ...databaseConfig,
  entities: [ImcEntity],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Base de datos conectada');

    const imcRepository = AppDataSource.getRepository(ImcEntity);

    // Generar 100 datos de prueba aleatorios
    const datosPrueba = Array.from({ length: 100 }, () => {
      const altura = +(Math.random() * (3.00 - 0.01)+ 0.01).toFixed(2); // entre 1.50 y 1.90
      const peso = +(Math.random() * (500.00 - 0.01)+ 0.01).toFixed(1);        // entre 45 y 110
      return { altura, peso };
    });

    for (const dato of datosPrueba) {
      // Calcular IMC
      const imcValue = dato.peso / (dato.altura * dato.altura);

      // Determinar categoría
      const categoria =
        imcValue < 18.5 ? 'Bajo peso' :
        imcValue < 25   ? 'Normal' :
        imcValue < 30   ? 'Sobrepeso' :
                          'Obeso';

      // Crear entidad con todos los campos obligatorios
      const imcEntity = imcRepository.create({
        ...dato,
        imc: parseFloat(imcValue.toFixed(2)), // redondea a 2 decimales
        categoria,
        fecha: new Date(),
      });

      await imcRepository.save(imcEntity);
    }

    console.log('100 datos de prueba insertados correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Ejecutar el seed
seed();

// npx ts-node src/seed.ts

