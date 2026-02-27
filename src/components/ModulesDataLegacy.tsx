import { Fingerprint, BookOpen, Compass, Scale, Heart, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // tvůj Supabase client
// import { Fingerprint, BookOpen, Compass, Scale, Heart } from 'lucide-react'; // ikony

export const getModulesLegacy = (t) => [
  {
    id: 1,
    icon: Fingerprint,
    titleKey: 'm1Title',
    subtitleKey: 'm1Subtitle',
    descriptionKey: 'm1Description',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    accentColor: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    lessons: [
      { id: 'l1', titleKey: 'm1L1Title', contentKey: 'm1L1Content', exerciseKey: 'm1L1Exercise' },
      { id: 'l2', titleKey: 'm1L2Title', contentKey: 'm1L2Content', exerciseKey: 'm1L2Exercise' },
      { id: 'l3', titleKey: 'm1L3Title', contentKey: 'm1L3Content', exerciseKey: 'm1L3Exercise' },
      { id: 'l4', titleKey: 'm1L4Title', contentKey: 'm1L4Content', exerciseKey: 'm1L4Exercise' },
      { id: 'l5', titleKey: 'm1L5Title', contentKey: 'm1L5Content', exerciseKey: 'm1L5Exercise' },
    ]
  },
  {
    id: 2,
    icon: BookOpen,
    titleKey: 'm2Title',
    subtitleKey: 'm2Subtitle',
    descriptionKey: 'm2Description',
    color: 'from-violet-400 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
    accentColor: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    lessons: [
      { id: 'l1', titleKey: 'm2L1Title', contentKey: 'm2L1Content', exerciseKey: 'm2L1Exercise' },
      { id: 'l2', titleKey: 'm2L2Title', contentKey: 'm2L2Content', exerciseKey: 'm2L2Exercise' },
      { id: 'l3', titleKey: 'm2L3Title', contentKey: 'm2L3Content', exerciseKey: 'm2L3Exercise' },
      { id: 'l4', titleKey: 'm2L4Title', contentKey: 'm2L4Content', exerciseKey: 'm2L4Exercise' },
      { id: 'l5', titleKey: 'm2L5Title', contentKey: 'm2L5Content', exerciseKey: 'm2L5Exercise' },
    ]
  },
  {
    id: 3,
    icon: Compass,
    titleKey: 'm3Title',
    subtitleKey: 'm3Subtitle',
    descriptionKey: 'm3Description',
    color: 'from-emerald-400 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    accentColor: '#10b981',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
    lessons: [
      { id: 'l1', titleKey: 'm3L1Title', contentKey: 'm3L1Content', exerciseKey: 'm3L1Exercise' },
      { id: 'l2', titleKey: 'm3L2Title', contentKey: 'm3L2Content', exerciseKey: 'm3L2Exercise' },
      { id: 'l3', titleKey: 'm3L3Title', contentKey: 'm3L3Content', exerciseKey: 'm3L3Exercise' },
      { id: 'l4', titleKey: 'm3L4Title', contentKey: 'm3L4Content', exerciseKey: 'm3L4Exercise' },
      { id: 'l5', titleKey: 'm3L5Title', contentKey: 'm3L5Content', exerciseKey: 'm3L5Exercise' },
    ]
  },
  {
    id: 4,
    icon: Scale,
    titleKey: 'm4Title',
    subtitleKey: 'm4Subtitle',
    descriptionKey: 'm4Description',
    color: 'from-sky-400 to-blue-600',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    accentColor: '#0ea5e9',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=80',
    lessons: [
      { id: 'l1', titleKey: 'm4L1Title', contentKey: 'm4L1Content', exerciseKey: 'm4L1Exercise' },
      { id: 'l2', titleKey: 'm4L2Title', contentKey: 'm4L2Content', exerciseKey: 'm4L2Exercise' },
      { id: 'l3', titleKey: 'm4L3Title', contentKey: 'm4L3Content', exerciseKey: 'm4L3Exercise' },
      { id: 'l4', titleKey: 'm4L4Title', contentKey: 'm4L4Content', exerciseKey: 'm4L4Exercise' },
      { id: 'l5', titleKey: 'm4L5Title', contentKey: 'm4L5Content', exerciseKey: 'm4L5Exercise' },
    ]
  },
  {
    id: 5,
    icon: Heart,
    titleKey: 'm5Title',
    subtitleKey: 'm5Subtitle',
    descriptionKey: 'm5Description',
    color: 'from-rose-400 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    accentColor: '#f43f5e',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80',
    lessons: [
      { id: 'l1', titleKey: 'm5L1Title', contentKey: 'm5L1Content', exerciseKey: 'm5L1Exercise' },
      { id: 'l2', titleKey: 'm5L2Title', contentKey: 'm5L2Content', exerciseKey: 'm5L2Exercise' },
      { id: 'l3', titleKey: 'm5L3Title', contentKey: 'm5L3Content', exerciseKey: 'm5L3Exercise' },
      { id: 'l4', titleKey: 'm5L4Title', contentKey: 'm5L4Content', exerciseKey: 'm5L4Exercise' },
      { id: 'l5', titleKey: 'm5L5Title', contentKey: 'm5L5Content', exerciseKey: 'm5L5Exercise' },
    ]
  }
];

// Mapování icon_name → React komponenty
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Fingerprint,
  BookOpen,
  Compass,
  Scale,
  Heart,
};

export const getModulesFromSupabase = async (t: (key: string) => string) => {
  try {
    // Načti modules + jejich lessons v jednom query
    const { data: modulesWithLessons, error } = await supabase
      .from('modules')
      .select(`
        id, slug, icon_name,
        title_key, subtitle_key, description_key,
        color, bg_color, text_color, border_color, accent_color, image_url,
        lessons (
          lesson_key, order_index,
          title_key, content_key, exercise_key
        )
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('Chyba při načítání modulů:', error);
      throw error;
    }

    if (!modulesWithLessons || modulesWithLessons.length === 0) {
      console.warn('Žádné moduly nenalezeny');
      return [];
    }

    // Transformuj na přesně stejnou strukturu jako getModulesLegacy
    return modulesWithLessons.map((module) => ({
      id: module.id,
      icon: iconMap[module.icon_name as keyof typeof iconMap] || Fingerprint, // fallback
      titleKey: module.title_key,
      subtitleKey: module.subtitle_key,
      descriptionKey: module.description_key,
      color: module.color,
      bgColor: module.bg_color, // pozor: v DB je bg_color, v JS bgColor
      textColor: module.text_color,
      borderColor: module.border_color,
      accentColor: module.accent_color,
      image: module.image_url,
      lessons: (module.lessons || [])
        .sort((a, b) => a.order_index - b.order_index) // seřaď podle order_index
        .map((lesson) => ({
          id: lesson.lesson_key, // 'l1', 'l2'...
          titleKey: lesson.title_key,
          contentKey: lesson.content_key,
          exerciseKey: lesson.exercise_key,
        })),
    }));
  } catch (error) {
    console.error('getModulesFromSupabase selhalo:', error);
    // Fallback na legacy data? Nebo prázdné pole
    return [];
  }
};