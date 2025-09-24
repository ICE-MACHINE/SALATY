import adhkarData from '../json/Adhkar.json';
import { type Dhikr } from '../Types/adhkarType';
type AdhkarSection = keyof (typeof adhkarData)[number];
export function getAdhkar(section: AdhkarSection): Dhikr[] {
    // find the entry that contains the requested section and assert a partial record shape
    const foundSection = adhkarData.find(item => section in item) as Partial<Record<AdhkarSection, Dhikr[]>> | undefined;
    return foundSection?.[section] ?? [];
};

export function getTitleInArabic(section: AdhkarSection): string {
    switch(section) {
        case 'morning':
            return 'أذكار الصباح';
        case 'evening':
            return 'أذكار المساء';
        case 'sleep':
            return 'أذكار النوم';
        case "general":
            return 'أذكار عامة';
        case "prayer":
            return 'أذكار الصلاة';
        case "quran":
            return 'أذكار القرآن';
        case "mosque":
            return 'أذكار المسجد';
        case "travel":
            return 'أذكار السفر';
        case "education":
            return 'أذكار الدراسة';
        
        default:
            return '';
    }
}