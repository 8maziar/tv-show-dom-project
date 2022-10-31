const allEpisodes = getAllEpisodes();
console.log("allEpisodes:", allEpisodes);
const cardContainer = document.getElementById("card-container");

// create card for each episodes
allEpisodes.forEach((episode) => {
  // create link
  const wrapperLink = document.createElement("a");
  wrapperLink.href = episode.url;
  wrapperLink.classList.add("card");

  //create div
  const card = document.createElement("div");

  //create title
  const title = document.createElement("h3");
  title.innerText = episode.name;

  //create image
  const image = document.createElement("img");
  image.src = episode.image.medium;
  image.alt = episode.name;

  //create desc
  const description = document.createElement("p");
  description.innerText = episode.summary.replace(/<p>|<\/p>/g, "");

  //append all to card
  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(description);
  wrapperLink.appendChild(card);

  //append episodes to container
  cardContainer.appendChild(wrapperLink);
});
