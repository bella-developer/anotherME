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
      passReqToCallback: true // Pass request to callback to check the action
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists with Google ID, allow login
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails?.[0]?.value;
        const action = req.session.oauthAction || 'login'; // Default to login if not specified
        
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            // User exists with this email
            
            if (action === 'register') {
              // This is a registration attempt with existing email
              // Reject and redirect to sign in
              return done(null, false, { 
                message: 'An account with this email already exists. Please sign in instead.',
                action: 'redirect_to_signin'
              });
            } else {
              // This is a login attempt - link Google account to existing user
              user.googleId = profile.id;
              user.profilePicture = profile.photos?.[0]?.value || user.profilePicture;
              user.isEmailVerified = true;
              
              // Store additional Google profile info if not already present
              if (!user.fullName && profile.displayName) {
                user.fullName = profile.displayName;
              }
              
              await user.save();
              return done(null, user);
            }
          }
        }

        // No existing user - create new account
        // Extract profile information
        const username = `google_${profile.displayName?.replace(/\s+/g, '').toLowerCase() || profile.id}${Math.floor(Math.random() * 1000)}`;
        
        user = await User.create({
          googleId: profile.id,
          username,
          email: email || `${profile.id}@google-oauth.local`,
          // No password needed for OAuth users
          profilePicture: profile.photos?.[0]?.value || '',
          fullName: profile.displayName || '',
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
