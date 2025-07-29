#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { YandexIntent } from './yandex-grammar-parser';

/**
 * Создает отдельные файлы для каждого интента
 * Название файла = ID интента
 */
function createIntentFiles(inputFile: string, outputDir: string = 'intents') {
  if (!fs.existsSync(inputFile)) {
    console.error(`Файл ${inputFile} не найден`);
    process.exit(1);
  }

  const data: { intents: YandexIntent[] } = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Создаем директорию для интентов
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Создаем файл для каждого интента
  for (const intent of data.intents) {
    const fileName = `${intent.name}.ts`;
    const filePath = path.join(outputDir, fileName);
    
    const fileContent = `import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * ${intent.description}
 * 
 * Положительные тесты:
 * ${intent.positiveTests.map(test => `- "${test}"`).join('\n * ')}
 * 
 * Отрицательные тесты:
 * ${intent.negativeTests.map(test => `- "${test}"`).join('\n * ')}
 */

// Грамматика Яндекса:
/*
${intent.grammar}
*/

@RegexIntent({
  pattern: ${generateRegexPattern(intent.grammar)},
  priority: ${intent.priority || 5},
  description: '${intent.description}'
})
export function ${camelCase(intent.name)}(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для ${intent.name}
  
  return new SkillResponseBuilder(
    'Обработка интента: ${intent.name}'
  ).build();
}

// Тесты
export const tests = {
  positive: ${JSON.stringify(intent.positiveTests, null, 2)},
  negative: ${JSON.stringify(intent.negativeTests, null, 2)}
};
`;

    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ Создан файл: ${filePath}`);
  }

  // Создаем индексный файл
  const indexContent = `// Автоматически сгенерированный индекс интентов

${data.intents.map(intent => 
  `export { ${camelCase(intent.name)}, tests as ${camelCase(intent.name)}Tests } from './${intent.name}';`
).join('\n')}

// Список всех интентов
export const ALL_INTENTS = [
${data.intents.map(intent => `  '${intent.name}'`).join(',\n')}
];
`;

  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`✅ Создан индексный файл: ${path.join(outputDir, 'index.ts')}`);
  
  console.log(`\n📁 Создано ${data.intents.length} файлов интентов в директории: ${outputDir}`);
}

function generateRegexPattern(grammar: string): string {
  // Простая конвертация грамматики в regex
  const lines = grammar.split('\n')
    .filter(line => line.trim() && !line.includes('root:') && !line.includes('slots:'))
    .map(line => line.trim().replace(/\s*\|\s*$/, ''));
  
  if (lines.length === 0) return '/(?:)/i';
  
  const patterns = lines.map(line => {
    // Заменяем пробелы на \s+ и экранируем только нужные символы
    return line.replace(/\s+/g, '\\s+');
  });
  
  if (patterns.length === 1) {
    return `/${patterns[0]}/i`;
  } else {
    return `/(${patterns.join('|')})/i`;
  }
}

function camelCase(str: string): string {
  return str
    .replace(/[^a-zA-Zа-яА-Я0-9]/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

// CLI интерфейс
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Использование: npx ts-node src/utils/create-intent-files.ts <input-file> [output-dir]

Пример:
  npx ts-node src/utils/create-intent-files.ts yandex-intents-full.json intents
    `);
    process.exit(1);
  }

  const inputFile = args[0];
  const outputDir = args[1] || 'intents';
  
  createIntentFiles(inputFile, outputDir);
}

export { createIntentFiles };