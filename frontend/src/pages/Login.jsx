import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const { success, message } = await login(formData.username, formData.password);

            if (success) {
                navigate('/dashboard');
            } else {
                setError(message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Contact Admin',
            html: `
                <div class="text-left">
                    <p class="mb-4">Please contact the administrator to reset your password:</p>
                    <p class="mb-2"><strong>Email:</strong> <a href="mailto:azamp442@gmail.com" class="text-primary-600 hover:underline">azamp442@gmail.com</a></p>
                    <p><strong>GitHub:</strong> <a href="https://github.com/Azam-aa" target="_blank" class="text-primary-600 hover:underline">Azam-aa</a></p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Close',
            confirmButtonColor: '#3b82f6',
            customClass: {
                popup: 'dark:bg-slate-800 dark:text-white'
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="px-8 py-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Sign in to manage your claims efficiently
                        </p>
                    </div>

                    {/* Test Credentials Panel for HR */}
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 whitespace-nowrap">Testing Credentials (Click to fill):</h3>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ username: 'admin', password: 'password123' })}
                                className="text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-600 rounded text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition"
                            >
                                Admin: admin
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ username: 'agent1', password: 'password123' })}
                                className="text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-600 rounded text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition"
                            >
                                Agent: agent1
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="username"
                            label="Username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />

                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            suffix={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                        />

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full justify-center py-3"
                            isLoading={isSubmitting}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 to-primary-300"></div>
            </div>
        </div>
    );
};

export default Login;
