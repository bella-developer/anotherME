import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return it
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            // User exists with this email but no Google account linked
            // Return error instead of auto-linking
            return done(null, false, { 
              message: 'An account with this email already exists. Please sign in with your username and password instead.' 
            });
          }
        }

        // Create new user from Google profile
        const username = `google_${profile.displayName?.replace(/\s+/g, '').toLowerCase() || profile.id}${Math.floor(Math.random() * 1000)}`;
        
        user = await User.create({
          googleId: profile.id,
          username,
          email: email || `${profile.id}@google-oauth.local`,
          password: Math.random().toString(36).slice(-16), // Random password (not used)
          profilePicture: profile.photos?.[0]?.value || '',
          isEmailVerified: true, // Google emails are verified
        });

        done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

export default passport;
