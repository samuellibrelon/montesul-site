const backToTopButton = document.getElementById("backToTop");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const revealElements = document.querySelectorAll(
  ".hero-section .row > div, .section-title, .section-subtitle, .info-box, " +
    ".service-card, .impact-card, .support-box, .partners-box, .contact-card, .map-box",
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  revealElements.forEach((element) => {
    const column = element.parentElement;
    const position = column
      ? Array.from(column.parentElement.children).indexOf(column)
      : 0;

    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", `${Math.max(position, 0) * 90}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);

        entry.target.addEventListener(
          "transitionend",
          () => {
            entry.target.classList.remove("reveal-item", "is-visible");
            entry.target.style.removeProperty("--reveal-delay");
          },
          { once: true },
        );
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -45px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const navigationLinks = document.querySelectorAll('.nav-link[href^="#"]');
const observedSections = Array.from(navigationLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navigationLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);

          if (isActive) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );

  observedSections.forEach((section) => navigationObserver.observe(section));
}
