import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import StoreNavbar from '../components/StoreNavbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { user, setUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [lookingUpZip, setLookingUpZip] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [availableColonies, setAvailableColonies] = useState([]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePhoto: user?.profilePhoto || '',
        address: {
            street: user?.address?.street || '',
            extNumber: user?.address?.extNumber || '',
            intNumber: user?.address?.intNumber || '',
            colony: user?.address?.colony || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: 'México'
        }
    });

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            profilePhoto: user.profilePhoto || '',
            address: {
                street: user.address?.street || '',
                extNumber: user.address?.extNumber || '',
                intNumber: user.address?.intNumber || '',
                colony: user.address?.colony || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || '',
                country: 'México'
            }
        });
        setPhotoPreview(user.profilePhoto || null);
    }, [user, authLoading, navigate]);

    const lookupZipCode = async (zipCode) => {
        if (zipCode.length !== 5) return;

        setLookingUpZip(true);
        try {
            const { data } = await api.get(`/locations/${zipCode}`);

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        city: data.municipio || '',
                        state: data.estado || '',
                        zipCode: zipCode,
                        // If colonies exist, set the first one as default or let user choose
                        colony: data.asentamientos && data.asentamientos.length > 0 ? data.asentamientos[0].nombre : ''
                    }
                }));

                if (data.asentamientos && Array.isArray(data.asentamientos)) {
                    setAvailableColonies(data.asentamientos.map(a => a.nombre));
                } else {
                    setAvailableColonies([]);
                }
            }
        } catch (error) {
            console.error('Error looking up zip code:', error);
            // Don't alert, just let user type manually if not found
        } finally {
            setLookingUpZip(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño ANTES de subir (4MB = 4 * 1024 * 1024 bytes)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
            toast.error('⚠️ La imagen es muy pesada. Máximo 4MB');
            e.target.value = ''; // Limpiar el input
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formDataUpload = new FormData();
        formDataUpload.append('images', file);

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formDataUpload, config);

            setFormData(prev => ({
                ...prev,
                profilePhoto: data[0]
            }));

            toast.success('✅ Foto actualizada correctamente');
            setUploading(false);
        } catch (error) {
            console.error('Error uploading photo:', error);

            // Revertir a la foto anterior
            setPhotoPreview(null);

            // Mensaje de error amigable
            if (error.response?.status === 413) {
                toast.error('⚠️ La imagen es muy pesada. Máximo 4MB');
            } else {
                toast.error('❌ Error al subir la foto. Intenta de nuevo');
            }

            setUploading(false);
            e.target.value = ''; // Limpiar el input
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];

            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));

            // Auto-lookup when zip code is complete
            if (addressField === 'zipCode' && value.length === 5) {
                lookupZipCode(value);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.put('/auth/profile', formData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Perfil actualizado correctamente');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al actualizar el perfil: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const getInitial = () => {
        return user.name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
            <StoreNavbar onSearch={() => { }} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                {/* Header Card */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 mb-6 md:mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="relative group">
                                {photoPreview || formData.profilePhoto ? (
                                    <img
                                        src={photoPreview || formData.profilePhoto}
                                        alt={user.name}
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg border-4 border-blue-100">
                                        {getInitial()}
                                    </div>
                                )}

                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            onChange={handlePhotoUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                        <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                    Mi Perfil
                                </h1>
                                <p className="text-sm md:text-base text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                    Administra tu información personal
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${isEditing
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:shadow-blue-200/50'
                                }`}
                        >
                            {isEditing ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar Perfil
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-10">
                        {/* Personal Information */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Información Personal
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1 ml-1">🔒 El correo no se puede cambiar</p>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Dirección de Envío
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Código Postal - First to trigger lookup */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Código Postal *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        maxLength="5"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                        placeholder="12345"
                                    />
                                    {lookingUpZip && (
                                        <div className="absolute right-3 top-3">
                                            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-blue-600 mt-1 ml-1">📍 Ingresa tu CP para auto-completar</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="Auto-completado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Municipio/Alcaldía</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="Auto-completado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Colonia</label>
                                {availableColonies.length > 0 && isEditing ? (
                                    <select
                                        name="address.colony"
                                        value={formData.address.colony}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                                    >
                                        <option value="">Selecciona una colonia</option>
                                        {availableColonies.map((col, idx) => (
                                            <option key={idx} value={col}>{col}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="address.colony"
                                        value={formData.address.colony}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                        placeholder="Auto-completado"
                                    />
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Calle</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="Av. Insurgentes Sur"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Número Exterior</label>
                                <input
                                    type="text"
                                    name="address.extNumber"
                                    value={formData.address.extNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="123"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Número Interior (Opcional)</label>
                                <input
                                    type="text"
                                    name="address.intNumber"
                                    value={formData.address.intNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    placeholder="Depto 4B"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">País</label>
                                <input
                                    type="text"
                                    value="México"
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed font-medium text-gray-600"
                                />
                                <p className="text-xs text-gray-500 mt-1 ml-1">🇲🇽 Solo enviamos a México</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-8 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-105"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 active:scale-95"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
