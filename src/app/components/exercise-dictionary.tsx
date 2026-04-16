import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EXERCISE_LIBRARY, type ExerciseCategoryKey } from '../data/exercise-library';

export function ExerciseDictionary() {
  const [activeCategory, setActiveCategory] = useState<ExerciseCategoryKey>('upperBody');
  const [customExercises, setCustomExercises] = useState<string[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');

  const handleAddExercise = () => {
    if (newExerciseName.trim()) {
      setCustomExercises([...customExercises, newExerciseName]);
      setNewExerciseName('');
    }
  };

  const handleRemoveExercise = (index: number) => {
    setCustomExercises(customExercises.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Exercise Dictionary Section */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Exercise Dictionary</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Complete reference of resistance exercises for tactical athletes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
            {Object.keys(EXERCISE_LIBRARY).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as ExerciseCategoryKey)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === key
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {EXERCISE_LIBRARY[key as ExerciseCategoryKey].map(e => e.name).slice(0, 3).join(', ')}... ({EXERCISE_LIBRARY[key as ExerciseCategoryKey].length})
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
              {activeCategory.replace(/([A-Z])/g, ' $1').trim()} Category
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              This category contains exercises that primarily target the specified muscle groups. 
              These movements are essential for building functional strength and athletic performance.
            </p>
          </div>

          {/* Total Count */}
          <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
            Showing {EXERCISE_LIBRARY[activeCategory].length} exercises in{' '}
            {activeCategory.replace(/([A-Z])/g, ' $1').trim()}
            {' '}| Total: {Object.values(EXERCISE_LIBRARY).reduce((acc, curr) => acc + curr.length, 0)} exercises
          </div>
        </CardContent>
      </Card>

      {/* Custom Exercise Builder */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Add Custom Exercises</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Create your own exercise list for quick reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Enter custom exercise name..."
              className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            <Button onClick={handleAddExercise}>Add</Button>
          </div>

          {customExercises.length > 0 && (
            <ul className="space-y-2">
              {customExercises.map((exercise, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{exercise}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {customExercises.length === 0 && (
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              No custom exercises added yet. Use the input above to add your own.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ExerciseDictionary;
