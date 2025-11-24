import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Add a review for a product
// @route   POST /api/reviews/:productId
// @access  Public (should be Private, but skipping auth for now)
router.post('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId, rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Check if user already reviewed
        const existing = await Review.findOne({ product: productId, user: userId });
        if (existing) {
            return res.status(400).json({ message: 'Ya has reseñado este producto' });
        }

        // Check if user purchased the product AND it was delivered
        const hasPurchased = await Order.findOne({
            user: userId,
            'orderItems.product': productId,
            isPaid: true,
            status: 'Entregado'
        });

        if (!hasPurchased) {
            return res.status(400).json({
                message: 'Solo puedes reseñar productos que hayas comprado y recibido. El pedido debe estar marcado como "Entregado" y pagado.'
            });
        }
        const review = new Review({
            product: productId,
            user: userId,
            name: user.name,
            rating,
            comment
        });
        await review.save();
        // Update product rating summary
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        product.rating = avgRating;
        product.numReviews = reviews.length;
        await product.save();
        res.status(201).json(review);
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Error al crear reseña' });
    }
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Error al obtener reseñas' });
    }
});

// @desc    Update a review (owner only)
// @route   PUT /api/reviews/:id
// @access  Public (should be Private)
router.put('/:id', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }
        // TODO: verify review.user matches req.body.userId for auth
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        await review.save();
        // Recalculate product rating
        const product = await Product.findById(review.product);
        const reviews = await Review.find({ product: product._id });
        product.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        product.numReviews = reviews.length;
        await product.save();
        res.json(review);
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Error al actualizar reseña' });
    }
});

// @desc    Delete a review (owner only)
// @route   DELETE /api/reviews/:id
// @access  Public (should be Private)
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }
        // TODO: verify owner
        await review.deleteOne();
        // Recalculate product rating
        const product = await Product.findById(review.product);
        const reviews = await Review.find({ product: product._id });
        if (reviews.length > 0) {
            product.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            product.numReviews = reviews.length;
        } else {
            product.rating = 0;
            product.numReviews = 0;
        }
        await product.save();
        res.json({ message: 'Reseña eliminada' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Error al eliminar reseña' });
    }
});

export default router;
