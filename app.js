const API_URL = "https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/";

// Function to load books
async function loadBooks() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const books = data.data;
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = "";

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
              <form method="POST" action="#" onsubmit="deleteBook(event, '${book.id}')">
                <input type="hidden" value="${book.id}">
                <button type="submit" class="btn btn-danger">Delete</button>
              </form>
            </div>
          </div>
        </div>
      `;
      bookContainer.innerHTML += bookCard;
    });
  } catch (error) {
    console.error("Error loading books:", error);
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = "<p>Failed to load books. Please try again later.</p>";
  }
}

// Function to delete a book
async function deleteBook(event, bookId) {
  event.preventDefault();

  try {
    // Encode the query string
    const query = `delete from Ao2HHkALjkDMjfci where id='id0007'`;
    const encodedQuery = encodeURIComponent(query);
    console.log(`${API_URL}?query=${encodedQuery}`);
    // Logs: https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/?query=delete%20from%20Ao2HHkALjkDMjfci%20where%20id%3D%27id0007%27

    const response = await fetch(`${API_URL}?query=${encodedQuery}`);
    
    if (response.status === 200) {
      alert("Book deleted successfully!");
      loadBooks(); // Reload the book list
    } else {
      alert(`Failed to delete the book. Error code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("An error occurred while deleting the book.");
  }
}

// Function to create a new book
async function createBook(event) {
  event.preventDefault();

  // Get form data
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const desc = document.getElementById("desc").value;
  const abstract = document.getElementById("abstract").value;
  const img = document.getElementById("img").value;

  // Get the latest id and increment it
  const response = await fetch(API_URL);
  const data = await response.json();
  const books = data.data;

  const latestId = books.length
    ? Math.max(...books.map(book => parseInt(book.id.replace("id", ""), 10))) + 1
    : 1;

  const newId = `id${String(latestId).padStart(4, "0")}`;

  // Send a POST request to add the new book
  try {
    const result = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          id: newId,
          title,
          author,
          desc,
          abstract,
          img,
        },
      }),
    });

    if (result.ok) {
      alert("Book added successfully!");
      document.getElementById("create-form").reset();
      loadBooks(); // Reload the book list after adding
    } else {
      alert("Failed to add the book. Please try again.");
    }
  } catch (error) {
    console.error("Error creating book:", error);
    alert("An error occurred while adding the book.");
  }
}

// Load books when the page loads
window.onload = () => {
  loadBooks();
  document.getElementById("create-form").addEventListener("submit", createBook);
};
