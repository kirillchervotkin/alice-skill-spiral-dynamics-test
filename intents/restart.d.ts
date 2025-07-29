import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Перезапуск
 *
 * Положительные тесты:
 * - "заново"
 * - "сначала"
 * - "перезапустить"
 * - "начать заново"
 * - "повторить тест"
 *
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */
export declare function restart(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=restart.d.ts.map