import { Routes, Route, Link } from "react-router-dom";
import FoodInventory from "./Webpages/FoodInventory.jsx";
import BabyInventory from "./Webpages/BabyInventory.jsx";
import AdultInventory from "./Webpages/AdultInventory.jsx";
import "./App.css";

function Home() {
  return (
    <>
      <nav className="home-side-nav">
        <Link to="/" className="nav-active">Home</Link>
        <Link to="/food">Food Bank</Link>
        <Link to="/baby">Baby Store</Link>
        <Link to="/adult">Adult Store</Link>
      </nav>

      <div className="app-container">
        <header className="app-header">
          <img
            src="/logo.jpeg"
            alt="Young Parents United logo"
            className="app-logo"
          />

          <div>
            <h1>Young Parents United Inventory</h1>
            <p className="subtitle">
              Inventory tracking for free stores and food bank
            </p>
          </div>
        </header>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/food" element={<FoodInventory />} />
      <Route path="/baby" element={<BabyInventory />} />
      <Route path="/adult" element={<AdultInventory />} />
    </Routes>
  );
}

export default App;
