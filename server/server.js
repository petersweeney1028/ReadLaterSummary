import express from 'express';
import bodyParser from 'body-parser';  // Ensure bodyParser is installed (npm install body-parser)

const app = express();

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Simulated Database (in-memory)
let articles = [];
let users = [{ id: 1, username: 'admin', password: 'admin'}];  // Example user

// Test Route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// User Authentication Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: "User authenticated successfully", userId: user.id });
    } else {
        res.status(401).json({ message: "Authentication failed" });
    }
});

// Save Article
app.post('/api/save_article', (req, res) => {
    const { title, content, authorId } = req.body;
    const newArticle = { id: articles.length + 1, title, content, authorId };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

// Get Articles
app.get('/api/get_articles', (req, res) => {
    res.json(articles);
});

// Delete Article
app.delete('/api/delete_article/:id', (req, res) => {
    const { id } = req.params;
    articles = articles.filter(article => article.id !== parseInt(id));
    res.status(200).json({ message: `Article ${id} deleted successfully` });
});

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
