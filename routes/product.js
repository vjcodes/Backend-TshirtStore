const express = require('express');
const { testProduct, getAllProducts, addProduct } = require('../controllers/productController');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

//user routes
router.route('/testproduct').get(testProduct)
router.route('/products').get(getAllProducts)




//admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)


module.exports = router