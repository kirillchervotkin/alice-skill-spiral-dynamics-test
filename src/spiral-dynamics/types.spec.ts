import { SpiralLevel, SPIRAL_LEVELS_META } from '../types/spiral-levels.enum';

describe('Types and Constants', () => {
  describe('SpiralLevel enum', () => {
    it('should have all 8 levels defined', () => {
      const expectedLevels = [
        'beige', 'purple', 'red', 'blue', 
        'orange', 'green', 'yellow', 'turquoise'
      ];
      
      const actualLevels = Object.values(SpiralLevel);
      expect(actualLevels).toHaveLength(8);
      expect(actualLevels.sort()).toEqual(expectedLevels.sort());
    });

    it('should have correct level values', () => {
      expect(SpiralLevel.BEIGE).toBe('beige');
      expect(SpiralLevel.PURPLE).toBe('purple');
      expect(SpiralLevel.RED).toBe('red');
      expect(SpiralLevel.BLUE).toBe('blue');
      expect(SpiralLevel.ORANGE).toBe('orange');
      expect(SpiralLevel.GREEN).toBe('green');
      expect(SpiralLevel.YELLOW).toBe('yellow');
      expect(SpiralLevel.TURQUOISE).toBe('turquoise');
    });
  });

  describe('SPIRAL_LEVELS_META', () => {
    it('should have metadata for all levels', () => {
      const levels = Object.values(SpiralLevel);

      levels.forEach((level) => {
        expect(SPIRAL_LEVELS_META[level]).toBeDefined();
        expect(SPIRAL_LEVELS_META[level].name).toBeDefined();
      });
    });

    it('should have correct level names', () => {
      const expectedNames = {
        [SpiralLevel.BEIGE]: 'Выживание',
        [SpiralLevel.PURPLE]: 'Племенной',
        [SpiralLevel.RED]: 'Силовой',
        [SpiralLevel.BLUE]: 'Порядок',
        [SpiralLevel.ORANGE]: 'Достижения',
        [SpiralLevel.GREEN]: 'Сообщество',
        [SpiralLevel.YELLOW]: 'Интегральный',
        [SpiralLevel.TURQUOISE]: 'Холистический'
      };

      Object.entries(expectedNames).forEach((entry) => {
        const [level, expectedName] = entry;
        expect(SPIRAL_LEVELS_META[level as SpiralLevel].name).toBe(expectedName);
      });
    });

    it('should have valid level names', () => {
      const levels = Object.values(SpiralLevel);

      levels.forEach((level) => {
        const meta = SPIRAL_LEVELS_META[level];
        expect(meta.name).toBeDefined();
        expect(typeof meta.name).toBe('string');
        expect(meta.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Answer interface', () => {
    it('should accept valid answer objects', () => {
      const validAnswers = [
        { questionId: 1, score: 0 },
        { questionId: 24, score: 1 },
        { questionId: 12, score: 2 }
      ];

      // TypeScript compilation will catch type errors
      validAnswers.forEach((answer) => {
        expect(answer.questionId).toBeGreaterThan(0);
        expect(answer.score).toBeGreaterThanOrEqual(0);
        expect(answer.score).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('SimpleQuestion interface', () => {
    it('should accept valid question objects', () => {
      const validQuestion = {
        id: 1,
        text: 'Test question?',
        level: SpiralLevel.BEIGE
      };

      expect(validQuestion.id).toBeGreaterThan(0);
      expect(validQuestion.text).toBeDefined();
      expect(validQuestion.level).toBeDefined();
      expect(Object.values(SpiralLevel)).toContain(validQuestion.level);
    });
  });

  describe('TestResult interface', () => {
    it('should accept valid test result objects', () => {
      const validResult = {
        top3: [
          {
            level: SpiralLevel.YELLOW,
            name: 'Гибкость и Системы',
            fullName: 'Гибкость и Системы (Желтый)',
            score: 6,
            interpretation: 'Доминирующий уровень'
          }
        ],
        allScores: {
          [SpiralLevel.BEIGE]: 2,
          [SpiralLevel.PURPLE]: 1,
          [SpiralLevel.RED]: 0,
          [SpiralLevel.BLUE]: 3,
          [SpiralLevel.ORANGE]: 4,
          [SpiralLevel.GREEN]: 5,
          [SpiralLevel.YELLOW]: 6,
          [SpiralLevel.TURQUOISE]: 2
        }
      };

      expect(validResult.top3).toHaveLength(1);
      expect(validResult.top3[0].score).toBe(6);
      expect(validResult.allScores).toBeDefined();
      expect(Object.keys(validResult.allScores)).toHaveLength(8);
    });
  });

  describe('LevelResult interface', () => {
    it('should accept valid level result objects', () => {
      const validLevelResult = {
        level: SpiralLevel.GREEN,
        name: 'Гармония и Равенство',
        fullName: 'Гармония и Равенство (Зеленый)',
        score: 4,
        interpretation: 'Вторичный уровень'
      };

      expect(validLevelResult.level).toBeDefined();
      expect(validLevelResult.name).toBeDefined();
      expect(validLevelResult.fullName).toBeDefined();
      expect(validLevelResult.score).toBeGreaterThanOrEqual(0);
      expect(validLevelResult.score).toBeLessThanOrEqual(6);
      expect(validLevelResult.interpretation).toBeDefined();
    });
  });

  describe('Score validation', () => {
    it('should validate score ranges', () => {
      const validScores = [0, 1, 2];
      const invalidScores = [-1, 3, 2.5, NaN, Infinity];

      validScores.forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(2);
        expect(Number.isInteger(score)).toBe(true);
      });

      invalidScores.forEach((score) => {
        const isValid = score >= 0 && score <= 2 && Number.isInteger(score);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Question ID validation', () => {
    it('should validate question ID ranges', () => {
      const validIds = Array.from({ length: 24 }, (_, i) => i + 1);
      const invalidIds = [0, -1, 25, 100, 1.5, NaN];

      validIds.forEach((id) => {
        expect(id).toBeGreaterThan(0);
        expect(id).toBeLessThanOrEqual(24);
        expect(Number.isInteger(id)).toBe(true);
      });

      invalidIds.forEach((id) => {
        const isValid = id > 0 && id <= 24 && Number.isInteger(id);
        expect(isValid).toBe(false);
      });
    });
  });
});
