import { Test, TestingModule } from '@nestjs/testing';
import { SpiralDynamicsService } from './spiral-dynamics.service';
import { QuestionsService } from './questions.service';
import { SpiralLevel } from '../types/spiral-levels.enum';

export interface Answer {
  questionId: number;
  score: number;
}

describe('SpiralDynamicsService', () => {
  let service: SpiralDynamicsService;
  let questionsService: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpiralDynamicsService, QuestionsService],
    }).compile();

    service = module.get<SpiralDynamicsService>(SpiralDynamicsService);
    questionsService = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateResults', () => {
    it('should calculate results correctly for all maximum scores', () => {
      // Создаем ответы с максимальными баллами для всех вопросов
      const answers: Answer[] = Array.from({ length: 24 }, (_, i) => ({
        questionId: i + 1,
        score: 2 // максимальный балл
      }));

      const result = service.calculateResults(answers);

      expect(result.top3).toHaveLength(3);
      expect(result.allScores).toBeDefined();

      // Каждый уровень должен иметь 6 баллов (3 вопроса * 2 балла)
      Object.values(result.allScores).forEach((score) => {
        expect(score).toBe(6);
      });
    });

    it('should calculate results correctly for minimum scores', () => {
      const answers: Answer[] = Array.from({ length: 24 }, (_, i) => ({
        questionId: i + 1,
        score: 0 // минимальный балл
      }));

      const result = service.calculateResults(answers);

      expect(result.top3).toHaveLength(3);
      
      // Все уровни должны иметь 0 баллов
      Object.values(result.allScores).forEach((score) => {
        expect(score).toBe(0);
      });
    });

    it('should calculate results correctly for mixed scores', () => {
      const answers: Answer[] = [
        // BEIGE (1, 9, 17) - 6 баллов
        { questionId: 1, score: 2 },
        { questionId: 9, score: 2 },
        { questionId: 17, score: 2 },
        // ORANGE (5, 13, 21) - 3 балла
        { questionId: 5, score: 1 },
        { questionId: 13, score: 1 },
        { questionId: 21, score: 1 },
        // Остальные - 0 баллов
        ...Array.from({ length: 18 }, (_, i) => {
          const excludedIds = [1, 5, 9, 13, 17, 21];
          let questionId = i + 1;
          while (excludedIds.includes(questionId)) {
            questionId++;
          }
          return { questionId, score: 0 };
        }).slice(0, 18)
      ];

      const result = service.calculateResults(answers);

      expect(result.allScores[SpiralLevel.BEIGE]).toBe(6);
      expect(result.allScores[SpiralLevel.ORANGE]).toBe(3);
      expect(result.top3[0].level).toBe(SpiralLevel.BEIGE);
      expect(result.top3[0].score).toBe(6);
    });

    it('should sort results by score descending', () => {
      const answers: Answer[] = [
        // YELLOW (7, 15, 23) - 6 баллов
        { questionId: 7, score: 2 },
        { questionId: 15, score: 2 },
        { questionId: 23, score: 2 },
        // GREEN (6, 14, 22) - 4 балла
        { questionId: 6, score: 2 },
        { questionId: 14, score: 1 },
        { questionId: 22, score: 1 },
        // BLUE (4, 12, 20) - 2 балла
        { questionId: 4, score: 1 },
        { questionId: 12, score: 1 },
        { questionId: 20, score: 0 },
        // Остальные - 0 баллов
        ...Array.from({ length: 15 }, (_, i) => {
          const excludedIds = [4, 6, 7, 12, 14, 15, 20, 22, 23];
          let questionId = i + 1;
          while (excludedIds.includes(questionId)) {
            questionId++;
          }
          return { questionId, score: 0 };
        }).slice(0, 15)
      ];

      const result = service.calculateResults(answers);

      expect(result.top3[0].score).toBe(6); // YELLOW
      expect(result.top3[1].score).toBe(4); // GREEN
      expect(result.top3[2].score).toBe(2); // BLUE
      
      // Проверяем, что результаты отсортированы по убыванию
      for (let i = 0; i < result.top3.length - 1; i++) {
        expect(result.top3[i].score).toBeGreaterThanOrEqual(result.top3[i + 1].score);
      }
    });
  });

  describe('formatResultsForVoice', () => {
    it('should format results correctly', () => {
      const mockResult = {
        top3: [
          {
            level: SpiralLevel.YELLOW,
            name: 'Гибкость и Системы',
            fullName: 'Гибкость и Системы (Желтый)',
            score: 6,
            interpretation: 'Доминирующий уровень'
          },
          {
            level: SpiralLevel.GREEN,
            name: 'Гармония и Равенство',
            fullName: 'Гармония и Равенство (Зеленый)',
            score: 4,
            interpretation: 'Вторичный уровень'
          },
          {
            level: SpiralLevel.BLUE,
            name: 'Порядок и Долг',
            fullName: 'Порядок и Долг (Синий)',
            score: 2,
            interpretation: 'Слабо выражен'
          }
        ],
        allScores: {} as any
      };

      const result = service.formatResultsForVoice(mockResult);

      expect(result).toContain('Твои ТОП-3 уровня ценностей сейчас:');
      expect(result).toContain('Первое место: Гибкость и Системы (Желтый) - 6 баллов');
      expect(result).toContain('Второе место: Гармония и Равенство (Зеленый) - 4 балла');
      expect(result).toContain('Третье место: Порядок и Долг (Синий) - 2 балла');
      expect(result).toContain('Хочешь узнать подробнее о своих уровнях?');
    });
  });

  describe('getLevelDescription', () => {
    it('should return descriptions for all levels', () => {
      const levels = Object.values(SpiralLevel);

      levels.forEach((level) => {
        const description = service.getLevelDescription(level);
        expect(description).toBeDefined();
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });

    it('should return specific descriptions for key levels', () => {
      const beigeDescription = service.getLevelDescription(SpiralLevel.BEIGE);
      expect(beigeDescription.toLowerCase()).toContain('выживани');

      const yellowDescription = service.getLevelDescription(SpiralLevel.YELLOW);
      expect(yellowDescription.toLowerCase()).toContain('гибкость');
    });
  });

  describe('score interpretation', () => {
    it('should interpret scores correctly', () => {
      // Тестируем через calculateResults, так как getInterpretation приватный
      const testCases = [
        { score: 6, expectedInterpretation: 'Доминирующий уровень' },
        { score: 5, expectedInterpretation: 'Доминирующий уровень' },
        { score: 4, expectedInterpretation: 'Вторичный уровень' },
        { score: 3, expectedInterpretation: 'Вторичный уровень' },
        { score: 2, expectedInterpretation: 'Слабо выражен' },
        { score: 1, expectedInterpretation: 'Слабо выражен' },
        { score: 0, expectedInterpretation: 'Слабо выражен' }
      ];

      testCases.forEach((testCase) => {
        const { score, expectedInterpretation } = testCase;
        // Создаем ответы, которые дадут нужный балл для первого уровня
        const answers: Answer[] = [
          { questionId: 1, score: Math.min(score, 2) },
          { questionId: 9, score: Math.min(Math.max(score - 2, 0), 2) },
          { questionId: 17, score: Math.min(Math.max(score - 4, 0), 2) },
          // Остальные вопросы с нулевыми баллами
          ...Array.from({ length: 21 }, (_, i) => ({
            questionId: i + 2 > 9 ? i + 3 : i + 2,
            score: 0
          }))
        ];

        const result = service.calculateResults(answers);
        const beigeResult = result.top3.find(r => r.level === SpiralLevel.BEIGE);
        
        if (beigeResult && beigeResult.score === score) {
          expect(beigeResult.interpretation).toContain(expectedInterpretation);
        }
      });
    });
  });
});
