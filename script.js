const cardContainer = document.getElementById("card-container");
const search = document.getElementById("search");
const selectEpisode = document.getElementById("select-episode");
const selectShow = document.getElementById("select-show");
const remainedParts = document.getElementById("remained-parts");
const showsList = getAllShows();

// save all episodes in a variable
let allEpisodes;

// load shows in select element
function loadShows() {
  showsList
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((show) => {
      const optionEl = document.createElement("option");
      optionEl.innerText = show.name;
      selectShow.appendChild(optionEl);
    });
}
loadShows();
// fetch episodes
function fetchEpisodes(id) {
  fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      allEpisodes = data;
      cardContainer.innerHTML = "";
      loadEpisodes(allEpisodes);
      episodeOptions();
    })
    .catch((err) => {
      const paraEl = document.createElement("p");
      paraEl.innerText = "Something went wrong";
      cardContainer.innerHTML = "";
      cardContainer.appendChild(paraEl);
    });
}
fetchEpisodes(167);

// load episodes
function loadEpisodes(episodes) {
  episodes.forEach((episode) => {
    // create card
    cardContainer.appendChild(createcards(episode));
  });
  remainedParts.innerText = `Displaying ${episodes.length}/${allEpisodes.length}`;
}

// load select episode options
function episodeOptions() {
  // add All option to select
  selectEpisode.innerHTML = "";
  const optionEl = document.createElement("option");
  optionEl.innerText = "All";
  selectEpisode.appendChild(optionEl);

  // load other options
  allEpisodes.forEach((episode) => {
    const optionEl = document.createElement("option");
    optionEl.innerText = `${getPart(episode.season, episode.number)} - ${
      episode.name
    }`;
    selectEpisode.appendChild(optionEl);
  });
}

// create cards
function createcards(episode) {
  // create link
  const wrapperLink = document.createElement("a");
  wrapperLink.href = episode.url;
  wrapperLink.classList.add("card");

  //create div
  const card = document.createElement("div");

  //create title
  const title = document.createElement("h3");
  title.innerText = episode.name;

  // create season and episode
  const part = document.createElement("p");
  part.innerText = getPart(episode.season, episode.number);

  //create image
  const image = document.createElement("img");
  image.src = episode.image.medium;
  image.alt = episode.name;

  //create desc
  const description = document.createElement("p");
  description.innerText = episode.summary.replace(/<p>|<\/p>|<br>/g, "");

  //append all to card
  card.appendChild(title);
  card.appendChild(part);
  card.appendChild(image);
  card.appendChild(description);
  wrapperLink.appendChild(card);
  return wrapperLink;
}

//get the text of tv show in correct format
function getPart(season, episode) {
  return `S${season < 10 ? "0" + season : season}E${
    episode < 10 ? "0" + episode : episode
  }`;
}

// select tv show
selectShow.addEventListener("change", () => {
  const value = selectShow.value;
  const showID = showsList.find((show) => show.name === value).id;
  fetchEpisodes(showID);
});

// search for episodes
search.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase();
  const remainedEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(value) ||
      episode.summary.toLowerCase().includes(value)
  );
  selectEpisode.value = "All";
  cardContainer.innerHTML = "";
  loadEpisodes(remainedEpisodes);
});

// select the episode with select element
selectEpisode.addEventListener("change", () => {
  const value = selectEpisode.value.slice(9);
  let remainedEpisodes = allEpisodes.filter(
    (episode) => episode.name === value
  );
  if (!value) {
    remainedEpisodes = allEpisodes;
  }
  search.value = "";
  cardContainer.innerHTML = "";
  loadEpisodes(remainedEpisodes);
});
