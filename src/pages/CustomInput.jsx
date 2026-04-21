import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomInput() {
  const navigate = useNavigate();

  const [processes, setProcesses] = useState(1);
  const [resources, setResources] = useState(1);

  const [allocation, setAllocation] = useState([]);
  const [max, setMax] = useState([]);
  const [total, setTotal] = useState([]);

  const [available, setAvailable] = useState([]);
  const [need, setNeed] = useState([]);

  const [needCalculated, setNeedCalculated] = useState(false);
  const [showMatrices, setShowMatrices] = useState(false);

  const [result, setResult] = useState("");
  const [safeSequence, setSafeSequence] = useState([]);
  const [steps, setSteps] = useState([]);

  // 🔷 Generate matrices
  const generateMatrices = () => {
    const p = processes;
    const r = resources;

    setAllocation(Array(p).fill().map(() => Array(r).fill(0)));
    setMax(Array(p).fill().map(() => Array(r).fill(0)));
    setTotal(Array(r).fill(0));

    setShowMatrices(true);
    setNeed([]);
    setNeedCalculated(false);
    setResult("");
    setSafeSequence([]);
    setSteps([]);
  };

  // 🔷 Handle input
  const handleChange = (matrix, setMatrix, i, j, value) => {
    const updated = [...matrix];
    updated[i][j] = Math.max(0, Number(value));
    setMatrix(updated);
  };

  // 🔷 Calculate Need + Available
  const calculateNeed = () => {
    const p = allocation.length;
    const r = allocation[0]?.length;
    // ❗ ADD THIS HERE (VERY TOP)
    if (total.every(v => v === 0)) {
  setResult("Invalid input: Total resources cannot be zero.");
  setNeed([]);
  setAvailable([]);
  setSafeSequence([]);
  setSteps([]);
  setNeedCalculated(false);
  return;
}
    // ❗ VALIDATION: max >= allocation
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < r; j++) {
        if (max[i][j] < allocation[i][j]) {
          setResult("Invalid input: Maximum must be ≥ Allocation.");
          return;
        }
      }
    }

    // ❗ VALIDATION: total should not be all zero
    if (total.every(v => v === 0)) {
      setResult("Invalid input: Total resources cannot be zero.");
      return;
    }

    // Calculate Need
    const needMatrix = allocation.map((row, i) =>
      row.map((val, j) => max[i][j] - val)
    );

    // Calculate Available
    const sumAlloc = Array(r).fill(0);
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < r; j++) {
        sumAlloc[j] += allocation[i][j];
      }
    }

    const avail = total.map((t, j) => t - sumAlloc[j]);

    // ❗ VALIDATION: allocation exceeds total
    if (avail.some(v => v < 0)) {
      setResult("Invalid input: Allocation exceeds Total resources.");
      return;
    }

    setNeed(needMatrix);
    setAvailable(avail);
    setNeedCalculated(true);
    setResult("");
    setSafeSequence([]);
    setSteps([]);
  };

  // 🔷 Check Safety
  const checkSafety = () => {
    if (!needCalculated) {
      setResult("Please calculate Need Matrix first.");
      return;
    }

    // ❗ VALIDATION: all zero case
    const allZero =
      [...allocation.flat(), ...max.flat(), ...total].every(v => v === 0);

    if (allZero) {
      setResult("Invalid input: Enter meaningful values (not all zeros).");
      return;
    }

    const p = allocation.length;
    const r = available.length;

    let work = [...available];
    let finish = Array(p).fill(false);
    let sequence = [];
    let logs = [];

    logs.push(`Initial Available: [${work.join(", ")}]`);

    let count = 0;

    while (count < p) {
      let found = false;

      for (let i = 0; i < p; i++) {
        if (!finish[i]) {
          let canExecute = true;

          for (let j = 0; j < r; j++) {
            if (need[i][j] > work[j]) {
              canExecute = false;
              break;
            }
          }

          if (canExecute) {
            logs.push(
              `P${i}: Need [${need[i].join(", ")}] ≤ Available [${work.join(", ")}]`
            );

            for (let j = 0; j < r; j++) {
              work[j] += allocation[i][j];
            }

            logs.push(`Updated Available: [${work.join(", ")}]`);

            sequence.push(`P${i}`);
            finish[i] = true;
            found = true;
            count++;
          }
        }
      }

      if (!found) {
        logs.push("No process satisfies Need ≤ Available → Deadlock possible");
        break;
      }
    }

    setSteps(logs);

    if (sequence.length === p) {
      setResult("The system is in a safe state.");
      setSafeSequence(sequence);
    } else {
      setResult("The system is in an unsafe state (Deadlock possible).");
      setSafeSequence([]);
    }
  };

  // 🔷 Reset
  const resetAll = () => {
    setProcesses(1);
    setResources(1);
    setAllocation([]);
    setMax([]);
    setTotal([]);
    setAvailable([]);
    setNeed([]);
    setNeedCalculated(false);
    setShowMatrices(false);
    setResult("");
    setSafeSequence([]);
    setSteps([]);
  };

  return (
    <div className="center-box">
        <button className="back-icon" onClick={() => navigate("/")}>
             ←
             </button>

      <h1 className="title">Banker’s Algorithm</h1>
      <h2>Enter System Details</h2>

      {/* Stepper */}
      <div className="stepper-container">

        <div className="stepper">
          <p>Number of Processes</p>
          <div className="stepper-box">
            <button onClick={() => setProcesses(Math.max(1, processes - 1))}>-</button>
            <span>{processes}</span>
            <button onClick={() => setProcesses(processes + 1)}>+</button>
          </div>
        </div>

        <div className="stepper">
          <p>Number of Resources</p>
          <div className="stepper-box">
            <button onClick={() => setResources(Math.max(1, resources - 1))}>-</button>
            <span>{resources}</span>
            <button onClick={() => setResources(resources + 1)}>+</button>
          </div>
        </div>

      </div>

      <button className="main-btn" onClick={generateMatrices}>
        Generate Matrices
      </button>

      {showMatrices && (
        <div className="matrix-container">

          {/* Total */}
          <div className="matrix-section">
            <h3>Total Resources</h3>
            <table className="matrix-table">
              <thead>
                <tr>
                  {total.map((_, j) => <th key={j}>R{j}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {total.map((val, j) => (
                    <td key={j}>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const updated = [...total];
                          updated[j] = Math.max(0, Number(e.target.value));
                          setTotal(updated);
                        }}
                        className="table-input"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allocation */}
          <div className="matrix-section">
            <h3>Allocation Matrix</h3>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {allocation[0]?.map((_, j) => <th key={j}>R{j}</th>)}
                </tr>
              </thead>
              <tbody>
                {allocation.map((row, i) => (
                  <tr key={i}>
                    <td>P{i}</td>
                    {row.map((val, j) => (
                      <td key={j}>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) =>
                            handleChange(allocation, setAllocation, i, j, e.target.value)
                          }
                          className="table-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Max */}
          <div className="matrix-section">
            <h3>Maximum Matrix</h3>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {max[0]?.map((_, j) => <th key={j}>R{j}</th>)}
                </tr>
              </thead>
              <tbody>
                {max.map((row, i) => (
                  <tr key={i}>
                    <td>P{i}</td>
                    {row.map((val, j) => (
                      <td key={j}>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) =>
                            handleChange(max, setMax, i, j, e.target.value)
                          }
                          className="table-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {showMatrices && (
        <button className="main-btn" onClick={calculateNeed}>
          Calculate Need Matrix
        </button>
      )}

      {needCalculated && result === "" && (
        <>
          <div className="matrix-section">
            <h3>Available Resources</h3>
            <p>[{available.join(", ")}]</p>
          </div>

          <div className="matrix-section">
            <h3>Need Matrix</h3>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {need[0]?.map((_, j) => <th key={j}>R{j}</th>)}
                </tr>
              </thead>
              <tbody>
                {need.map((row, i) => (
                  <tr key={i}>
                    <td>P{i}</td>
                    {row.map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="main-btn" onClick={checkSafety}>
            Check Safe State
          </button>
        </>
      )}

      {result && (
        <div className="result-box">
          <h3>{result}</h3>
          {safeSequence.length > 0 && (
            <p>Safe sequence is: {safeSequence.join(" → ")}</p>
          )}
        </div>
      )}

      {steps.length > 0 && (
  <div className="result-box">

    <h3>Explanation</h3>

    {/* Step-by-step explanation */}
    {steps.map((step, i) => (
      <p key={i}>{step}</p>
    ))}

    {/* Final understanding */}
    <hr style={{ margin: "10px 0", opacity: 0.3 }} />

    {safeSequence.length > 0 ? (
      <p>
        All processes satisfied the condition Need ≤ Available at each step.
        Hence, the system is in a safe state.
      </p>
    ) : (
      <p>
        At some point, no process satisfied Need ≤ Available.
        Hence, the system is in an unsafe state (deadlock possible).
      </p>
    )}

  </div>
)}

      <button className="main-btn" onClick={resetAll}>
        Reset
      </button>

    </div>
  );
}

export default CustomInput;