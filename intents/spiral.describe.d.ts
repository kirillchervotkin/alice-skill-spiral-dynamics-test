import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Описание уровня
 *
 * Положительные тесты:
 * - "опиши"
 * - "описание"
 * - "расскажи"
 * - "подробнее"
 * - "что это значит"
 * - "объясни"
 * - "детали"
 * - "больше информации"
 *
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "начать тест"
 */
export declare function spiralDescribe(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.describe.d.ts.map