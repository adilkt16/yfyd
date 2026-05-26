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

  const testimonialListRoot = q("[data-testimonial-list]");
  if (testimonialListRoot) {
    const testimonials = [
      {
        photo: "assets/events/vinod-kannan.jpeg",
        name: "Mr. Vinod Kannan",
        designation: "Former CEO - Vistara Airlines<br>Senior Vice President - Singapore Airlines",
        feedback:
          "\"It was a great experience interacting with such an enthusiastic and driven community. YFYD is doing an excellent job in empowering students. This is a great initiative and we have to keep this going.\"",
      },
      {
        photo: "assets/events/ap.jpeg",
        name: "ABULLAKUTTY A P",
        designation: "President, Calicut Chamber of Commerce & Industry",
        feedback:
          "\"Best wishes to the team Youth For youth Development for creating a powerful platform where young people can grow as leaders and connect with each other. Your efforts are truly shaping the future by building confidence, collaboration, and vision among youth. Keep inspiring and empowering.\"",
      },
      {
        photo: "assets/events/Arjun-Mohan.png",
        name: "Mr. Arjun Mohan",
        designation: "Former CEO of BYJU'S and UpGrad",
        feedback:
          "\"Excellent Initiative, Hopefully, this community grows beyond Kerala - across South India, all of India, and even Southeast Asia\"",
      },
    ];

    const cardsPerPage = 3;
    const pageCount = Math.ceil(testimonials.length / cardsPerPage);
    const prevButton = q("[data-testimonial-prev]");
    const nextButton = q("[data-testimonial-next]");
    const controls = q("[data-testimonial-controls]");

    let pageIndex = 0;

    const buildCardMarkup = (testimonial) => {
      return `
        <article class="testimonial-card">
          <img class="testimonial-photo" src="${testimonial.photo}" alt="${testimonial.name}" loading="lazy" />
          <div>
            <p class="badge">Industry Feedback</p>
            <blockquote class="testimonial-feedback">${testimonial.feedback}</blockquote>
            <p class="testimonial-name">${testimonial.name}</p>
            <p class="testimonial-designation">${testimonial.designation}</p>
          </div>
        </article>
      `;
    };

    const renderTestimonials = () => {
      const start = pageIndex * cardsPerPage;
      const visibleTestimonials = testimonials.slice(start, start + cardsPerPage);
      testimonialListRoot.innerHTML = visibleTestimonials.map(buildCardMarkup).join("");

      if (prevButton) {
        prevButton.disabled = pageIndex === 0;
      }
      if (nextButton) {
        nextButton.disabled = pageIndex >= pageCount - 1;
      }
    };

    if (controls) {
      controls.hidden = testimonials.length <= cardsPerPage;
    }

    if (prevButton && testimonials.length > cardsPerPage) {
      prevButton.addEventListener("click", () => {
        pageIndex = Math.max(0, pageIndex - 1);
        renderTestimonials();
      });
    }

    if (nextButton && testimonials.length > cardsPerPage) {
      nextButton.addEventListener("click", () => {
        pageIndex = Math.min(pageCount - 1, pageIndex + 1);
        renderTestimonials();
      });
    }

    renderTestimonials();
  }

  const joinFunnel = q("[data-join-funnel]");
  if (joinFunnel) {
    const indicators = qa("[data-step-indicator]", joinFunnel);
    const panels = qa("[data-funnel-step]", joinFunnel);
    const nextButtons = qa("[data-funnel-next]", joinFunnel);
    const prevButtons = qa("[data-funnel-prev]", joinFunnel);
    const conductAck = q("#conduct-ack", joinFunnel);
    const proceedToApplication = q("#proceed-to-application", joinFunnel);

    const setStep = (step) => {
      indicators.forEach((indicator) => {
        const isCurrent = Number(indicator.getAttribute("data-step-indicator")) === step;
        indicator.classList.toggle("is-active", isCurrent);
      });

      panels.forEach((panel) => {
        const isCurrent = Number(panel.getAttribute("data-funnel-step")) === step;
        panel.classList.toggle("is-active", isCurrent);
      });
    };

    indicators.forEach((indicator) => {
      indicator.addEventListener("click", () => {
        const targetStep = Number(indicator.getAttribute("data-step-indicator"));
        if (targetStep) {
          setStep(targetStep);
        }
      });
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetStep = Number(button.getAttribute("data-funnel-next"));
        if (targetStep) {
          setStep(targetStep);
        }
      });
    });

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetStep = Number(button.getAttribute("data-funnel-prev"));
        if (targetStep) {
          setStep(targetStep);
        }
      });
    });

    if (conductAck && proceedToApplication) {
      const updateProceedState = () => {
        proceedToApplication.disabled = !conductAck.checked;
      };

      conductAck.addEventListener("change", updateProceedState);
      proceedToApplication.addEventListener("click", () => {
        if (!conductAck.checked) {
          return;
        }
        setStep(4);
      });

      updateProceedState();
    }

    setStep(1);
  }
})();
