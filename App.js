import React, { useState } from "react";
import "./App.css";
 
function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");
 
  function addNumbers() {
    setResult(Number(num1) + Number(num2));
  }
 
  return (
    <div className="container">
      <h1>Addition of Two Numbers</h1>
 
      <input
        type="number"
        placeholder="Enter first number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
 
      <input
        type="number"
        placeholder="Enter second number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
 
      <button onClick={addNumbers}>Add Numbers</button>
 
      <h2>Result: {result}</h2>
    </div>
  );
}
 
export default App;