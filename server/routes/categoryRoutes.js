import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all unique categories from products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        const categories = [...new Set(products.map(p => p.category))];
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// @route   GET /api/categories/stats
// @desc    Get category statistics (product count, stock count)
// @access  Private/Admin
router.get('/stats', async (req, res) => {
    try {
        const products = await Product.find({});
        const categoryStats = {};

        products.forEach(product => {
            if (!categoryStats[product.category]) {
                categoryStats[product.category] = {
                    totalProducts: 0,
                    productsInStock: 0,
                    productsOutOfStock: 0,
                    products: []
                };
            }

            categoryStats[product.category].totalProducts++;

            if (product.countInStock > 0) {
                categoryStats[product.category].productsInStock++;
            } else {
                categoryStats[product.category].productsOutOfStock++;
                categoryStats[product.category].products.push({
                    _id: product._id,
                    name: product.name,
                    countInStock: product.countInStock
                });
            }
        });

        res.json(categoryStats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category stats', error: error.message });
    }
});

// @route   POST /api/categories
// @desc    Add a new category
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }

        const normalizedName = name.trim();

        // Check if category already exists
        const existingProduct = await Product.findOne({ category: normalizedName });

        if (existingProduct) {
            return res.status(400).json({ message: 'Esta categoría ya existe' });
        }

        res.status(201).json({
            message: 'Categoría agregada exitosamente',
            category: normalizedName
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar categoría', error: error.message });
    }
});

// @route   PUT /api/categories/:name
// @desc    Edit a category name and update all related products
// @access  Private/Admin
router.put('/:name', async (req, res) => {
    try {
        const oldCategoryName = decodeURIComponent(req.params.name);
        const { newName } = req.body;

        if (!newName || newName.trim() === '') {
            return res.status(400).json({ message: 'El nuevo nombre de la categoría es requerido' });
        }

        const normalizedNewName = newName.trim();

        // Check if new category name already exists (and it's not the same category)
        if (oldCategoryName !== normalizedNewName) {
            const existingCategory = await Product.findOne({ category: normalizedNewName });
            if (existingCategory) {
                return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
            }
        }

        // Update all products with the old category to the new category
        const updateResult = await Product.updateMany(
            { category: oldCategoryName },
            { $set: { category: normalizedNewName } }
        );

        res.json({
            message: 'Categoría actualizada exitosamente',
            oldName: oldCategoryName,
            newName: normalizedNewName,
            updatedProducts: updateResult.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar categoría', error: error.message });
    }
});


// @route   DELETE /api/categories/:name
// @desc    Delete a category and all associated products
// @access  Private/Admin
router.delete('/:name', async (req, res) => {
    try {
        const categoryName = decodeURIComponent(req.params.name);

        // Find all products in this category
        const products = await Product.find({ category: categoryName });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada o vacía' });
        }

        // Check if any product has stock
        const hasStock = products.some(p => p.countInStock > 0);

        if (hasStock) {
            return res.status(400).json({
                message: 'No se puede eliminar esta categoría porque tiene productos con stock disponible',
                suggestion: 'Primero debes agotar o eliminar los productos con stock'
            });
        }

        // Delete all products in this category
        const deleteResult = await Product.deleteMany({ category: categoryName });

        res.json({
            message: 'Categoría eliminada exitosamente',
            deletedProducts: deleteResult.deletedCount,
            products: products.map(p => ({ _id: p._id, name: p.name }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
    }
});

export default router;
