const API_URL = "https://api.apispreadsheets.com/data/3a24vZuKqrS2rNnl/";

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
              <a href="update.html?id=${book.id}" class="btn btn-warning">Update</a>
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

async function deleteBook(event, bookId) {
  event.preventDefault();

  try {
    // Construct the DELETE query URL
    const deleteUrl = `${API_URL}?query=delete from 3a24vZuKqrS2rNnl where id='${bookId}'`;

    // Make the DELETE request
    const deleteResponse = await fetch(deleteUrl);

    // Check the response status
    if (deleteResponse.status === 200) {
      alert("Book deleted successfully!");
      await loadBooks(); // Reload the updated book list
    } else {
      const errorDetails = await deleteResponse.json();
      console.error("Error response from server:", errorDetails);
      alert("Failed to delete the book. Please try again.");
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
      document.getElementById("create-book-form").reset();
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
  document.getElementById("create-book-form").addEventListener("submit", createBook);
};
