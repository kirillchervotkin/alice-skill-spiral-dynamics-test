import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Пауза теста
 *
 * Положительные тесты:
 * - "пауза"
 * - "остановить"
 * - "приостановить"
 * - "стоп"
 * - "подожди"
 * - "остановись"
 * - "прерви тест"
 *
 * Отрицательные тесты:
 * - "продолжить"
 * - "дальше"
 * - "начать"
 */
export declare function spiralPause(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.pause.d.ts.map