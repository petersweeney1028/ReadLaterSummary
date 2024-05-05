import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

const app = express();

// Configure Passport for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://read-later-summary-e391515c4221.herokuapp.com/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Example User Data
  const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
  // Store user information in memory or a database
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes for Google Authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard.html');
  }
);

// API Endpoints
let articles = [];
let users = [{ id: 1, username: 'admin', password: 'admin' }];

app.get('/', (req, res) => res.send('Hello, World!'));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) res.json({ message: "User authenticated successfully", userId: user.id });
  else res.status(401).json({ message: "Authentication failed" });
});

app.post('/api/google-login', (req, res) => {
  const { id_token } = req.body;
  // Process `id_token` to authenticate the user
  // You can verify the `id_token` using Google's token verification API
  res.json({ user: { id: 2, name: "Google User" } });
});

app.post('/api/save_article', (req, res) => {
  const newArticle = { id: articles.length + 1, title: req.body.title, content: req.body.content, authorId: req.body.authorId };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

app.get('/api/get_articles', (req, res) => res.json(articles));

app.delete('/api/delete_article/:id', (req, res) => {
  articles = articles.filter(article => article.id !== parseInt(req.params.id));
  res.status(200).json({ message: `Article ${req.params.id} deleted successfully` });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(`Error: ${error.stack}`);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
