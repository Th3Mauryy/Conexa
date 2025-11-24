import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get wishlist for user
// @route   GET /api/wishlist/:userId
// @access  Public (should be Private)
router.get('/:userId', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate('products');
        if (!wishlist) {
            return res.json({ products: [] });
        }
        res.json(wishlist);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ message: 'Error al obtener wishlist' });
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:userId/:productId
// @access  Public (should be Private)
router.post('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }
        await wishlist.save();
        res.json(wishlist);
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ message: 'Error al añadir a wishlist' });
    }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:userId/:productId
// @access  Public (should be Private)
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist no encontrada' });
        }
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ message: 'Error al eliminar de wishlist' });
    }
});

export default router;
