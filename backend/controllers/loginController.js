const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');
const Log = require('../models/LogModel.js')

const loginController = {
    loginUser: async function (req, res, next) {
      // Passport will handle the login and session management
      console.log('Trying to authenticate:', req.body);
      const { email, password } = req.body;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];
    
      try {
        // Find the user in the database by email
        const user = await User.findOne({ email });
        if (!user) {
          await Log.create({
            email,
            status: 'failure',
            message: 'Invalid email or password',
            ip,
            userAgent
          });
          return res.status(401).send('Invalid email or password');
        }

        const MAX_ATTEMPTS = 4; // 5 attempts
        const LOCK_TIME_MS = 2 * 60 * 1000; // 2 minutes

        // Block login if too many failed attempts
        if (user.invalidAttempts >= MAX_ATTEMPTS) {
          const now = Date.now();
          const lastAttempt = user.lastAttempt ? new Date(user.lastAttempt).getTime() : 0;
          const timeSinceLastAttempt = now - lastAttempt;

          if (timeSinceLastAttempt < LOCK_TIME_MS) {
            const remaining = Math.ceil((LOCK_TIME_MS - timeSinceLastAttempt) / 1000);
            return res.status(403).send(`Too many attempts! Try again in ${remaining} seconds.`);
          } else {
            await user.save();
          }
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          // Increment invalidAttempts and update lastAttempt on failed login
          await User.findByIdAndUpdate(user._id, {
            $inc: { invalidAttempts: 1 },
            $set: { lastAttempt: new Date() }
          });

          await Log.create({
            email,
            status: 'failure',
            message: 'Invalid email or password',
            ip,
            userAgent
          });
          
          return res.status(401).send('Invalid email or password');
        }
    
        // If login is successful, reset invalidAttempts and update lastAttempt
        user.invalidAttempts = 0;
        await user.save();
    
        // Store the user info in the session after successful login
        await Log.create({
          email,
          status: 'success',
          message: 'Successful Login',
          ip,
          userAgent
        });
        req.session.user = user._id;
        return res.status(200).send({
          redirectTo: '/home',
          lastAttempt: user.lastAttempt
        });
        
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    },  
    currentUser: async function (req, res) {
        console.log('Session ID:', req.session.user);
        const currentUser = (await User.findById(req.session.user).select('name'))?.name;
        console.log('Session data from MongoDB:', req.session);
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        if (req.session.user) {
            res.status(200).send({ redirectTo: '/home', currentUser: currentUser});
            // res.redirect('/home');
        } else {
            await Log.create({
              email,
              status: 'failure',
              message: 'User is not Auntheticated',
              ip,
              userAgent
            });
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
    logoutUser: async function(req, res){
      try {
        const userId = req.session.user;
        const user = await User.findById(req.session.user);
        const email = user?.email || "unknown";
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
  
        if (userId) {
          // Update lastAttempt during logout
          await User.findByIdAndUpdate(userId, {
            $set: { lastAttempt: new Date() }
          });
        }
        
        req.session.destroy(async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
          }
          
          // Clear the session cookie
          res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name for sessions in Express
      
          // Respond with a success message
          await Log.create({
            email,
            status: 'success',
            message: 'Logged out successfully',
            ip,
            userAgent
          });

          res.status(200).json({ message: 'Logged out successfully' });
        });
      } catch (err) {
        await Log.create({
          email,
          status: 'success',
          message: 'Server error during logout',
          ip,
          userAgent
        });
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Server error during logout' });
      }
    },
    checkEmail: async function(req, res){
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
    },
    getResetQuestion: async function (req, res) {
      try {
        const userId = req.session.user;
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
    
        // Fetch resetQuestion, resetAnswer, passwordHistory, and passwordDate
        const user = await User.findById(userId).select('resetQuestion resetAnswer passwordHistory passwordDate');
    
        console.log("User data:", user);

        if (!user || !user.resetQuestion) {
          return res.status(404).json({ message: 'No reset question found' });
        }
    
        return res.status(200).json({
          resetQuestion: user.resetQuestion,
          resetAnswer: user.resetAnswer,
          passwordHistory: user.passwordHistory || [],
          passwordDate: user.passwordDate || null
        });
      } catch (error) {
        console.error('Error fetching reset question and answer:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },     
    changePassword: async function (req, res) {
      try {
        const userId = req.session.user;
        const { newPassword, resetAnswer } = req.body;
    
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });
    
        // Check reset answer
        const isResetCorrect = user.resetAnswer.trim().toLowerCase() === resetAnswer.trim().toLowerCase();

        if (!isResetCorrect) {
          return res.status(400).json({ message: "Incorrect answer to reset question." });
        }
    
        // Prevent password reuse
        for (const oldHashed of user.passwordHistory) {
          const isSame = await bcrypt.compare(newPassword, oldHashed);
          if (isSame) {
            return res.status(400).json({ message: "You cannot reuse an old password." });
          }
        }
    
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Save current password to history
        if (user.password) {
          user.passwordHistory.unshift(user.password);
          user.passwordHistory = user.passwordHistory.slice(0, 10);
        }
    
        user.password = newHashedPassword;
        await user.save();
    
        return res.status(200).json({ message: "Password updated successfully!" });
    
      } catch (err) {
        console.error("Password change error:", err);
        res.status(500).json({ message: "Server error" });
      }
    }        
  };

  module.exports = loginController;