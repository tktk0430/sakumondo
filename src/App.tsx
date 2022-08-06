import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Body from "./Body";

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <div className="header">
          <div style={{ fontSize: "1.5rem" }}>SAKUMONDO</div>
        </div>
        <div className="body">
          <Body />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
