import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import bcrypt from 'bcrypt';

function loadPassport() {
    passport.use(new LocalStrategy(async function verify(username, password, done) {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
    }));
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
    done(null, user);
});

export default loadPassport;