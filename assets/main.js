const currentPage = document.body.dataset.page;
const navLinks = document.querySelectorAll(".site-nav a");
const BLOG_OWNER = "jiajun-shen";
const BLOG_REPO = "jiajun-shen.github.io";
const BLOG_API = `https://api.github.com/repos/${BLOG_OWNER}/${BLOG_REPO}`;

navLinks.forEach((link) => {
  const target = link.getAttribute("href");
  if (!target) return;

  if (
    (currentPage === "home" && target.endsWith("index.html")) ||
    (currentPage === "projects" && target.endsWith("projects.html")) ||
    (currentPage === "writing" && target.endsWith("writing.html")) ||
    (currentPage === "about" && target.endsWith("about.html"))
  ) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function formatDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripMarkdown(value = "") {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(issue) {
  const firstParagraph = (issue.body || "")
    .split(/\n\s*\n/)
    .map((block) => stripMarkdown(block))
    .find(Boolean);
  const source = firstParagraph || issue.body_text || stripMarkdown(issue.body || "");
  if (!source) return "这篇文章还没有正文预览，点进去继续阅读。";
  return source.length > 120 ? `${source.slice(0, 120)}...` : source;
}

function getVisibleIssues(issues) {
  return issues.filter((issue) => {
    if (issue.pull_request) return false;
    const labels = issue.labels.map((label) => label.name.toLowerCase());
    return !labels.includes("draft") && !labels.includes("hidden");
  });
}

function renderIssueLabels(labels = []) {
  const visibleLabels = labels.filter((label) => !["draft", "hidden"].includes(label.name.toLowerCase()));
  if (!visibleLabels.length) return "";

  return `
    <ul class="tag-list issue-labels" aria-label="文章标签">
      ${visibleLabels.map((label) => `<li>${escapeHtml(label.name)}</li>`).join("")}
    </ul>
  `;
}

async function fetchIssues() {
  const response = await fetch(`${BLOG_API}/issues?state=open&sort=created&direction=desc&per_page=30`, {
    headers: {
      Accept: "application/vnd.github.full+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  return response.json();
}

async function fetchIssue(number) {
  const response = await fetch(`${BLOG_API}/issues/${number}`, {
    headers: {
      Accept: "application/vnd.github.full+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  return response.json();
}

function renderIssueList(issues) {
  const container = document.querySelector("[data-issue-list]");
  if (!container) return;

  const visibleIssues = getVisibleIssues(issues);

  if (!visibleIssues.length) {
    container.innerHTML = `
      <article class="article-card empty-card">
        <span class="article-date">No posts yet</span>
        <h2>还没有通过 Issues 发布的文章</h2>
        <p>点击上面的“写一篇文章”，在 GitHub 里新建 issue。发布后，这里会自动出现文章卡片。</p>
      </article>
    `;
    return;
  }

  container.innerHTML = visibleIssues
    .map((issue, index) => `
      <a class="article-card ${index === 0 ? "featured" : ""}" href="article.html?number=${issue.number}">
        <span class="article-date">${formatDate(issue.created_at)}</span>
        <h2>${escapeHtml(issue.title)}</h2>
        <p>${escapeHtml(makeExcerpt(issue))}</p>
        ${renderIssueLabels(issue.labels)}
        <span class="text-link">阅读全文</span>
      </a>
    `)
    .join("");
}

function renderIssueError(container, message) {
  container.innerHTML = `
    <article class="article-card empty-card">
      <span class="article-date">Sync paused</span>
      <h2>暂时没有读取到文章</h2>
      <p>${escapeHtml(message)} 可以稍后刷新页面，或者直接去 GitHub Issues 检查文章是否发布。</p>
    </article>
  `;
}

async function initIssueList() {
  const container = document.querySelector("[data-issue-list]");
  if (!container) return;

  try {
    const issues = await fetchIssues();
    renderIssueList(issues);
  } catch (error) {
    renderIssueError(container, "GitHub API 读取失败。");
  }
}

async function initIssueArticle() {
  const article = document.querySelector("[data-issue-article]");
  if (!article) return;

  const params = new URLSearchParams(window.location.search);
  const number = params.get("number");

  if (!number) {
    article.innerHTML = `
      <p class="eyebrow">Missing issue</p>
      <h1>没有找到文章编号</h1>
      <p class="lead">请从文章列表进入一篇具体文章。</p>
    `;
    return;
  }

  try {
    const issue = await fetchIssue(number);
    document.title = `${issue.title} · 沈家骏 Jiajun Shen`;
    article.innerHTML = `
      <p class="eyebrow">Issue #${issue.number} · ${formatDate(issue.created_at)}</p>
      <h1>${escapeHtml(issue.title)}</h1>
      <div class="issue-body">${issue.body_html || `<p>${escapeHtml(issue.body || "这篇文章还没有正文。")}</p>`}</div>
      ${renderIssueLabels(issue.labels)}
      <p><a class="text-link" href="${issue.html_url}" target="_blank" rel="noreferrer">在 GitHub 上编辑这篇文章</a></p>
    `;
  } catch (error) {
    article.innerHTML = `
      <p class="eyebrow">Not found</p>
      <h1>暂时没有读取到这篇文章</h1>
      <p class="lead">可能是 issue 已关闭、编号不对，或者 GitHub API 暂时不可用。</p>
    `;
  }
}

initIssueList();
initIssueArticle();
