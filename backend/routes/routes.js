const User = require('../models/UserModel.js'); // adjust path if needed
const express = require('express');
const controller = require('../controllers/controller.js');
const orderController = require('../controllers/orderController.js');
const contactController = require('../controllers/contactController.js');
const productController = require('../controllers/productController.js');
const registerController = require('../controllers/registerController.js');
const loginController = require('../controllers/loginController.js');
const ensureAuthenticated = require('../middleware/ensureAuthenticated.js');
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
//     ensureAuthenticated(req, res, next);  // Ensure auth for all other routes
// });

// Private
app.post('/postOrder', orderController.createOrder);
app.post('/updateOrder/:orderId', orderController.updateOrder);
app.get('/deleteOrder/:orderId', orderController.deleteOrder);
app.get('/getAllOrders', orderController.getAllOrders);

app.post('/createContact', contactController.createContact);
app.post('/updateContact', contactController.updateContact);
app.get('/deleteContact', contactController.deleteContact);
app.get('/getContact', contactController.getContact);
app.get('/getAllContacts', contactController.getAllContacts);

app.post('/createProduct', productController.createProduct);
app.get('/getProduct/:productId', productController.getProduct);
app.get('/getAllProducts', productController.getAllProducts);
app.post('/updateProduct/:productId', productController.updateProduct);
app.get('/deleteProduct/:productId', productController.deleteProduct);
app.get('/deleteAllProducts', productController.deleteAllProducts);

app.get('/getAllUsers', userController.getAllUsers);
app.put("/users/:id/role", userController.updateRole);

app.post('/check-email', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required' });
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ exists: true });
      }
  
      res.json({ exists: false });
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  

module.exports = app;