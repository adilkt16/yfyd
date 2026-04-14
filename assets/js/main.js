(function () {
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const year = q("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const body = document.body;
  const currentPage = body.getAttribute("data-page");
  if (currentPage) {
    qa("[data-page-link]").forEach((link) => {
      const isActive = link.getAttribute("data-page-link") === currentPage;
      if (isActive) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  const navToggle = q(".nav-toggle");
  const siteNav = q("#site-nav");
  if (navToggle && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const willOpen = !siteNav.classList.contains("open");
      siteNav.classList.toggle("open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });

    siteNav.addEventListener("click", (event) => {
      const targetLink = event.target.closest("a");
      if (!targetLink) {
        return;
      }
      if (window.matchMedia("(max-width: 1080px)").matches) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!siteNav.classList.contains("open")) {
        return;
      }
      const clickedInside = siteNav.contains(event.target) || navToggle.contains(event.target);
      if (!clickedInside) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) {
        closeMenu();
      }
    });
  }

  qa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href").slice(1);
      if (!targetId) {
        return;
      }

      const target = q(`#${CSS.escape(targetId)}`);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  const revealElements = qa("[data-reveal]");
  if (revealElements.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );

      revealElements.forEach((element) => observer.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }
  }

  qa(".join-form").forEach((form) => {
    const feedback = q(".form-feedback", form);

    const setFieldError = (field, message) => {
      const errorNode = q(`[data-error-for='${field.id}']`, form);
      if (errorNode) {
        errorNode.textContent = message || "";
      }
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let valid = true;
      const requiredFields = qa("[required]", form);

      requiredFields.forEach((field) => {
        const value = field.value.trim();
        let message = "";

        if (!value) {
          message = "This field is required.";
        } else if (field.type === "email") {
          const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!emailOk) {
            message = "Enter a valid email address.";
          }
        }

        setFieldError(field, message);
        if (message) {
          valid = false;
        }
      });

      if (!valid) {
        if (feedback) {
          feedback.style.color = "#b13b3b";
          feedback.textContent = "Please complete the highlighted fields.";
        }
        return;
      }

      if (feedback) {
        feedback.style.color = "#2e6f4f";
        feedback.textContent = "Thank you. Your request has been recorded. Our team will connect with you shortly.";
      }
      form.reset();
    });
  });
})();
