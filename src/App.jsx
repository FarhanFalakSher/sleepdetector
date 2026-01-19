import { useState } from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  // Global driver status
  const [driverStatus, setDriverStatus] = useState("Alert");

  return (
    <div className="App bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard */}
      <Dashboard
        driverStatus={driverStatus}
        setDriverStatus={setDriverStatus}
      />
    </div>
  );
}

export default App;
