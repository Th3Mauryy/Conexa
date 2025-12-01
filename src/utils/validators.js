/**
 * Utilidades de Validación de Formularios
 * Validaciones en tiempo real para todos los formularios del proyecto
 */

/**
 * Valida formato de email completo
 * @param {string} email - Email a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'El correo electrónico es requerido' };
    }

    // Validar formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Formato de correo electrónico inválido' };
    }

    // Validar que el dominio tenga al menos 2 caracteres después del punto
    const domainParts = email.split('@')[1]?.split('.');
    if (!domainParts || domainParts[domainParts.length - 1]?.length < 2) {
        return { isValid: false, error: 'Dominio de correo incompleto (ej: .com, .mx)' };
    }

    // Validar dominios comunes mal escritos
    const commonDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
    const domain = email.split('@')[1];
    const partialDomains = ['gmail.c', 'outlook.c', 'hotmail.c', 'yahoo.c'];

    if (partialDomains.some(partial => domain?.startsWith(partial))) {
        return { isValid: false, error: 'Dominio de correo incompleto' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} - { isValid: boolean, error: string, strength: string }
 */
export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
        return { isValid: false, error: 'La contraseña es requerida', strength: 'weak' };
    }

    if (password.length < 6) {
        return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres', strength: 'weak' };
    }

    // Determinar fortaleza de la contraseña
    let strength = 'weak';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (password.length >= 8 && strengthScore >= 3) {
        strength = 'strong';
    } else if (password.length >= 6 && strengthScore >= 2) {
        strength = 'medium';
    }

    return { isValid: true, error: '', strength };
};

/**
 * Valida confirmación de contraseña
 * @param {string} password - Contraseña original
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return { isValid: false, error: 'Confirma tu contraseña' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, error: 'Las contraseñas no coinciden' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida nombre completo
 * @param {string} name - Nombre a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateName = (name) => {
    if (!name || name.trim() === '') {
        return { isValid: false, error: 'El nombre es requerido' };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
    }

    // Validar que tenga al menos nombre y apellido
    const nameParts = name.trim().split(' ');
    if (nameParts.length < 2) {
        return { isValid: false, error: 'Ingresa tu nombre completo (nombre y apellido)' };
    }

    // Validar que no contenga números
    if (/\d/.test(name)) {
        return { isValid: false, error: 'El nombre no puede contener números' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida teléfono mexicano
 * @param {string} phone - Teléfono a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
        return { isValid: false, error: 'El teléfono es requerido' };
    }

    // Remover caracteres no numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
        return { isValid: false, error: 'El teléfono debe tener 10 dígitos' };
    }

    // Validar que empiece con un dígito válido (no 0 o 1)
    if (cleanPhone[0] === '0' || cleanPhone[0] === '1') {
        return { isValid: false, error: 'Número de teléfono inválido' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida código postal mexicano
 * @param {string} zipCode - Código postal a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateZipCode = (zipCode) => {
    if (!zipCode || zipCode.trim() === '') {
        return { isValid: false, error: 'El código postal es requerido' };
    }

    const cleanZip = zipCode.replace(/\D/g, '');

    if (cleanZip.length !== 5) {
        return { isValid: false, error: 'El código postal debe tener 5 dígitos' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida dirección de calle
 * @param {string} street - Calle a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateStreet = (street) => {
    if (!street || street.trim() === '') {
        return { isValid: false, error: 'La calle es requerida' };
    }

    if (street.trim().length < 3) {
        return { isValid: false, error: 'La calle debe tener al menos 3 caracteres' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida número exterior
 * @param {string} extNumber - Número exterior a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateExtNumber = (extNumber) => {
    if (!extNumber || extNumber.trim() === '') {
        return { isValid: false, error: 'El número exterior es requerido' };
    }

    return { isValid: true, error: '' };
};

/**
 * Valida campo de texto requerido genérico
 * @param {string} value - Valor a validar
 * @param {string} fieldName - Nombre del campo para el mensaje de error
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'Este campo') => {
    if (!value || value.toString().trim() === '') {
        return { isValid: false, error: `${fieldName} es requerido` };
    }

    return { isValid: true, error: '' };
};

/**
 * Formatea teléfono a formato mexicano (XXX) XXX-XXXX
 * @param {string} phone - Teléfono a formatear
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
};

/**
 * Limpia teléfono de formato
 * @param {string} phone - Teléfono formateado
 * @returns {string} - Solo dígitos
 */
export const cleanPhone = (phone) => {
    return phone.replace(/\D/g, '');
};
