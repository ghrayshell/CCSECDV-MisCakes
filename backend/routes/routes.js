const User = require('../models/UserModel.js'); // adjust path if needed
const express = require('express');
const controller = require('../controllers/controller.js');
const orderController = require('../controllers/orderController.js');
const contactController = require('../controllers/contactController.js');
const productController = require('../controllers/productController.js');
const registerController = require('../controllers/registerController.js');
const loginController = require('../controllers/loginController.js');
const {requireAuth, requireRole} = require('../middleware/auth.js');
const userController = require('../controllers/registerController.js');

const app = express();

// Public routes
app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);
app.post('/register', registerController.addUser);
app.post('/login', loginController.loginUser);
app.get('/current_user', loginController.currentUser);

// app.use((req, res, next) => {
//     const publicPaths = ['/favicon.ico', '/', '/register', '/login', 'current_user']; // Add more public paths if needed
//     if (publicPaths.includes(req.path)) return next();  // Skip auth for public routes
//     auth(req, res, next);  // Ensure auth for all other routes
// });

// Private
app.post('/postOrder', requireAuth, requireRole('customer'), orderController.createOrder);
app.post('/updateOrder/:orderId', requireAuth, orderController.updateOrder);
app.get('/deleteOrder/:orderId', requireAuth, orderController.deleteOrder);
app.get('/getAllOrders', requireAuth, orderController.getAllOrders);

app.post('/createContact', requireAuth, contactController.createContact);
app.post('/updateContact', requireAuth, contactController.updateContact);
app.get('/deleteContact', requireAuth, contactController.deleteContact);
app.get('/getContact', requireAuth, contactController.getContact);
app.get('/getAllContacts', requireAuth, contactController.getAllContacts);

app.post('/createProduct', requireAuth, productController.createProduct);
app.get('/getProduct/:productId', requireAuth, productController.getProduct);
app.get('/getAllProducts', requireAuth, productController.getAllProducts);
app.put('/updateProduct/:productId', requireAuth, requireRole('product_manager'), productController.updateProduct);
app.delete('/deleteProduct/:productId', requireAuth, requireRole('product_manager'), productController.deleteProduct);
app.get('/deleteAllProducts', requireAuth, requireRole('product_manager'), productController.deleteAllProducts);

app.get('/getAllUsers', requireAuth, userController.getAllUsers);
app.put("/users/:id/role", requireAuth, requireRole('admin'), userController.updateRole);

app.post('/check-email', requireAuth, loginController.checkEmail);
app.get('/logout', loginController.logoutUser);

app.get('/getResetQuestion', loginController.getResetQuestion);
app.post('/change-password', loginController.changePassword);

app.get('/status', requireAuth, userController.getRole);
app.get('/logs', requireAuth, requireRole('admin'), userController.getLogs);
app.delete('/logs', requireAuth, requireRole('admin'), userController.deleteLogs);

module.exports = app;