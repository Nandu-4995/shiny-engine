document.addEventListener("DOMContentLoaded", function() {
    
    // --- DAY 7: FETCH AND DISPLAY BLOGS ON HOME PAGE ---
    const homeBlogList = document.getElementById("home-blog-list");

    if (homeBlogList) {
        // Fetch the data from your Express backend
        fetch('http://localhost:3000/api/blogs')
            .then(response => response.json())
            .then(result => {
                const blogs = result.data; // Target the array inside your JSON
                
                // Loop through each blog in the database and create a card for it
                blogs.forEach(blog => {
                    const card = document.createElement("article");
                    card.className = "blog-card";
                    card.innerHTML = `
                        <h2>${blog.title}</h2>
                        <p>${blog.content}</p>
                        <button class="btn btn-secondary">Read More</button>
                    `;
                    homeBlogList.appendChild(card);
                });
            })
            .catch(error => console.error("Error fetching blogs:", error));
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

            if (title.length < 5) {
                formMessage.textContent = "Error: Blog title must be at least 5 characters long.";
                formMessage.style.color = "red";
                return;
            }

            if (content === "") {
                formMessage.textContent = "Error: Blog content cannot be empty.";
                formMessage.style.color = "red";
                return;
            }

            formMessage.textContent = "Success: Blog posted!";
            formMessage.style.color = "green";

            const newCard = document.createElement("article");
            newCard.className = "blog-card";
            newCard.innerHTML = `
                <h2>${title}</h2>
                <p>${content}</p>
                <button class="btn btn-secondary">Read More</button>
            `;
            blogContainer.prepend(newCard);
            blogForm.reset();
        });
    }
});