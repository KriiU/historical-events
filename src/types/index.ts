export interface HistoricEvent {
  date: string;
  description: string;
}

export interface HistoricCategory {
  title: string;
  events: HistoricEvent[];
}

export interface DateRangeProps {
  startDate: number;
  endDate: number;
  startDateRef: React.RefObject<HTMLDivElement | null>;
  endDateRef: React.RefObject<HTMLDivElement | null>;
  /** Опциональный callback для обработки изменений дат */
  onDateChange?: (startDate: number, endDate: number) => void;
  /** Опциональный класс для дополнительной стилизации */
  className?: string;
}

export interface SpinnerCircleProps {
  historicDates: HistoricCategory[];
  currentEvent: number;
  angle: number;
  timeOfRotation: number;
  numberOfEvents: number;
  mainCircleRef: React.RefObject<HTMLDivElement | null>;
  onEventClick: (index: number) => void;
}

export interface NavigationButtonsProps {
  currentEvent: number;
  totalEvents: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export interface EventSliderProps {
  currentCategory: HistoricCategory;
  sliderRef: React.RefObject<HTMLDivElement | null>;
}

export interface ControlButtonsProps {
  historicDates: HistoricCategory[];
  currentEvent: number;
  onEventClick: (index: number) => void;
} 