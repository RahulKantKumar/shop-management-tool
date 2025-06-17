import "./App.css";
import "./global.scss";
import BillingPage from "./pages/BillingPage";
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/billing' element={<BillingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
