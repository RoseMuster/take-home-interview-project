const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const animeResults = document.getElementById("anime-results");
const yearFilter = document.getElementById("year-filter");
const sortFilter = document.getElementById("sort-filter");
const API_URL = "https://api.tenrai.org/v1/anime?q=";
let animeData = [];
let filteredData = [];
searchButton.addEventListener("click", function () {
    animeResults.innerHTML = "<p>Loading</p>;"
    const query = search.value;
    const url = API_URL + encodeURIComponent(query);
    
    fetch(url)
    .then(response => {  
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const selectedYear = yearFilter.value;
        yearFilter.innerHTML = '<option value="all">All Years</option>';
        
        if (data.data.length === 0) {
            animeResults.innerHTML = "<p>No anime found. Try another search.</p>";
            return;
        }

        const years = data.data.map(anime => new Date(anime.aired.from).getFullYear()).filter(year => !isNaN(year));

        const uniqueYears = [...new Set(years)].sort((a,b) => b - a);
        uniqueYears.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
        yearFilter.appendChild(option);
        });

        yearFilter.value = selectedYear;  
        filteredData = selectedYear=== "all"
            ? data.data
            : data.data.filter(anime => new 
                Date(anime.aired.from).getFullYear().toString() === selectedYear
            );

        anime = filteredData.map(anime => {
            return {
                title: anime.title,
                image: anime.images.jpg.image_url,
                aired: anime.aired.string,
                synopsis: anime.synopsis
            }; 
        });
        
    })
    .catch(error => console.error(error));
    animeResults.innerHTML = "<p>Something went wrong. Please try again. </p>";
});

search.addEventListener("keydown", 
function (event) { 
    if (event.key === "Enter") {
    searchButton.click(); 
    }
});
sortFilter.addEventListener("change", function() {
    console.log(sortFilter.value);
    if (sortFilter.value === "az") {
        filteredData.sort((a,b) => a.title.localeCompare(b.title));
    }
    else if (sortFilter.value === "za") {
        filteredData.sort((a, b) => b.title.localeCompare(a.title));
    }
    renderResults();
}); 

function renderResults() {
    const animeHTML = filteredData.map(anime => {
            return `
                <div class="anime-card" data-year="${new Date(anime.aired).getFullYear()}">
                    <h2>${anime.title}</h2>
                    <img src="${anime.image}" alt="${anime.title}">
                    <p class="anime-date">Aired: ${anime.aired}</p>
                    <p>${anime.synopsis}</p>
                </div>
            `;
        })
        const animeHTMLString = animeHTML.join("");
        animeResults.innerHTML = animeHTMLString;
}