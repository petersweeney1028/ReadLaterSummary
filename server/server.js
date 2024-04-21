import express from 'express';

const app = express();

app.use(express.json()); // Built-in Express middleware to parse JSON bodies

// General request logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`);
    next();
});

// Simulated Database (in-memory)
let articles = [];
let users = [{ id: 1, username: 'admin', password: 'admin'}];

// Routes Definitions
app.get('/', (req, res) => res.send('Hello, World!'));
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) res.json({ message: "User authenticated successfully", userId: user.id });
    else res.status(401).json({ message: "Authentication failed" });
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

// Define the port to run the server on and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


