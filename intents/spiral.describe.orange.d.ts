import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Описание оранжевого уровня
 *
 * Положительные тесты:
 * - "опиши оранжевый"
 * - "расскажи про оранжевый"
 * - "что такое оранжевый"
 * - "про оранжевый"
 * - "о оранжевом"
 * - "оранжевый"
 * - "опиши orange"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
export declare function spiralDescribeOrange(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.describe.orange.d.ts.map