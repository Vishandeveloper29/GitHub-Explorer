<div align="center">

# 🔭 GitHub Explorer

**A sleek, dark-themed GitHub profile search tool — no frameworks, no build step, just open and use.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub API](https://img.shields.io/badge/GitHub_API-7C6AF7?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-4AF79E?style=for-the-badge)

</div>

---

## ✨ About

GitHub Explorer lets you instantly look up any GitHub user by username. It queries the public **GitHub REST API** in real time to surface profile details, account statistics, and top-starred repositories — all in a polished dark UI with smooth animations.

---

## 🚀 Features

| | Feature | Description |
|---|---|---|
| 🔍 | **Profile Search** | Look up any public GitHub account by username |
| 📊 | **Account Stats** | Repos, followers, and following count at a glance |
| 📦 | **Top Repositories** | The 6 most-starred repos with star & fork counts |
| 🌈 | **Language Colors** | Each language shown with its official GitHub color dot |
| 🌙 | **Dark Theme** | Deep dark UI with purple accent glow |
| ⚡ | **Zero Dependencies** | No npm, no build step — just open `index.html` |
| 📱 | **Responsive** | Works on desktop, tablet, and mobile |

---

## 📁 File Structure

```
github-explorer/
├── index.html    ← markup & layout
├── style.css     ← dark theme, animations, responsive grid
└── script.js     ← GitHub API calls & DOM rendering
```

---

## 🛠️ Quick Start

**1. Clone the repo**
```bash
git clone https://github.com/your-username/github-explorer.git
cd github-explorer
```

**2. Open in your browser**

Just open `index.html` directly — or serve it locally:

```bash
# Python
python -m http.server 8080

# Node / npx
npx serve .
```

**3. Search!**

Type any GitHub username (e.g. `torvalds`, `gaearon`, `sindresorhus`) and press **Search** or hit `Enter`.

---

## ⚙️ How It Works

When a search is triggered, two requests fire in parallel via `Promise.all`:

```
GET https://api.github.com/users/{username}
GET https://api.github.com/users/{username}/repos?sort=stars&per_page=6
```

The results are rendered directly into the DOM — no page reload, no frameworks.

> **Rate limiting:** The public GitHub API allows **60 requests/hour** per IP. For heavier use, add a personal access token as a `Bearer` header inside the `fetch()` calls in `script.js`.

---

## 🎨 Customisation

**Change the accent colour**

All colours live as CSS variables at the top of `style.css`:

```css
:root {
  --accent:  #7c6af7;  /* purple — change to any hex */
  --accent2: #f7826a;  /* coral  — gradient pair     */
  --green:   #4af79e;  /* mint   — highlight colour  */
}
```

**Show more repositories**

Edit the `per_page` value in `script.js`:

```js
// Change 6 to any number up to 100
fetch(`.../repos?sort=stars&per_page=6`)
```

**Add a new programming language colour**

Append to the `langcolors` map in `script.js`:

```js
const langcolors = {
  JavaScript: "#f1e05a",
  // ...existing entries...
  Zig: "#ec915c",  // ← add new languages here
  Lua: "#000080",
};
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 — semantic, no frameworks |
| Styling | CSS3 — custom properties, grid, keyframe animations |
| Logic | Vanilla JS — Fetch API, async/await, DOM manipulation |
| Fonts | [Syne](https://fonts.google.com/specimen/Syne) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts |
| Data | [GitHub REST API v3](https://docs.github.com/en/rest) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes and push the branch
4. Open a Pull Request describing what changed and why

---

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with 💜 using the GitHub REST API</sub>
</div>
