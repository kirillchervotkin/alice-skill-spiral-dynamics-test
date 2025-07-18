import { Injectable } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { SpiralLevel, SPIRAL_LEVELS_META } from '../types/spiral-levels.enum';

export interface Answer {
  questionId: number;
  score: number; // 0 = Нет, 1 = Не уверен, 2 = Да
}

export interface ColorResult {
  level: SpiralLevel;
  name: string;
  fullName: string;
  score: number;
  interpretation: string;
}

export interface TestResult {
  top3: ColorResult[];
  allScores: Record<SpiralLevel, number>;
}

@Injectable()
export class SpiralDynamicsService {
  constructor(private readonly questionsService: QuestionsService) {}

  private readonly levelDescriptions = {
    [SpiralLevel.BEIGE]: 'Фокус на выживании: еда, безопасность, здоровье, действия по инстинкту.',
    [SpiralLevel.PURPLE]: 'Сила традиций: ритуалы, духи предков, мистика, верность \'своим\'.',
    [SpiralLevel.RED]: 'Мир-джунгли: сила, власть, импульсы, победа любой ценой, \'беру что хочу\'.',
    [SpiralLevel.BLUE]: 'Основа — порядок: правила, иерархия, долг, абсолютная истина, стабильность.',
    [SpiralLevel.ORANGE]: 'Двигатель прогресса: стратегия, успех, конкуренция, инновации, личные достижения.',
    [SpiralLevel.GREEN]: 'Ценность гармонии: равенство, эмпатия, сообщество, консенсус, забота о людях.',
    [SpiralLevel.YELLOW]: 'Гибкость систем: адаптивность, функциональность, интеграция знаний, видение связей.',
    [SpiralLevel.TURQUOISE]: 'Целостность мира: глобальное сознание, холизм, духовность, единство жизни, эволюция.',
  };

  private readonly levelNames = {
    [SpiralLevel.BEIGE]: 'Выживание',
    [SpiralLevel.PURPLE]: 'Магия и Племенной',
    [SpiralLevel.RED]: 'Власть и Сила',
    [SpiralLevel.BLUE]: 'Порядок и Долг',
    [SpiralLevel.ORANGE]: 'Успех и Конкуренция',
    [SpiralLevel.GREEN]: 'Гармония и Равенство',
    [SpiralLevel.YELLOW]: 'Гибкость и Системы',
    [SpiralLevel.TURQUOISE]: 'Глобальность',
  };

  calculateResults(answers: Answer[]): TestResult {
    // Инициализируем счетчики для каждого уровня
    const scores: Record<SpiralLevel, number> = {
      [SpiralLevel.BEIGE]: 0,
      [SpiralLevel.PURPLE]: 0,
      [SpiralLevel.RED]: 0,
      [SpiralLevel.BLUE]: 0,
      [SpiralLevel.ORANGE]: 0,
      [SpiralLevel.GREEN]: 0,
      [SpiralLevel.YELLOW]: 0,
      [SpiralLevel.TURQUOISE]: 0,
    };

    // Подсчитываем баллы по уровням
    answers.forEach(answer => {
      const question = this.questionsService.getQuestion(answer.questionId);
      if (question) {
        scores[question.level] += answer.score;
      }
    });

    // Сортируем результаты по убыванию
    const sortedResults = Object.entries(scores)
      .map(([level, score]) => ({
        level: level as SpiralLevel,
        name: this.levelNames[level as SpiralLevel],
        fullName: `${this.levelNames[level as SpiralLevel]} (${SPIRAL_LEVELS_META[level as SpiralLevel].name})`,
        score,
        interpretation: this.getInterpretation(score)
      }))
      .sort((a, b) => b.score - a.score);

    return {
      top3: sortedResults.slice(0, 3),
      allScores: scores
    };
  }

  private getInterpretation(score: number): string {
    if (score >= 5) {
      return 'Доминирующий уровень. Эти ценности наиболее ярко выражены в вашем текущем мировоззрении и поведении. Определяет вашу центральную операционную систему.';
    } else if (score >= 3) {
      return 'Вторичный уровень. Эти ценности присутствуют и влияют на вас, но не являются основными. Могут проявляться в определенных сферах жизни или ситуациях.';
    } else {
      return 'Слабо выражен. Эти ценности в данный момент мало актуальны для вас или сознательно отвергаются.';
    }
  }

  getLevelDescription(level: SpiralLevel): string {
    return this.levelDescriptions[level] || 'Описание не найдено.';
  }

  getLevelFullName(level: SpiralLevel): string {
    const meta = SPIRAL_LEVELS_META[level];
    return `${meta.name} (${level})`;
  }

  private getColorName(level: SpiralLevel): string {
    const colorNames = {
      [SpiralLevel.BEIGE]: 'Бежевый',
      [SpiralLevel.PURPLE]: 'Фиолетовый',
      [SpiralLevel.RED]: 'Красный',
      [SpiralLevel.BLUE]: 'Синий',
      [SpiralLevel.ORANGE]: 'Оранжевый',
      [SpiralLevel.GREEN]: 'Зеленый',
      [SpiralLevel.YELLOW]: 'Желтый',
      [SpiralLevel.TURQUOISE]: 'Бирюзовый',
    };
    return colorNames[level];
  }

  formatResultsForVoice(result: TestResult): string {
    const top3 = result.top3;

    let text = 'Твои ТОП-3 уровня ценностей сейчас:\n\n';

    const places = ['Первое место', 'Второе место', 'Третье место'];

    top3.forEach((item, index) => {
      const scoreWord = this.getScoreWord(item.score);
      const colorName = this.getColorName(item.level);
      text += `${places[index]}: ${item.name} (${colorName}) - ${item.score} ${scoreWord}.\n`;
    });

    text += '\nХочешь узнать подробнее о своих уровнях?';

    return text;
  }

  private getScoreWord(score: number): string {
    if (score === 1) return 'балл';
    if (score >= 2 && score <= 4) return 'балла';
    return 'баллов';
  }
}
