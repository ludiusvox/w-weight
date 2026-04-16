import { createBrowserRouter } from 'react-router';
import { WorkoutPage } from './components/workout-page';
import { RootLayout } from './components/root-layout';
import { NavyBMICalculator } from './components/navy-bmi-calculator';
import { Stopwatch } from './components/stopwatch';
import { DoublePyramid } from './components/double-pyramid';
import { ExerciseDictionary } from './components/exercise-dictionary';
import { PrilepinsChart } from './components/prilepins-chart';

const standardMuscleGroups = [
  'Gluteus',
  'Hamstring',
  'Quad',
  'Calf',
  'Hip',
  'Groin',
  'Chest',
  'Shoulder',
  'Trapezoids',
  'Latissimus',
  'Bicep',
  'Tricep',
  'Core',
];

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <WorkoutPage muscleGroup="Gluteus" />,
      },
      ...standardMuscleGroups.map((group) => ({
        path: group.toLowerCase(),
        element: <WorkoutPage muscleGroup={group} />,
      })),
      {
        path: 'prilepins',
        element: <PrilepinsChart />,
      },
      {
        path: 'bmi-navy-calc',
        element: <NavyBMICalculator />,
      },
      {
        path: 'stopwatch',
        element: <Stopwatch />,
      },
      {
        path: 'double-pyramid',
        element: <DoublePyramid />,
      },
      {
        path: 'exercise-dictionary',
        element: <ExerciseDictionary />,
      },
    ],
  },
]);
