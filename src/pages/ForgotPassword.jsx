import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
            setResetUrl(data.resetUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                        ¿Olvidaste tu contraseña?
                    </h2>
                    <p className="text-gray-600">
                        No te preocupes, te enviaremos instrucciones para restablecerla
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!resetUrl ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            {message && !resetUrl && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-800 text-sm">{message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Enviar instrucciones'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-green-800 font-semibold mb-2">✅ Solicitud procesada</h3>
                                <p className="text-green-700 text-sm mb-3">{message}</p>

                                {/* Temporal: Mostrar link para testing */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                    <p className="text-yellow-800 text-xs font-medium mb-2">
                                        🚧 Modo desarrollo - En producción esto llegará por email:
                                    </p>
                                    <Link
                                        to={resetUrl.replace(window.location.origin, '')}
                                        className="text-blue-600 hover:text-blue-800 text-sm break-all underline"
                                    >
                                        {resetUrl}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
