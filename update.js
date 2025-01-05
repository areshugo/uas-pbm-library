const API_URL = "https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/";
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id"); // Get the book ID from the URL

// Load existing book data into the form
async function loadBookData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const book = data.data.find(book => book.id === bookId);
    if (book) {
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
      document.getElementById("desc").value = book.desc;
      document.getElementById("abstract").value = book.abstract;
    } else {
      alert("Book not found!");
    }
  } catch (error) {
    console.error("Error loading book data:", error);
    alert("Failed to load book data. Please try again later.");
  }
}

// Handle form submission for updating book data
document.getElementById("update-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const updatedBook = {
    id: bookId,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    desc: document.getElementById("desc").value,
    abstract: document.getElementById("abstract").value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        query: `update set title='${updatedBook.title}', author='${updatedBook.author}', desc='${updatedBook.desc}', abstract='${updatedBook.abstract}' where id='${updatedBook.id}'`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      alert("Book updated successfully!");
      window.location.href = "index.html"; // Redirect to the main page
    } else {
      throw new Error("Failed to update book");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Failed to update the book. Please try again later.");
  }
});

// Load the book data when the page is ready
window.onload = loadBookData;
