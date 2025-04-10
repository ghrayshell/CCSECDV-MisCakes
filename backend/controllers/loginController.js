const passport = require('passport');
const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');

const loginController = {
    loginUser: async function (req, res, next) {
      // Passport will handle the login and session management
      console.log('Trying to authenticate:', req.body);
      const {email, password} = req.body;

      try {
        // Find the user in the database by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).send('Invalid email or password');
        }
    
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).send('Invalid email or password');
        }
    
        // Store the user info in the session after successful login
        req.session.user = user._id;
        return res.status(200).send({ redirectTo: '/home' });
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    }, 
    currentUser: function (req, res) {
        console.log('Session ID:', req.session.user);
        // console.log('Session data from MongoDB:', req.session);

        if (req.session.user) {
            res.status(200).send({ redirectTo: '/home' });
            // res.redirect('/home');
          } else {
            res.status(401).send('Unauthorized');
          }

        // if (req.session.userId) {
        //     // If the session contains a user ID, find the user from the database
        //     User.findById(req.session.userId, (err, user) => {
        //       if (err) return res.status(500).json({ message: 'Server error' });
        //       if (!user) return res.status(401).json({ message: 'User not found' });
        
        //       // If user is found, return user details
        //       return res.json({ authenticated: true, user: user });
        //     });
        // } else {
        //     // If no user ID in session, return unauthenticated
        //     return res.status(401).json({ authenticated: false });
        // }
    },
  };
  
  module.exports = loginController;