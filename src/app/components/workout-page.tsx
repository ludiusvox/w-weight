import { EpleyCalculator } from './epley-calculator';
import { ProcedureDisplay } from './procedure-display';
import { Stopwatch } from './stopwatch';
import { RomanChairSection } from './roman-chair-section';
import { LandmineSection } from './landmine-section';
import { RepTracker } from './rep-tracker';
import { PrilepinsChart } from './prilepins-chart';

interface WorkoutPageProps {
  muscleGroup: string;
}

export function WorkoutPage({ muscleGroup }: WorkoutPageProps) {
  const isCore = muscleGroup === 'Core';
  const isPrilepins = muscleGroup === 'Prilepins';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 dark:text-white">{muscleGroup} Training</h1>
        
        {isPrilepins ? (
          <PrilepinsChart />
        ) : (
          <div className="space-y-6">
            <EpleyCalculator />
            <ProcedureDisplay />
            {isCore && (
              <>
                <RomanChairSection />
                <LandmineSection />
              </>
            )}
            <Stopwatch />
            <RepTracker />
          </div>
        )}
      </div>
    </div>
  );
}