import React from 'react';
import { Link } from 'react-router-dom';
import { Guitar as Hospital } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Hospital className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MedCare</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Register
            </Link>
            <Link
              to="/book-appointment"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Book Appointment
            </Link>
            <Link
              to="/doctors"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Doctors
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;