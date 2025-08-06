import { useCallback, useMemo } from 'react';

interface UseDateRangeProps {
  startDate: number;
  endDate: number;
}

interface UseDateRangeReturn {
  isValidDate: (date: number) => boolean;
  isStartDateValid: boolean;
  isEndDateValid: boolean;
  isRangeValid: boolean;
  formatDate: (date: number) => string;
  getDateRange: () => { start: number; end: number };
  validateRange: () => { isValid: boolean; errors: string[] };
}

/**
 * Кастомный хук для работы с диапазоном дат
 * 
 * @param startDate - начальная дата
 * @param endDate - конечная дата
 * @returns объект с методами для работы с датами
 */
export const useDateRange = ({ startDate, endDate }: UseDateRangeProps): UseDateRangeReturn => {
  // Валидация отдельной даты
  const isValidDate = useCallback((date: number): boolean => {
    return !isNaN(date) && date > 0 && date <= 9999;
  }, []);

  // Проверка валидности дат
  const isStartDateValid = useMemo(() => isValidDate(startDate), [startDate, isValidDate]);
  const isEndDateValid = useMemo(() => isValidDate(endDate), [endDate, isValidDate]);

  // Проверка логичности диапазона
  const isRangeValid = useMemo(() => {
    if (!isStartDateValid || !isEndDateValid) return false;
    return startDate <= endDate;
  }, [startDate, endDate, isStartDateValid, isEndDateValid]);

  // Форматирование даты для отображения
  const formatDate = useCallback((date: number): string => {
    if (!isValidDate(date)) {
      return '0000';
    }
    return date.toString();
  }, [isValidDate]);

  // Получение диапазона дат
  const getDateRange = useCallback(() => {
    return {
      start: startDate,
      end: endDate
    };
  }, [startDate, endDate]);

  // Полная валидация диапазона с ошибками
  const validateRange = useCallback(() => {
    const errors: string[] = [];

    if (!isStartDateValid) {
      errors.push('Начальная дата недействительна');
    }

    if (!isEndDateValid) {
      errors.push('Конечная дата недействительна');
    }

    if (isStartDateValid && isEndDateValid && startDate > endDate) {
      errors.push('Начальная дата не может быть больше конечной');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [startDate, endDate, isStartDateValid, isEndDateValid]);

  return {
    isValidDate,
    isStartDateValid,
    isEndDateValid,
    isRangeValid,
    formatDate,
    getDateRange,
    validateRange
  };
}; 