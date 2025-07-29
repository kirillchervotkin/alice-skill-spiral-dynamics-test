import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Описание красного уровня
 *
 * Положительные тесты:
 * - "опиши красный"
 * - "расскажи про красный"
 * - "что такое красный"
 * - "про красный"
 * - "о красном"
 * - "красный"
 * - "опиши red"
 *
 * Отрицательные тесты:
 * - "опиши желтый"
 * - "синий"
 * - "помощь"
 */
export declare function spiralDescribeRed(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.describe.red.d.ts.map