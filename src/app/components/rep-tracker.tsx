import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface RepTrackerProps {
  repSequence: number[];
}

export function RepTracker({ repSequence }: RepTrackerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Handle empty or undefined sequence
  if (!repSequence || repSequence.length === 0) {
    return (
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="dark:text-white">Rep Tracker</h3>
          <Button onClick={() => setCurrentIndex(0)} variant="outline" size="sm">
            <RotateCcw className="size-4 mr-2" />
            Reset
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
          No rep sequence available. Generate a pyramid to start tracking.
        </p>
      </Card>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < repSequence.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  // Auto-scroll to active bubble when currentIndex changes
  useEffect(() => {
    if (bubbleRefs.current[currentIndex] && scrollContainerRef.current) {
      const activeBubble = bubbleRefs.current[currentIndex];
      const container = scrollContainerRef.current;
      
      if (activeBubble) {
        // Calculate position relative to container
        const bubbleRect = activeBubble.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Scroll to center the active bubble
        const offset = bubbleRect.left - containerRect.left - containerRect.width / 2 + bubbleRect.width / 2;
        
        container.scrollTo({
          left: offset,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dark:text-white">Rep Tracker</h3>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCcw className="size-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          size="icon"
          className="flex-shrink-0"
        >
          <ChevronLeft className="size-5" />
        </Button>

        {/* Scrollable container for bubbles */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-2 items-center justify-start py-2 min-w-full">
            {repSequence.map((rep, index) => (
              <button
                key={index}
                ref={(el) => bubbleRefs.current[index] = el}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  index === currentIndex
                    ? 'bg-blue-600 text-white scale-125 shadow-lg ring-4 ring-blue-200 dark:ring-blue-800'
                    : index < currentIndex
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="font-bold">{rep}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === repSequence.length - 1}
          variant="outline"
          size="icon"
          className="flex-shrink-0"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current Rep: <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{repSequence[currentIndex]}</span>
          {' '}
          ({currentIndex + 1} of {repSequence.length})
        </p>
      </div>
    </Card>
  );
}

export default RepTracker;
