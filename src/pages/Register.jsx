import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateName,
    validatePhone,
    formatPhone,
    cleanPhone
} from '../utils/validators';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Estado para errores de cada campo
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Estado para indicar qué campos han sido tocados
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false
    });

    const [passwordStrength, setPasswordStrength] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    // Validar campo individual en tiempo real
    const validateField = (field, value) => {
        let validation;

        switch (field) {
            case 'name':
                validation = validateName(value);
                break;
            case 'email':
                validation = validateEmail(value);
                break;
            case 'phone':
                validation = validatePhone(value);
                break;
            case 'password':
                validation = validatePassword(value);
                setPasswordStrength(validation.strength || '');
                break;
            case 'confirmPassword':
                validation = validatePasswordMatch(password, value);
                break;
            default:
                validation = { isValid: true, error: '' };
        }

        setFieldErrors(prev => ({
            ...prev,
            [field]: validation.error
        }));

        return validation.isValid;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Validar al perder foco
        if (field === 'name') validateField('name', name);
        if (field === 'email') validateField('email', email);
        if (field === 'phone') validateField('phone', phone);
        if (field === 'password') validateField('password', password);
        if (field === 'confirmPassword') validateField('confirmPassword', confirmPassword);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (touched.name) {
            validateField('name', value);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.email) {
            validateField('email', value);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const formatted = formatPhone(value);
        setPhone(formatted);
        if (touched.phone) {
            validateField('phone', formatted);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (touched.password) {
            validateField('password', value);
        }
        // Re-validar confirmPassword si ya fue ingresada
        if (touched.confirmPassword && confirmPassword) {
            validateField('confirmPassword', confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (touched.confirmPassword) {
            validateField('confirmPassword', value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Marcar todos los campos como tocados
        setTouched({
            name: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true
        });

        // Validar todos los campos
        const nameValid = validateField('name', name);
        const emailValid = validateField('email', email);
        const phoneValid = validateField('phone', phone);
        const passwordValid = validateField('password', password);
        const confirmPasswordValid = validateField('confirmPassword', confirmPassword);

        // Si algún campo es inválido, detener
        if (!nameValid || !emailValid || !phoneValid || !passwordValid || !confirmPasswordValid) {
            setError('Por favor corrige los errores en el formulario');
            return;
        }

        // Limpiar teléfono antes de enviar
        const cleanedPhone = cleanPhone(phone);

        const result = await register(name, email, password, cleanedPhone);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    // Determinar si el botón debe estar deshabilitado
    const isFormInvalid = () => {
        return Object.values(fieldErrors).some(error => error !== '') ||
            !name || !email || !phone || !password || !confirmPassword;
    };

    // Obtener color del borde según el estado del campo
    const getInputBorderClass = (field, value) => {
        if (!touched[field]) return 'border-gray-200';
        if (fieldErrors[field]) return 'border-red-500';
        if (value) return 'border-green-500';
        return 'border-gray-200';
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 'strong') return 'bg-green-500';
        if (passwordStrength === 'medium') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 'strong') return 'Segura';
        if (passwordStrength === 'medium') return 'Media';
        if (passwordStrength === 'weak') return 'Débil';
        return '';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Crear Cuenta</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Nombre Completo */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={`shadow-sm border-2 ${getInputBorderClass('name', name)} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                            value={name}
                            onChange={handleNameChange}
                            onBlur={() => handleBlur('name')}
                            placeholder="Juan Pérez García"
                        />
                        {touched.name && fieldErrors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`shadow-sm border-2 ${getInputBorderClass('email', email)} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => handleBlur('email')}
                            placeholder="ejemplo@correo.com"
                        />
                        {touched.email && fieldErrors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className={`shadow-sm border-2 ${getInputBorderClass('phone', phone)} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                            value={phone}
                            onChange={handlePhoneChange}
                            onBlur={() => handleBlur('phone')}
                            placeholder="(312) 123-4567"
                            maxLength="14"
                        />
                        {touched.phone && fieldErrors.phone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.phone}
                            </p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`shadow-sm border-2 ${getInputBorderClass('password', password)} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => handleBlur('password')}
                            placeholder="Mínimo 6 caracteres"
                        />
                        {touched.password && fieldErrors.password && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.password}
                            </p>
                        )}
                        {password && !fieldErrors.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Seguridad:</span>
                                    <span className={`text-xs font-medium ${passwordStrength === 'strong' ? 'text-green-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {getPasswordStrengthText()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                        style={{ width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%' }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirmar Contraseña *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`shadow-sm border-2 ${getInputBorderClass('confirmPassword', confirmPassword)} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Repite tu contraseña"
                        />
                        {touched.confirmPassword && fieldErrors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
                        {touched.confirmPassword && !fieldErrors.confirmPassword && confirmPassword && (
                            <p className="text-green-500 text-xs mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Las contraseñas coinciden
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className={`text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full transition-all transform active:scale-95 shadow-lg ${isFormInvalid()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                }`}
                            type="submit"
                            disabled={isFormInvalid()}
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
