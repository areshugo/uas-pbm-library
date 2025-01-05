const API_URL = "https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/";

// Function to get books from the API
async function getBooks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const books = data.data;
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Function to display books as cards
function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = '';  // Clear existing books

    books.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.desc}</p>
            <p><strong>Abstract:</strong> ${book.abstract}</p>
            <img src="${book.img}" alt="${book.title}" width="100">
            <button onclick="deleteBook('${book.id}')">Delete</button>
        `;

        bookList.appendChild(card);
    });
}

// Function to delete a book
async function deleteBook(bookId) {
    const query = `delete from Ao2HHkALjkDMjfci where id='${bookId}'`;
    const response = await fetch(`${API_URL}?query=${query}`, { method: "GET" });
    if (response.ok) {
        alert("Book deleted!");
        getBooks(); // Refresh book list
    } else {
        alert("Error deleting book");
    }
}

// Function to add a new book
document.getElementById("add-book-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const newBook = {
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        desc: document.getElementById("desc").value,
        abstract: document.getElementById("abstract").value,
        img: document.getElementById("img").value,
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: newBook })
    });

    if (response.ok) {
        alert("Book added!");
        getBooks(); // Refresh book list
    } else {
        alert("Error adding book");
    }
});

// Call the getBooks function to load the books initially
getBooks();
