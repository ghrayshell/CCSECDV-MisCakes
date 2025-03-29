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
    }
}

module.exports = userController;