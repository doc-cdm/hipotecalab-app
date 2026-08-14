import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = buttonRect.bottom + 8;
      let left = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
      
      // Adjust horizontal position if tooltip goes off screen
      if (left < 8) {
        left = 8;
      } else if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8;
      }
      
      // Adjust vertical position if tooltip goes off screen
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = buttonRect.top - tooltipRect.height - 8;
      }
      
      setPosition({ top, left });
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`text-slate-400 hover:text-white transition-colors ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <HelpCircle size={16} />
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-w-xs"
          style={{ top: position.top, left: position.left }}
        >
          <div className="p-3">
            <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-slate-700 border-l border-t border-slate-600 rotate-45"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpTooltip;
