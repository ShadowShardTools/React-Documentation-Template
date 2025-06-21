import { Loader  } from 'lucide-react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <Loader className="w-5 h-5 animate-spin text-blue-500" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

export default LoadingSpinner;
