const API_KEY = "6d5dd35d";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");
const sortSelect = document.querySelector("#sortSelect");

let currentMovies = [];

//EVENT LISTENER

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

//SHOW SKELETON LOADING CARDS
function showSkeleton() {
  const skeleton = Array(10)
    .fill(0)
    .map(
      () =>
        `<div class="movie-card movie-card--skeleton">
  <div class=" movie-card__img movie-card__img--skeleton"></div>
  <div class=" movie-card__title movie-card__title--skeleton"></div>
  <div class="movie-card__year movie-card__year--skeleton"></div>
  </div>
`,
    )
    .join("");
  moviesGrid.innerHTML = skeleton;
}

//FETCH MOVIES FROM API

async function fetchMovies(searchTerm) {
  showSkeleton();
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=6d5dd35d&s=${searchTerm}`,
  );
  const data = await res.json();
  console.log("API Response", data);
  if (data.Response === "True") {
    currentMovies = data.Search;
    console.log("Movies saved:", currentMovies);
    console.log("Number of movies:", currentMovies.length);
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    sortSelect.value = "default";
    displayMovies(currentMovies);
  } else {
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    moviesGrid.innerHTML = "<p> No Movies Found.</p>";
    currentMovies = [];
  }
}

//DISPLAY MOVIES
function displayMovies(movies) {
  const movieResults = movies
    .map((movie) => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "";
      return `
      <div class="movie-card">
        ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}.">` : ""}
        <h2 class="movie-card__title">${movie.Title}</h2>
        <p class="movie-card__year">${movie.Year}</p>
      </div>
    `;
    })
    .join("");

  moviesGrid.innerHTML = movieResults;
}
//Sort
sortSelect.addEventListener("change", (e) => {
  sortMovies(e.target.value);
});
function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];
  if (sortType === "a-z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "z-a") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === "oldest") {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }
  console.log("Sorted Movies:", sortedMovies);

  displayMovies(sortedMovies);
}

fetchMovies("Marvel");
