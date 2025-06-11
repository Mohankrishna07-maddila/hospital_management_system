import React, { useState } from 'react';
import { format } from 'date-fns';

interface AppointmentForm {
  department: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
}

const AppointmentBooking: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentForm>({
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });

  const departments = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'General Medicine',
  ];

  const doctors: Record<string, string[]> = {
    Cardiology: ['Dr. John Smith', 'Dr. Sarah Johnson'],
    Orthopedics: ['Dr. Michael Brown', 'Dr. Emily Davis'],
    Neurology: ['Dr. David Wilson', 'Dr. Lisa Anderson'],
    Pediatrics: ['Dr. Robert Taylor', 'Dr. Maria Garcia'],
    'General Medicine': ['Dr. James Miller', 'Dr. Patricia Moore'],
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically send the data to our backend
    console.log('Appointment booked:', formData);
    alert('Appointment booked successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AppointmentForm) => ({
      ...prev,
      [name]: value
    }));
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor</label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={!formData.department}
          >
            <option value="">Select Doctor</option>
            {formData.department && doctors[formData.department].map(doc => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;