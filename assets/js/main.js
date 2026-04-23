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

  const testimonialRoot = q("[data-testimonial]");
  if (testimonialRoot) {
    const testimonials = [
      {
        photo: "assets/events/vinod-kannan.jpeg",
        name: "Mr. Vinod Kannan",
        designation: "Former CEO - Vistara Airlines<br>Senior Vice President - Singapore Airlines",
        feedback:
          "\"It was a great experience interacting with such an enthusiastic and driven community. YFYD is doing an excellent job in empowering students. This is a great initiative and we have to keep this going.\"",
      },
    ];

    const photoNode = q("[data-testimonial-photo]", testimonialRoot);
    const feedbackNode = q("[data-testimonial-feedback]", testimonialRoot);
    const nameNode = q("[data-testimonial-name]", testimonialRoot);
    const designationNode = q("[data-testimonial-designation]", testimonialRoot);
    const prevButton = q("[data-testimonial-prev]");
    const nextButton = q("[data-testimonial-next]");

    let index = 0;

    const renderTestimonial = () => {
      const current = testimonials[index];
      if (!current) {
        return;
      }
      if (photoNode) {
        photoNode.src = current.photo;
        photoNode.alt = current.name;
      }
      if (feedbackNode) {
        feedbackNode.textContent = current.feedback;
      }
      if (nameNode) {
        nameNode.textContent = current.name;
      }
      if (designationNode) {
        designationNode.innerHTML = current.designation;
      }
    };

    if (prevButton) {
      prevButton.disabled = testimonials.length < 2;
      prevButton.addEventListener("click", () => {
        index = (index - 1 + testimonials.length) % testimonials.length;
        renderTestimonial();
      });
    }

    if (nextButton) {
      nextButton.disabled = testimonials.length < 2;
      nextButton.addEventListener("click", () => {
        index = (index + 1) % testimonials.length;
        renderTestimonial();
      });
    }

    renderTestimonial();
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
