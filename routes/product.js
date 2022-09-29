const express = require('express');
const { testProduct, getAllProducts, addProduct, adminGetAllProducts, getOneProduct } = require('../controllers/productController');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

//user routes
router.route('/testproduct').get(testProduct)
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getOneProduct)





//admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProducts)


module.exports = router