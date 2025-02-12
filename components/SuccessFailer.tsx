
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertProps {
  type: 'success' | 'failure';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex flex-col items-center p-6 rounded-lg shadow-lg max-w-sm 
          ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
        >
          {type === 'success' ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </motion.div>
        <span className="mt-4 text-lg font-semibold">{message}</span>
      </motion.div>
    </div>
  );
};

export default Alert;
