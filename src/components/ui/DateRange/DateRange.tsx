import React, { memo, useCallback, useState, useEffect } from 'react';
import { DateRangeProps } from '../../../types';
import { useDateRange } from '../../../hooks/useDateRange';
import './DateRange.scss';

/**
 * DateRange Component
 * 
 * Компонент для отображения диапазона дат с анимированным изменением.
 * Использует refs для GSAP анимаций.
 * 
 * @param startDate - начальная дата диапазона
 * @param endDate - конечная дата диапазона
 * @param startDateRef - ref для начальной даты (для GSAP)
 * @param endDateRef - ref для конечной даты (для GSAP)
 * @param onDateChange - опциональный callback для обработки изменений
 * @param className - опциональный класс для дополнительной стилизации
 */
const DateRange: React.FC<DateRangeProps> = memo(({
  startDate,
  endDate,
  startDateRef,
  endDateRef,
  onDateChange,
  className
}) => {
  // Локальное состояние для анимаций
  const [isHovered, setIsHovered] = useState(false);
  const [activeDate, setActiveDate] = useState<'start' | 'end' | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Использование кастомного хука для работы с датами
  const {
    isRangeValid,
    formatDate,
    validateRange
  } = useDateRange({ startDate, endDate });

  // Валидация с выводом ошибок в консоль
  const validation = validateRange();
  if (!validation.isValid && process.env.NODE_ENV === 'development') {
    console.warn('DateRange: Validation errors:', validation.errors);
  }

  // CSS классы для стилизации с анимациями
  const rangeClassName = `range${!isRangeValid ? ' range--invalid' : ''}${isHovered ? ' range--hovered' : ''}${pulseAnimation ? ' range--pulse' : ''}${className ? ` ${className}` : ''}`;

  // Эффект для пульсации при изменении дат
  useEffect(() => {
    setPulseAnimation(true);
    const timer = setTimeout(() => setPulseAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [startDate, endDate]);

  // Обработчик клика с анимацией
  const handleDateClick = useCallback((dateType: 'start' | 'end') => {
    setActiveDate(dateType);
    
    // Анимация при клике
    const element = dateType === 'start' ? startDateRef.current : endDateRef.current;
    if (element) {
      element.style.transform = 'scale(1.1)';
      setTimeout(() => {
        if (element) element.style.transform = 'scale(1)';
      }, 150);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`DateRange: ${dateType} date clicked`, {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        validation: validation
      });
    }

    // Вызов callback если предоставлен
    if (onDateChange) {
      onDateChange(startDate, endDate);
    }

    // Сброс активного состояния
    setTimeout(() => setActiveDate(null), 300);
  }, [startDate, endDate, formatDate, validation, onDateChange, startDateRef, endDateRef]);

  // Обработчики hover эффектов
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div 
      className="historic-dates__range"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={rangeClassName}>
        <p 
          className={`range_start ${activeDate === 'start' ? 'range_start--active' : ''}`}
          ref={startDateRef}
          onClick={() => handleDateClick('start')}
          title={`Начальная дата: ${formatDate(startDate)}`}
          aria-label={`Начальная дата диапазона: ${formatDate(startDate)}`}
        >
          {formatDate(startDate)}
          {/* Индикатор активности */}
          {activeDate === 'start' && (
            <span className="range__indicator">✨</span>
          )}
        </p>
        
        {/* Анимированный разделитель */}
        <div className="range__separator">
          <span className="range__separator-line"></span>
          <span className="range__separator-dot">•</span>
          <span className="range__separator-line"></span>
        </div>
        
        <p 
          className={`range_end ${activeDate === 'end' ? 'range_end--active' : ''}`}
          ref={endDateRef}
          onClick={() => handleDateClick('end')}
          title={`Конечная дата: ${formatDate(endDate)}`}
          aria-label={`Конечная дата диапазона: ${formatDate(endDate)}`}
        >
          {formatDate(endDate)}
          {/* Индикатор активности */}
          {activeDate === 'end' && (
            <span className="range__indicator">✨</span>
          )}
        </p>
      </div>
      
      {/* Индикатор ошибки */}
      {process.env.NODE_ENV === 'development' && !validation.isValid && (
        <div className="range__error-indicator">
          ⚠️ {validation.errors.join(', ')}
        </div>
      )}
    </div>
  );
});

// Отображаемое имя для React DevTools
DateRange.displayName = 'DateRange';

export default DateRange; 