import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

dotenv.config();

const deleteReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete all reviews
        await Review.deleteMany({});
        console.log('All reviews deleted');

        // Reset product ratings
        await Product.updateMany({}, { rating: 0, numReviews: 0 });
        console.log('Product ratings reset');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteReviews();
