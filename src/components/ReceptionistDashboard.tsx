import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './ReceptionistDashboard.css';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: 'pending' | 'in-progress' | 'treated';
  emergency: boolean;
  assignedDoctor?: string;
}

interface Doctor {
  id: string;
  name: string;
}

const ReceptionistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'receptionist') {
        navigate('/staff-login');
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log('Fetching patients data...');
        const response = await fetch(`${config.apiBaseUrl}/api/patients`);
        if (!response.ok) {
          if (response.status === 429) {
            console.log('Rate limit reached, waiting before next fetch...');
            return;
          }
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        console.log('Received patients data:', data);
        
        // Ensure each patient has a valid ID
        const patientsWithIds = data.map((patient: any) => ({
          ...patient,
          id: patient._id || patient.id || `temp-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setPatients(patientsWithIds);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        console.log('Fetching doctors data...');
        const response = await fetch(`${config.apiBaseUrl}/api/staff/doctors`);
        if (!response.ok) {
          if (response.status === 429) {
            console.log('Rate limit reached, waiting before next fetch...');
            return;
          }
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        console.log('Received doctors data:', data);
        
        // Ensure each doctor has a valid ID
        const formattedDoctors = data.map((doctor: any) => ({
          id: doctor._id || doctor.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          name: doctor.name || doctor.username || 'Unknown Doctor'
        }));
        
        console.log('Formatted doctors:', formattedDoctors);
        setDoctors(formattedDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again.');
      }
    };

    // Initial fetch
    fetchPatients();
    fetchDoctors();

    // Set up interval for auto-updates with longer intervals
    const patientInterval = setInterval(fetchPatients, 30000); // Update every 30 seconds
    const doctorInterval = setInterval(fetchDoctors, 60000); // Update doctors every 60 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(patientInterval);
      clearInterval(doctorInterval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/staff-login');
  };

  const handleToggleEmergency = async (patientId: string) => {
    try {
      console.log('Toggling emergency status for patient:', patientId);
      console.log('Current patients:', patients);
      
      // Find the current patient to get their emergency status
      const currentPatient = patients.find(p => p.id === patientId);
      if (!currentPatient) {
        throw new Error('Patient not found');
      }
      
      console.log('Current patient emergency status:', currentPatient.emergency);
      
      const response = await fetch(`${config.apiBaseUrl}/api/patients/${patientId}/emergency`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergency: !currentPatient.emergency // Toggle the current status
        })
      });

      console.log('Server response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(errorText || 'Failed to toggle emergency status');
      }

      const updatedPatient = await response.json();
      console.log('Updated patient after emergency toggle:', updatedPatient);
      
      // Update the patients list with the new emergency status
      setPatients(patients.map(p => 
        p.id === patientId 
          ? { ...p, emergency: updatedPatient.emergency }
          : p
      ));
    } catch (err) {
      console.error('Error toggling emergency status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update emergency status. Please try again.');
    }
  };

  const handleAssignDoctor = async (patientId: string, doctorId: string) => {
    if (!doctorId) return; // Don't proceed if no doctor is selected
    
    try {
      console.log('Assigning doctor:', { patientId, doctorId });
      
      // First, get the doctor's username from the doctors list
      const selectedDoctor = doctors.find(d => d.id === doctorId);
      if (!selectedDoctor) {
        throw new Error('Selected doctor not found');
      }

      const response = await fetch(`${config.apiBaseUrl}/api/patients/${patientId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          doctorUsername: selectedDoctor.name // Send the doctor's username instead of ID
        }),
      });
      
      if (!response.ok) {
        // Try to parse the error response as JSON first
        let errorMessage = 'Failed to assign doctor';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, try to get the text response
          const textResponse = await response.text();
          errorMessage = textResponse || errorMessage;
        }
        console.error('Server error response:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const updatedPatient = await response.json();
      console.log('Updated patient after doctor assignment:', updatedPatient);
      
      // Update the patients list with the new assignment
      setPatients(patients.map(p => 
        p.id === patientId 
          ? { ...p, assignedDoctor: selectedDoctor.name }
          : p
      ));
    } catch (err) {
      console.error('Error assigning doctor:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign doctor. Please try again.');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'treated':
        return 'status-treated';
      default:
        return '';
    }
  };

  console.log('Rendering receptionist dashboard with:', {
    patientsCount: patients.length,
    filteredPatientsCount: filteredPatients.length,
    loading,
    error
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Receptionist Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading patients...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th key="name">Name</th>
                <th key="age">Age</th>
                <th key="gender">Gender</th>
                <th key="status">Status</th>
                <th key="emergency">Emergency</th>
                <th key="assignedDoctor">Assigned Doctor</th>
                <th key="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={`patient-${patient.id}`}>
                  <td key={`name-${patient.id}`}>{patient.name}</td>
                  <td key={`age-${patient.id}`}>{patient.age}</td>
                  <td key={`gender-${patient.id}`}>{patient.gender}</td>
                  <td key={`status-${patient.id}`}>
                    <span className={`status-badge ${getStatusClass(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td key={`emergency-${patient.id}`}>
                    {patient.emergency && (
                      <span className="emergency-badge">Emergency</span>
                    )}
                  </td>
                  <td key={`assigned-doctor-${patient.id}`}>
                    {patient.assignedDoctor || 'Not assigned'}
                  </td>
                  <td key={`actions-${patient.id}`}>
                    <button
                      className="emergency-button"
                      onClick={() => handleToggleEmergency(patient.id)}
                    >
                      {patient.emergency ? 'Remove Emergency' : 'Mark Emergency'}
                    </button>
                    <select
                      className="assign-button"
                      value={patient.assignedDoctor || ''}
                      onChange={(e) => handleAssignDoctor(patient.id, e.target.value)}
                    >
                      <option key="default" value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={`doctor-${doctor.id}`} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;