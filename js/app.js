/* I'm too lazy to fix this code
<li class="nav__item">
    <a class="nav__link" href="#">Why this site exist</a>
</li> fix it later */

const apiKey =
  "live_4SEdY99VVa1ExR1NMNGWf4xJ29z49FcrMaEV9eFsZMNoTCCYQhYDUsm87JxBfCz3";
const randomCatsUrl = `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}&limit=12`;

const initialBreedsUrl = `https://api.thecatapi.com/v1/breeds?api_key=${apiKey}&limit=12&page=`;
const searchBreedUrl = `https://api.thecatapi.com/v1/breeds/search?api_key=${apiKey}&q=`;
const searchImageUrl = `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}&limit=1&breed_id=`;

const cardContainer = document.querySelector(".card-container");
const randomKittiesBtn = document.querySelector("#random-kitties");
const galleryBtn = document.querySelector("#gallery");
const formBreed = document.querySelector(".search-form");
const inputBreed = document.querySelector(".search-form__input");

let page = 0;

const images = {
  url: [],
};

const breeds = {
  id: [],
  description: [],
  url: [],
  name: [],
  wikipedia_url: [],
};

async function initialBreeds(page) {
  cardContainer.innerHTML = "";
  await fetch(initialBreedsUrl + page)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((userData) => {
      userData.forEach((breed) => {
        breeds.id.push(breed.id);
        breeds.description.push(breed.temperament);
        breeds.name.push(breed.name);
        breeds.wikipedia_url.push(breed.wikipedia_url);
        console.log(breeds.description);
      });
      console.log(breeds.id);
      return searchImage(breeds);
    });
}

initialBreeds(0).catch((err) => console.log(err));

async function searchBreed(breed) {
  await fetch(searchBreedUrl + breed)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((userData) => {
      const ids = userData.map((item) => item.id);
      ids.forEach((id) => breeds.id.push(id));
      return searchImage(breeds);
    })
    .finally(() => {
      breeds.url = [];
    });
}
galleryBtn.addEventListener("click", (e) => initialBreeds());
formBreed.addEventListener("submit", (e) => {
  e.preventDefault();
  searchBreed(inputBreed.value).catch((err) => console.log(err));
  inputBreed.value = "";
  breeds.id.splice(0, breeds.id.length);
});

async function searchImage(breeds) {
  console.log(breeds);
  for (const id of breeds.id) {
    console.log(id);
    fetch(searchImageUrl + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        console.log(userData);
        userData.map((item) => breeds.url.push(item.url));
        return putImagesIntoCard(breeds);
      });
  }
}

async function randomPictures() {
  await fetch(randomCatsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((userData) => {
      userData.map((item) => images.url.push(item.url));
      return putRandomImages(images);
    });
}

randomKittiesBtn.addEventListener("click", randomPictures);

const putImagesIntoCard = (data) => {
  cardContainer.innerHTML = "";
  data.url.forEach((img, index) => {
    const cardHTML = `<div class="card">
          <div class="card__picture">
            <img src="${img}" alt=""/>
          </div>
          <div class="card__description">
            <h4>${breeds.name[index]}</h4>
            <p>
              ${data.description[index].replace(";", "")};
            </p>
          </div>
          <a href="${breeds.wikipedia_url[index]}" target="_blank" class="card__btn">Learn more &rarr;</a>
      </div>`;
    cardContainer.insertAdjacentHTML("afterbegin", cardHTML);
  });
};

const putRandomImages = (data) => {
  cardContainer.innerHTML = "";
  data.url.forEach((img) => {
    const cardHTML = `<div class="card" style="width: 36rem; height: 40rem">
          <div  class="card__picture">
            <img style="width: 100%; height: 40rem" src="${img}" alt="" />
          </div>
      </div>`;
    cardContainer.insertAdjacentHTML("afterbegin", cardHTML);
  });
};
