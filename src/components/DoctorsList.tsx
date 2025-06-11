import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

interface Doctor {
  name: string;
  specialty: string;
  image: string;
  experience: string;
  availability: string;
  contact: {
    email: string;
    phone: string;
  };
}

const DoctorsList: React.FC = () => {
  const doctors: Doctor[] = [
    {
      name: 'Dr. John Smith',
      specialty: 'Cardiology',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      experience: '15 years',
      availability: 'Mon, Wed, Fri',
      contact: {
        email: 'john.smith@medcare.com',
        phone: '(555) 123-4567'
      }
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrics',
      image: 'https://images.pexels.com/photos/5214997/pexels-photo-5214997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      experience: '12 years',
      availability: 'Tue, Thu, Sat',
      contact: {
        email: 'sarah.johnson@medcare.com',
        phone: '(555) 234-5678'
      }
    },
    {
      name: 'Dr. Michael Brown',
      specialty: 'Orthopedics',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      experience: '18 years',
      availability: 'Mon, Tue, Thu',
      contact: {
        email: 'michael.brown@medcare.com',
        phone: '(555) 345-6789'
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Medical Specialists</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              <p className="text-gray-600 mt-2">Experience: {doctor.experience}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{doctor.availability}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{doctor.contact.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{doctor.contact.phone}</span>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={() => window.location.href = '/book-appointment'}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;