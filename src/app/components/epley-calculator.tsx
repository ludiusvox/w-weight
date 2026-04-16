import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface EpleyCalculatorProps {
  onSetWeight?: (weight: string) => void;
}

export function EpleyCalculator({ onSetWeight }: EpleyCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const calculateOneRM = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      return null;
    }

    // Epley Formula: 1RM = w(1 + r/30)
    const oneRM = w * (1 + r / 30);
    return oneRM.toFixed(1);
  };

  const oneRM = calculateOneRM();
  const seventyPercent = oneRM ? (parseFloat(oneRM) * 0.7).toFixed(1) : null;
  const eightyPercent = oneRM ? (parseFloat(oneRM) * 0.8).toFixed(1) : null;

  const handleSetWeight = (percentage: number, weightValue: string) => {
    if (onSetWeight) {
      onSetWeight(weightValue);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Epley Formula - 1RM Calculator</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Estimate your one-rep max using the Epley formula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula Display */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-center font-mono text-lg dark:text-white">
            1RM = w × (1 + r/30)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            w = weight lifted, r = repetitions completed
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="dark:text-gray-200">Weight (lbs/kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="reps" className="dark:text-gray-200">Repetitions</Label>
            <Input
              id="reps"
              type="number"
              placeholder="Enter reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* 1RM Result */}
        {oneRM && (
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-4 rounded-lg text-center">
            <p className="text-sm mb-1">Estimated 1RM</p>
            <p className="text-3xl font-bold">{oneRM} lbs/kg</p>
          </div>
        )}

        {/* 70% and 80% Calculations */}
        {seventyPercent && eightyPercent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Recommended Training Weights</h3>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleSetWeight(70, seventyPercent)}
                className="flex-1 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4 rounded-lg text-center border-2 border-green-300 dark:border-green-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <p className="text-xs text-green-800 dark:text-green-200 mb-1 font-medium">70% of 1RM</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">{seventyPercent}</p>
              </button>
              <button
                onClick={() => handleSetWeight(80, eightyPercent)}
                className="flex-1 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg text-center border-2 border-purple-300 dark:border-purple-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <p className="text-xs text-purple-800 dark:text-purple-200 mb-1 font-medium">80% of 1RM</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{eightyPercent}</p>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Click either bubble to set that weight in your Double Pyramid tracker
            </p>
          </div>
        )}

        {/* Instructions */}
        {!oneRM && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">How to Use</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Enter a weight you can lift for 3-5 reps</li>
              <li>The calculator will estimate your one-rep max (1RM)</li>
              <li>Click the 70% or 80% bubble to set that weight in Double Pyramid tracker</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EpleyCalculator;
