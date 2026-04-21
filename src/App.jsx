import { BrowserRouter, Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import Home from "./pages/Home";
import CustomInput from "./pages/CustomInput";
import Example from "./pages/Example";

function App() {
  return (
    <BrowserRouter>
      <Background />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custom" element={<CustomInput />} />
          <Route path="/Example" element={<Example />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;