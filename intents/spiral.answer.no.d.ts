import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Ответ нет на вопрос
 *
 * Положительные тесты:
 * - "нет"
 * - "не согласен"
 * - "неверно"
 * - "не правильно"
 * - "никогда"
 * - "ни в коем случае"
 *
 * Отрицательные тесты:
 * - "да"
 * - "согласен"
 * - "может быть"
 */
export declare function spiralAnswerNo(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.answer.no.d.ts.map