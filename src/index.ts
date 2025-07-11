/**
 * Главная точка входа для NestJS модуля спиральной динамики
 * Экспортирует все интерфейсы, типы и NestJS модули
 */

// Экспорт всех типов данных и интерфейсов
export * from './common/interfaces';

// Экспорт NestJS модулей
export * from './modules/spiral-dynamics/spiral-dynamics.module';
export * from './modules/tests/tests.module';
export * from './modules/validation/validation.module';
export * from './app.module';

// Экспорт сервисов
export * from './modules/spiral-dynamics/spiral-dynamics.service';
export * from './modules/spiral-dynamics/spiral-calculator.service';
export * from './modules/tests/tests.service';
export * from './modules/validation/validation.service';

// Экспорт контроллеров
export * from './modules/spiral-dynamics/spiral-dynamics.controller';
export * from './modules/tests/tests.controller';

// Экспорт DTO
export * from './common/dto/calculate-result.dto';

// Экспорт утилит
export { SPIRAL_LEVELS_META } from './types/spiral-levels.enum';

// Удобная функция для быстрого создания сервиса
export function createSpiralDynamicsService(
  testsDirectory?: string,
  calculator?: SpiralCalculator,
  validationConfig?: Partial<import('./types/validation.interface').ValidationConfig>
) {
  const testProvider = new FileSystemTestProvider({
    testsDirectory: testsDirectory || './data/tests'
  });

  const calc = calculator || new SpiralCalculator();

  return new SpiralDynamicsTestService(testProvider, calc, validationConfig);
}

// Экспорт для совместимости
import { SpiralDynamicsTestService } from './services/spiral-dynamics-test.service';
import { FileSystemTestProvider } from './services/test-provider.service';
import { SpiralCalculator } from './services/spiral-calculator.service';

export default {
  SpiralDynamicsTestService,
  FileSystemTestProvider,
  SpiralCalculator,
  createSpiralDynamicsService
};
