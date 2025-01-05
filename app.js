// API URL to fetch data from ApiSpreadsheets
const API_URL = "https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/";

// Function to fetch data and create cards dynamically
async function loadBooks() {
    try {
        // Fetch the data from the API
        const response = await fetch(API_URL);
        const data = await response.json();

        // Get the book data
        const books = data.data;

        // Get the container where we want to add book cards
        const bookContainer = document.getElementById('book-container');
        bookContainer.innerHTML = '';  // Clear any existing content

        // Loop through each book and create a card
        books.forEach(book => {
            const bookCard = `
                <div class="book-card">
                    <div class="book-image">
                        <img src="${book.img}" alt="${book.title}">
                    </div>
                    <div class="book-details">
                        <h5 class="book-title">${book.title}</h5>
                        <p class="book-author">by ${book.author}</p>
                        <p class="book-desc">${book.desc}</p>
                        <p class="book-abstract">${book.abstract.length > 100 ? book.abstract.substring(0, 100) + '...' : book.abstract}</p>
                        <div class="buttons">
                            <a href="update.html?id=${book.id}" class="btn btn-warning">Update</a>
                            <form method="POST" action="#" style="display: inline;">
                                <button type="button" class="btn btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            // Add the book card to the container
            bookContainer.innerHTML += bookCard;
        });
    } catch (error) {
        console.error('Error loading books:', error);
        const bookContainer = document.getElementById('book-container');
        bookContainer.innerHTML = '<p>Failed to load books. Please try again later.</p>';
    }
}

// Delete Book
async function deleteBook(bookId) {
    try {
        // Sending a POST request to delete the book
        const response = await fetch(`${API_URL}`, {
            method: 'POST',  // POST method for delete action
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',  // Assuming the API needs an 'action' field
                bookId: bookId,    // Use the correct book ID (e.g., id0001)
            }),
        });

        // Check if the response was successful
        if (response.ok) {
            alert('Book deleted successfully!');
            loadBooks(); // Reload the books after deletion
        } else {
            alert('Failed to delete book.');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('An error occurred while deleting the book.');
    }
}

// Handle Create Book Form Submission
document.getElementById('create-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Fetch the current data to generate a new ID
    const response = await fetch(API_URL);
    const data = await response.json();
    const books = data.data;

    // Get the highest existing ID
    const lastId = books.length ? Math.max(...books.map(book => parseInt(book.id.replace('id', '')))) : 0;
    const newId = 'id' + String(lastId + 1).padStart(4, '0');  // Increment ID (e.g., id0001, id0002, ...)

    const newBook = {
        id: newId,  // New incrementing ID
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        img: document.getElementById('img').value,
        desc: document.getElementById('desc').value,
        abstract: document.getElementById('abstract').value
    };

    const postResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    });

    if (postResponse.ok) {
        alert('Book added successfully!');
        loadBooks(); // Reload the books
        document.getElementById('create-book-form').reset(); // Clear the form
    } else {
        alert('Failed to add book.');
    }
});

// Load books when the page loads
window.onload = loadBooks;
