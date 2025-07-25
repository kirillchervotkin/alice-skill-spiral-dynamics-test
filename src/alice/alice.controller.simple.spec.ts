import { Test, TestingModule } from '@nestjs/testing';
import { AliceController } from './alice.controller';
import { SpiralDynamicsService } from '../spiral-dynamics/spiral-dynamics.service';
import { QuestionsService } from '../spiral-dynamics/questions.service';

describe('AliceController (Simple Tests)', () => {
  let controller: AliceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliceController],
      providers: [SpiralDynamicsService, QuestionsService],
    }).compile();

    controller = module.get<AliceController>(AliceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Basic functionality', () => {
    it('should return welcome message', () => {
      const response = controller.unknownHandler({});
      
      expect(response).toBeDefined();
      expect(response.response).toBeDefined();
      expect(response.response.text).toContain('Привет!');
      expect(response.response.text).toContain('Спиральной динамики');
      expect(response.response.end_session).toBe(false);
    });

    it('should return help message', () => {
      const response = controller.help();
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Тест покажет');
      expect(response.response.text).toContain('выживание, традиции, власть');
    });

    it('should handle agreement to start', () => {
      const response = controller.agreeToStart({ state: 'welcome' });

      expect(response).toBeDefined();
      expect(response.response.text).toContain('Отлично! Начнём!');
      expect(response.response.text).toContain('Вопрос 1 из 24');
    });

    it('should handle refusal', () => {
      const response = controller.exit({ state: 'welcome' });

      expect(response).toBeDefined();
      expect(response.response.text).toBe('Всегда рада помочь. Обращайтесь!');
      expect(response.response.end_session).toBe(true);
    });

    it('should handle exit', () => {
      const response = controller.exitSkill();
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('До свидания!');
      expect(response.response.end_session).toBe(true);
    });

    it('should handle restart', () => {
      const response = controller.restart();
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Привет!');
    });
  });

  describe('Answer handling', () => {
    const mockSessionData = {
      currentQuestion: 1,
      answers: [],
      state: 'testing' as const
    };

    // Правильная структура данных для Яндекс.Диалогов
    const mockAliceData = {
      state: {
        session: {
          data: mockSessionData
        }
      }
    };

    it('should handle yes answer', () => {
      const response = controller.answerYes(mockSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle no answer', () => {
      const response = controller.answerNo(mockSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle unsure answer', () => {
      const response = controller.answerUnsure(mockSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle repeat question', () => {
      const response = controller.repeatQuestion(mockSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 1 из 24');
    });
  });

  describe('Test completion', () => {
    const mockSessionDataLastQuestion = {
      currentQuestion: 24,
      answers: Array.from({ length: 23 }, (_, i) => ({
        questionId: i + 1,
        score: 1
      })),
      state: 'testing' as const
    };

    // Правильная структура данных для Яндекс.Диалогов
    const mockAliceDataLastQuestion = {
      state: {
        session: {
          data: mockSessionDataLastQuestion
        }
      }
    };

    it('should show results after last question', () => {
      const response = controller.answerYes(mockSessionDataLastQuestion);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Спасибо за ответы!');
      expect(response.response.text).toContain('ТОП-3 уровня ценностей');
    });
  });

  describe('Results navigation', () => {
    const mockResultsData = {
      results: {
        top3: [{
          level: 'yellow' as any,
          name: 'Интегральный',
          fullName: 'Интегральный (Желтый)',
          score: 6,
          interpretation: 'Доминирующий уровень'
        }],
        allScores: {} as any
      },
      state: 'results' as const
    };

    it('should handle describe level', () => {
      const response = controller.describeLevel(mockResultsData);

      expect(response).toBeDefined();
      expect(response.response.text).toContain('Подробнее о вашем доминирующем уровне');
    });

    it('should handle repeat results', () => {
      const response = controller.repeatResults(mockResultsData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('ТОП-3 уровня ценностей');
    });

    it('should handle send results', () => {
      const response = controller.sendResults(mockResultsData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('функция отправки пока не реализована');
    });
  });

  describe('Pause functionality', () => {
    const mockPausedData = {
      currentQuestion: 10,
      answers: Array.from({ length: 9 }, (_, i) => ({
        questionId: i + 1,
        score: 1
      })),
      state: 'testing' as const
    };

    it('should handle pause', () => {
      const response = controller.pauseTest(mockPausedData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Тест приостановлен');
      expect(response.response.text).toContain('вопросе 10 из 24');
    });

    it('should handle continue after pause', () => {
      const pausedSessionData = {
        ...mockPausedData,
        state: 'paused' as const
      };
      
      const response = controller.continueTest(pausedSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Продолжаем!');
      expect(response.response.text).toContain('Вопрос 10 из 24');
    });
  });

  describe('Error handling', () => {
    const mockTestingData = {
      currentQuestion: 5,
      answers: [],
      state: 'testing' as const
    };

    it('should handle error during testing', () => {
      const response = controller.handleError(mockTestingData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Извини, не поняла ответ');
      expect(response.response.text).toContain('ДА, НЕТ или НЕ УВЕРЕН');
    });

    it('should handle error in other states', () => {
      const response = controller.handleError({ state: 'welcome' as const });
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Извини, не поняла');
    });
  });
});
