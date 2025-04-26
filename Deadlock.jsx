import React, { useState } from 'react';
import './App.css';

function App() {
  const [processes, setProcesses] = useState(0);
  const [resources, setResources] = useState(0);
  const [allocated, setAllocated] = useState([]);
  const [maximum, setMaximum] = useState([]);
  const [available, setAvailable] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);
  const [deadlock, setDeadlock] = useState(false);

  const handleProcessesChange = (e) => {
    setProcesses(parseInt(e.target.value) || 0);
  };

  const handleResourcesChange = (e) => {
    setResources(parseInt(e.target.value) || 0);
  };

  const initMatrices = () => {
    setAllocated(Array.from({ length: processes }, () => Array(resources).fill(0)));
    setMaximum(Array.from({ length: processes }, () => Array(resources).fill(0)));
    setAvailable(Array(resources).fill(0));
    setSafeSequence([]);
    setDeadlock(false);
  };

  const handleMatrixChange = (matrixSetter, matrix, i, j, value) => {
    const updated = [...matrix];
    updated[i][j] = parseInt(value) || 0;
    matrixSetter(updated);
  };

  const handleAvailableChange = (index, value) => {
    const updated = [...available];
    updated[index] = parseInt(value) || 0;
    setAvailable(updated);
  };

  const isSafe = () => {
    const work = [...available];
    const finish = Array(processes).fill(false);
    const sequence = [];

    let found;
    do {
      found = false;
      for (let i = 0; i < processes; i++) {
        if (!finish[i]) {
          let canAllocate = true;
          for (let j = 0; j < resources; j++) {
            if (maximum[i][j] - allocated[i][j] > work[j]) {
              canAllocate = false;
              break;
            }
          }
          if (canAllocate) {
            for (let k = 0; k < resources; k++) {
              work[k] += allocated[i][k];
            }
            finish[i] = true;
            sequence.push(`P${i}`);
            found = true;
          }
        }
      }
    } while (found);

    if (finish.every(f => f)) {
      setSafeSequence(sequence);
      setDeadlock(false);
    } else {
      setSafeSequence([]);
      setDeadlock(true);
    }
  };

  return (
    <div className="container">
      <h1>🛡️ Deadlock Prevention Simulator</h1>

      <div className="input-section">
        <input
          type="number"
          placeholder="Processes"
          onChange={handleProcessesChange}
          min="1"
        />
        <input
          type="number"
          placeholder="Resources"
          onChange={handleResourcesChange}
          min="1"
        />
        <button onClick={initMatrices}>Create Matrices</button>
      </div>

      {allocated.length > 0 && (
        <>
          <h2>Allocated Matrix</h2>
          {allocated.map((row, i) => (
            <div key={i}>
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(setAllocated, allocated, i, j, e.target.value)}
                />
              ))}
            </div>
          ))}

          <h2>Maximum Matrix</h2>
          {maximum.map((row, i) => (
            <div key={i}>
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(setMaximum, maximum, i, j, e.target.value)}
                />
              ))}
            </div>
          ))}

          <h2>Available Resources</h2>
          <div>
            {available.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => handleAvailableChange(i, e.target.value)}
              />
            ))}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={isSafe}>Check Safe State</button>
          </div>

          {safeSequence.length > 0 && (
            <div className="safe">
              <h3>✅ System is in Safe State!</h3>
              <p>Safe Sequence: {safeSequence.join(' ➔ ')}</p>
            </div>
          )}

          {deadlock && (
            <div className="deadlock">
              <h3>⚠️ Deadlock Detected!</h3>
              <p>No safe sequence possible.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
