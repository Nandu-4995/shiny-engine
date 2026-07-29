const express = require('express');
const app = express();
const PORT = 3000;

// Middleware: This allows your server to read incoming JSON data from POST requests
app.use(express.json());
// Serve static frontend files (HTML, CSS, JS) from this folder
app.use(express.static(__dirname));
// A temporary in-memory array to act as our "Database" for now
let blogs = [
    { id: 1, title: 'Day 3: Styling', content: 'Added professional CSS styling.' },
    { id: 2, title: 'Day 4: JavaScript', content: 'Added DOM manipulation and validation.' }
];

// --- 1. GET ROUTE (To fetch data) ---
app.get('/api/blogs', (req, res) => {
    console.log("GET request received at /api/blogs");
    res.status(200).json({
        message: 'Successfully retrieved all blogs',
        data: blogs
    });
});

// --- 2. POST ROUTE (To add new data) ---
app.post('/api/blogs', (req, res) => {
    console.log("POST request received with data:", req.body);
    const newBlog = req.body;
    
    // Basic Backend Validation
    if (!newBlog.title || !newBlog.content) {
        return res.status(400).json({ message: 'Error: Title and content are required.' });
    }

    // Assign a new ID and save the blog to our array
    newBlog.id = blogs.length + 1;
    blogs.push(newBlog);

    // Send back a success response
    res.status(201).json({
        message: 'Blog successfully created!',
        data: newBlog
    });
});

// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`Backend server is running smoothly on http://localhost:${PORT}`);
});