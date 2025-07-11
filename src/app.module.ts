import { Module } from '@nestjs/common';
import { SpiralDynamicsModule } from './modules/spiral-dynamics/spiral-dynamics.module';
import { TestsModule } from './modules/tests/tests.module';
import { ValidationModule } from './modules/validation/validation.module';

@Module({
  imports: [
    SpiralDynamicsModule,
    TestsModule,
    ValidationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
