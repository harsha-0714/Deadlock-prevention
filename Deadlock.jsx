// App.jsx
import { useState } from "react";

export default function App() {
  const [numProcesses, setNumProcesses] = useState(0);
  const [numResources, setNumResources] = useState(0);
  const [maxNeed, setMaxNeed] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [available, setAvailable] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);

  const createTables = () => {
    setMaxNeed(Array.from({ length: numProcesses }, () => Array(numResources).fill(0)));
    setAllocation(Array.from({ length: numProcesses }, () => Array(numResources).fill(0)));
    setAvailable(Array(numResources).fill(0));
    setSafeSequence([]);
  };

  const handleInputChange = (matrix, setMatrix, i, j, value) => {
    const updated = [...matrix];
    updated[i][j] = parseInt(value) || 0;
    setMatrix(updated);
  };

  const handleAvailableChange = (index, value) => {
    const updated = [...available];
    updated[index] = parseInt(value) || 0;
    setAvailable(updated);
  };

  const bankersAlgorithm = () => {
    const need = maxNeed.map((row, i) => row.map((max, j) => max - allocation[i][j]));
    const work = [...available];
    const finish = Array(numProcesses).fill(false);
    const sequence = [];

    let madeProgress;

    do {
      madeProgress = false;
      for (let i = 0; i < numProcesses; i++) {
        if (!finish[i] && need[i].every((n, j) => n <= work[j])) {
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[i][j];
          }
          finish[i] = true;
          sequence.push(i);
          madeProgress = true;
        }
      }
    } while (madeProgress);

    if (finish.every(f => f)) {
      setSafeSequence(sequence);
    } else {
      setSafeSequence(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Deadlock Prevention (Banker's Algorithm)</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Number of Processes"
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Number of Resources"
          value={numResources}
          onChange={(e) => setNumResources(parseInt(e.target.value))}
          className="border p-2 rounded"
        />
        <button
          onClick={createTables}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Tables
        </button>
      </div>

      {maxNeed.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Max Need Matrix</h2>
            {maxNeed.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {row.map((value, j) => (
                  <input
                    key={j}
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(maxNeed, setMaxNeed, i, j, e.target.value)}
                    className="border p-1 w-16 rounded"
                  />
                ))}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Allocation Matrix</h2>
            {allocation.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {row.map((value, j) => (
                  <input
                    key={j}
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(allocation, setAllocation, i, j, e.target.value)}
                    className="border p-1 w-16 rounded"
                  />
                ))}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Available Resources</h2>
            <div className="flex gap-2">
              {available.map((value, i) => (
                <input
                  key={i}
                  type="number"
                  value={value}
                  onChange={(e) => handleAvailableChange(i, e.target.value)}
                  className="border p-1 w-16 rounded"
                />
              ))}
            </div>
          </div>

          <button
            onClick={bankersAlgorithm}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Check for Deadlock
          </button>

          <div className="mt-6">
            {safeSequence ? (
              <h2 className="text-xl font-bold text-green-700">
                Safe Sequence: {safeSequence.map(p => `P${p}`).join(" ➔ ")}
              </h2>
            ) : safeSequence === null ? (
              <h2 className="text-xl font-bold text-red-700">Deadlock Detected!</h2>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
