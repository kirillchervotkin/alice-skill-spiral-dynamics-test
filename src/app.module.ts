import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IntentMiddleware } from '@kirillchervotkin/alice-nestjs-framework';
import { AliceController } from './alice/alice.controller';
import { SpiralDynamicsService } from './spiral-dynamics/spiral-dynamics.service';
import { QuestionsService } from './spiral-dynamics/questions.service';

@Module({
  imports: [],
  controllers: [AliceController],
  providers: [SpiralDynamicsService, QuestionsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IntentMiddleware)
      .forRoutes('*');
  }
}
