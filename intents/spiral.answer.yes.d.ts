import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Ответ Да на вопрос
 *
 * Положительные тесты:
 * - "да"
 * - "согласен"
 * - "верно"
 * - "правильно"
 * - "конечно"
 * - "точно"
 * - "абсолютно"
 * - "именно так"
 *
 * Отрицательные тесты:
 * - "нет"
 * - "не согласен"
 * - "может быть"
 */
export declare function spiralAnswerYes(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.answer.yes.d.ts.map