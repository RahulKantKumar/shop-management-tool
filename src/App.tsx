import "./App.css";
import "./global.scss";
import BillingPage from "./pages/BillingPage";
import InventoryPage from "./pages/InventoryPage";
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/billing' element={<BillingPage />} />
        <Route path='/inventory' element={<InventoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
