import { useState, useEffect, useRef } from "react";
import SleepDetector from "./SleepDetector";
import { FiAlertCircle, FiClock } from "react-icons/fi";

const Dashboard = ({ driverStatus, setDriverStatus }) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const alertRef = useRef(null);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track alerts when driver becomes Drowsy
  useEffect(() => {
    if (driverStatus === "Drowsy") {
      setAlerts((prev) => {
        if (prev[0]?.type !== "Drowsy") {
          const newAlerts = [
            { time: new Date().toLocaleTimeString(), type: "Drowsy" },
            ...prev,
          ];
          return newAlerts.slice(0, 10); // keep last 10 alerts
        }
        return prev;
      });
    }
  }, [driverStatus]);

  // Auto-scroll alert list
  useEffect(() => {
    if (alertRef.current) {
      alertRef.current.scrollTop = 0;
    }
  }, [alerts]);

  // Format session timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Driver Status */}
        <div className="bg-gray-800 text-white rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <FiAlertCircle size={40} className="text-yellow-400 mb-2" />
          <h2 className="text-xl font-semibold">Driver Status</h2>
          <p
            className={`mt-2 text-2xl font-bold ${
              driverStatus === "Alert"
                ? "text-green-400"
                : "text-red-500 animate-pulse"
            }`}
          >
            {driverStatus}
          </p>
        </div>

        {/* Session Timer */}
        <div className="bg-gray-800 text-white rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <FiClock size={40} className="text-yellow-400 mb-2" />
          <h2 className="text-xl font-semibold">Session Duration</h2>
          <p className="mt-2 text-2xl font-bold">{formatTime(sessionTime)}</p>
        </div>

        {/* Alerts History */}
        <div className="bg-gray-800 text-white rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold">Alerts History</h2>
          <ul
            className="mt-2 max-h-32 overflow-y-auto w-full text-center"
            aria-live="polite"
            ref={alertRef}
          >
            {alerts.length === 0 && <p>No alerts yet</p>}
            {alerts.map((alert, idx) => (
              <li
                key={idx}
                className="py-1 border-b border-gray-700 text-yellow-400"
              >
                [{alert.time}] {alert.type}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Live Camera / Sleep Detector */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Live Camera Feed
        </h2>
        <SleepDetector onStatusChange={setDriverStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
