const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let blogs = [
    { id: 1, title: 'Day 3: Styling', content: 'Added professional CSS styling.' },
    { id: 2, title: 'Day 4: JavaScript', content: 'Added DOM manipulation and validation.' }
];

// --- 1. GET ROUTE (Read) ---
app.get('/api/blogs', (req, res) => {
    res.status(200).json({ message: 'Successfully retrieved all blogs', data: blogs });
});

// --- 2. POST ROUTE (Create) ---
app.post('/api/blogs', (req, res) => {
    const newBlog = req.body;
    if (!newBlog.title || !newBlog.content) {
        return res.status(400).json({ message: 'Error: Title and content are required.' });
    }
    // Safely assign a new ID even if some blogs were deleted
    newBlog.id = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1; 
    blogs.push(newBlog);
    res.status(201).json({ message: 'Blog successfully created!', data: newBlog });
});

// --- 3. PUT ROUTE (Update) ---
app.put('/api/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const updatedData = req.body;
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) return res.status(404).json({ message: 'Error: Blog not found.' });

    if (updatedData.title) blogs[blogIndex].title = updatedData.title;
    if (updatedData.content) blogs[blogIndex].content = updatedData.content;
    res.status(200).json({ message: 'Blog successfully updated!', data: blogs[blogIndex] });
});

// --- 4. DELETE ROUTE (Delete) ---
app.delete('/api/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) {
        return res.status(404).json({ message: 'Error: Blog not found.' });
    }
    
    // Remove exactly 1 item at the found index
    blogs.splice(blogIndex, 1); 
    
    res.status(200).json({ message: 'Blog successfully deleted!' });
});

app.listen(PORT, () => {
    console.log(`Backend server is running smoothly on http://localhost:${PORT}`);
});