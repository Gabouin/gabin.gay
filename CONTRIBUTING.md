# Contributing to gabintavernier.com

Thanks for your interest in contributing! This is my personal website, so the design choices are mine — but bug fixes, responsive/accessibility improvements and good ideas are very welcome.

---

## Table of Contents

- [What Contributions Are Welcome](#what-contributions-are-welcome)
- [Project Structure (Where to Put Files)](#project-structure-where-to-put-files)
- [How to Contribute](#how-to-contribute)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Code of Conduct](#code-of-conduct)

---

## What Contributions Are Welcome

### Bugs
- Layout breaking on some screen size or browser
- Broken links, images that don't load
- Overflow, misaligned elements, hover effects misbehaving

### Responsive & Accessibility
- Improvements for phones and tablets
- Better contrast, alt texts, keyboard navigation

### Documentation
- Fixing typos in the pages or the README
- Improving this guide

### Ideas
- Suggestions for the empty home page boxes, new sections, fun web-culture stuff (88x31, webrings...)
- For big visual/design changes: **please open an issue first** to discuss it before spending time on a PR — this is a personal site, so I might say no to a redesign, but I always want to hear the idea!

---

## Project Structure (Where to Put Files)

Please follow these conventions to keep the repo clean:

- `*.html` — one file per page, at the root
- `css/main.css` — the **single** stylesheet for the whole site; no extra CSS files
- `js/` — scripts (`script.js` tap support for the home boxes, `projects.js` + `projects-data.js` for the projects page)
- `images/` — site assets (photos, badges, illustrations)
- `images/projects/` — one image per project (referenced from `js/projects-data.js`)
- `images/readme/` — screenshots used by the README

A few CSS conventions used in `main.css`:
- Text gray is `rgb(95, 95, 95)`, titles are black
- Cards and boxes use 3-4px pastel borders with `border-radius: 15px`
- Hover effects use `transform` / `box-shadow` (nothing that shifts the layout)
- Responsive rules live in `@media` blocks — the blog ones must stay at the **end** of the file to win the cascade

---

## How to Contribute

### 1. Fork the repository
Use the **Fork** button on GitHub.

### 2. Clone your fork
```bash
git clone https://github.com/<your-username>/website-v2.git
cd website-v2
```

### 3. Create a new branch
Use a descriptive name:
```bash
git checkout -b fix/navbar-overflow-mobile
# or
git checkout -b docs/fix-readme-typo
# or
git checkout -b idea/guestbook-box
```

### 4. Make your changes
No build step needed — just open the `.html` files in your browser to test. Check your change at desktop width, tablet width (≤1024px) and phone width (≤600px).

### 5. Commit your changes
```bash
git add .
git commit -m "fix: keep newsletter cards aligned on tablet"
```

### 6. Push and open a Pull Request
```bash
git push origin fix/navbar-overflow-mobile
```
Then open a PR targeting the default branch.

---

## Submitting a Pull Request

To keep PRs easy to review:
- Keep PRs focused on a single topic.
- Include before/after screenshots for any visual change (desktop + mobile).
- Don't add frameworks, build tools or dependencies — the whole point of this site is that it's handmade.
- If you move or rename files, update the links in `README.md`.

---

## Reporting Issues

If you find a problem, open an issue and include:
- What you expected vs what happened
- The page where it happens
- Your browser and screen size (or device)
- A screenshot if it's visual

---

## Code of Conduct

Be respectful and constructive. Everyone is welcome regardless of skill level.
