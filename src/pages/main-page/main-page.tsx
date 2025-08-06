import React, { useRef } from 'react';
import { historicDates } from '../../constants/historic-dates';
import { DateRange, NavigationButtons, ControlButtons } from '../../components/ui';
import { SpinnerCircle, EventSlider } from '../../components/features';
import './main-page.scss';
import gsap from "gsap";

function MainPage() {
  const numberOfEvents = historicDates.length;
  const angleBetweenDots = 360 / numberOfEvents;
  const defaultTimeOfRotation = 300;

  const sliderRef = useRef<HTMLDivElement>(null);
  const mainCircleRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);
  
  const [angle, setAngle] = React.useState<number>(angleBetweenDots);
  const [currentEvent, setCurrentEvent] = React.useState<number>(0);
  const [timeOfRotation, setTimeOfRotation] = React.useState<number>(defaultTimeOfRotation);
  const [startDate, setStartDate] = React.useState<number>(Number(historicDates[0].events[0].date));
  const [endDate, setEndDate] = React.useState<number>(Number(historicDates[0].events[historicDates.length - 1].date));

  // Убираем дублирующую логику, так как теперь слайдер сам управляет своей видимостью

  function fadeIt(fn: Function): void {
    // Теперь слайдер сам управляет своей видимостью
    const timer = setTimeout(() => {
      fn();
      clearTimeout(timer);
    }, 150);
  }
  
  function loadPrev(): void {
    loadThis(currentEvent - 1);
  }

  function loadNext(): void {
    loadThis(currentEvent + 1);
  }

  function animateDatesRange(index: number): void {
    const newStartDate = Number(historicDates[index].events[0].date);
    const startRange = newStartDate - startDate;
    const newEndDate = Number(historicDates[index].events[historicDates.length - 1].date);
    const endRange = newEndDate - endDate;
    const animationTime = (timeOfRotation + 300) / 1000;

    gsap.to(startDateRef.current, {
      duration: animationTime,
      textContent: `+=${startRange}`,
      roundProps: "textContent",
      ease: "none",
      onUpdate: () => setStartDate(newStartDate)
    });
    gsap.to(endDateRef.current, {
      duration: animationTime,
      textContent: `+=${endRange}`,
      roundProps: "textContent",
      ease: "none",
      onUpdate: () => setEndDate(newEndDate)
    });
  }

  function loadThis(index: number): void {
    animateDatesRange(index);

    mainCircleRef.current?.children[index].classList.add("spinner__shoulder_active");
    
    const angleOfRotation = angleBetweenDots - index * angleBetweenDots;
    setTimeOfRotation(Math.abs(currentEvent - index) * defaultTimeOfRotation);
    const timer = setTimeout(() => {
      setAngle(angleOfRotation);
      clearTimeout(timer);
    }, 300);

    fadeIt(() => setCurrentEvent(index));
  }

  return (
    <main className='main'>
      <section className='historic-dates'>
        <h1 className='historic-dates__heading'>Исторические даты</h1>
        
        <DateRange
          startDate={startDate}
          endDate={endDate}
          startDateRef={startDateRef}
          endDateRef={endDateRef}
        />
        
        <SpinnerCircle
          historicDates={historicDates}
          currentEvent={currentEvent}
          angle={angle}
          timeOfRotation={timeOfRotation}
          numberOfEvents={numberOfEvents}
          mainCircleRef={mainCircleRef}
          onEventClick={loadThis}
        />
        
        <NavigationButtons
          currentEvent={currentEvent}
          totalEvents={numberOfEvents}
          onPrevClick={loadPrev}
          onNextClick={loadNext}
        />
        
        <EventSlider
          currentCategory={historicDates[currentEvent]}
          sliderRef={sliderRef}
        />
        
        <ControlButtons
          historicDates={historicDates}
          currentEvent={currentEvent}
          onEventClick={loadThis}
        />
      </section>
    </main>
  );
}

export default MainPage;
