const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel.js'); // Adjust path to your User model
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    {
      usernameField: 'email',         // use email instead of default 'username'
      passwordField: 'password'       // default is fine, but can be explicit
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        console.log('User: ', user);
  
        if (!user) {
          return done(null, false, { message: 'No user found with that email' });
        } 
  
        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password

        console.log('isMatch: ', isMatch);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
  
        return done(null, user); // Auth success
      } catch (err) {
        return done(err);
      }
    }
  ));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      // Fetch the full user object from the database using the stored ID
      const user = await User.findById(id); 
      if (!user) {
        return done(new Error('User not found'));  // Handle the case if user not found
      }
      done(null, user); // Attach the user object to req.user
    } catch (err) {
      done(err, null);  // Pass any error to done
    }
  });