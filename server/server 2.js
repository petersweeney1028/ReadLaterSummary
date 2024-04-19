import express from 'express';
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
