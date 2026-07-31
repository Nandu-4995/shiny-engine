document.addEventListener("DOMContentLoaded", function() {
    
    // --- DAY 7, 8 & 9: FETCH, DISPLAY, EDIT, AND DELETE BLOGS ---
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
                        
                        // Added a red Delete button next to the Edit button
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

        // Load blogs on startup
        loadBlogs(); 

        // Listen for button clicks
        homeBlogList.addEventListener("click", function(event) {
            
            // --- EDIT LOGIC ---
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
                    .then(response => response.json())
                    .then(data => {
                        console.log("Update Success:", data);
                        loadBlogs(); 
                    })
                    .catch(error => console.error("Error updating blog:", error));
                }
            }

            // --- DELETE LOGIC ---
            if (event.target.classList.contains("delete-btn")) {
                const blogId = event.target.getAttribute("data-id");
                
                // Prompt user with a browser confirmation dialog
                const confirmDelete = confirm("Are you sure you want to permanently delete this blog post?");
                
                if (confirmDelete) {
                    fetch(`http://localhost:3000/api/blogs/${blogId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Delete Success:", data);
                        loadBlogs(); // Refresh UI to make the deleted card vanish!
                    })
                    .catch(error => console.error("Error deleting blog:", error));
                }
            }
        });
    }

    // --- DAY 4: ADD BLOG FORM VALIDATION (Remains Unchanged) ---
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

            if (title.length < 5 || content === "") {
                formMessage.textContent = "Error: Invalid title or content.";
                formMessage.style.color = "red";
                return;
            }

            formMessage.textContent = "Success: Blog posted!";
            formMessage.style.color = "green";

            const newCard = document.createElement("article");
            newCard.className = "blog-card";
            newCard.innerHTML = `<h2>${title}</h2><p>${content}</p><button class="btn btn-secondary">Read More</button>`;
            blogContainer.prepend(newCard);
            blogForm.reset();
        });
    }
});