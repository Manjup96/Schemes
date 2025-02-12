import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar"; // Navbar Component
import Login from "./Components/Login/Login";
import Registration from "./Components/Registration/Registration";
import SavingPlan from "./Components/SavingPlan/SavingPlan";
import "./App.css"; // Global styles

// Component to handle conditional Navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();

  // Show Navbar only on the "SavingPlan" page
  const showNavbar = location.pathname === "/saving-plan";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/saving-plan" element={<SavingPlan />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
