import React, { useRef, useState, useCallback } from 'react';
import { ControlButtonsProps } from '../../../types';
import './ControlButtons.scss';

const ControlButtons: React.FC<ControlButtonsProps> = ({
  historicDates,
  currentEvent,
  onEventClick
}) => {
  const [pulsingButton, setPulsingButton] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Функция для воспроизведения звука и пульсации
  const handleButtonClick = useCallback((index: number) => {
    // Создаем звуковой эффект
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Создаем простой звуковой сигнал с помощью Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.12);
      
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.12);
    }

    // Запускаем пульсацию для конкретной кнопки
    setPulsingButton(index);
    setTimeout(() => setPulsingButton(null), 300);

    // Вызываем оригинальный callback
    onEventClick(index);
  }, [onEventClick]);

  return (
    <div className='events__control-buttons'>
      {historicDates.map((item, index) => (
        <button 
          key={index}
          className={`events__button ${currentEvent === index ? 'events__button_active' : ''} ${pulsingButton === index ? 'button-pulsing' : ''}`}
          onClick={() => handleButtonClick(index)}
        />
      ))}
    </div>
  );
};

export default ControlButtons; 