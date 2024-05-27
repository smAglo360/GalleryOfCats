const apiKey =
  "live_4SEdY99VVa1ExR1NMNGWf4xJ29z49FcrMaEV9eFsZMNoTCCYQhYDUsm87JxBfCz3";

const initialBreedsUrl = `https://api.thecatapi.com/v1/breeds?limit=12&page=`;
const searchBreedUrl = `https://api.thecatapi.com/v1/breeds/search?&attach_image=1&q=`;

//Dom elements
const cardContainer = document.querySelector(".card-container");
const btnPrevious = document.querySelector("#previous");
const btnNext = document.querySelector("#next");

let page = 0;

const breeds = {
  id: [],
  reference_image_id: [],
  description: [],
  url: [],
  name: [],
  wikipedia_url: [],
};

const fetchInitialBreeds = async () => {
  cardContainer.innerHTML = "";
  clearBreeds(breeds);
  await fetch(initialBreedsUrl + page, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  })
    .then((response) =>
      !response.ok ? console.error("Something wrong") : response.json(),
    )
    .then((data) => {
      data.forEach((breed) => {
        breed.hasOwnProperty("image") ? putBreedsIntoObject(breed) : null;
      });
    });
  return breeds != null ? putImagesIntoCard(breeds) : null;
};

const putImagesIntoCard = function (breeds) {
  cardContainer.innerHTML = "";
  reverseBreeds(breeds);
  breeds.id.forEach((id, index) => {
    const cardHTML = `<div class="card">
          <div class="card__picture">
            <img src="${breeds.url[index]}" alt="" />
          </div>
          <div class="card__description">
            <h4>${breeds.name[index]}</h4>
            <p>
              ${breeds.description[index]}
            </p>
          </div>
          <a href="${breeds.wikipedia_url[index]}" target="_blank" class="btn btn--card">Learn more &rarr;</a>`;
    cardContainer.insertAdjacentHTML("afterbegin", cardHTML);
  });
};

const changePaginationNumber = function (page) {
  document.querySelector("#page").textContent = page + 1;
};

/* I put that into functions without ideas why*/
const reverseBreeds = (breeds) => {
  for (const [key, value] of Object.entries(breeds)) {
    value.reverse();
  }
};
const clearBreeds = (breeds) => {
  for (const [key, value] of Object.entries(breeds)) {
    value.length = 0;
  }
};

const putBreedsIntoObject = function (breed) {
  breeds.id.push(breed.reference_image_id);
  breeds.url.push(breed.image.url);
  breeds.name.push(breed.name);
  breeds.description.push(breed.description);
  breeds.wikipedia_url.push(breed.wikipedia_url);
};

btnPrevious.addEventListener("click", (e) => {
  e.preventDefault();
  page--;
  if (page >= 0) {
    changePaginationNumber(page);
    fetchInitialBreeds().catch((error) => console.error(error));
  }
});
btnNext.addEventListener("click", (e) => {
  e.preventDefault();
  page++;
  if (page <= 5) {
    changePaginationNumber(page);
    fetchInitialBreeds().catch((error) => console.error(error));
  }
});

//Logic, i know that I have put it into class but nah
fetchInitialBreeds().catch((error) => console.error(error));
