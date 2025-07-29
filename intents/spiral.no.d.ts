import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Ответ Нет
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
export declare function spiralNo(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.no.d.ts.map