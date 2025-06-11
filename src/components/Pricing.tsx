import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popularPlan?: boolean;
}

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: annual ? '$29' : '$39',
      description: 'Perfect for small businesses and startups',
      features: [
        { text: 'Up to 5 team members', available: true },
        { text: 'Basic analytics', available: true },
        { text: '24/7 support', available: true },
        { text: 'API access', available: false },
        { text: 'Advanced security', available: false },
      ],
      cta: 'Get started'
    },
    {
      name: 'Professional',
      price: annual ? '$79' : '$99',
      description: 'Ideal for growing businesses',
      features: [
        { text: 'Up to 20 team members', available: true },
        { text: 'Advanced analytics', available: true },
        { text: '24/7 priority support', available: true },
        { text: 'API access', available: true },
        { text: 'Advanced security', available: false },
      ],
      cta: 'Get started',
      popularPlan: true
    },
    {
      name: 'Enterprise',
      price: annual ? '$199' : '$249',
      description: 'For large organizations with advanced needs',
      features: [
        { text: 'Unlimited team members', available: true },
        { text: 'Custom analytics', available: true },
        { text: 'Dedicated account manager', available: true },
        { text: 'Unlimited API access', available: true },
        { text: 'Enterprise-grade security', available: true },
      ],
      cta: 'Contact sales'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that's right for your business
          </p>
          
          {/* Billing toggle */}
          <div className="mt-6 flex justify-center">
            <div className="relative bg-gray-100 p-1 rounded-full flex">
              <button
                onClick={() => setAnnual(true)}
                className={`${
                  annual
                    ? 'bg-white shadow-sm'
                    : 'bg-transparent'
                } relative py-2 px-6 rounded-full text-sm font-medium transition-all duration-200`}
              >
                Annual
                <span className={annual ? 'text-blue-800' : 'text-gray-500'}>
                  {' '}
                  Save 20%
                </span>
              </button>
              <button
                onClick={() => setAnnual(false)}
                className={`${
                  !annual
                    ? 'bg-white shadow-sm'
                    : 'bg-transparent'
                } relative py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                  !annual ? 'text-blue-800' : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg overflow-hidden bg-white transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                plan.popularPlan ? 'ring-2 ring-blue-800' : ''
              }`}
            >
              {plan.popularPlan && (
                <div className="bg-blue-800 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /mo
                  </span>
                </div>
                <p className="mt-5 text-lg text-gray-500">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className={`flex-shrink-0 ${feature.available ? 'text-green-500' : 'text-gray-300'}`}>
                        <Check size={20} />
                      </div>
                      <p className={`ml-3 text-base ${feature.available ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href="#"
                    className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                      plan.popularPlan
                        ? 'text-white bg-blue-800 hover:bg-blue-900'
                        : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                    } transition-colors duration-200`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;