const currentPage = document.body.dataset.page;
const navLinks = document.querySelectorAll(".site-nav a");

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
