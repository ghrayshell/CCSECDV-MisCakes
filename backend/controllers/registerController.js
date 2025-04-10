const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');

const userController = {
    addUser: async function(req, res){
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save()
                .then((savedUser) => {
                    res.status(201).json(savedUser);
                })
                .catch((error) => {
                    res.status(500).json({error: 'Error: ' + error});
                });
        } catch (error) {
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    },

    getAllUsers: async function(req, res) {
        try {
            const users = await User.find();  // Fetch all users from the database
            res.status(200).json(users);  // Return the list of users
        } catch (error) {
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    }, 

    // Update user role
    updateRole: async function(req, res) {
        const { id } = req.params;  // User ID from the URL
        const { role } = req.body;  // New role from the request body

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
                return res.status(404).json({ message: "User not found" });
            }

            // Send back the updated user
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Error: ' + error.message });
        }
    }
}

module.exports = userController;