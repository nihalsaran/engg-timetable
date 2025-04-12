import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CampusIllustration from './CampusIllustration';
import { submitPasswordResetForm } from './services/ForgotPassword';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setErrorMessage('');
      await submitPasswordResetForm(values.email, setIsLoading, setIsSubmitted, setErrorMessage);
    },
  });

  const SuccessMessage = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-3xl font-extrabold text-white mb-4">
        Check your email
      </h2>
      <p className="text-indigo-200 mb-8">
        We've sent password reset instructions to your email address.
      </p>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-lg text-sm font-semibold
                     bg-gradient-to-r from-indigo-500 to-indigo-600 text-white
                     hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
        >
          Return to login
        </Link>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff20_25%,transparent_25%,transparent_75%,#ffffff20_75%,#ffffff20)] bg-[length:60px_60px] animate-flow" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff20_25%,transparent_25%,transparent_75%,#ffffff20_75%,#ffffff20)] bg-[length:60px_60px] animate-flow-reverse" 
             style={{ animationDelay: '-2s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex items-center gap-8">
          {/* 3D Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-1/2 h-[500px]"
          >
            <CampusIllustration />
          </motion.div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 max-w-md"
          >
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
              {isSubmitted ? (
                <SuccessMessage />
              ) : (
                <>
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-3xl font-extrabold text-white">
                      Reset your password
                    </h2>
                    <p className="mt-2 text-indigo-200">
                      Enter your email address and we'll send you instructions
                    </p>
                  </motion.div>

                  <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          type="email"
                          {...formik.getFieldProps('email')}
                          className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                                   bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                   focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                   transition-all duration-200"
                          placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-sm text-red-400"
                          >
                            {formik.errors.email}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold
                                  bg-gradient-to-r from-indigo-500 to-indigo-600 text-white
                                  hover:from-indigo-600 hover:to-indigo-700
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                  transform transition-all duration-200 cursor-pointer
                                  ${isLoading ? 'opacity-75 cursor-wait' : 'hover:scale-[1.02]'}`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isLoading ? 'loading' : 'static'}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isLoading ? 'Sending...' : 'Send reset instructions'}
                          </motion.span>
                        </AnimatePresence>
                      </button>

                      {errorMessage && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-400 text-center"
                        >
                          {errorMessage}
                        </motion.p>
                      )}

                      <div className="text-center">
                        <Link
                          to="/login"
                          className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                        >
                          Back to login
                        </Link>
                      </div>
                    </motion.div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;