document.addEventListener("DOMContentLoaded", function() {
    
    // --- HOME PAGE: FETCH, DISPLAY, EDIT, AND DELETE BLOGS ---
    const homeBlogList = document.getElementById("home-blog-list");

    if (homeBlogList) {
        function loadBlogs() {
            homeBlogList.innerHTML = ""; 
            
            fetch('http://localhost:3000/api/blogs')
                .then(response => response.json())
                .then(result => {
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
                .catch(error => console.error("Error fetching blogs:", error));
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
                    .catch(error => console.error("Error updating blog:", error));
                }
            }

            // DELETE
            if (event.target.classList.contains("delete-btn")) {
                const blogId = event.target.getAttribute("data-id");
                const confirmDelete = confirm("Are you sure you want to permanently delete this blog post?");
                
                if (confirmDelete) {
                    fetch(`http://localhost:3000/api/blogs/${blogId}`, {
                        method: 'DELETE'
                    })
                    .then(() => loadBlogs())
                    .catch(error => console.error("Error deleting blog:", error));
                }
            }
        });
    }

    // --- BLOG PAGE: ADD BLOG FORM (DAY 10 FRONTEND INTEGRATION) ---
    const blogForm = document.getElementById("add-blog-form");
    const titleInput = document.getElementById("blog-title");
    const contentInput = document.getElementById("blog-content");
    const formMessage = document.getElementById("form-message");
    const blogContainer = document.getElementById("blog-container");

    if (blogForm) {
        blogForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            // 1. Frontend Validation
            if (title.length < 5 || content === "") {
                formMessage.textContent = "Error: Invalid title or content.";
                formMessage.style.color = "red";
                return;
            }

            // 2. BACKEND INTEGRATION: Send the data using Fetch POST
            fetch('http://localhost:3000/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, content: content })
            })
            .then(response => response.json())
            .then(data => {
                // 3. Success UI updates
                formMessage.textContent = "Success: Blog permanently saved to the server!";
                formMessage.style.color = "green";

                const newCard = document.createElement("article");
                newCard.className = "blog-card";
                newCard.innerHTML = `<h2>${data.data.title}</h2><p>${data.data.content}</p><button class="btn btn-secondary">Read More</button>`;
                
                blogContainer.prepend(newCard);
                blogForm.reset();
            })
            .catch(error => {
                console.error("Error posting blog:", error);
                formMessage.textContent = "Error: Could not connect to the server.";
                formMessage.style.color = "red";
            });
        });
    }
});