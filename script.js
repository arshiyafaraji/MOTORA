const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    nav.querySelectorAll("a").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});

const filters = document.querySelectorAll(".filter");
const bikes = document.querySelectorAll(".bike-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;

    bikes.forEach(bike => {
      const visible = category === "all" || bike.dataset.category === category;
      bike.classList.toggle("hide", !visible);
    });
  });
});

// Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const matchingLink = nav.querySelector(`a[href="#${entry.target.id}"]`);
    if (matchingLink) {
      nav.querySelectorAll("a").forEach(item => item.classList.remove("active"));
      matchingLink.classList.add("active");
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => observer.observe(section));
