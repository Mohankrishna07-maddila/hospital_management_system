import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './components/MainDashboard';
import StaffLogin from './components/StaffLogin';
import PatientRegistration from './components/PatientRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import './index.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* We'll add doctor and receptionist dashboard routes later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;