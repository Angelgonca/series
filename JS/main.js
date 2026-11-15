const createShowCard = (episode) => {
    const show = episode?.show ?? {};

    const card = document.createElement("div");
    card.classList.add("movies-card");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("movies-info");

    const name = document.createElement("h2");
    name.classList.add("movies-name");
    name.textContent = show.name || "Serie desconocida";

    const episodeName = document.createElement("h3");
    episodeName.textContent = episode.name || "Sin título";

    const date = document.createElement("p");
    date.textContent = `Fecha: ${episode.airdate || "No disponible"}`;

    const season = document.createElement("p");
    season.textContent = `Temporada: ${episode.season ?? "No disponible"}`;

    const number = document.createElement("p");
    number.textContent = `Episodio: ${episode.number ?? "No disponible"}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(episodeName);
    infoDiv.appendChild(date);
    infoDiv.appendChild(season);
    infoDiv.appendChild(number);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("movies-image-container");

    const image = document.createElement("img");
    image.classList.add("movies-image");
    image.src = show.image.medium;
    image.alt = show.name;

    imageContainer.appendChild(image);

    card.appendChild(imageContainer);
    card.appendChild(infoDiv);

    return card;
};


const createSearchShowCard = (result) => {
    const show = result.show;

    const card = document.createElement("div");
    card.classList.add("movies-card");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("movies-image-container");

    const image = document.createElement("img");
    image.classList.add("movies-image");
    image.src = show.image.medium;
    image.alt = show.name;

    imageContainer.appendChild(image);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("movies-info");

    const name = document.createElement("h2");
    name.classList.add("movies-name");
    name.textContent = show.name;

    const genre = document.createElement("p");
    genre.textContent = `Género: ${
        show.genres?.join(", ") || "No disponible"
    }`;

    const premiered = document.createElement("p");
    premiered.textContent = `Estreno: ${
        show.premiered || "No disponible"
    }`;

    const status = document.createElement("p");
    status.textContent = `Estado: ${
        show.status || "No disponible"
    }`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(genre);
    infoDiv.appendChild(premiered);
    infoDiv.appendChild(status);

    card.appendChild(imageContainer);
    card.appendChild(infoDiv);

    return card;
};


document.addEventListener("DOMContentLoaded", () => {

    const moviesGrid = document.getElementById("movies-grid");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    if (!moviesGrid || !searchForm || !searchInput) {
        console.error("No se encuentran todos los elementos HTML necesarios.");
        return;
    }

    // CARGA INICIAL DE EPISODIOS CON AXIOS

    console.log("Conectando con TVmaze...");

    axios.get("https://api.tvmaze.com/schedule")
        .then(response => {

            const data = response.data;
            console.log("Episodios recibidos:", data.length);
            moviesGrid.innerHTML = "";

            const episodesWithImage = data.filter(episode => {
                return episode.show?.image?.medium;
            });

            episodesWithImage.slice(0, 30).forEach(episode => {
                const showCard = createShowCard(episode);
                moviesGrid.appendChild(showCard);
            });

        })
        .catch(error => {
            console.error("Error al cargar episodios:", error);
            moviesGrid.textContent = "No se ha podido cargar la información.";
        });




    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const searchValue = searchInput.value.trim();

        if (!searchValue) {
            moviesGrid.innerHTML = "<p>Escribe el nombre de una serie.</p>";
            return;
        }

        moviesGrid.innerHTML = "<p>Buscando series...</p>";

        axios.get(
            `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchValue)}`
        )
            .then(response => {

                const data = response.data;

                moviesGrid.innerHTML = "";

                const showsWithImage = data.filter(result => {
                    return result.show?.image?.medium;
                });

                showsWithImage.forEach(result => {
                    const showCard = createSearchShowCard(result);
                    moviesGrid.appendChild(showCard);
                });

                if (showsWithImage.length === 0) {
                    moviesGrid.innerHTML =
                        "<p>No se encontraron series con imagen disponible.</p>";
                }

            })
            .catch(error => {
                console.error("Error en la búsqueda:", error);
                moviesGrid.innerHTML =
                    "<p>No se pudieron cargar las series.</p>";
            });

    });

});