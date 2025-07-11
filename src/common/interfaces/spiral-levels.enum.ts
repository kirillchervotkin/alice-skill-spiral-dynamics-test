/**
 * Уровни спиральной динамики по модели Клэра Грейвза
 * Каждый уровень представляет определенную систему ценностей и мышления
 */
export enum SpiralLevel {
  /** AN - Выживание: базовые потребности, инстинкты */
  BEIGE = 'beige',
  
  /** BO - Племенной/Магический: традиции, ритуалы, принадлежность к группе */
  PURPLE = 'purple',
  
  /** CP - Силовой/Импульсивный: власть, доминирование, немедленное удовлетворение */
  RED = 'red',
  
  /** DQ - Порядок/Авторитарный: правила, иерархия, дисциплина, смысл */
  BLUE = 'blue',
  
  /** ER - Достижения/Предпринимательский: успех, конкуренция, материальный прогресс */
  ORANGE = 'orange',
  
  /** FS - Сообщество/Эгалитарный: гармония, равенство, забота о других */
  GREEN = 'green',
  
  /** GT - Интегральный/Системный: системное мышление, интеграция, гибкость */
  YELLOW = 'yellow',
  
  /** HU - Холистический/Глобальный: глобальное сознание, синергия, холизм */
  TURQUOISE = 'turquoise'
}

/**
 * Метаданные уровней спиральной динамики
 */
export interface SpiralLevelMeta {
  level: SpiralLevel;
  code: string; // AN, BO, CP, DQ, ER, FS, GT, HU
  name: string;
  color: string;
  tier: 1 | 2; // Первый или второй порядок
  order: number; // Порядковый номер
}

/**
 * Метаданные всех уровней
 */
export const SPIRAL_LEVELS_META: Record<SpiralLevel, SpiralLevelMeta> = {
  [SpiralLevel.BEIGE]: {
    level: SpiralLevel.BEIGE,
    code: 'AN',
    name: 'Выживание',
    color: '#F5F5DC',
    tier: 1,
    order: 1
  },
  [SpiralLevel.PURPLE]: {
    level: SpiralLevel.PURPLE,
    code: 'BO',
    name: 'Племенной',
    color: '#800080',
    tier: 1,
    order: 2
  },
  [SpiralLevel.RED]: {
    level: SpiralLevel.RED,
    code: 'CP',
    name: 'Силовой',
    color: '#FF0000',
    tier: 1,
    order: 3
  },
  [SpiralLevel.BLUE]: {
    level: SpiralLevel.BLUE,
    code: 'DQ',
    name: 'Порядок',
    color: '#0000FF',
    tier: 1,
    order: 4
  },
  [SpiralLevel.ORANGE]: {
    level: SpiralLevel.ORANGE,
    code: 'ER',
    name: 'Достижения',
    color: '#FFA500',
    tier: 1,
    order: 5
  },
  [SpiralLevel.GREEN]: {
    level: SpiralLevel.GREEN,
    code: 'FS',
    name: 'Сообщество',
    color: '#008000',
    tier: 1,
    order: 6
  },
  [SpiralLevel.YELLOW]: {
    level: SpiralLevel.YELLOW,
    code: 'GT',
    name: 'Интегральный',
    color: '#FFFF00',
    tier: 2,
    order: 7
  },
  [SpiralLevel.TURQUOISE]: {
    level: SpiralLevel.TURQUOISE,
    code: 'HU',
    name: 'Холистический',
    color: '#40E0D0',
    tier: 2,
    order: 8
  }
};
