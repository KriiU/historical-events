import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EventSliderProps } from '../../../types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './EventSlider.scss';

/**
 * EventSlider Component
 * 
 * Компонент слайдера для отображения исторических событий.
 * Использует Swiper для плавной прокрутки и анимаций.
 * 
 * @param currentCategory - текущая категория событий
 * @param sliderRef - ref для контейнера слайдера
 */
const EventSlider: React.FC<EventSliderProps> = memo(({
  currentCategory,
  sliderRef
}) => {
  // Refs для управления слайдером
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Локальное состояние для анимаций
  const [isPulsing, setIsPulsing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Функция для воспроизведения звука и пульсации
   * Создает звуковой эффект с помощью Web Audio API
   */
  const playSoundAndPulse = useCallback(() => {
    // Создаем звуковой эффект
    if (!audioRef.current) {
      audioRef.current = new Audio();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    }

    // Запускаем пульсацию
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 400);
  }, []);

  /**
   * Обработчик изменения слайда
   */
  const handleSlideChange = useCallback(() => {
    playSoundAndPulse();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('EventSlider: Slide changed', {
        currentIndex: swiperRef.current?.activeIndex,
        totalSlides: currentCategory.events.length
      });
    }
  }, [playSoundAndPulse, currentCategory.events.length]);

  /**
   * Обработчик клика по кнопкам навигации
   */
  const handleButtonClick = useCallback(() => {
    playSoundAndPulse();
  }, [playSoundAndPulse]);

  /**
   * Эффект для плавного перехода при смене категории
   */
  useEffect(() => {
    // Сохраняем текущую позицию слайдера
    const currentSlide = swiperRef.current?.activeIndex || 0;
    
    // Плавно скрываем слайдер
    setIsVisible(false);
    
    setTimeout(() => {
      // Показываем слайдер с новыми данными
      setIsVisible(true);
      
      // Восстанавливаем позицию слайдера (если возможно)
      setTimeout(() => {
        if (swiperRef.current && currentSlide < currentCategory.events.length) {
          swiperRef.current.slideTo(currentSlide, 0);
        }
      }, 50);
    }, 150);
  }, [currentCategory]);

  // CSS классы для стилизации
  const sliderClassName = `historic-dates__slider slider${isPulsing ? ' slider-pulsing' : ''}${isVisible ? ' slider_show' : ''}`;

  // Настройки Swiper для разных разрешений
  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: false,
      allowTouchMove: true
    },
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: false,
      allowTouchMove: true
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
      centeredSlides: false,
      allowTouchMove: true
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
      centeredSlides: false,
      allowTouchMove: true
    },
    1440: {
      slidesPerView: 4,
      spaceBetween: 60,
      centeredSlides: false,
      allowTouchMove: true
    }
  };

  return (
    <div 
      ref={sliderRef} 
      className={sliderClassName}
      aria-label={`Слайдер событий категории: ${currentCategory.title}`}
    >
      {/* Мобильный заголовок */}
      <p className='slider__mobile-title'>{currentCategory.title}</p>
      
      {/* Кнопка "Назад" */}
      <button 
        className='slider__btn slider__btn_prev' 
        onClick={handleButtonClick}
        aria-label="Предыдущий слайд"
      />
      
      {/* Swiper контейнер */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={60}
        slidesPerView={1}
        centeredSlides={false}
        watchOverflow={true}
        allowTouchMove={true}
        resistance={true}
        resistanceRatio={0.85}
        breakpoints={swiperBreakpoints}
        navigation={{
          prevEl: '.slider__btn_prev',
          nextEl: '.slider__btn_next',
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper: SwiperType) => {
          swiperRef.current = swiper;
          // Убеждаемся, что слайдер правильно инициализирован
          swiper.update();
        }}
        onReachEnd={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('EventSlider: Reached end of slider');
          }
        }}
      >
        {/* Рендер слайдов */}
        {currentCategory.events.map((item, index) => {
          const { date, description } = item;
          return (
            <SwiperSlide 
              key={`${currentCategory.title}-${index}`}
              className='slider__slide'
              aria-label={`Событие ${index + 1} из ${currentCategory.events.length}`}
            >
              <p className='slider__year'>{date}</p>
              <p className='slider__description'>{description}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>
      
      {/* Кнопка "Вперед" */}
      <button 
        className='slider__btn slider__btn_next' 
        onClick={handleButtonClick}
        aria-label="Следующий слайд"
      />
    </div>
  );
});

// Отображаемое имя для React DevTools
EventSlider.displayName = 'EventSlider';

export default EventSlider; 