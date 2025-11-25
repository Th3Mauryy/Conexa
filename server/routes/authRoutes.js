import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePhoto: user.profilePhoto,
            address: user.address,
            phone: user.phone,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'El usuario ya existe' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePhoto: user.profilePhoto,
            address: user.address,
            phone: user.phone,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            address: user.address,
            phone: user.phone,
            image: user.image
        });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// @desc    Forgot password - Send reset token
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('DEBUG: FRONTEND_URL is:', process.env.FRONTEND_URL); // Debug log
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No existe usuario con ese email' });
        }
        const crypto = await import('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const message = `
            <h1>Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>Si no solicitaste este correo, puedes ignorarlo.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Recuperación de Contraseña - Conexa',
                html: message
            });

            res.json({
                message: 'Email enviado con instrucciones',
            });
        } catch (error) {
            console.error('Error sending recovery email:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({
                message: 'Error al enviar el email',
                error: error.message
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error al procesar solicitud' });
    }
});
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Hash the token from params
        const crypto = await import('crypto');
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            message: 'Contraseña actualizada exitosamente',
            success: true
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error al resetear contraseña' });
    }
});


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        // Get user ID from Authorization header (JWT token)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and get user ID
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name;
        user.phone = phone || user.phone;
        if (req.body.profilePhoto !== undefined) {
            user.profilePhoto = req.body.profilePhoto;
        }
        user.address = {
            street: address?.street || user.address?.street || '',
            extNumber: address?.extNumber || user.address?.extNumber || '',
            intNumber: address?.intNumber || user.address?.intNumber || '',
            colony: address?.colony || user.address?.colony || '',
            city: address?.city || user.address?.city || '',
            state: address?.state || user.address?.state || '',
            zipCode: address?.zipCode || user.address?.zipCode || '',
            country: 'México',
        };

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profilePhoto: updatedUser.profilePhoto,
            isAdmin: updatedUser.isAdmin,
            address: updatedUser.address,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

export default router;
