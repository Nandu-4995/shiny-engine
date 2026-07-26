document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Select the DOM elements
    const blogForm = document.getElementById("add-blog-form");
    const titleInput = document.getElementById("blog-title");
    const contentInput = document.getElementById("blog-content");
    const formMessage = document.getElementById("form-message");
    const blogContainer = document.getElementById("blog-container");

    // 2. Add an event listener to the form submission
    if (blogForm) {
        blogForm.addEventListener("submit", function(event) {
            
            // Prevent the page from reloading
            event.preventDefault();

            // Get the values typed by the user
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            // 3. Validation Logic
            if (title.length < 5) {
                formMessage.textContent = "Error: Blog title must be at least 5 characters long.";
                formMessage.style.color = "red";
                return; // Stop the function here
            }

            if (content === "") {
                formMessage.textContent = "Error: Blog content cannot be empty.";
                formMessage.style.color = "red";
                return; // Stop the function here
            }

            // 4. Success UI & DOM Manipulation
            formMessage.textContent = "Success: Blog posted!";
            formMessage.style.color = "green";

            // Create a new HTML article element for the new card
            const newCard = document.createElement("article");
            newCard.className = "blog-card";
            
            // Insert the validated text into the card
            newCard.innerHTML = `
                <h2>${title}</h2>
                <p>${content}</p>
                <button class="btn btn-secondary">Read More</button>
            `;

            // Prepend puts the new card at the very top of the container!
            blogContainer.prepend(newCard);

            // Clear the form fields for the next entry
            blogForm.reset();
        });
    }
});