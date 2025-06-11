import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UserPlus, Stethoscope } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MedCare Hospital
        </h1>
        <p className="text-xl text-gray-600">
          Your health is our priority. Book appointments online and manage your healthcare needs easily.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Link
          to="/register"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <UserPlus className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Patient Registration</h2>
          <p className="text-gray-600">
            Register as a new patient and create your medical profile
          </p>
        </Link>

        <Link
          to="/book-appointment"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Calendar className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>
          <p className="text-gray-600">
            Schedule appointments with our experienced doctors
          </p>
        </Link>

        <Link
          to="/doctors"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Stethoscope className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Doctors</h2>
          <p className="text-gray-600">
            View our team of qualified medical professionals
          </p>
        </Link>
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose MedCare?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">24/7 Emergency Care</h3>
            <p className="text-gray-600">
              Round-the-clock emergency services with experienced medical staff
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Online Appointments</h3>
            <p className="text-gray-600">
              Easy and convenient online appointment booking system
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Experienced Doctors</h3>
            <p className="text-gray-600">
              Team of highly qualified and experienced medical professionals
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Modern Facilities</h3>
            <p className="text-gray-600">
              State-of-the-art medical facilities and equipment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;