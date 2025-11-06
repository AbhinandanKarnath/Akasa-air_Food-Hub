import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Truck, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { registerUser, setAuthToken } from '../../utils/auth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (error) setError('');

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Weak', color: 'text-red-500' };
      case 2:
      case 3:
        return { text: 'Medium', color: 'text-yellow-500' };
      case 4:
      case 5:
        return { text: 'Strong', color: 'text-green-500' };
      default:
        return { text: '', color: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData.email, formData.password, formData.name);
      
      if (response.token) {
        setAuthToken(response.token);
        toast.success('Welcome to FoodHub! 🎉');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-20 w-28 h-28 bg-orange-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div className="absolute bottom-32 left-16 w-36 h-36 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-bounce delay-700"></div>
      <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-md relative">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-2xl shadow-lg">
                <Truck className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Join FoodHub!
            </h1>
            <p className="text-gray-600 text-sm">
              Create your account and start your delicious food journey with us
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Registration Failed</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password Strength</span>
                    <span className={`font-medium ${getPasswordStrengthText().color}`}>
                      {getPasswordStrengthText().text}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    passwordMismatch
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : passwordMatch
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="absolute inset-y-0 right-10 flex items-center">
                    {passwordMatch ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Password Match Message */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-orange-600 hover:text-orange-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-orange-600 hover:text-orange-700 font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || passwordMismatch}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 
                flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl
                ${loading || passwordMismatch
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-95'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white/50 rounded-full">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 bg-white/50 backdrop-blur-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            🔒 Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;