import { Injectable } from '@nestjs/common';
import { SpiralLevel } from '../types/spiral-levels.enum';

export interface SimpleQuestion {
  id: number;
  text: string;
  level: SpiralLevel;
}

@Injectable()
export class QuestionsService {
  private readonly questions: SimpleQuestion[] = [
    // Бежевый (Выживание) - вопросы 1, 9, 17
    { id: 1, text: "Главный приоритет — это физическая безопасность, еда, кров, здоровье. Согласен?", level: SpiralLevel.BEIGE },
    { id: 9, text: "Действуешь по ситуации, без долгих планов?", level: SpiralLevel.BEIGE },
    { id: 17, text: "Решаешь здесь и сейчас, планы не важны?", level: SpiralLevel.BEIGE },

    // Фиолетовый (Магия/Племенной) - вопросы 2, 10, 18
    { id: 2, text: "Традиции и ритуалы предков защищают и придают смысл. Согласен?", level: SpiralLevel.PURPLE },
    { id: 10, text: "Высшие силы или духи влияют на твою жизнь?", level: SpiralLevel.PURPLE },
    { id: 18, text: "Мистика или связь с предками помогают в трудностях?", level: SpiralLevel.PURPLE },

    // Красный (Власть/Сила) - вопросы 3, 11, 19
    { id: 3, text: "Сильный человек берет то, что хочет, не глядя на слабых. Это про тебя?", level: SpiralLevel.RED },
    { id: 11, text: "Чтобы добиться своего, иногда надо идти по головам?", level: SpiralLevel.RED },
    { id: 19, text: "Уважение заслуживают только сильные и властные?", level: SpiralLevel.RED },

    // Синий (Порядок/Долг) - вопросы 4, 12, 20
    { id: 4, text: "Четкие правила и авторитеты нужны для порядка. Да?", level: SpiralLevel.BLUE },
    { id: 12, text: "Поведение должно определяться долгом и моралью?", level: SpiralLevel.BLUE },
    { id: 20, text: "Обществу нужна строгая иерархия для порядка?", level: SpiralLevel.BLUE },

    // Оранжевый (Успех/Конкуренция) - вопросы 5, 13, 21
    { id: 5, text: "Успех — это деньги, статус, личные достижения. Так ли это?", level: SpiralLevel.ORANGE },
    { id: 13, text: "Прогресс двигают инновации и конкуренция?", level: SpiralLevel.ORANGE },
    { id: 21, text: "Личная свобода и рост важнее традиций?", level: SpiralLevel.ORANGE },

    // Зеленый (Гармония/Равенство) - вопросы 6, 14, 22
    { id: 6, text: "Гармония в отношениях важнее личного успеха. Да?", level: SpiralLevel.GREEN },
    { id: 14, text: "Справедливость — это равенство и уважение ко всем?", level: SpiralLevel.GREEN },
    { id: 22, text: "Лучшие решения принимаются сообща, по согласию?", level: SpiralLevel.GREEN },

    // Желтый (Гибкость/Система) - вопросы 7, 15, 23
    { id: 7, text: "Ключ к проблемам — гибкость и практичные решения. Да?", level: SpiralLevel.YELLOW },
    { id: 15, text: "Истина зависит от контекста, нет абсолютов?", level: SpiralLevel.YELLOW },
    { id: 23, text: "Мудрость — в понимании сложных систем?", level: SpiralLevel.YELLOW },

    // Бирюзовый (Глобальность) - вопросы 8, 16, 24
    { id: 8, text: "Все в мире связано, решения должны быть глобальными. Согласен?", level: SpiralLevel.TURQUOISE },
    { id: 16, text: "Человечество — часть экосистемы, нужно с ней жить в гармонии?", level: SpiralLevel.TURQUOISE },
    { id: 24, text: "Глобальные кризисы требуют единства человечества?", level: SpiralLevel.TURQUOISE },
  ];

  getQuestion(questionNumber: number): SimpleQuestion | null {
    return this.questions.find(q => q.id === questionNumber) || null;
  }

  getAllQuestions(): SimpleQuestion[] {
    return this.questions;
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }
}
