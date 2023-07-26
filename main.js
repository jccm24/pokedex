document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const pokemonList = document.getElementById("pokemonList");

  // Función para mostrar los detalles del Pokémon en el modal
  function showPokemonDetails(event) {
    // Crea el contenido del modal
    const modalContent = `
    <h5>Peso: ${event.weight}</h5>
    <h5>Movimientos:</h5>
    <ul>
      ${event.abilities.map(ability => `<li>${ability}</li>`).join("")}
    </ul>
  `;

    // Muestra el modal utilizando Bootstrap
    const modalContentElement = document.getElementById("modalContent");
    modalContentElement.innerHTML = modalContent;

    // Desplaza la página hacia arriba antes de mostrar el modal
    window.scrollTo({ top: 0, behavior: "smooth" });

    $("#pokemonModal").modal("show");
  }

  // Crea un conjunto para almacenar los nombres de los Pokémon agregados
  const addedPokemons = new Set();

  // Función para cargar los datos del JSON y mostrar los pokemones
  function loadPokemons() {
    fetch("pokemon.json")
      .then(response => response.json())
      .then(data => {
        data.forEach(pokemon => {
          // Verifica si el Pokémon ya ha sido agregado a las tarjetas
          if (!addedPokemons.has(pokemon.name)) {
            const card = `
            <div class="col-md-4 mb-4">
              <div class="card">
                <img src="${pokemon.ThumbnailImage}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                  <h5 class="card-title">${pokemon.name}</h5>
                  <p class="card-text">Tipo: ${pokemon.type}</p>
                </div>
                <a href="#" class="stretched-link" data-pokemon='${JSON.stringify(pokemon)}'></a>
              </div>
            </div>
          `;
            pokemonList.insertAdjacentHTML("beforeend", card);

            // Agrega el nombre del Pokémon al conjunto de Pokémon agregados
            addedPokemons.add(pokemon.name);
          }
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }


  // Carga los pokemones al cargar la página
  loadPokemons();

  // Agrega un evento de clic a los enlaces de los pokemones
  pokemonList.addEventListener("click", function (event) {
    if (event.target.matches("a.stretched-link")) {
      const pokemon = JSON.parse(event.target.getAttribute("data-pokemon"));
      showPokemonDetails(pokemon);
    }
  });
  // Agrega un evento de escucha al input de búsqueda
  searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.trim().toLowerCase();
    const cards = pokemonList.querySelectorAll(".card");

    cards.forEach(card => {
      const pokemonName = card.querySelector(".card-title").textContent.toLowerCase();
      if (pokemonName.includes(searchValue)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

