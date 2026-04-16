import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { EXERCISE_LIBRARY, type ExerciseCategoryKey } from '../data/exercise-library';

interface ExerciseLibraryDisplayProps {
  initialCategory?: ExerciseCategoryKey;
}

export function ExerciseLibraryDisplay({ initialCategory = 'upperBody' }: ExerciseLibraryDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<ExerciseCategoryKey>(initialCategory);

  const categories: { key: ExerciseCategoryKey; title: string }[] = [
    { key: 'upperBody', title: 'Upper Body' },
    { key: 'lowerBody', title: 'Lower Body' },
    { key: 'trunkCore', title: 'Trunk / Core' },
    { key: 'totalBody', title: 'Total Body (Compound)' }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Exercise Library</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Sample Resistance Exercises for Tactical Athletes - Reference Guide
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.title} ({EXERCISE_LIBRARY[cat.key].length})
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXERCISE_LIBRARY[activeCategory].map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {exercise.name}
              </h3>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {exercise.id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">
            {categories.find((c) => c.key === activeCategory)?.title} Category
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            This category contains exercises that primarily target the specified muscle groups. 
            These movements are essential for building functional strength and athletic performance.
          </p>
        </div>

        {/* Total Count */}
        <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
          Showing {EXERCISE_LIBRARY[activeCategory].length} exercises in{' '}
          {categories.find((c) => c.key === activeCategory)?.title.toLowerCase()}
          {' '}| Total: {Object.values(EXERCISE_LIBRARY).reduce((acc, curr) => acc + curr.length, 0)} exercises
        </div>
      </CardContent>
    </Card>
  );
}

export default ExerciseLibraryDisplay;
