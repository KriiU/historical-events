import React, { memo, useCallback, useRef, useState } from 'react';
import { NavigationButtonsProps } from '../../../types';
import './NavigationButtons.scss';

/**
 * NavigationButtons Component
 * 
 * Кнопки навигации для переключения между событиями.
 * 
 * @param currentEvent - текущий индекс события
 * @param totalEvents - общее количество событий
 * @param onPrevClick - callback для кнопки "Предыдущий"
 * @param onNextClick - callback для кнопки "Следующий"
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = memo(({
  currentEvent,
  totalEvents,
  onPrevClick,
  onNextClick
}) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Функция для форматирования счетчика
  const getTotal = useCallback((length: number, index: number): string => {
    return `${String(index + 1).padStart(2,'0')}/${String(length).padStart(2,'0')}`;
  }, []);

  // Функция для воспроизведения звука и пульсации
  const handleClickWithEffect = useCallback((callback: () => void) => {
    // Создаем звуковой эффект
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Создаем простой звуковой сигнал с помощью Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Запускаем пульсацию
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);

    // Вызываем оригинальный callback
    callback();
  }, []);

  const handlePrevClick = useCallback(() => {
    handleClickWithEffect(onPrevClick);
  }, [handleClickWithEffect, onPrevClick]);

  const handleNextClick = useCallback(() => {
    handleClickWithEffect(onNextClick);
  }, [handleClickWithEffect, onNextClick]);

  return (
    <div className="historic-dates__navigation navigation">
      <p className="navigation__total">
        {getTotal(totalEvents, currentEvent)}
      </p>
      
      <div className={`navigation__buttons control-buttons ${isPulsing ? 'pulsing' : ''}`}>
        <button 
          className="control-buttons__default control-buttons__prev"
          onClick={handlePrevClick}
          disabled={currentEvent === 0}
        />
        <button
          className="control-buttons__default control-buttons__next"
          onClick={handleNextClick}
          disabled={currentEvent === totalEvents - 1}
        />
      </div>
    </div>
  );
});

// Отображаемое имя для React DevTools
NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons; 