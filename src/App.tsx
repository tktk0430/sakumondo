import { AnswerForm } from "./AnswerForm";
import "./App.css";
import { Question } from "./Question";

function App() {
  return (
    <div className="main">
      <div className="header">
        <div style={{ fontSize: "1.5rem" }}>SAKUMONDO</div>
      </div>
      <div className="body">
        <Question />
        <AnswerForm />
      </div>
    </div>
  );
}

export default App;
