import {WeekDayEnum} from "../types/week-day.enum";
import {DisciplineTypeEnum} from "../types/discipline-type.enum";

export const mapUkrainianDayToEnglish = (ukrainianDay: string): WeekDayEnum | undefined => {
    switch (ukrainianDay) {
        case 'Понеділок':
            return WeekDayEnum.Monday;
        case 'Вівторок':
            return WeekDayEnum.Tuesday;
        case 'Середа':
            return WeekDayEnum.Wednesday;
        case 'Четвер':
            return WeekDayEnum.Thursday;
        case 'П`ятниця':
            return WeekDayEnum.Friday;
        default:
            return undefined;
    }
};

export const lessonTypeToUkranian = (type: DisciplineTypeEnum): string | undefined => {
    switch (type) {
        case DisciplineTypeEnum.Lecture:
            return 'Лекція';
        case DisciplineTypeEnum.Practice:
            return 'Практика';
        default:
            return undefined;
    }
};