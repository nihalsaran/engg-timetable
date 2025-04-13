import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CampusIllustration from './CampusIllustration';
import { registerSuperAdmin, validateSecretKey } from './services/SuperAdminRegistration';
import { FiEye, FiEyeOff, FiLock, FiAlertCircle } from 'react-icons/fi';

const SuperAdminRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secretKeyVerified, setSecretKeyVerified] = useState(false);
  const navigate = useNavigate();

  // Secret key validation form
  const secretKeyForm = useFormik({
    initialValues: {
      secretKey: '',
    },
    validationSchema: Yup.object({
      secretKey: Yup.string().required('Secret key is required'),
      // super-admin-secret-key-2025
    }),
    onSubmit: (values) => {
      if (validateSecretKey(values.secretKey)) {
        setSecretKeyVerified(true);
      } else {
        setRegistrationError('Invalid secret key. Please contact system administrator.');
      }
    },
  });

  // Registration form
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: 'Administration',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
      department: Yup.string()
        .required('Department is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setRegistrationError('');
      
      try {
        const userData = {
          name: values.name,
          email: values.email,
          password: values.password,
          department: values.department,
        };
        
        const result = await registerSuperAdmin(userData);
        console.log('SuperAdmin registration successful:', result);
        
        // Always navigate to login page after successful registration
        // The session creation might have failed, so user should log in manually
        navigate('/login', { 
          state: { 
            message: 'SuperAdmin account created successfully! Please log in with your new account.' 
          } 
        });
      } catch (error) {
        console.error('Registration failed:', error);
        setRegistrationError(error.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

          {/* Registration Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 max-w-md"
          >
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-center text-3xl font-extrabold text-white mb-2">
                  Create SuperAdmin Account
                </h2>
                <p className="text-center text-indigo-200 mb-6">
                  Setup the first administrator for the system
                </p>
              </motion.div>
              
              {/* Security Notice */}
              <div className="mb-6 p-3 bg-yellow-400/20 rounded-lg border border-yellow-400/30">
                <div className="flex items-center">
                  <FiAlertCircle className="text-yellow-400 mr-2 flex-shrink-0" size={18} />
                  <p className="text-white text-sm">
                    This page is for authorized personnel only. Creating a SuperAdmin account requires a valid security key.
                  </p>
                </div>
              </div>

              {registrationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-white text-sm mb-4"
                >
                  {registrationError}
                </motion.div>
              )}
              
              {!secretKeyVerified ? (
                // Secret Key Verification Form
                <form onSubmit={secretKeyForm.handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="secretKey" className="block text-sm font-medium text-white mb-1">
                      Security Key
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-indigo-300" />
                      </div>
                      <input
                        id="secretKey"
                        type="password"
                        {...secretKeyForm.getFieldProps('secretKey')}
                        className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg 
                                bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                transition-all duration-200"
                        placeholder="Enter security key"
                      />
                    </div>
                    {secretKeyForm.touched.secretKey && secretKeyForm.errors.secretKey && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-400"
                      >
                        {secretKeyForm.errors.secretKey}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold
                              bg-gradient-to-r from-indigo-500 to-indigo-600 text-white
                              hover:from-indigo-600 hover:to-indigo-700
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                              transform transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                    >
                      Verify Security Key
                    </button>
                  </motion.div>
                </form>
              ) : (
                // SuperAdmin Registration Form
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        type="text"
                        {...formik.getFieldProps('name')}
                        className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                                bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-400"
                        >
                          {formik.errors.name}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                          className="mt-1 text-sm text-red-400"
                        >
                          {formik.errors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="department" className="block text-sm font-medium text-white">
                      Department
                    </label>
                    <div className="mt-1">
                      <input
                        id="department"
                        type="text"
                        {...formik.getFieldProps('department')}
                        className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                                bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                transition-all duration-200"
                        placeholder="Enter department name"
                      />
                      {formik.touched.department && formik.errors.department && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-400"
                        >
                          {formik.errors.department}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...formik.getFieldProps('password')}
                        className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                                bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                transition-all duration-200 pr-10"
                        placeholder="Create a secure password"
                      />
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300 hover:text-white"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                      {formik.touched.password && formik.errors.password && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-400"
                        >
                          {formik.errors.password}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...formik.getFieldProps('confirmPassword')}
                        className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                                bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                                focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                transition-all duration-200 pr-10"
                        placeholder="Confirm your password"
                      />
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300 hover:text-white"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-400"
                        >
                          {formik.errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2"
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
                          {isLoading ? 'Creating account...' : 'Create SuperAdmin Account'}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </motion.div>
                </form>
              )}
              
              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-sm text-indigo-300 hover:text-white transition-colors"
                >
                  Return to login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegistration;