import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CampusIllustration from './CampusIllustration';
import authService from '../../appwrite/auth';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setLoginError('');
      
      try {
        const response = await authService.login(values.email, values.password);
        
        if (response.success) {
          // Check user role and navigate to appropriate dashboard
          const currentUser = await authService.getCurrentUser();
          if (currentUser.success) {
            // Navigate based on user role - this would come from your user's appwrite document
            // For now, let's assume all users are admins
            navigate('/admin-dashboard');
            
            // In a real app, you would do something like:
            /*
            switch (currentUser.user.role) {
              case 'admin':
                navigate('/admin-dashboard');
                break;
              case 'hod':
                navigate('/hod-dashboard');
                break;
              case 'ttincharge':
                navigate('/tt-dashboard');
                break;
              default:
                navigate('/login');
            }
            */
          } else {
            navigate('/admin-dashboard');
          }
        } else {
          setLoginError('Failed to login. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setLoginError('Authentication failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    },
  });

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

          {/* Login Form */}
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
                <h2 className="text-center text-3xl font-extrabold text-white mb-8">
                  University Timetable System
                </h2>
              </motion.div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/30 border border-red-500/50 rounded-lg text-white text-sm"
                >
                  {loginError}
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email address
                  </label>
                  <div className="mt-1 group">
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
                >
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      {...formik.getFieldProps('password')}
                      className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-lg 
                               bg-white/5 backdrop-blur-sm text-white placeholder-white/50
                               focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                               transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-400"
                      >
                        {formik.errors.password}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                        {isLoading ? 'Signing in...' : 'Sign in'}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;