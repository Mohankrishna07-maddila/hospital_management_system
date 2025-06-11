import React from 'react';
import { BarChart2, Shield, Zap, Repeat } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="p-3 rounded-full bg-blue-100 text-blue-800 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <BarChart2 size={24} />,
      title: 'Advanced Analytics',
      description: 'Get deep insights into your business with our powerful analytics tools. Track performance and identify trends.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Enterprise Security',
      description: 'Your data is protected with enterprise-grade security features. We ensure your information stays private and secure.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Real-time Processing',
      description: 'Process and analyze data in real-time. Make informed decisions faster with up-to-the-minute information.'
    },
    {
      icon: <Repeat size={24} />,
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and services. Our platform integrates with over 100+ popular applications.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features that make a difference
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform is designed to help your business grow with powerful features
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;