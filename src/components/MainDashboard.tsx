import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainDashboard.css';

const MainDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-dashboard">
      {/* Animated background elements */}
      <div className="bg-elements">
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
        <div className="floating-plus floating-plus-1"></div>
        <div className="floating-plus floating-plus-2"></div>
      </div>

      {/* Content container */}
      <div className="dashboard-container">
        {loading ? (
          <div className="loading-container">
            <div className="pulse-indicators">
              <div className="pulse-dot pulse-dot-1"></div>
              <div className="pulse-dot pulse-dot-2"></div>
              <div className="pulse-dot pulse-dot-3"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome section */}
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome to Our Hospital</h1>
              <p className="welcome-subtitle">Your Health, Our Priority</p>
            </div>
            
            {/* Card container */}
            <div className="card-container">
              {/* Patient Card */}
              <div className="card">
                <h2 className="card-title">Patient Registration</h2>
                <button
                  onClick={() => navigate('/patient-registration')}
                  className="action-button patient-button"
                >
                  Register as Patient
                </button>
              </div>
              
              {/* Staff Card */}
              <div className="card">
                <h2 className="card-title">Staff Portal</h2>
                <button
                  onClick={() => navigate('/staff-login')}
                  className="action-button staff-button"
                >
                  Staff Login
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Animated wave at the bottom */}
      <div className="wave-container">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path className="shape-fill" d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default MainDashboard;