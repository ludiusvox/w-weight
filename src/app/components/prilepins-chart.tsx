import { Card } from './ui/card';

export function PrilepinsChart() {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="mb-4 dark:text-white">Prilepin's Chart</h2>
        
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left dark:text-white text-sm">
                  Intensity (% of 1RM)
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left dark:text-white text-sm">
                  Reps per Set
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left dark:text-white text-sm">
                  Optimal Total Reps
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left dark:text-white text-sm">
                  Range
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">55-65%</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">3-6</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-bold text-green-600 dark:text-green-400 text-sm">24</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">18-30</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-750">
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">70-80%</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">3-6</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-bold text-green-600 dark:text-green-400 text-sm">18</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">12-24</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">80-90%</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">2-4</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-bold text-green-600 dark:text-green-400 text-sm">15</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">10-20</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-750">
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">90%+</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">1-2</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-bold text-green-600 dark:text-green-400 text-sm">7</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 dark:text-gray-300 text-sm">4-10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm dark:text-gray-300">
            <strong className="dark:text-white">Note:</strong> Prilepin's Chart is based on data from Olympic weightlifters and provides guidelines for optimal training volume at different intensities.
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="mb-4 dark:text-white">Sample Monthly Structure</h2>
        
        <p className="text-sm mb-4 dark:text-gray-300">
          If you were applying this to a primary lift (like a squat or bench press), the intensity wave might look like this:
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">Week 1: 75% of 1RM</h3>
            <p className="text-sm dark:text-gray-300">Building volume</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">Week 2: 85% of 1RM</h3>
            <p className="text-sm dark:text-gray-300">Heavy loading</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">Week 3: 70% of 1RM</h3>
            <p className="text-sm dark:text-gray-300">Active recovery / Technique focus</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">Week 4: 90% of 1RM</h3>
            <p className="text-sm dark:text-gray-300">Peak testing or maximal effort</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="mb-4 dark:text-white">Supplemental Guide: Training Effect by Rep Range</h2>
        
        <p className="text-sm mb-4 dark:text-gray-300">
          To further help with your "W" patterns, here is how those rep ranges typically translate to physiological adaptations:
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">1–3 Reps</h3>
            <p className="text-sm dark:text-gray-300">
              Primarily Central Nervous System (CNS) and Power
            </p>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">4–7 Reps</h3>
            <p className="text-sm dark:text-gray-300">
              Myofibrillar Hypertrophy (Functional muscle density/strength)
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">8–12 Reps</h3>
            <p className="text-sm dark:text-gray-300">
              Sarcoplasmic Hypertrophy (Size and volume/the "pump")
            </p>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg">
            <h3 className="mb-2 dark:text-white">12+ Reps</h3>
            <p className="text-sm dark:text-gray-300">
              Muscle Endurance and Metabolic Stress
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 border border-amber-300 dark:border-amber-700">
        <h2 className="mb-4 dark:text-white">How to Use This for Your Wavy Periodization</h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              M
            </div>
            <div>
              <h3 className="mb-1 dark:text-white">Medium Weeks</h3>
              <p className="text-sm dark:text-gray-800">
                Aim for the <strong>Optimal total reps</strong> in the 70–80% range
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              H
            </div>
            <div>
              <h3 className="mb-1 dark:text-white">High Weeks</h3>
              <p className="text-sm dark:text-gray-800">
                Push toward the higher end of the <strong>Range</strong> in the 80–90% bracket
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              L
            </div>
            <div>
              <h3 className="mb-1 dark:text-white">Low Weeks</h3>
              <p className="text-sm dark:text-gray-800">
                Stay at the low end of the <strong>Range</strong> at &lt; 70% to allow for recovery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              P
            </div>
            <div>
              <h3 className="mb-1 dark:text-white">Peak Weeks</h3>
              <p className="text-sm dark:text-gray-800">
                Aim for the <strong>Optimal (7 reps)</strong> at 90%+, typically done as multiple singles or doubles
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}