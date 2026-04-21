import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Example() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // 🔷 SAFE EXAMPLE (EXAM BASED)
  const loadSafe = () => {
    const total = [10, 5, 7];

    const allocation = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1]
    ];

    const max = [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2]
    ];

    runExample(total, allocation, max);
  };

  // 🔷 UNSAFE EXAMPLE
  const loadUnsafe = () => {
    const total = [5, 3, 2];

    const allocation = [
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
    ];

    const max = [
      [2, 1, 2],
      [2, 2, 1],
      [2, 1, 2],
      [1, 2, 1]
    ];

    runExample(total, allocation, max);
  };

  // 🔷 CORE LOGIC
  const runExample = (total, allocation, max) => {
    const p = allocation.length;
    const r = allocation[0].length;

    // 🔹 Calculate Available
    const allocatedSum = Array(r).fill(0);

    for (let i = 0; i < p; i++) {
      for (let j = 0; j < r; j++) {
        allocatedSum[j] += allocation[i][j];
      }
    }

    const available = total.map((val, j) => val - allocatedSum[j]);

    // 🔹 Calculate Need
    const need = allocation.map((row, i) =>
      row.map((val, j) => max[i][j] - val)
    );

    // 🔹 Safety Algorithm
    let work = [...available];
    let finish = Array(p).fill(false);
    let sequence = [];
    let steps = [];

    steps.push(`Initial Available: [${work.join(", ")}]`);

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
            steps.push(
              `P${i}: Need [${need[i].join(", ")}] ≤ Available [${work.join(", ")}] → Executed`
            );

            for (let j = 0; j < r; j++) {
              work[j] += allocation[i][j];
            }

            steps.push(`Updated Available: [${work.join(", ")}]`);

            sequence.push(`P${i}`);
            finish[i] = true;
            found = true;
            count++;
          }
        }
      }

      if (!found) {
        steps.push("No process satisfies Need ≤ Available → Deadlock");
        break;
      }
    }

    const isSafe = sequence.length === p;

    setData({
      total,
      allocation,
      max,
      need,
      available,
      sequence,
      steps,
      isSafe
    });
  };

  return (
    <div className="center-box">

      {/* Back */}
      <button className="back-icon" onClick={() => navigate("/")}>
        ←
      </button>

      <h1 className="title">Banker’s Algorithm</h1>
      <h2>Example Demonstration</h2>

      <button className="main-btn" onClick={loadSafe}>
        Load Safe Example
      </button>

      <button className="main-btn" onClick={loadUnsafe}>
        Load Unsafe Example
      </button>

      {data && (
        <>
          {/* 🔷 SYSTEM INFO */}
          <div className="result-box">
            <p>Processes: {data.allocation.length}</p>
            <p>Resources: {data.total.length}</p>
            <p>Total Resources: [{data.total.join(", ")}]</p>
          </div>

          {/* 🔷 MATRICES (HORIZONTAL) */}
          <div className="matrix-row-container">

            {/* Allocation */}
            <div className="matrix-section">
              <h3>Allocation</h3>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    {data.allocation[0].map((_, j) => <th key={j}>R{j}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.allocation.map((row, i) => (
                    <tr key={i}>
                      <td>P{i}</td>
                      {row.map((val, j) => <td key={j}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Max */}
            <div className="matrix-section">
              <h3>Maximum</h3>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    {data.max[0].map((_, j) => <th key={j}>R{j}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.max.map((row, i) => (
                    <tr key={i}>
                      <td>P{i}</td>
                      {row.map((val, j) => <td key={j}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Need */}
            <div className="matrix-section">
              <h3>Need</h3>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    {data.need[0].map((_, j) => <th key={j}>R{j}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.need.map((row, i) => (
                    <tr key={i}>
                      <td>P{i}</td>
                      {row.map((val, j) => <td key={j}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Available */}
            <div className="matrix-section">
              <h3>Available</h3>
              <p>[{data.available.join(", ")}]</p>
            </div>

          </div>

          {/* RESULT */}
          <div className="result-box">
            <h3>
              {data.isSafe
                ? "The system is in a safe state."
                : "The system is in an unsafe state."}
            </h3>

            {data.isSafe && (
              <p>Safe sequence is: {data.sequence.join(" → ")}</p>
            )}
          </div>

          {/* STEPS */}
          <div className="result-box">
            <h3>Execution Steps</h3>
            {data.steps.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Example;