import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'How does the billing work?',
      answer: 'We offer both monthly and annual billing options. Annual plans come with a 20% discount. You can upgrade, downgrade, or cancel your plan at any time through your account dashboard.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can change your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial on all plans. No credit card is required to start your trial. You can upgrade to a paid plan at any time during or after your trial period.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We take security seriously. Your data is encrypted both in transit and at rest. We use industry-standard security practices and regularly undergo security audits. Our platform complies with GDPR, CCPA, and other data protection regulations.'
    },
    {
      question: 'Can I integrate with other tools?',
      answer: 'Yes, we offer integrations with over 100+ popular tools and services. You can connect your favorite marketing, sales, and project management tools through our API or using our pre-built integrations.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'All plans include email support with a 24-hour response time. Professional and Enterprise plans include priority support with faster response times. Enterprise plans also include a dedicated account manager for personalized support.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Have a different question? Contact our support team at support@pulsehq.io
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-base text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;