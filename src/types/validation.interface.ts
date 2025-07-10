/**
 * Типы ошибок валидации
 */
export enum ValidationErrorType {
  MISSING_FIELD = 'missing_field',
  INVALID_FORMAT = 'invalid_format',
  INVALID_VALUE = 'invalid_value',
  OUT_OF_RANGE = 'out_of_range',
  DUPLICATE_VALUE = 'duplicate_value',
  INCONSISTENT_DATA = 'inconsistent_data',
  INSUFFICIENT_DATA = 'insufficient_data'
}

/**
 * Уровни серьезности предупреждений
 */
export enum ValidationWarningLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Ошибка валидации
 */
export interface ValidationError {
  /** Тип ошибки */
  type: ValidationErrorType;
  
  /** Код ошибки */
  code: string;
  
  /** Сообщение об ошибке */
  message: string;
  
  /** Поле, в котором обнаружена ошибка */
  field?: string;
  
  /** Путь к полю (для вложенных объектов) */
  fieldPath?: string;
  
  /** Ожидаемое значение */
  expected?: any;
  
  /** Фактическое значение */
  actual?: any;
  
  /** Дополнительный контекст */
  context?: Record<string, any>;
}

/**
 * Предупреждение валидации
 */
export interface ValidationWarning {
  /** Уровень серьезности */
  level: ValidationWarningLevel;
  
  /** Код предупреждения */
  code: string;
  
  /** Сообщение предупреждения */
  message: string;
  
  /** Поле, к которому относится предупреждение */
  field?: string;
  
  /** Рекомендация по исправлению */
  suggestion?: string;
  
  /** Влияние на результат */
  impact?: string;
}

/**
 * Результат валидации
 */
export interface ValidationResult {
  /** Прошла ли валидация успешно */
  isValid: boolean;
  
  /** Список ошибок */
  errors: ValidationError[];
  
  /** Список предупреждений */
  warnings: ValidationWarning[];
  
  /** Общий счет качества (0-1) */
  qualityScore?: number;

  /** Общий счет валидации (алиас для qualityScore) */
  score?: number;
  
  /** Детали валидации */
  details?: {
    /** Полнота данных */
    completeness: number;

    /** Согласованность */
    consistency: number;

    /** Качество */
    quality: number;
  };

  /** Сводка валидации */
  summary?: {
    /** Общее количество проверок */
    totalChecks: number;
    
    /** Количество пройденных проверок */
    passedChecks: number;
    
    /** Количество критических ошибок */
    criticalErrors: number;
    
    /** Количество предупреждений высокого уровня */
    highWarnings: number;
  };
  
  /** Время валидации */
  validatedAt?: Date;
  
  /** Версия валидатора */
  validatorVersion?: string;
}

/**
 * Конфигурация валидации
 */
export interface ValidationConfig {
  /** Строгий режим валидации */
  strictMode: boolean;
  
  /** Проверять ли полноту данных */
  checkCompleteness: boolean;
  
  /** Проверять ли согласованность данных */
  checkConsistency: boolean;
  
  /** Минимальный порог качества */
  minQualityThreshold: number;
  
  /** Пользовательские правила валидации */
  customRules?: ValidationRule[];
}

/**
 * Правило валидации
 */
export interface ValidationRule {
  /** Название правила */
  name: string;
  
  /** Описание правила */
  description: string;
  
  /** Функция проверки */
  validator: (data: any, context?: any) => ValidationError | null;

  /** Функция проверки (алиас для validator) */
  check?: (data: any) => boolean;

  /** Сообщение об ошибке */
  errorMessage?: string;
  
  /** Применимость правила */
  applicableFor: string[];
  
  /** Приоритет правила */
  priority: number;
}
