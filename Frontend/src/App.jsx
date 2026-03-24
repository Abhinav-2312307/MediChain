import { useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import { loadUserFromStorage } from "./features/auth/authThunks";
import { useAppDispatch } from "./hooks/reduxHooks";
import { ThemeProvider } from "./context/ThemeContext";
import PatientLayout from "./layouts/PatientLayout";
import Home from "./pages/Home";
import Signup from "./pages/SignupLoginPage";
import ChatPage from "./pages/patient/ChatPage";
import CurrentHealthPage from "./pages/patient/CurrentHealthPage";
import DashboardPage from "./pages/patient/DashboardPage";
import DiagnosticsPage from "./pages/patient/DiagnosticsPage";
import MedicalPage from "./pages/patient/MedicalPage";
import MedicalHistoryPage from "./pages/patient/MedicalHistoryPage";
import PatientPageIndex from "./pages/patient/PatientPageIndex";
import ProfilePage from "./pages/patient/ProfilePage";
import SettingsPage from "./pages/patient/SettingsPage";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function renderPatientRoutes() {
  return (
    <>
      <Route index element={<PatientPageIndex />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="medical-history" element={<MedicalHistoryPage />} />
      <Route path="current-health" element={<CurrentHealthPage />} />
      <Route path="medical" element={<MedicalPage />} />
      <Route path="diagnostics" element={<DiagnosticsPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </>
  );
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_Backend_API_URL}/health`)
      .then(() => console.log("Backend is awake"))
      .catch(() => console.warn("Backend still waking up..."));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signup />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/patient" element={<PatientLayout />}>
              {renderPatientRoutes()}
            </Route>
            <Route path="/patient-portal" element={<PatientLayout />}>
              {renderPatientRoutes()}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
