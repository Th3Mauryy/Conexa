import express from 'express';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load postal codes data
const postalCodesPath = path.join(__dirname, '../utils/mexico_codigos_postales.json');
let postalCodesData = {};

try {
    if (fs.existsSync(postalCodesPath)) {
        const data = fs.readFileSync(postalCodesPath, 'utf8');
        postalCodesData = JSON.parse(data);
        console.log('Postal codes data loaded successfully');
    } else {
        console.error(`Postal codes file not found at: ${postalCodesPath}`);
    }
} catch (error) {
    console.error('Error loading postal codes data:', error);
}

// @desc    Get location info by zip code
// @route   GET /api/locations/:zipCode
// @access  Public
router.get('/:zipCode', (req, res) => {
    const { zipCode } = req.params;

    if (!postalCodesData[zipCode]) {
        return res.status(404).json({ message: 'Código postal no encontrado' });
    }

    const locationData = postalCodesData[zipCode];
    res.json(locationData);
});

export default router;
