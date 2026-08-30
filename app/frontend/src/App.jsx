import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Admin from "./Admin";
import AdminView from "./pages/AdminView";
import Dashboard from "./Dashboard";
import DoctorScheduler from "./pages/DoctorScheduler";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-view" element={<AdminView />} />
        <Route path="/admin-123" element={<Navigate to="/dashboard?tab=calendar" replace />} />
        <Route path="/schedule" element={<DoctorScheduler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;