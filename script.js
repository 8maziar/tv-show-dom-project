const cardContainer = document.getElementById("card-container");
const search = document.getElementById("search");
const selectEpisode = document.getElementById("select-episode");
const selectShow = document.getElementById("select-show");
const remainedParts = document.getElementById("remained-parts");
const showsList = getAllShows();

let allEpisodes;
let isEpisodesDisplayed = false;

// load shows in select element
function loadShows(shows) {
  selectShow.innerHTML = "";
  const optionEl = document.createElement("option");
  optionEl.innerText = "All";
  selectShow.appendChild(optionEl);

  cardContainer.innerHTML = "";
  shows
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((show) => {
      const optionEl = document.createElement("option");
      optionEl.innerText = show.name;
      selectShow.appendChild(optionEl);
      const showDiv = createShowCard(show);
      cardContainer.appendChild(showDiv);
    });
  remainedParts.innerText = `Displaying ${shows.length}/${showsList.length}`;
}
loadShows(showsList);

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

// load episodes
function loadEpisodes(episodes) {
  episodes.forEach((episode) => {
    // create card
    cardContainer.appendChild(createEpisodecard(episode));
  });
  remainedParts.innerText = `Displaying ${episodes.length}/${allEpisodes.length}`;
}

// load select episode options
function episodeOptions() {
  // add first option to select
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

// fetch tv show
function getTheEpisodes(id) {
  const value = selectShow.value;
  if (value === "All") {
    loadShows(showsList);
    isEpisodesDisplayed = false;
    selectEpisode.value = "All";
    search.value = "";
    selectEpisode.classList.remove("visible");
  }
  if (id) {
    selectShow.value = showsList.find((show) => show.id === id).name;
    window.scrollTo(0, 0);
  }
  const showID = id || showsList.find((show) => show.name === value).id;
  fetchEpisodes(showID);
  search.value = "";
  isEpisodesDisplayed = true;
  selectEpisode.classList.add("visible");
}

// select tv show +++++++++++++++++++++++++++++++++++++
selectShow.addEventListener("change", () => {
  getTheEpisodes();
});

// search for episodes
search.addEventListener("keyup", (e) => {
  if (!isEpisodesDisplayed) {
    const value = e.target.value.toLowerCase();
    const remainedShows = showsList.filter(
      (show) =>
        show.name.toLowerCase().includes(value) ||
        show.summary.toLowerCase().includes(value) ||
        show.genres.some((genre) => genre.toLowerCase().includes(value))
    );
    selectEpisode.value = "All";
    cardContainer.innerHTML = "";
    loadShows(remainedShows);
  } else {
    const value = e.target.value.toLowerCase();
    const remainedEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(value) ||
        episode.summary.toLowerCase().includes(value)
    );
    selectEpisode.value = "All";
    cardContainer.innerHTML = "";
    loadEpisodes(remainedEpisodes);
  }
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

///////////////////////////////////////////////////////// create shows card
function createShowCard(show) {
  // create link
  const wrapperLink = document.createElement("a");
  wrapperLink.classList.add("card");
  wrapperLink.addEventListener("click", () => {
    getTheEpisodes(show.id);
  });

  //create div
  const card = document.createElement("div");

  //create title
  const title = document.createElement("h3");
  title.innerText = show.name;

  // create rating
  const rating = document.createElement("p");
  rating.innerText = show.rating.average;

  //create image
  const image = document.createElement("img");
  image.src = show?.image?.original;
  image.alt = show.name;

  //create desc
  const description = document.createElement("p");
  const editedSummary = show.summary.replace(/<.{1,3}>/g, "");
  const extraSummary = document.createElement("span");
  const fullSummary = document.createElement("p");
  fullSummary.innerText = editedSummary;
  if (editedSummary.length < 160) {
    description.innerText = editedSummary;
  } else {
    description.innerText = editedSummary.slice(0, 160);
    // create span for extra summary
    extraSummary.innerText = "Hover to read more";
    extraSummary.addEventListener("mouseenter", () => {
      fullSummary.classList.add("show");
    });
    extraSummary.addEventListener("mouseout", () => {
      fullSummary.classList.remove("show");
    });
  }

  // create genres
  const genres = document.createElement("p");
  genres.innerText = "Genres:  " + show.genres.join(", ");

  // create status runtime container
  const statusContainer = document.createElement("div");
  statusContainer.classList.add("status-container");

  // create status
  const status = document.createElement("span");
  status.innerText = show.status;
  // create runtime
  const runtime = document.createElement("span");
  runtime.innerText = "Time :  " + show.runtime;

  //append all to card
  card.appendChild(title);
  card.appendChild(rating);
  card.appendChild(image);
  card.appendChild(description);
  card.appendChild(extraSummary);
  card.appendChild(fullSummary);
  card.appendChild(genres);
  statusContainer.appendChild(runtime);
  statusContainer.appendChild(status);
  card.appendChild(statusContainer);
  wrapperLink.appendChild(card);
  return wrapperLink;
}

/////////////////////////////////////////////////// create episodes cards
function createEpisodecard(episode) {
  // create link
  const wrapperLink = document.createElement("a");
  wrapperLink.classList.add("card");
  wrapperLink.href = episode.url;

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
  const editedSummary = episode.summary.replace(/<.{1,3}>/g, "");
  const extraSummary = document.createElement("span");
  const fullSummary = document.createElement("p");
  fullSummary.innerText = editedSummary;
  if (editedSummary.length < 160) {
    description.innerText = editedSummary;
  } else {
    description.innerText = editedSummary.slice(0, 160);
    // create span for extra summary
    extraSummary.innerText = "... hover to read more";
    extraSummary.addEventListener("mouseenter", () => {
      fullSummary.classList.add("show");
    });
    extraSummary.addEventListener("mouseout", () => {
      fullSummary.classList.remove("show");
    });
  }

  //append all to card
  card.appendChild(title);
  card.appendChild(part);
  card.appendChild(image);
  card.appendChild(description);
  card.appendChild(extraSummary);
  card.appendChild(fullSummary);
  wrapperLink.appendChild(card);
  return wrapperLink;
}

//get the text of tv show in correct format
function getPart(season, episode) {
  return `S${season < 10 ? "0" + season : season}E${
    episode < 10 ? "0" + episode : episode
  }`;
}
