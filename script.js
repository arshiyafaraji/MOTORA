/* ============================================================
   موتورسواری — script.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const toFa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  /* ============================================================
     1. PRELOADER + SPEEDOMETER
     ============================================================ */
  const preloader = $("#preloader");
  const speedoBar = $("#speedoBar");
  const preNum = $("#preNum");

  const RADIUS = 42;
  const CIRC = 2 * Math.PI * RADIUS;

  if (speedoBar) {
    speedoBar.style.strokeDasharray = CIRC;
    speedoBar.style.strokeDashoffset = CIRC;
  }

  let progress = 0;
  let finished = false;

  const finishPreloader = () => {
    if (finished) return;
    finished = true;
    preloader.classList.add("done");
    setTimeout(() => {
      preloader.style.display = "none";
      document.body.classList.remove("no-scroll");
    }, 750);
  };

  document.body.classList.add("no-scroll");

  const tick = setInterval(() => {
    progress += Math.random() * 9 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(finishPreloader, 420);
    }
    if (speedoBar) {
      speedoBar.style.strokeDashoffset = CIRC * (1 - progress / 100);
    }
    if (preNum) preNum.textContent = toFa(Math.floor(progress));
  }, 95);

  setTimeout(finishPreloader, 4500);
  window.addEventListener("load", () => setTimeout(finishPreloader, 1400));

  /* ============================================================
     2. CUSTOM CURSOR
     ============================================================ */
  const cursor = $("#cursor");
  const cursorDot = $("#cursorDot");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cursor && cursorDot && finePointer) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const renderCursor = () => {
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const hoverables = "a, button, .filter, .article-card, .bike-card, input";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
    });
  }

  /* ============================================================
     3. SCROLL PROGRESS BAR
     ============================================================ */
  const progressBar = $("#progressBar");
  const updateProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  };

  /* ============================================================
     4. HEADER STATE + TO-TOP BUTTON
     ============================================================ */
  const header = $("#header");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 30);
    if (toTop) toTop.classList.toggle("show", y > 550);
    updateProgress();
    updateActiveNav();
  };

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    }
  });

  /* ============================================================
     5. MOBILE MENU
     ============================================================ */
  const burger = $("#burger");
  const nav = $("#nav");

  const closeNav = () => {
    if (!nav || !burger) return;
    nav.classList.remove("open");
    burger.classList.remove("open");
    document.body.classList.remove("no-scroll");
  };

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      document.body.classList.toggle("no-scroll", isOpen);
    });

    $$(".nav__link", nav).forEach((link) =>
      link.addEventListener("click", closeNav)
    );

    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ============================================================
     6. REVEAL ON SCROLL
     ============================================================ */
  const revealEls = $$("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = i * 90 + "ms";
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  setTimeout(() => {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }, 3000);

  /* ============================================================
     7. ANIMATED COUNTERS
     ============================================================ */
  const counters = $$("[data-count]");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1700;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString("fa-IR");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => {
      c.textContent = (parseInt(c.dataset.count, 10) || 0).toLocaleString("fa-IR");
    });
  }

  /* ============================================================
     8. 3D TILT ON CARDS
     ============================================================ */
  if (finePointer) {
    $$("[data-tilt]").forEach((card) => {
      const MAX = 8;

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(1000px) rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ============================================================
     9. HERO CARD PARALLAX
     ============================================================ */
  const heroCard = $("#heroCard");

  if (heroCard && finePointer) {
    const hero = $(".hero");

    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroCard.style.transform =
        `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateZ(0)`;
    });

    hero.addEventListener("mouseleave", () => {
      heroCard.style.transform = "rotateY(0) rotateX(0)";
    });
  }

  /* ============================================================
     10. MAGNETIC BUTTONS
     ============================================================ */
  if (finePointer) {
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ============================================================
     11. SHOP FILTERS
     ============================================================ */
  const filterBtns = $$(".filter");
  const bikeCards = $$(".bike-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      bikeCards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.classList.remove("card-in");

        if (match) {
          card.classList.remove("filtered-out");
          void card.offsetWidth;
          card.classList.add("card-in");
        } else {
          card.classList.add("filtered-out");
        }
      });
    });
  });

  /* ============================================================
     12. SCROLL-SPY NAV
     ============================================================ */
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? $(id) : null;
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (!sections.length) return;
    const pos = window.scrollY + window.innerHeight * 0.32;
    let currentId = sections[0].id;

    sections.forEach((sec) => {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentId
      );
    });
  }

  /* ============================================================
     13. SMOOTH ANCHOR SCROLL
     ============================================================ */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 14;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ============================================================
     14. INIT
     ============================================================ */
  onScroll();
  updateProgress();
})();
