const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');

function getTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function stripFirstH1(markdown) {
  return markdown.replace(/^#\s+.*\n+/, '');
}

function renderPostPage(title, html) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="../css/main.css" />
    <script src="../js/script.js" defer></script>
    <style>
      body {
        background: #fff;
        color: #111;
      }

      .article-shell {
        max-width: 820px;
        margin: 6rem auto 3rem;
        padding: 2.2rem 2rem 2.5rem;
        background: #fffdf9;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 18px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
      }

      .article-shell h1,
      .article-shell h2,
      .article-shell h3 {
        color: #111;
        line-height: 1.2;
      }

      .article-shell h1 {
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 1rem;
      }

      .article-shell h2 {
        font-size: clamp(1.4rem, 2.5vw, 2rem);
        margin-top: 2.2rem;
      }

      .article-shell h3 {
        font-size: 1.2rem;
        margin-top: 1.5rem;
      }

      .article-shell p,
      .article-shell li {
        font-size: 1.08rem;
        line-height: 1.8;
        color: #2f2f2f;
      }

      .article-shell ul,
      .article-shell ol {
        padding-left: 1.5rem;
      }

      .article-shell a {
        color: #0a5f8f;
        text-decoration: underline;
      }

      .article-shell strong {
        color: #111;
      }

      .article-shell .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #333;
        text-decoration: none;
        font-weight: 600;
      }

      @media screen and (max-width: 700px) {
        .article-shell {
          margin: 3.5rem 1rem 2rem;
          padding: 1.25rem 1rem 2rem;
        }
      }
    </style>
  </head>
  <body class="blog-page">
    <div id="header">
      <nav class="navbar">
        <ul>
          <li><a href="../index.html">Gabin</a></li>
          <li><a href="../projects.html">Projects</a></li>
          <li><a href="../photos.html">Photos</a></li>
          <li><a href="../role.html">Experience</a></li>
          <li><a href="../blog.html" class="active">Blog</a></li>
        </ul>
      </nav>
      <nav class="toggle-no-flower">
        <button id="ImgToggle" class="toggle-flower">
          <img src="../images/illustrations/no-flower.png" alt="no flower btn" />
        </button>
      </nav>
      <div class="btns">
        <a href="https://github.com/gabouin" class="github-link" target="_blank" rel="noopener noreferrer">Github</a>
        <a href="https://instagram.com/gabin.tvr_" class="instagram-link" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>

    <main class="article-shell">
      <a class="back-link" href="../blog.html">← Back to blog</a>
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
