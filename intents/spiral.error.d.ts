import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Обработка ошибок
 *
 * Положительные тесты:
 * - "не понял"
 * - "не поняла"
 * - "ошибка"
 * - "что делать"
 * - "не работает"
 * - "проблема"
 * - "сломалось"
 *
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */
export declare function spiralError(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.error.d.ts.map