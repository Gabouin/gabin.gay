let current=0;

const card = document.getElementById("project-card");
const img = document.getElementById("project-image");
const title = document.getElementById("project-title");
const desc = document.getElementById("project-description");
const demo = document.getElementById("demo-link");
const repo = document.getElementById("repo-link");
const page = document.getElementById("page-link");
const hackatime = document.getElementById("hackatime");
const dots = document.getElementById("dots");
const grid = document.getElementById("project-grid");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const HACKATIME_USER = "U0A2SJ7B739";

projects.forEach((p, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot'
    dot.setAttribute('aria-label', p.title);
    dot.addEventListener('click', () => showProject(i));
    dots.appendChild(dot);
});

function setLink(el, url) {
    if (url) {
        el.href = url;
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

function renderProject(p) {
    img.src = p.image;
    img.alt = p.title;
    title.textContent = p.title;
    desc.textContent = p.description;
    setLink(demo, p.demo);
    setLink(repo, p.repo);
    setLink(page, p.page);
    if (p.hackatime) {
        hackatime.style.display = '';
        hackatime.textContent = "Loading...";
        loadHackatime(p.hackatime)
            .then(t => hackatime.textContent = `Designed in ${t}`)
            .catch(() => hackatime.style.display = 'none');
    } else {
        hackatime.style.display = 'none';
    }
    dots.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

function updateNavState() {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

const imageCache = new Map();

// Resolves once the image is in the browser cache (or has failed, so we never hang).
function preloadImage(src) {
    if (!imageCache.has(src)) {
        imageCache.set(src, new Promise(resolve => {
            const im = new Image();
            im.onload = im.onerror = () => resolve();
            im.src = src;
        }));
    }
    return imageCache.get(src);
}

let showToken = 0;

function showProject(index) {
    const animating = typeof isCardAnimating !== 'undefined' && isCardAnimating;
    if (animating) return;

    const previousIndex = current;
    const targetIndex = (index + projects.length) % projects.length;
    const direction = targetIndex - previousIndex;
    const p = projects[targetIndex];
    const token = ++showToken;

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    preloadImage(p.image).then(() => {
        if (token !== showToken) return;
        current = targetIndex;
        swapCard(() => {
            renderProject(p);
            updateNavState();
        }, direction);
    });
}

prevBtn.addEventListener('click', () => showProject(current - 1));
nextBtn.addEventListener('click', () => showProject(current + 1));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showProject(current -1);
    if (e.key === 'ArrowRight') showProject(current +1);
});

updateNavState();



async function fetchSeconds(name) {
    const url = `https://hackatime.hackclub.com/api/v1/users/${HACKATIME_USER}/stats`
        + `?features=projects&filter_by_project=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    return json.data.total_seconds;
}

async function loadHackatime(names) {
    const results = await Promise.all(names.map(fetchSeconds));
    const s = results.reduce((a, b) => a + b, 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
}

renderProject(projects[current]);

// Warm the cache for the other projects once the page has loaded (heaviest last).
window.addEventListener('load', () => {
    projects.slice().sort((a, b) => (a.image.endsWith('.gif') ? 1 : 0) - (b.image.endsWith('.gif') ? 1 : 0))
        .forEach(p => preloadImage(p.image));
});


smallProjects.forEach(p => {
    const card = document.createElement("div");
    card.className = "small-card";

    card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p class="small-hackatime" style="display: none"></p>
        <div class="small-links"></div>
    `;

    if (p.hackatime) {
        const time = card.querySelector(".small-hackatime");
        time.style.display = '';
        time.textContent = "Loading...";
        loadHackatime(p.hackatime)
            .then(t => time.textContent = `Designed in  ${t}`)
            .catch(() => time.style.display = 'none');
    }

    const links = card.querySelector(".small-links");
    if (p.demo) links.insertAdjacentHTML("beforeend",
        `<a class="small-demo" href="${p.demo}" target="_blank" rel="noopener">Demo</a>`);
     if (p.repo) links.insertAdjacentHTML("beforeend",
        `<a class="small-repo" href="${p.repo}" target="_blank" rel="noopener">Repo</a>`);
    grid.appendChild(card);
    });
