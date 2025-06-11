import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

interface Patient {
  _id: string;
  name: string;
  mobile: string;
  location: string;
  disease: string;
  status: string;
  emergency: boolean;
  assignedDoctor: string | null;
}

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusChanging, setStatusChanging] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Doctor username must be set in localStorage after login
        const doctorUsername = localStorage.getItem('doctorUsername');
        console.log('Current doctor username:', doctorUsername);

        // If not found, show error and redirect
        if (!doctorUsername) {
          setError('Doctor username not found in localStorage. Please log in again.');
          navigate('/staff-login');
          return;
        }
        
        setCurrentDoctor(doctorUsername);

        const response = await fetch(`${config.apiBaseUrl}/api/patients`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Strict filtering: only show patients where assignedDoctor exactly matches the current doctor's username
        const assignedPatients = data.filter((patient: Patient) => {
          const isAssigned = patient.assignedDoctor === doctorUsername;
          console.log(`Patient ${patient.name} assigned to ${patient.assignedDoctor}, current doctor: ${doctorUsername}, isAssigned: ${isAssigned}`);
          return isAssigned;
        });
        
        console.log(`Found ${assignedPatients.length} patients assigned to doctor ${doctorUsername}`);
        setPatients(assignedPatients);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patient data. Please try again.');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up auto-refresh every 10 seconds
    const refreshInterval = setInterval(fetchData, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [navigate]);

  // Add a check to prevent unauthorized access
  useEffect(() => {
    const checkAuth = () => {
      const doctorUsername = localStorage.getItem('doctorUsername');
      if (!doctorUsername) {
        navigate('/staff-login');
      }
    };

    checkAuth();
    // Check auth every 5 seconds
    const authInterval = setInterval(checkAuth, 5000);
    return () => clearInterval(authInterval);
  }, [navigate]);

  const handleStatusUpdate = async (patientId: string, newStatus: string) => {
    setStatusChanging(patientId);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/patients/${patientId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient status');
      }

      setPatients(patients.map(patient =>
        patient._id === patientId ? { ...patient, status: newStatus } : patient
      ));
    } catch (error) {
      console.error('Error updating patient status:', error);
      alert('Failed to update patient status');
    } finally {
      setStatusChanging(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorUsername');
    navigate('/staff-login');
  };

  // Add search filter function
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.mobile?.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#EFF6FF', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1E40AF' }}>Loading patient data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#EFF6FF', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#DC2626' }}>{error}</h2>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 transform hover:scale-105 transition-transform duration-300">
              Doctor Dashboard - {currentDoctor}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>

          {/* Enhanced Search Input */}
          <div className="mb-6">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <input
                type="text"
                placeholder="Search by name or mobile number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <div className="absolute right-3 top-3">
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${searchFocused ? 'rotate-12' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 animate-pulse">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative animate-fade-in" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Disease</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-300">Update Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr 
                      key={patient._id} 
                      className={`${patient.emergency ? 'bg-red-50' : ''} 
                        ${hoveredRow === patient._id ? 'bg-blue-50' : ''}
                        transform transition-all duration-300 hover:scale-[1.01]`}
                      onMouseEnter={() => setHoveredRow(patient._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{patient.name || 'Unknown Patient'}</div>
                          {patient.emergency && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 animate-pulse">
                              Emergency
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.mobile || 'No contact'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.location || 'Location not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.disease || 'No diagnosis'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${patient.status === 'treated' ? 'bg-green-100 text-green-800' : 
                            patient.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {patient.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={patient.status || 'pending'}
                          onChange={(e) => handleStatusUpdate(patient._id, e.target.value)}
                          disabled={statusChanging === patient._id}
                          className={`border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${statusChanging === patient._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            transform transition-all duration-300 hover:scale-105`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="treated">Treated</option>
                        </select>
                        {statusChanging === patient._id && (
                          <span className="ml-2 text-blue-500 animate-pulse">Updating...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;