import React from "react";
import Donut from "./Donut.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Donut />
      <button className="donut-button">
        Pague 1 R$ para clicar nesse botão estúpido
      </button>
    </div>
  );
}

export default App;
