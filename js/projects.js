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
            .then(t => hackatime.textContent = `${t} on Hackatime`)
            .catch(() => hackatime.style.display = 'none');
    } else {
        hackatime.style.display = 'none';
    }
    dots.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

function showProject(index) {
    const direction = index - current;
    current = (index + projects.length) % projects.length;
    const p = projects[current];
    swapCard(() => renderProject(p), direction);
}

document.getElementById("prev").addEventListener('click', () => showProject(current - 1));
document.getElementById("next").addEventListener('click', () => showProject(current + 1));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showProject(current -1);
    if (e.key === 'ArrowRight') showProject(current +1);
});


const HACKATIME_USER = "U0A2SJ7B739";

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

document.getElementById("scrollBtn").addEventListener("click", () => {
  document.getElementById("project-grid").scrollIntoView({ behavior: "smooth" });
});
