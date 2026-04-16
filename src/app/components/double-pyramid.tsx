import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RepTracker } from './rep-tracker';

interface PyramidSet {
  setNumber: number;
  reps: string;
  weight: string;
}

// Default "W" pattern sequence (two V's)
const DEFAULT_W_SEQUENCE = [5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5];

interface DoublePyramidProps {
  initialWeight?: string;
}

export function DoublePyramid({ initialWeight }: DoublePyramidProps) {
  const [pyramidType, setPyramidType] = useState<'ascending' | 'descending'>('ascending');
  const [startReps, setStartReps] = useState<string>('5');
  const [endReps, setEndReps] = useState<string>('10');
  const [customRepSequence, setCustomRepSequence] = useState<string>('');
  const [useCustomSequence, setUseCustomSequence] = useState<boolean>(false);
  const [sets, setSets] = useState<PyramidSet[]>([]);

  // Reset tracker when pyramid is cleared or regenerated
  const handleGeneratePyramid = () => {
    let sequence: number[];
    
    if (useCustomSequence && customRepSequence.trim()) {
      // Parse custom sequence from comma-separated input
      sequence = customRepSequence.split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n) && n > 0);
      
      if (sequence.length === 0) {
        return;
      }
    } else {
      // Use default "W" pattern
      sequence = [...DEFAULT_W_SEQUENCE];
    }

    const newSets: PyramidSet[] = sequence.map((rep, index) => ({
      setNumber: rep,
      reps: rep.toString(),
      weight: initialWeight || ''
    }));

    setSets(newSets);
  };

  const handleClearPyramid = () => {
    setSets([]);
  };

  const handleWeightChange = (setIndex: number, value: string) => {
    const updatedSets = [...sets];
    updatedSets[setIndex].weight = value;
    setSets(updatedSets);
  };

  // Derived sequence from sets for RepTracker
  const currentSequence = sets.map(s => parseInt(s.reps) || 0);

  const calculateTotalVolume = () => {
    return sets.reduce((total, set) => {
      const reps = parseInt(set.reps) || 0;
      const weight = parseFloat(set.weight) || 0;
      return total + (reps * weight);
    }, 0);
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Double Pyramid Weight Tracking</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Track weight and reps across pyramid sets (ascending + descending)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rep Scheme Selection */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Rep Scheme</h3>
          
          {/* Default "W" Pattern Display */}
          {!useCustomSequence && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-center font-mono text-sm mb-1 dark:text-white">
                5 – 4 – 3 – 2 – 1 – 2 – 3 – 4 – 5 – 4 – 3 – 2 – 1 – 2 – 3 – 4 – 5
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 text-center">
                Total: 57 repetitions (Two "V" patterns)
              </p>
            </div>
          )}

          {/* Custom Sequence Input */}
          {useCustomSequence && (
            <div className="mb-4">
              <Label htmlFor="custom-reps" className="dark:text-white">Enter Custom Rep Sequence</Label>
              <Input
                id="custom-reps"
                type="text"
                value={customRepSequence}
                onChange={(e) => setCustomRepSequence(e.target.value)}
                placeholder="e.g., 5,4,3,2,1,2,3,4,5 or 3,4,5,6,7,6,5,4,3"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                Separate each rep count with a comma (no spaces required)
              </p>
            </div>
          )}

          {/* Toggle Custom Sequence */}
          <button
            onClick={() => setUseCustomSequence(!useCustomSequence)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              useCustomSequence
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {useCustomSequence ? 'Use Default "W" Pattern' : 'Enter Custom Rep Sequence'}
          </button>

          <Button onClick={handleGeneratePyramid} className="w-full mt-4">
            Generate Pyramid Sets
          </Button>
        </div>

        {/* Instructions */}
        {!sets.length && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">How to Use</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2 list-disc list-inside">
              <li><strong className="dark:text-white">First "V":</strong> Start at 5 reps, descend to 1, climb back to 5</li>
              <li><strong className="dark:text-white">Second "V":</strong> Immediately repeat the descent and ascent (1-2-3-4-5)</li>
              <li><strong className="dark:text-white">Load:</strong> Use 70-80% of your 1RM. The highest rep count (5) should feel like you have 2-3 reps left (RPE 7-8)</li>
              <li><strong className="dark:text-white">Rest:</strong> Rest 30-60 seconds between each number</li>
            </ul>
          </div>
        )}

        {/* Rep Tracker - Shows visual bubbles for current sequence */}
        {sets.length > 0 && (
          <RepTracker repSequence={currentSequence} />
        )}

        {/* Set Tracking */}
        {sets.length > 0 && (
          <>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Set Tracking</h3>
              
              <div className="space-y-3">
                {sets.map((set, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-sm text-gray-900 dark:text-white w-16">Set {index + 1}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Label htmlFor={`reps-${index}`} className="text-xs text-muted-foreground dark:text-gray-400">Reps</Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        value={set.reps}
                        readOnly
                        className="w-20 bg-gray-100 dark:bg-gray-700 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Label htmlFor={`weight-${index}`} className="text-xs text-muted-foreground dark:text-gray-400">Weight</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleWeightChange(index, e.target.value)}
                        placeholder="kg/lbs"
                        className="w-28 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Volume */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Total Volume: <span className="font-bold text-primary dark:text-blue-400">{calculateTotalVolume().toFixed(1)}</span>
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <Button onClick={handleClearPyramid} variant="outline" className="w-full">
              Clear Pyramid
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DoublePyramid;
