import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function NavyBMICalculator() {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [height, setHeight] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);

  const calculateBodyFat = () => {
    const heightVal = parseFloat(height);
    const neckVal = parseFloat(neck);
    const waistVal = parseFloat(waist);

    if (!heightVal || !neckVal || !waistVal) return;

    let result: number;

    if (unitSystem === 'imperial') {
      // Imperial formula: %BF = 86.010 × log₁₀(waist - neck) - 70.041 × log₁₀(height) + 36.76
      const waistNeckDiff = waistVal - neckVal;
      if (waistNeckDiff <= 0 || heightVal <= 0) return;

      result = 
        86.010 * Math.log10(waistNeckDiff) - 
        70.041 * Math.log10(heightVal) + 
        36.76;
    } else {
      // Metric formula: %BF = 495 / (1.0324 - 0.19077 × log₁₀(waist - neck) + 0.15456 × log₁₀(height)) - 450
      const waistNeckDiff = waistVal - neckVal;
      if (waistNeckDiff <= 0 || heightVal <= 0) return;

      result = 
        495 / (1.0324 - 0.19077 * Math.log10(waistNeckDiff) + 0.15456 * Math.log10(heightVal)) - 
        450;
    }

    // Clamp to reasonable range
    result = Math.max(2, Math.min(50, result));
    setBodyFatPercentage(Math.round(result * 10) / 10);
  };

  const handleReset = () => {
    setHeight('');
    setNeck('');
    setWaist('');
    setBodyFatPercentage(null);
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">US Navy Body Fat Calculator</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Calculate body fat percentage using the US Navy method for men.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex gap-4">
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              unitSystem === 'imperial'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Imperial (inches)
          </button>
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              unitSystem === 'metric'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Metric (cm)
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="height" className="dark:text-white">
              Height ({unitSystem === 'imperial' ? 'inches' : 'cm'})
            </Label>
            <Input
              id="height"
              type="number"
              step={unitSystem === 'imperial' ? 0.1 : 0.1}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unitSystem === 'imperial' ? "72" : "183"}
              className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="neck" className="dark:text-white">
              Neck ({unitSystem === 'imperial' ? 'inches' : 'cm'})
            </Label>
            <Input
              id="neck"
              type="number"
              step={unitSystem === 'imperial' ? 0.1 : 0.1}
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder={unitSystem === 'imperial' ? "16" : "40"}
              className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="waist" className="dark:text-white">
              Waist ({unitSystem === 'imperial' ? 'inches' : 'cm'})
            </Label>
            <Input
              id="waist"
              type="number"
              step={unitSystem === 'imperial' ? 0.1 : 0.1}
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder={unitSystem === 'imperial' ? "32" : "81"}
              className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>

        {/* Measurement Note */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Measurement Note:</strong> Measure neck just below the larynx (Adam's apple) angled slightly downward, and waist horizontally at the navel.
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            This method is preferred for lifters because it ignores total mass in favor of circumference ratios, making it more accurate for muscular individuals.
          </p>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateBodyFat}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Calculate Body Fat
        </button>

        {/* Reset Button */}
        {bodyFatPercentage !== null && (
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Reset Calculator
          </button>
        )}

        {/* Result Display */}
        {bodyFatPercentage !== null && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-6 rounded-md text-center border border-green-200 dark:border-green-800">
            <p className="text-sm text-muted-foreground dark:text-gray-300 mb-1">Body Fat Percentage</p>
            <p className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">{bodyFatPercentage}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
