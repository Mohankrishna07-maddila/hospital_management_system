import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card';
import config from '../config';

interface LoginForm {
  role: string;
  id: string;
  password: string;
}

const StaffLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    role: 'doctor',
    id: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if enough time has passed since last attempt
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    const minDelay = 5000; // 5 seconds minimum between attempts

    if (timeSinceLastAttempt < minDelay) {
      const remainingTime = Math.ceil((minDelay - timeSinceLastAttempt) / 1000);
      setCountdown(remainingTime);
      setError(`Please wait ${remainingTime} seconds before trying again.`);
      return;
    }

    setLoading(true);
    setLastAttemptTime(now);

    try {
      console.log('Sending login request with data:', formData);
      const response = await fetch(`${config.apiBaseUrl}/api/staff/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) : 30;
          setCountdown(waitTime);
          throw new Error(`Too many login attempts. Please wait ${waitTime} seconds before trying again.`);
        } else if (response.status === 401) {
          throw new Error('Invalid username or password. Please check your credentials and try again.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed. Please try again.');
        }
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store user role in localStorage
      localStorage.setItem('userRole', formData.role);

      // Store doctor username if role is doctor
      if (formData.role === 'doctor') {
        localStorage.setItem('doctorUsername', data.name); // <-- This line is required!
        navigate('/doctor-dashboard');
      } else if (formData.role === 'receptionist') {
        navigate('/receptionist-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
          <h2 className="text-2xl font-bold text-secondary-900">
            Staff Login
          </h2>
          <div className="w-10"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
              {error}
              {countdown > 0 && (
                <div className="mt-2 text-sm">
                  You can try again in: <span className="font-bold">{countdown}</span> seconds
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <div>
              <label htmlFor="id" className="block text-sm font-medium text-secondary-700 mb-1">
                Username
              </label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your username"
                value={formData.id}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `Wait ${countdown}s` : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StaffLogin;