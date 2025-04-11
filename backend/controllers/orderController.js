const Order =  require('../models/OrderModel.js');
const Log = require('../models/LogModel.js');
const User = require('../models/UserModel.js');

const orderController = {
    createOrder: async function(req, res){
        const formData = req.body;
        const newData = new Order(formData);
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        console.log(newData);

        await newData.save()
            .then(async (savedOrder) => {
                await Log.create({
                    email,
                    status: 'success',
                    message: 'One successful order',
                    ip,
                    userAgent
                });
                res.status(201).json(savedOrder);
            })
            .catch(async (error) => {
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Internal server error',
                    ip,
                    userAgent
                });
                res.status(500).json({ error: 'An error occurred: ' + error });
                console.log(error);
            });
    },

    updateOrder: async function (req, res){
        const query = req.params.orderId;
        const order = req.body;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        try{
            const updatedOrder = await Order.updateOne({orderNum: query}, order);

            if(!updatedOrder){
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Order not found',
                    ip,
                    userAgent
                });
                res.status(404).json({error: 404, message: 'Order not found.'});
            } else {
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Updated one order',
                    ip,
                    userAgent
                });
                res.status(200).json(updatedOrder);
            }
        } catch (err){
            return res.status(500).send(err);
        }
    }, 

    deleteOrder: async function (req, res) {
        const query = req.params.orderId;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        try {
            const orderToDelete = await Order.deleteOne({orderNum: query});

            if(!orderToDelete){
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'Order not found',
                    ip,
                    userAgent
                });
                res.status(404).json({error: 404, message: 'Order not found.'});
            } else {
                await Log.create({
                    email,
                    status: 'success',
                    message: 'Deleted one order',
                    ip,
                    userAgent
                });
                res.status(200).json(orderToDelete);
            }
        } catch(err){
            return res.status(500).send(err);
        }
    },

    getAllOrders: async function(req, res) {
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        try {
          const orders = await Order.find();
      
          if (!orders || orders.length === 0) {
            await Log.create({
                email,
                status: 'failure',
                message: 'No orders found',
                ip,
                userAgent
            });
            return res.status(404).json({ message: 'No orders found' });
          }
          await Log.create({
                email,
                status: 'success',
                message: 'Successfully retrieved all orders',
                ip,
                userAgent
            });
          res.json(orders);
        } catch (err) {
          return res.status(500).send(err);
        }
    }
};

module.exports = orderController;