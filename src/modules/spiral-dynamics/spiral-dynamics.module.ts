import { Module } from '@nestjs/common';
import { SpiralDynamicsController } from './spiral-dynamics.controller';
import { SpiralDynamicsService } from './spiral-dynamics.service';
import { SpiralCalculatorService } from './spiral-calculator.service';
import { TestsModule } from '../tests/tests.module';
import { ValidationModule } from '../validation/validation.module';

@Module({
  imports: [TestsModule, ValidationModule],
  controllers: [SpiralDynamicsController],
  providers: [SpiralDynamicsService, SpiralCalculatorService],
  exports: [SpiralDynamicsService, SpiralCalculatorService],
})
export class SpiralDynamicsModule {}
