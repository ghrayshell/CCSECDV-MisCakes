const Product = require('../models/ProductModel.js');

const productController = {
    createProduct: async function(req, res){
        console.log("CREATED NEW");
        const productDesc = req.body;
        const newData = new Product(productDesc);

        await newData.save()
            .then((savedProduct) => {
                res.status(201).json(savedProduct);
            })
            .catch((error) => {
                res.status(500).json({ error: 'Error: ' + error });
            });
    },

    getProduct: async function(req, res){
        const query = req.params.productId;

        console.log('Query: ', query);

        try {
            const product = await Product.findOne({_id: query});

            if(!product){
                res.status(404).json({error: 404, message: 'Product not found.'});
            } else{
                res.json(product);
            }
        } catch(err){
            return res.status(500).send(err);
        }
    },

    getAllProducts: async function(req, res){
        try{
            const products = await Product.find();
            res.json(products);
        } catch(err){
            return res.status(500).send(err);
        }
    },

    // updateProduct: async function(req, res){
    //     const query = req.params.productId;
    //     const newData = req.body;

    //     try{
    //         const updatedProduct = await Product.updateOne({productId: query}, newData);

    //         if(!updatedProduct){
    //             res.status(404).json({error: '404', message: 'Product not Found.'});
    //         } else{
    //             res.json(updatedProduct);
    //         }
    //     } catch(err){
    //         return res.status(500).json({error: '500', message: err});
    //     }
    // },

    updateProduct: async function(req, res) {
        console.log("HEY");
        const id = req.params.productId;  // This is the correct MongoDB _id
        const newData = req.body;
    
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
        }
    },
    

    // deleteProduct: async function(req, res){
    //     const query = req.params.productId;
        
    //     try{
    //         const productToDelete = await Product.deleteOne({productId: query});

    //         if(!productToDelete){
    //             res.status(404).json({error: '404', message: 'Product not Found.'});
    //         } else{
    //             res.json(productToDelete);
    //         }
    //     } catch(err){
    //         return res.status(500).send(err);
    //     }
    // },

    deleteProduct: async function(req, res) {
        const id = req.params.productId;
    
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
    
            if (!deletedProduct) {
                return res.status(404).json({ error: '404', message: 'Product not found.' });
            }
    
            res.json({ message: 'Product deleted successfully.' });
        } catch (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: '500', message: err.message });
        }
    },

    deleteAllProducts: async function(req, res){
        try{
            const products = await Product.deleteMany();
            res.json(products);
        } catch(err){
            return res.status(500).send(err);
        }
    }
};

module.exports = productController;