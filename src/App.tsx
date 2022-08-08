import { BrowserRouter } from "react-router-dom";
import "App.css";
import { Main } from "pages/Main";
import { Header } from "pages/Header";
import { Footer } from "pages/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <div className="header">
          <Header />
        </div>
        <div className="body">
          <Main />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
