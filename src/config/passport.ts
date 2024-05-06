import Users from '@models/Users';
import { Types } from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((userId: string, cb) => {
  cb(null, { _id: userId });
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (username, password, cb) => {
    try {
      const existingUser = await Users.getUser(username);

      if (!existingUser) {
        throw new Error('User not found.');
      }

      if (!existingUser.password) {
        throw new Error('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if (!passwordMatch) {
        throw new Error('Incorrect password');
      }

      const user = existingUser.toObject();

      delete user.password;

      return cb(null, user as unknown as Express.User);
    } catch (error) {
      cb(error, false);
    }
  })
);
