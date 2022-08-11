import { BrowserRouter } from "react-router-dom";
import "App.css";
import { Header } from "pages/Header";
import { Footer } from "pages/Footer";
import { MainRouter } from "routers/main";

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <div className="header">
          <Header />
        </div>
        <div className="body">
          <MainRouter />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
