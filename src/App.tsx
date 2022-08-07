import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Body from "./Body";
import gitIcon from "./images/github.png";

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
        <div className="external-links">
          <a
            href="https://github.com/tktk0430/sakumondo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={gitIcon} alt="github link" />
          </a>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
