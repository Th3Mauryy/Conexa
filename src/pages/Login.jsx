import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../utils/validators';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.email) {
            const validation = validateEmail(value);
            setEmailError(validation.error);
        }
    };

    const handleEmailBlur = () => {
        setTouched(prev => ({ ...prev, email: true }));
        const validation = validateEmail(email);
        setEmailError(validation.error);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handlePasswordBlur = () => {
        setTouched(prev => ({ ...prev, password: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Marcar campos como tocados
        setTouched({ email: true, password: true });

        // Validar email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error);
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        // Validar password no vacío
        if (!password) {
            setError('Por favor ingresa tu contraseña');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            if (result.user && result.user.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/tienda');
            }
        } else {
            setError(result.message);
        }
    };

    const getInputBorderClass = (field, value, hasError) => {
        if (!touched[field]) return 'border-gray-300';
        if (hasError) return 'border-red-500';
        if (value) return 'border-green-500';
        return 'border-gray-300';
    };

    const isFormInvalid = () => {
        return !email || !password || emailError !== '';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
                    <p className="mt-2 text-sm text-gray-600">Ingresa a tu cuenta para continuar</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-6 flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`block w-full px-4 py-3 rounded-lg border-2 ${getInputBorderClass('email', email, emailError)} focus:ring-2 focus:ring-blue-500 transition-colors text-base`}
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                        />
                        {touched.email && emailError && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {emailError}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`block w-full px-4 py-3 rounded-lg border-2 ${getInputBorderClass('password', password, false)} focus:ring-2 focus:ring-blue-500 transition-colors text-base`}
                            placeholder="••••••••"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                        />
                    </div>

                    <button
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isFormInvalid()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        type="submit"
                        disabled={isFormInvalid()}
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
