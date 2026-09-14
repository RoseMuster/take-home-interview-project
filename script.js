const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function () {
    console.log(search.value);
});
const API_URL = "https://api.jikan.moe/v4/anime?q=";