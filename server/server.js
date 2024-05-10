import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://read-later-summary-e391515c4221.herokuapp.com/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Google Authentication Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to the Vercel dashboard after successful login
    res.redirect('https://read-later-frontend-kpcsd91j0-peter-sweeneys-projects.vercel.app/dashboard.html');
  }
);

app.get('/login', (req, res) => res.send('Login Failed'));

// Other Routes
app.get('/', (req, res) => res.send('Hello, World!'));

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(`Error: ${error.stack}`);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
