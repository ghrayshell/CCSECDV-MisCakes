const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');
const Log = require('../models/LogModel.js');

const userController = {
    addUser: async function(req, res){
        const {name, email, password, resetQuestion, resetAnswer} = req.body;
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        if (!name || !email || !password || !resetQuestion || !resetAnswer) {
            return res.status(400).json({ message: "Name, email, password, password reset question, and password reset answer are required" });
        }

        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                passwordHistory:[hashedPassword],
                passwordDate: new Date(),
                resetQuestion,
                resetAnswer
            });

            await newUser.save()
                .then(async (savedUser) => {
                    await Log.create({
                        email,
                        status: 'success',
                        message: 'Added user successfully',
                        ip,
                        userAgent
                    });
                    res.status(201).json(savedUser);
                })
                .catch(async (error) => {
                    await Log.create({
                        email,
                        status: 'failure',
                        message: 'Internal Server Error',
                        ip,
                        userAgent
                    });
                    res.status(500).json({error: 'Error: ' + error});
                });
        } catch (error) {
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal Server Error',
                ip,
                userAgent
            });
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    },

    getAllUsers: async function(req, res) {
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        try {
            const users = await User.find();  // Fetch all users from the database
            await Log.create({
                email,
                status: 'success',
                message: 'Retrieved all users',
                ip,
                userAgent
            });
            res.status(200).json(users);  // Return the list of users
        } catch (error) {
            await Log.create({
                email,
                status: 'failure',
                message: 'Failed to retrieve all users',
                ip,
                userAgent
            });
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    }, 

    // Update user role
    updateRole: async function(req, res) {
        const { id } = req.params;  // User ID from the URL
        const { role } = req.body;  // New role from the request body
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        // Validate the role against the enum values
        const validRoles = ["admin", "product_manager", "customer"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role. Valid roles are: admin, product_manager, customer." });
        }

        try {
            // Find and update the user by ID
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { role },
                { new: true }  // Return the updated user
            );

            if (!updatedUser) {
                await Log.create({
                    email,
                    status: 'failure',
                    message: 'User not found',
                    ip,
                    userAgent
                });
                return res.status(404).json({ message: "User not found" });
            } 
            await Log.create({
                email,
                status: 'success',
                message: 'Updated role successfully',
                ip,
                userAgent
            });

            // Send back the updated user
            res.status(200).json(updatedUser);
        } catch (error) {
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal server error',
                ip,
                userAgent
            });
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    },
    getRole: async function(req, res){
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        try {
            // Check if the user is authenticated by checking the session
            const user = await User.findById(req.session.user).select('role');
            if (req.session && user) {
              // If authenticated, send back the user's role
              return res.json({ role: user.role });
            } else {
              // If not authenticated, return an error message
            
              return res.status(401).json({ message: 'Not authenticated' });
            }
          } catch (error) {
            // Handle any unexpected errors
            await Log.create({
                email,
                status: 'failure',
                message: 'Internal Server Error',
                ip,
                userAgent
            });
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
    },

    getLogs: async function(req, res){
        try {
            const logs = await Log.find().sort({ timestamp: -1 }); // Latest first
            res.json(logs);
        } catch (err) {
        res.status(500).json({ message: 'Error fetching logs', error: err });
        }
    },

    deleteLogs: async function(req, res){
        try {
            await Log.deleteMany({});
            res.status(200).json({ message: 'All logs deleted successfully' });
        } catch (err) {
            console.error('Error deleting logs:', err);  // Log this to terminal
            res.status(500).json({ message: 'Failed to delete logs' });
        }

    }
}

module.exports = userController;