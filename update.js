const API_URL = "https://api.apispreadsheets.com/data/Ao2HHkALjkDMjfci/";

// Go back to the main page
function goBack() {
  window.location.href = "index.html";
}

// Function to load book data into the update form
async function loadBookData() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const book = data.data.find(b => b.id === bookId);

    if (book) {
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
      document.getElementById("img").value = book.img;
      document.getElementById("desc").value = book.desc;
      document.getElementById("abstract").value = book.abstract;
    } else {
      alert("Book not found.");
    }
  } catch (error) {
    console.error("Error loading book data:", error);
    alert("Failed to load book data.");
  }
}

// Function to update the book data
async function updateBook(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  const updatedData = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    img: document.getElementById("img").value,
    desc: document.getElementById("desc").value,
    abstract: document.getElementById("abstract").value,
  };

  try {
    // Send a POST request with the updated data and query to update the record
    const updateResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          id: bookId,
          title: updatedData.title,
          author: updatedData.author,
          img: updatedData.img,
          desc: updatedData.desc,
          abstract: updatedData.abstract,
        },
        query: `select * from Ao2HHkALjkDMjfci where id='${bookId}'`,  // Ensure this query matches the format used in your example
      }),
    });

    if (updateResponse.status === 201) {
      alert("Book updated successfully!");
      window.location.href = "index.html"; // Redirect to the main page after update
    } else {
      alert("Failed to update book. Please try again.");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    alert("An error occurred while updating the book.");
  }
}

// Load book data and set up event listener
window.onload = () => {
  loadBookData();
  document.getElementById("update-book-form").addEventListener("submit", updateBook);
};
