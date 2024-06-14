import { Router } from 'express';
import { createProduct, searchProducts, getPaginatedProducts, filterProducts } from '../Controllers/ProductControllers'

const router = Router();

// POST Endpoint
router.post('/products', createProduct);

// Search Endpoint
router.get('/products/search', searchProducts);

// Paginated List Endpoint
router.get('/products', getPaginatedProducts);

// Filter by Price Range and Name
router.get('/products/filter', filterProducts);

export default router;
