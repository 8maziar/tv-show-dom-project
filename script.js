const allEpisodes = getAllEpisodes();
const cardContainer = document.getElementById("card-container");
const search = document.getElementById("search");
const selectEpisode = document.getElementById("select-episode");
const remainedParts = document.getElementById("remained-parts");

// load episodes
function loadEpisodes(episodes) {
  episodes.forEach((episode) => {
    // load select's options
    if (episodes.length === allEpisodes.length) {
      const optionEl = document.createElement("option");
      optionEl.innerText = `${getPart(episode.season, episode.number)} - ${
        episode.name
      }`;
      selectEpisode.appendChild(optionEl);
    }
    // create card
    cardContainer.appendChild(createcards(episode));
  });
  remainedParts.innerText = `Displaying ${episodes.length}/73`;
}
loadEpisodes(allEpisodes);

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
  description.innerText = episode.summary.replace(/<p>|<\/p>/g, "");

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
