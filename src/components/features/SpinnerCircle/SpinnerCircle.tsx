import React from 'react';
import { SpinnerCircleProps } from '../../../types';
import './SpinnerCircle.scss';

const SpinnerCircle: React.FC<SpinnerCircleProps> = ({
  historicDates,
  currentEvent,
  angle,
  timeOfRotation,
  numberOfEvents,
  mainCircleRef,
  onEventClick
}) => {
  return (
    <div className="historic-dates__spinner spinner">
      <div 
        ref={mainCircleRef} 
        className='spinner__main-circle' 
        style={{ 
          "--count": numberOfEvents, 
          "--angle": angle + "deg", 
          "--time": timeOfRotation + "ms",
          "--delay": timeOfRotation + 300 + "ms",
        } as React.CSSProperties}
      >
        {historicDates.map((item, index) => {
          const { title } = item;
          const idx = index + 1;
          return (
            <div 
              key={index} 
              className={"spinner__shoulder " + (currentEvent === index ? 'spinner__shoulder_active' : '')} 
              style={{ "--i": idx } as React.CSSProperties}
              onClick={() => onEventClick(index)}
            >
              <div className='spinner__circle-area'>
                <p className='spinner__circle'>
                  {idx}
                  <span className='spinner__title'>{title}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpinnerCircle; 