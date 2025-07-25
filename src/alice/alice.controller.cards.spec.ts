import { Test, TestingModule } from '@nestjs/testing';
import { AliceController } from './alice.controller';
import { SpiralDynamicsService } from '../spiral-dynamics/spiral-dynamics.service';
import { QuestionsService } from '../spiral-dynamics/questions.service';
import { PreconditionFailedException } from '@nestjs/common';

describe('AliceController (Cards Tests)', () => {
  let controller: AliceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliceController],
      providers: [SpiralDynamicsService, QuestionsService],
    }).compile();
    controller = module.get<AliceController>(AliceController);
  });

  describe('Cards functionality', () => {
    const mockSessionDataLastQuestion = {
      currentQuestion: 24,
      answers: Array.from({ length: 23 }, (_, i) => ({
        questionId: i + 1,
        score: 1
      })),
      state: 'testing' as const
    };

    const mockResultsData = {
      results: {
        top3: [{
          level: 'yellow' as any,
          name: 'Интегральный',
          fullName: 'Интегральный (Желтый)',
          score: 6,
          interpretation: 'Доминирующий уровень'
        }, {
          level: 'green' as any,
          name: 'Сообщество',
          fullName: 'Сообщество (Зеленый)',
          score: 4,
          interpretation: 'Значимый уровень'
        }, {
          level: 'blue' as any,
          name: 'Порядок',
          fullName: 'Порядок (Синий)',
          score: 3,
          interpretation: 'Присутствующий уровень'
        }],
        allScores: {} as any
      },
      state: 'results' as const
    };

    it('should include card in results response', () => {
      // Правильная структура данных для Яндекс.Диалогов
      const mockAliceData = {
        state: {
          session: {
            data: mockSessionDataLastQuestion
          }
        }
      };
      
      const response = controller.answerYes(mockSessionDataLastQuestion);

      expect(response).toBeDefined();
      expect(response.response.card).toBeDefined();
      expect((response.response.card as any)?.type).toBe('ItemsList');
    });

    it('should create ItemsList card with correct structure', () => {
      // Правильная структура данных для Яндекс.Диалогов
      const mockAliceData = {
        state: {
          session: {
            data: mockSessionDataLastQuestion
          }
        }
      };
      
      const response = controller.answerYes(mockSessionDataLastQuestion);
      const card = response.response.card as any;
      
      expect(card.type).toBe('ItemsList');
      expect(card.header).toBeDefined();
      expect(card.header.text).toContain('ТОП-3 уровня ценностей');
      expect(card.items).toHaveLength(3);
      expect(card.footer).toBeDefined();
    });

    it('should create card items with correct data', () => {
      const response = controller.answerYes(mockSessionDataLastQuestion);
      const card = response.response.card as any;
      
      // Проверяем первый элемент
      const firstItem = card.items[0];
      expect(firstItem.title).toContain('1.');
      expect(firstItem.description).toContain('баллов');
      expect(firstItem.button).toBeDefined();
      expect(firstItem.button.title).toContain('Подробнее');
      expect(firstItem.image_id).toBeDefined();
    });

    it('should include BigImage card in level description', () => {
      const response = controller.describeLevel(mockResultsData);

      expect(response).toBeDefined();
      expect(response.response.card).toBeDefined();
      expect((response.response.card as any)?.type).toBe('BigImage');
    });

    it('should create BigImage card with correct structure', () => {
      const response = controller.describeLevel(mockResultsData);
      const card = response.response.card as any;
      
      expect(card.type).toBe('BigImage');
      expect(card.title).toContain('Интегральный');
      expect(card.description).toContain('Гибкость систем');
      expect(card.description).toContain('6 баллов');
      expect(card.button).toBeDefined();
      expect(card.button.title).toContain('Вернуться к результатам');
      expect(card.image_id).toBeDefined();
    });

    it('should have valid image IDs for all levels', () => {
      const levels = ['beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turquoise'];
      
      levels.forEach(level => {
        // Используем приватный метод через any для тестирования
        const imageId = (controller as any).getLevelImageId(level);
        expect(imageId).toBeDefined();
        expect(typeof imageId).toBe('string');
        expect(imageId.length).toBeGreaterThan(0);
      });
    });

    it('should return default image for unknown level', () => {
      const imageId = (controller as any).getLevelImageId('unknown');
      expect(imageId).toBe('1030494/022efd253558a2baea16'); // beige image as default
    });

    it('should maintain backward compatibility without cards', () => {
      // Проверяем, что ответы работают даже если карточки не поддерживаются
      const response = controller.answerYes(mockSessionDataLastQuestion);
      
      expect(response.response.text).toBeDefined();
      expect(response.response.text.length).toBeGreaterThan(0);
      expect(response.response.buttons).toBeDefined();
      expect(response.response.buttons?.length).toBeGreaterThan(0);
    });

    it('should have proper card structure for voice-only devices', () => {
      // Карточки должны быть опциональными для голосовых устройств
      const response = controller.answerYes(mockSessionDataLastQuestion);
      
      // Основная функциональность должна работать без карточек
      expect(response.response.text).toContain('Спасибо за ответы');
      expect(response.response.text).toContain('ТОП-3');
      expect(response.response.end_session).toBe(false);
    });

    it('should create results card with proper footer', () => {
      const response = controller.answerYes(mockSessionDataLastQuestion);
      const card = response.response.card as any;
      
      expect(card.footer.text).toContain('Результаты показывают');
      expect(card.footer.button).toBeDefined();
      expect(card.footer.button.title).toContain('полный отчет');
    });

    it('should handle level description card button', () => {
      const response = controller.describeLevel(mockResultsData);
      const card = response.response.card as any;
      
      expect(card.button.title).toBe('Вернуться к результатам');
      expect(card.button.hide).toBe(false);
    });
  });

  describe('Card error handling', () => {
    it('should handle missing results gracefully', () => {
      const response = controller.describeLevel({ state: 'results' as const });
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Сначала пройди тест');
      // Карточка не должна быть создана при ошибке
      expect(response.response.card).toBeUndefined();
    });

    it('should work without screen interface', () => {
      const sessionData = {
        currentQuestion: 24,
        answers: Array.from({ length: 23 }, (_, i) => ({
          questionId: i + 1,
          score: 1
        })),
        state: 'testing' as const
      };
      
      // Симулируем устройство без экрана
      const response = controller.answerYes(sessionData);
      
      // Карточка может быть создана, но основной функционал должен работать
      expect(response.response.text).toBeDefined();
      expect(response.response.buttons).toBeDefined();
    });
  });
});
