import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * Повтор вопроса
 *
 * Положительные тесты:
 * - "повтори"
 * - "повторить"
 * - "еще раз"
 * - "не расслышал"
 * - "не поняла"
 * - "что ты сказала"
 * - "скажи еще раз"
 * - "повтори вопрос"
 *
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "помощь"
 */
export declare function spiralRepeat(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.repeat.d.ts.map