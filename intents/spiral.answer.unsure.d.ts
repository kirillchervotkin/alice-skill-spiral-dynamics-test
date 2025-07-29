import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Не уверен
 *
 * Положительные тесты:
 * - "не знаю"
 * - "не уверен"
 * - "затрудняюсь"
 * - "может быть"
 * - "возможно"
 * - "сложно сказать"
 * - "трудно сказать"
 * - "по разному"
 * - "и да и нет"
 *
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "точно"
 */
export declare function spiralAnswerUnsure(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.answer.unsure.d.ts.map