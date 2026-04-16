import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Stopwatch } from './stopwatch';
import { EpleyCalculator } from './epley-calculator';
import { DoublePyramid } from './double-pyramid';
import { RomanChairSection } from './roman-chair-section';
import { LandmineSection } from './landmine-section';
import { ProcedureDisplay } from './procedure-display';

interface WorkoutPageProps {
  muscleGroup: string;
}

export function WorkoutPage({ muscleGroup }: WorkoutPageProps) {
  const [notes, setNotes] = useState('');
  const [pyramidWeight, setPyramidWeight] = useState<string>('');

  // Core-specific sections
  const isCoreTab = muscleGroup === 'Core';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">{muscleGroup} Workout</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Plan and track your {muscleGroup.toLowerCase()} training session
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Core-Specific Instructional Sections */}
      {isCoreTab && (
        <>
          <RomanChairSection />
          <LandmineSection />
          <ProcedureDisplay />
        </>
      )}

      {/* Tracking Tools Section (Available for all tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Epley Calculator - passes weight to DoublePyramid via state */}
        <EpleyCalculator onSetWeight={setPyramidWeight} />

        {/* Double Pyramid Tracker - receives initial weight from Epley */}
        <DoublePyramid initialWeight={pyramidWeight} />
      </div>

      {/* Stopwatch & Rest Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Stopwatch />
      </div>

      {/* Notes Section */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Session Notes</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Track your progress and observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="notes" className="dark:text-white">Notes</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your workout notes here..."
            rows={4}
            className="w-full mt-2 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </CardContent>
      </Card>

      {/* Quick Links to Other Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/double-pyramid" className="block p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Double Pyramid</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track pyramid sets with weight and reps</p>
        </a>
        <a href="/exercise-dictionary" className="block p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Exercise Dictionary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse all available exercises</p>
        </a>
        <a href="/bmi-navy-calc" className="block p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">BMI Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Calculate body fat percentage</p>
        </a>
      </div>
    </div>
  );
}

export default WorkoutPage;
