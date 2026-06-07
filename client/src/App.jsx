import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalysisResults from "./pages/AnalysisResults";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050816]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <AnalysisResults />
            </ProtectedRoute>
          }
        />

        <Route path="/upload" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
