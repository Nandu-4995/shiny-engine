document.addEventListener("DOMContentLoaded", function() {
    
    // --- HOME PAGE: FETCH, DISPLAY, EDIT, AND DELETE BLOGS ---
    const homeBlogList = document.getElementById("home-blog-list");

    if (homeBlogList) {
        function loadBlogs() {
            homeBlogList.innerHTML = "<p>Loading securely...</p>"; // Performance: Show loading state
            
            fetch('http://localhost:3000/api/blogs')
                .then(response => {
                    if (!response.ok) throw new Error("Server offline");
                    return response.json();
                })
                .then(result => {
                    homeBlogList.innerHTML = ""; 
                    const blogs = result.data;
                    
                    blogs.forEach(blog => {
                        const card = document.createElement("article");
                        card.className = "blog-card";
                        card.innerHTML = `
                            <h2>${blog.title}</h2>
                            <p>${blog.content}</p>
                            <button class="btn btn-secondary">Read More</button>
                            <button class="btn edit-btn" style="background-color: #00d2ff; color: #1a1a1a; margin-left: 10px;" data-id="${blog.id}">Edit</button>
                            <button class="btn delete-btn" style="background-color: #ff4d4d; color: white; margin-left: 10px;" data-id="${blog.id}">Delete</button>
                        `;
                        homeBlogList.appendChild(card);
                    });
                })
                .catch(error => {
                    // BUG FIX: Graceful UI fallback for static GitHub Pages deployment
                    console.warn("Backend connection failed. Displaying static fallback.");
                    homeBlogList.innerHTML = `
                        <div style="text-align: center; padding: 20px; border: 1px dashed #ff4d4d; border-radius: 8px;">
                            <h3 style="color: #ff4d4d;">⚠️ Backend Server Offline</h3>
                            <p>This UI is currently hosted statically via GitHub Pages.</p>
                            <p>To view dynamic data and test CRUD operations, please clone the repository and run the Node.js server locally.</p>
                        </div>
                    `;
                });
        }

        loadBlogs(); 

        homeBlogList.addEventListener("click", function(event) {
            // EDIT
            if (event.target.classList.contains("edit-btn")) {
                const blogId = event.target.getAttribute("data-id");
                const newTitle = prompt("Enter the updated Blog Title:");
                const newContent = prompt("Enter the updated Blog Content:");

                if (newTitle && newContent) {
                    fetch(`http://localhost:3000/api/blogs/${blogId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle, content: newContent })
                    })
                    .then(() => loadBlogs())
                    .catch(() => alert("Cannot edit: Backend server is offline."));
                }
            }

            // DELETE
            if (event.target.classList.contains("delete-btn")) {
                const blogId = event.target.getAttribute("data-id");
                if (confirm("Are you sure you want to permanently delete this blog post?")) {
                    fetch(`http://localhost:3000/api/blogs/${blogId}`, { method: 'DELETE' })
                    .then(() => loadBlogs())
                    .catch(() => alert("Cannot delete: Backend server is offline."));
                }
            }
        });
    }

    // --- BLOG PAGE: ADD BLOG FORM ---
    const blogForm = document.getElementById("add-blog-form");
    const titleInput = document.getElementById("blog-title");
    const contentInput = document.getElementById("blog-content");
    const formMessage = document.getElementById("form-message");

    if (blogForm) {
        blogForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            if (title.length < 5 || content === "") {
                formMessage.textContent = "Error: Invalid title or content.";
                formMessage.style.color = "red";
                return;
            }

            fetch('http://localhost:3000/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, content: content })
            })
            .then(response => {
                if (!response.ok) throw new Error("Server offline");
                return response.json();
            })
            .then(() => {
                formMessage.textContent = "Success: Blog permanently saved!";
                formMessage.style.color = "green";
                blogForm.reset();
            })
            .catch(() => {
                formMessage.textContent = "Error: Backend offline. Cannot post data from static host.";
                formMessage.style.color = "red";
            });
        });
    }
});