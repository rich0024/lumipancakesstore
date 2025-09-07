const passport = require('passport');
const { findUserByGoogleId, createUser, findUserById, findUserByEmail, updateUser } = require('../models/User');

// Configure Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret') {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth callback received profile:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value
    });

    // Check if user already exists by Google ID
    let user = findUserByGoogleId(profile.id);
    
    if (user) {
      console.log('Existing user found by Google ID:', user.email);
      return done(null, user);
    }

    // Check if user exists by email (in case they signed up with email first)
    user = findUserByEmail(profile.emails[0].value);
    if (user) {
      console.log('Existing user found by email, updating with Google ID:', user.email);
      // Update existing user with Google ID
      const updateResult = updateUser(user.id, { googleId: profile.id });
      if (updateResult.success) {
        return done(null, updateResult.user);
      } else {
        console.error('Failed to update user with Google ID:', updateResult.error);
        return done(null, false, { message: 'Failed to link Google account' });
      }
    }

    // Create new user
    const userData = {
      email: profile.emails[0].value,
      name: profile.displayName,
      googleId: profile.id,
      role: 'user' // Default role
    };

    console.log('Creating new user with data:', userData);
    const result = await createUser(userData);
    
    if (result.success) {
      console.log('User created successfully:', result.user.email);
      return done(null, result.user);
    } else {
      console.error('Failed to create user:', result.error);
      return done(null, false, { message: result.error });
    }
  } catch (error) {
    console.error('Google OAuth strategy error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('⚠️  Google OAuth credentials not found. OAuth authentication disabled.');
  console.log('   To enable OAuth, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

module.exports = passport;
