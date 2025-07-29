import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Описание синего уровня
 *
 * Положительные тесты:
 * - "опиши синий"
 * - "расскажи про синий"
 * - "что такое синий"
 * - "про синий"
 * - "о синем"
 * - "синий"
 * - "опиши blue"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
export declare function spiralDescribeBlue(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.describe.blue.d.ts.map