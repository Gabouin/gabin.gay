const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'pages', 'posts');

function getTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function stripFirstH1(markdown) {
  return markdown.replace(/^#\s+.*\n+/, '');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPostPage(title, html) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="../../css/main.css" />
    <script src="../../js/script.js" defer></script>
    <style>
      :root {
        --blue: #cfe8f7;
        --pink: #fbd5e5;
        --yellow: #fdf1b8;
        --lilac: #e4d9f7;
        --ink: #1f1d24;
        --ink-soft: #3a3841;
        --muted: #7b7884;
        --line: #1f1d24;
      }

      body {
        background: #fff;
        color: var(--ink);
      }

      ::selection {
        background: var(--pink);
      }

      .article-shell {
        max-width: 80%;
        margin: 6rem auto 4rem;
        padding: 2.4rem 2.4rem 3rem;
        background: #fffdf9;
        border: 2px solid var(--line);
        border-radius: 22px;
        box-shadow: 8px 8px 0 var(--pink);
      }

      /* Back link : pastille pastel */
      .article-shell .back-link {
        display: inline-block;
        margin-bottom: 1.6rem;
        padding: 0.3rem 0.9rem;
        background: var(--blue);
        color: var(--ink);
        border: 2px solid var(--line);
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.15s ease, background 0.15s ease;
      }

      .article-shell .back-link:hover {
        background: var(--yellow);
        transform: translate(-3px, -2px) rotate(-2deg);
      }

      /* Titres */
      .article-shell h1,
      .article-shell h2,
      .article-shell h3 {
        color: var(--ink);
        line-height: 1.2;
      }

      .article-shell h1 {
        font-size: clamp(2rem, 4.5vw, 3rem);
        margin: 0 0 0.8rem;
        text-decoration: underline wavy var(--pink);
        text-decoration-thickness: 5px;
        text-underline-offset: 10px;
      }

      .article-shell h1 + p > em:only-child {
        color: var(--muted);
      }

      .article-shell h2 {
        display: inline-block;
        font-size: clamp(1.4rem, 2.6vw, 1.9rem);
        margin: 2.6rem 0 0.9rem;
        text-decoration: underline wavy var(--blue);
        text-decoration-thickness: 4px;
        text-underline-offset: 8px;
      }

      .article-shell h3 {
        font-size: 1.2rem;
        margin: 1.8rem 0 0.5rem;
        text-decoration: underline wavy var(--yellow);
        text-decoration-thickness: 3px;
        text-underline-offset: 6px;
      }

      /* Texte */
      .article-shell p,
      .article-shell li {
        font-size: 1.08rem;
        line-height: 1.8;
        color: var(--ink-soft);
      }

      .article-shell p {
        margin: 0 0 1.2rem;
      }

      .article-shell ul,
      .article-shell ol {
        padding-left: 1.5rem;
        margin: 0 0 1.4rem;
      }

      .article-shell li::marker {
        color: #e88bb4;
      }

      .article-shell li + li {
        margin-top: 0.3rem;
      }

      .article-shell strong {
        color: var(--ink);
        background: linear-gradient(transparent 60%, var(--yellow) 60%);
      }

      /* Liens : soulignement ondulé */
      .article-shell a:not(.back-link) {
        color: var(--ink);
        text-decoration: underline wavy #6bb6e6;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
        transition: background 0.15s ease;
      }

      .article-shell a:not(.back-link):hover {
        background: var(--blue);
      }

      /* Citations : encadré jaune */
      .article-shell blockquote {
        margin: 1.8rem 0;
        padding: 0.9rem 1.2rem;
        background: var(--yellow);
        border: 2px solid var(--line);
        border-radius: 16px;
        box-shadow: 5px 5px 0 var(--lilac);
      }

      .article-shell blockquote p {
        margin: 0;
      }

      /* Code */
      .article-shell code {
        padding: 0.12em 0.4em;
        background: var(--lilac);
        border-radius: 6px;
        font-size: 0.92em;
      }

      .article-shell pre {
        margin: 1.6rem 0;
        padding: 1.1rem 1.2rem;
        background: #1f1d24;
        color: #f3f0f7;
        border: 2px solid var(--line);
        border-radius: 16px;
        box-shadow: 5px 5px 0 var(--blue);
        overflow-x: auto;
        line-height: 1.6;
      }

      .article-shell pre code {
        padding: 0;
        background: none;
        color: inherit;
        font-size: 0.95rem;
      }

      /* Images : style polaroid */
      .article-shell img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 2rem auto;
        border: 2px solid var(--line);
        border-radius: 14px;
        box-shadow: 6px 6px 0 var(--pink);
        transition: transform 0.2s ease;
      }

      .article-shell img:hover {
        transform: rotate(-1deg) scale(1.01);
      }

      /* Tableaux */
      .article-shell table {
        width: 100%;
        margin: 1.6rem 0;
        border-collapse: separate;
        border-spacing: 0;
        border: 2px solid var(--line);
        border-radius: 14px;
        overflow: hidden;
      }

      .article-shell th,
      .article-shell td {
        padding: 0.6rem 0.9rem;
        border-bottom: 1px solid rgba(31, 29, 36, 0.15);
        text-align: left;
      }

      .article-shell th {
        background: var(--blue);
      }

      .article-shell tr:last-child td {
        border-bottom: none;
      }

      /* Séparateur : fleurs */
      .article-shell hr {
        border: none;
        margin: 2.6rem 0;
        text-align: center;
        height: 1.5rem;
      }

      .article-shell hr::after {
        content: "✿  ✿  ✿";
        color: #e88bb4;
        letter-spacing: 0.4em;
        font-size: 1.2rem;
      }

      @media screen and (max-width: 700px) {
        .article-shell {
          margin: 3.5rem 0.8rem 2rem;
          padding: 1.3rem 1.1rem 2rem;
          border-radius: 16px;
          box-shadow: 5px 5px 0 var(--pink);
        }

        .article-shell p,
        .article-shell li {
          font-size: 1.02rem;
        }
      }
    </style>
  </head>
  <body class="blog-page">
    <div id="header">
      <nav class="navbar">
        <ul>
          <li><a href="../../index.html">Gabin</a></li>
          <li><a href="../projects.html">Projects</a></li>
          <li><a href="../photos.html">Photos</a></li>
          <li><a href="../role.html">Experience</a></li>
          <li><a href="../blog.html" class="active">Blog</a></li>
        </ul>
      </nav>
      <nav class="toggle-no-flower">
        <button id="ImgToggle" class="toggle-flower">
          <img src="../../images/illustrations/no-flower.png" alt="no flower btn" />
        </button>
      </nav>
      <div class="btns">
        <a href="https://github.com/gabouin" class="github-link" target="_blank" rel="noopener noreferrer">Github</a>
        <a href="https://instagram.com/gabin.tvr_" class="instagram-link" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>

    <main class="article-shell">
      <a class="back-link" href="../blog.html">← Back to blog</a>
      <h1>${escapeHtml(title)}</h1>
      ${html}
    </main>
  </body>
</html>`;
}

const files = fs.readdirSync(postsDir)
  .filter((file) => file.endsWith('.md'))
  .sort();

for (const file of files) {
  const sourcePath = path.join(postsDir, file);
  const markdown = fs.readFileSync(sourcePath, 'utf8');
  const title = getTitle(markdown, file.replace(/\.md$/, ''));
  const body = stripFirstH1(markdown);
  const html = marked.parse(body, {
    breaks: true,
    gfm: true,
  });
  const outputPath = path.join(postsDir, file.replace(/\.md$/, '.html'));
  const finalHtml = renderPostPage(title, html);
  fs.writeFileSync(outputPath, finalHtml, 'utf8');
  console.log(`Generated ${path.relative(rootDir, outputPath)}`);
}

console.log(`Done. Generated ${files.length} article(s).`);
