import { Injectable } from '@nestjs/common';
import { TestAnswers } from '../../common/interfaces/answers.interface';
import { ValidationResult } from '../../common/interfaces/validation.interface';

@Injectable()
export class ValidationService {
  
  async validateAnswers(answers: TestAnswers): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Базовая валидация
    if (!answers.testId) {
      errors.push('Отсутствует ID теста');
    }

    if (!answers.answers || answers.answers.length === 0) {
      errors.push('Отсутствуют ответы пользователя');
    }

    // Валидация ответов
    if (answers.answers) {
      answers.answers.forEach((answer, index) => {
        if (!answer.questionId) {
          errors.push(`Ответ ${index + 1}: отсутствует ID вопроса`);
        }
        if (!answer.selectedOptionId) {
          errors.push(`Ответ ${index + 1}: не выбран вариант ответа`);
        }
      });

      // Проверка полноты (должно быть 24 ответа для стандартного теста)
      if (answers.answers.length < 24) {
        warnings.push(`Неполный тест: ${answers.answers.length} из 24 ответов`);
      }

      // Проверка на дублирующиеся ответы
      const questionIds = answers.answers.map(a => a.questionId);
      const uniqueQuestionIds = new Set(questionIds);
      if (questionIds.length !== uniqueQuestionIds.size) {
        errors.push('Обнаружены дублирующиеся ответы на вопросы');
      }
    }

    // Валидация времени
    if (answers.startedAt && answers.completedAt) {
      const duration = answers.completedAt.getTime() - answers.startedAt.getTime();
      if (duration < 60000) { // Менее 1 минуты
        warnings.push('Тест пройден слишком быстро');
      }
      if (duration > 3600000) { // Более 1 часа
        warnings.push('Тест пройден слишком медленно');
      }
    }

    // Расчет метрик качества
    const completeness = answers.answers ? answers.answers.length / 24 : 0;
    const consistency = this.calculateConsistency(answers);
    const quality = errors.length === 0 ? 1.0 : Math.max(0, 1.0 - errors.length * 0.2);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      qualityScore: quality,


    };
  }

  private calculateConsistency(answers: TestAnswers): number {
    // TODO: Реализовать анализ согласованности ответов
    // Проверка на противоречивые паттерны ответов
    
    if (!answers.answers || answers.answers.length === 0) {
      return 0;
    }

    // Простая проверка: если есть время ответов, анализируем их
    const responseTimes = answers.answers
      .map(a => a.responseTime)
      .filter(t => t !== undefined) as number[];

    if (responseTimes.length === 0) {
      return 0.8; // Базовая согласованность без данных о времени
    }

    // Проверка на слишком быстрые или медленные ответы
    const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const inconsistentAnswers = responseTimes.filter(time => 
      time < avgTime * 0.1 || time > avgTime * 10
    ).length;

    return Math.max(0, 1.0 - (inconsistentAnswers / responseTimes.length));
  }
}
