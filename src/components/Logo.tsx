import React from 'react';
import { Zap } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-shrink-0 items-center">
      <Zap className="h-8 w-8 text-blue-800" />
      <span className="ml-2 text-xl font-bold text-gray-900">Pulse</span>
    </div>
  );
};

export default Logo;