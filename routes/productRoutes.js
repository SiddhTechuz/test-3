const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const productController = require('../controllers/productController')



router.post('/add-product', authController.protect, productController.createProduct)
router.get('/all', productController.getProducts)

router.get('/search', productController.searchProduct)
router.get('/:slug', productController.searchBySlug)



module.exports = router;
