import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Ответ Да
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
 * - "ага"
 * - "угу"
 *
 * Отрицательные тесты:
 * - "нет"
 * - "не согласен"
 * - "может быть"
 */
export declare function spiralYes(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.yes.d.ts.map