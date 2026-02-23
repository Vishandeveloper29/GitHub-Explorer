// --- language color map ---
const langcolors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  default: "#7c6af7",
};

// get color for a language, or use default color
function getlangcolor(lang) {
  return langcolors[lang] || langcolors.default;
}

// show numbers like 1000 as 1.0k
function formatnum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

// grab elements from the page by their id
const input = document.getElementById("searchinput");
const btn = document.getElementById("searchbtn");
const loader = document.getElementById("loader");
const profilecard = document.getElementById("profilecard");
const repossection = document.getElementById("repossection");
const errormsg = document.getElementById("errormsg");

// when the button is clicked, run search
btn.addEventListener("click", search);

// when the user presses Enter in the input box, also run search
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") search();
});

// main search function
async function search() {
  const username = input.value.trim();
  if (!username) return; // do nothing if input is empty

  // hide old results and show loader
  profilecard.style.display = "none";
  repossection.style.display = "none";
  errormsg.style.display = "none";
  loader.style.display = "block";
  btn.textContent = "Loading...";

  try {
    // fetch user info and repos at the same time
    const [userres, reposres] = await Promise.all([
      fetch("https://api.github.com/users/" + username),
      fetch(
        "https://api.github.com/users/" +
          username +
          "/repos?sort=stars&per_page=6",
      ),
    ]);

    if (!userres.ok) throw new Error("Not found");

    const user = await userres.json();
    const repos = await reposres.json();

    // show the profile and repos on the page
    renderprofile(user);
    renderrepos(repos, user.avatar_url);
  } catch (e) {
    // if anything went wrong, show the error message
    errormsg.style.display = "block";
  } finally {
    // always hide loader and reset button text
    loader.style.display = "none";
    btn.textContent = "Search →";
  }
}

// fill in the profile card with user data
function renderprofile(u) {
  document.getElementById("avatar").src = u.avatar_url;
  document.getElementById("name").textContent = u.name || u.login;
  document.getElementById("login").textContent = "@" + u.login;
  document.getElementById("bio").textContent = u.bio || "";
  document.getElementById("statrepos").textContent = formatnum(u.public_repos);
  document.getElementById("statfollowers").textContent = formatnum(u.followers);
  document.getElementById("statfollowing").textContent = formatnum(u.following);
  document.getElementById("viewbtn").href = u.html_url;

  // build the meta info row (location, company, blog, twitter)
  const meta = document.getElementById("meta");
  meta.innerHTML = "";

  if (u.location)
    meta.innerHTML += metaitem(
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      u.location,
    );

  if (u.company)
    meta.innerHTML += metaitem(
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      u.company,
    );

  if (u.blog)
    meta.innerHTML += metaitem(
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      u.blog,
    );

  if (u.twitter_username)
    meta.innerHTML += metaitem(
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>',
      "@" + u.twitter_username,
    );

  // show the profile card
  profilecard.style.display = "block";
}

// helper: build one meta row with icon and text
function metaitem(icon, text) {
  return '<div class="meta-item">' + icon + " " + text + "</div>";
}

// fill in the repos grid with repo cards
function renderrepos(repos, avatarurl) {
  if (!Array.isArray(repos) || repos.length === 0) return;

  document.getElementById("repocount").textContent = repos.length;

  const grid = document.getElementById("reposgrid");
  grid.innerHTML = ""; // clear old cards

  // loop through each repo and make a card
  repos.forEach(function (repo) {
    const langcolor = getlangcolor(repo.language);

    const card = document.createElement("a");
    card.className = "repo-card";
    card.href = repo.html_url;
    card.target = "_blank";

    card.innerHTML =
      '<div class="repo-name">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' +
      '<img class="owner-avatar" src="' +
      avatarurl +
      '" alt="owner">' +
      repo.name +
      "</div>" +
      '<p class="repo-desc">' +
      (repo.description || "No description provided.") +
      "</p>" +
      '<div class="repo-footer">' +
      '<div class="repo-stat stars">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      formatnum(repo.stargazers_count) +
      "</div>" +
      '<div class="repo-stat">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>' +
      formatnum(repo.forks_count) +
      "</div>" +
      (repo.language
        ? '<div class="lang-dot" style="--lang-color: ' +
          langcolor +
          '">' +
          repo.language +
          "</div>"
        : "") +
      "</div>";

    grid.appendChild(card);
  });

  // show the repos section
  repossection.style.display = "block";
}
