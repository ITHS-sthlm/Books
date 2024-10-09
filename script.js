// Variabler
const booksContainer = document.getElementById('books-container');
const apiURL = 'https://potterapi-fedeperin.vercel.app/en/books'; // Nytt API URL

// Funktion utan parametrar: Hämtar böcker
function fetchBooks() {
    fetch(apiURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP-fel! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Data från API:', data); // Felsökningslogg

            // Kontrollera om data är en array
            let books;
            if (Array.isArray(data)) {
                books = data;
            } else {
                console.error('Oväntat dataformat:', data);
                booksContainer.innerHTML =
                    '<p class="text-danger">Oväntat dataformat från API:et.</p>';
                return;
            }

            // Kontrollera om böcker finns
            if (books.length === 0) {
                booksContainer.innerHTML = '<p>Inga böcker hittades.</p>';
                return;
            }

            // Visa böckerna
            displayBooks(books);
        })
        .catch((error) => {
            console.error('Fel vid hämtning av böcker:', error);
            booksContainer.innerHTML =
                '<p class="text-danger">Kunde inte ladda böcker.</p>';
        });
}

// Funktion med parametrar: Skapar HTML för varje bok
function createBookCard(book) {
    // Använd rätt egenskapsnamn enligt API-svaret
    const title = book.title || 'Ingen titel';
    const originalTitle = book.originalTitle || '';
    const releaseDate = book.releaseDate || 'Okänt datum';
    const description = book.description || 'Ingen beskrivning tillgänglig.';
    const coverImage =
        book.cover || 'https://via.placeholder.com/300x400?text=Ingen+Bild';
    const pages = book.pages || 'Okänt antal sidor';

    // Lägg till en genre om möjligt eller använd en standardvärde
    // Eftersom API:et inte tillhandahåller genre, kan vi sätta det till "Fantasy" för alla
    const genre = 'Fantasy';

    return `
        <div class="col-md-4">
            <div class="card book-card">
                <img src="${coverImage}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${truncateText(description, 150)}</p>
                    <p class="card-text"><strong>Utgivningsdatum:</strong> ${releaseDate}</p>
                    <p class="card-text"><strong>Sidor:</strong> ${pages}</p>
                    <p class="card-text"><strong>Genre:</strong> ${genre}</p>
                    <a href="#" class="btn btn-primary">Läs mer</a>
                </div>
            </div>
        </div>
    `;
}

// Funktion med returvärde: Trunkerar text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Högre ordningens funktion: Itererar över böcker och lägger till dem i DOM
function displayBooks(books) {
    if (Array.isArray(books) && books.length > 0) {
        const bookCards = books.map((book) => createBookCard(book)).join('');
        booksContainer.innerHTML = bookCards;
    } else {
        booksContainer.innerHTML = '<p>Inga böcker hittades.</p>';
    }
}

// Anropa funktionen för att hämta och visa böcker när DOM:en är laddad
document.addEventListener('DOMContentLoaded', fetchBooks);

/* Exempel på användning av högre ordningens funktion med filter */
function filterBooksByTitle(books, searchTerm) {
    return books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Exempel på användning (Valfritt)
fetch(apiURL)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP-fel! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (Array.isArray(data)) {
            const filteredBooks = filterBooksByTitle(data, 'harry');
            console.log('Filtrerade Böcker:', filteredBooks);
        } else {
            console.error('Oväntat dataformat för filter:', data);
        }
    })
    .catch((error) => console.error(error));
