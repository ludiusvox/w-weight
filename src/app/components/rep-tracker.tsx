import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const repSequence = [5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5];

export function RepTracker() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
        >
          <ChevronLeft className="size-5" />
        </Button>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 items-center justify-start min-w-max px-4">
            {repSequence.map((rep, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index === currentIndex
                      ? 'bg-blue-600 text-white scale-125 shadow-lg ring-4 ring-blue-200 dark:ring-blue-800'
                      : index < currentIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="font-bold">{rep}</span>
                </button>
                {index < repSequence.length - 1 && (
                  <div
                    className={`w-4 h-0.5 ${
                      index < currentIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === repSequence.length - 1}
          variant="outline"
          size="icon"
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
