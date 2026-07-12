import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Admin from "./Admin";
import AdminView from "./pages/AdminView";
import Dashboard from "./Dashboard";
import DoctorScheduler from "./pages/DoctorScheduler";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-123" element={<AdminView />} />
          <Route path="/schedule" element={<DoctorScheduler />} />
        </Routes>

        <Toaster position="top-right" richColors />
      </>
    </BrowserRouter>
  );
}

export default App;