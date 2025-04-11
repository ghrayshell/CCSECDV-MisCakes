const Product = require('../models/ProductModel.js');
const Log = require('../models/LogModel.js');
const User = require('../models/UserModel.js');

const productController = {
    createProduct: async function(req, res){
        console.log("CREATED NEW");
        const productDesc = req.body;
        const newData = new Product(productDesc);
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        await newData.save()
            .then(async (savedProduct) => {
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Successfully saved one product',
                    ip,
                    userAgent
                });
                res.status(201).json(savedProduct);
            })
            .catch(async (error) => {
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Internal server error',
                    ip,
                    userAgent
                });
                res.status(500).json({ error: 'Error: ' + error });
            });
    },

    getProduct: async function(req, res){
        const query = req.params.productId;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        console.log('Query: ', query);

        try {
            const product = await Product.findOne({_id: query});

            if(!product){
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Product not found',
                    ip,
                    userAgent
                });
                res.status(404).json({error: 404, message: 'Product not found.'});
            } else{
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Successfully retrieved a product',
                    ip,
                    userAgent
                });
                res.json(product);
            }
        } catch(err){
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal server error',
                ip,
                userAgent
            });
            return res.status(500).send(err);
        }
    },

    getAllProducts: async function(req, res){
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        try{
            const products = await Product.find();
            if (!products || products.length === 0) {
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'No orders found',
                    ip,
                    userAgent
                });
                return res.status(404).json({ message: 'No orders found' });
              }
            res.json(products);
        } catch(err){
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal server error',
                ip,
                userAgent
            });
            return res.status(500).send(err);
        }
    },
  
    updateProduct: async function(req, res) {
        console.log("HEY");
        const id = req.params.productId;  // This is the correct MongoDB _id
        const newData = req.body;
        const query = req.params.productId;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
    
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, newData, {
                new: true,
                runValidators: true,
            });
    
            if (!updatedProduct) {
                return res.status(404).json({ error: '404', message: 'Product not found.' });
            }
    
            res.json(updatedProduct);
        } catch (err) {
            console.error('Update failed:', err);
            return res.status(500).json({ error: '500', message: err.message });
            if(!updatedProduct){
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Product not found',
                    ip,
                    userAgent
                });
                res.status(404).json({error: '404', message: 'Product not Found.'});
            } else{
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Updated one product',
                    ip,
                    userAgent
                });
                res.json(updatedProduct);
            }
        } catch(err){
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal server error',
                ip,
                userAgent
            });
            return res.status(500).json({error: '500', message: err});
        }
    },
   
    deleteProduct: async function(req, res) {
        const id = req.params.productId;
        const query = req.params.productId;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
    
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
    
            if (!deletedProduct) {
                return res.status(404).json({ error: '404', message: 'Product not found.' });
            if(!productToDelete){
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Product not found',
                    ip,
                    userAgent
                });
                res.status(404).json({error: '404', message: 'Product not Found.'});
            } else{
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Successfully deleted a product',
                    ip,
                    userAgent
                });
                res.json(productToDelete);
            }
    
            res.json({ message: 'Product deleted successfully.' });
        } catch (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: '500', message: err.message });
        }
    },

    deleteAllProducts: async function(req, res){
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        try{
            const products = await Product.deleteMany();
            res.json(products);
        } catch(err){
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal server error',
                ip,
                userAgent
            });
            return res.status(500).send(err);
        }
    }
};

module.exports = productController;