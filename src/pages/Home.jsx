import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [showDesc, setShowDesc] = useState(false);   // 🔥 state

  return (
    <div className="home-container">
        <button className="info-btn"onClick={() => setShowDesc(!showDesc)}>
            {showDesc ? "×" : "?"}
        </button>
      <h1 className="title">Banker's Algorithm Simulator</h1>

      <p className="developers">
        Developed by <br />
        ASVITHA RM • BALAMURUGAN K • ARULKUMARAN S
      </p>

      {/* 🔽 COLLAPSIBLE CONTENT */}
      <div className={`desc-box ${showDesc ? "show" : ""}`}>
        <p>
          Banker's Algorithm is a deadlock avoidance algorithm used in operating systems.
          It checks whether the system is in a safe state before allocating resources.
          By calculating the need, available, and allocation matrices, it ensures that
          all processes can complete without causing a deadlock.
        </p>
      </div>

      <button className="main-btn" onClick={() => navigate("/custom")}>
        Custom Input
      </button>

      <button className="main-btn" onClick={() => navigate("/example")}>
        Examples
      </button>
    </div>
  );
}

export default Home;