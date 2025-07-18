import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { SpiralLevel } from '../types/spiral-levels.enum';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestion', () => {
    it('should return question by id', () => {
      const question = service.getQuestion(1);
      expect(question).toBeDefined();
      expect(question?.id).toBe(1);
      expect(question?.text).toContain('физическая безопасность');
      expect(question?.level).toBe(SpiralLevel.BEIGE);
    });

    it('should return null for invalid id', () => {
      const question = service.getQuestion(999);
      expect(question).toBeNull();
    });

    it('should return null for negative id', () => {
      const question = service.getQuestion(-1);
      expect(question).toBeNull();
    });

    it('should return null for zero id', () => {
      const question = service.getQuestion(0);
      expect(question).toBeNull();
    });
  });

  describe('getAllQuestions', () => {
    it('should return all 24 questions', () => {
      const questions = service.getAllQuestions();
      expect(questions).toHaveLength(24);
    });

    it('should have questions with sequential ids from 1 to 24', () => {
      const questions = service.getAllQuestions();
      const ids = questions.map(q => q.id).sort((a, b) => a - b);
      const expectedIds = Array.from({ length: 24 }, (_, i) => i + 1);
      expect(ids).toEqual(expectedIds);
    });

    it('should have correct distribution of questions by levels', () => {
      const questions = service.getAllQuestions();
      const levelCounts = questions.reduce((acc, q) => {
        acc[q.level] = (acc[q.level] || 0) + 1;
        return acc;
      }, {} as Record<SpiralLevel, number>);

      // Каждый уровень должен иметь ровно 3 вопроса
      Object.values(levelCounts).forEach((count) => {
        expect(count).toBe(3);
      });
    });
  });

  describe('question content validation', () => {
    it('should have correct number of questions per level', () => {
      const levels = Object.values(SpiralLevel);

      levels.forEach((level) => {
        const questionsForLevel = service.getAllQuestions()
          .filter(q => q.level === level);
        expect(questionsForLevel).toHaveLength(3);
      });
    });

    it('should have questions for all levels', () => {
      const questions = service.getAllQuestions();
      const levelsInQuestions = [...new Set(questions.map(q => q.level))];
      const allLevels = Object.values(SpiralLevel);

      expect(levelsInQuestions.sort()).toEqual(allLevels.sort());
    });

    it('should have specific questions for key levels', () => {
      const questions = service.getAllQuestions();

      // Проверяем, что есть вопросы для ключевых уровней
      const beigeQuestions = questions.filter(q => q.level === SpiralLevel.BEIGE);
      expect(beigeQuestions.length).toBe(3);
      expect(beigeQuestions.some(q => q.id === 1)).toBe(true);

      const yellowQuestions = questions.filter(q => q.level === SpiralLevel.YELLOW);
      expect(yellowQuestions.length).toBe(3);
      expect(yellowQuestions.some(q => q.id === 7)).toBe(true);
    });
  });

  describe('question text validation', () => {
    it('should have non-empty text for all questions', () => {
      const questions = service.getAllQuestions();
      questions.forEach((question) => {
        expect(question.text).toBeDefined();
        expect(question.text.length).toBeGreaterThan(0);
        expect(question.text.trim()).toBe(question.text);
      });
    });

    it('should have questions with valid text format', () => {
      const questions = service.getAllQuestions();
      questions.forEach((question) => {
        const text = question.text;
        // Проверяем, что вопрос содержит осмысленный текст
        expect(text.length).toBeGreaterThan(10);
        expect(text).toMatch(/[а-яё]/i); // содержит русские буквы
      });
    });
  });
});
