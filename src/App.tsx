import { BrowserRouter } from "react-router-dom";
import "App.css";
import { Header } from "pages/Header";
import { Footer } from "pages/Footer";
import { MainRouter } from "routers/main";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Slide}
        theme="colored"
      />
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
