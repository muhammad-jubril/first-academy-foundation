(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var closeMenu = document.getElementById("close-menu");
  var navLinks = document.getElementById("nav-links");
  var navOverlay = document.getElementById("nav-overlay");

  function openNav() {
    navLinks.classList.add("is-open");
    navOverlay.classList.add("is-visible");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    navLinks.classList.remove("is-open");
    navOverlay.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuToggle && navLinks && navOverlay) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.contains("is-open") ? closeNav() : openNav();
    });
    closeMenu && closeMenu.addEventListener("click", closeNav);
    navOverlay.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.innerWidth < 768) closeNav();
      });
    });
  }

  /* Mobile dropdown toggle (Academics) — tap to expand on small screens */
  var dropdownParent = document.querySelector(".has-dropdown");
  if (dropdownParent) {
    var dropdownLink = dropdownParent.querySelector(":scope > a");
    dropdownLink && dropdownLink.addEventListener("click", function (e) {
      if (window.innerWidth < 768) {
        e.preventDefault();
        dropdownParent.classList.toggle("is-open");
      }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 10) header.style.boxShadow = "0 8px 26px rgba(15,36,20,.12)";
    else header.style.boxShadow = "";
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if (window.IntersectionObserver && revealEls.length && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- In-page anchor highlighting ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-link, .dropdown a");
  if (window.IntersectionObserver && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            var href = a.getAttribute("href") || "";
            if (href.indexOf("#" + id) !== -1) a.classList.add("is-active");
            else if (href.indexOf("#") !== -1) a.classList.remove("is-active");
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 1300;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if (window.IntersectionObserver && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-target"); });
  }

  /* ---------- FAQ accordion ---------- */
  var triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(function (trigger) {
    var panel = trigger.nextElementSibling;
    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach(function (t) {
        t.setAttribute("aria-expanded", "false");
        t.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, caption) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      openLightbox(item.getAttribute("data-full"), item.getAttribute("data-caption"));
    });
  });
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox && lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("back-to-top");
  function onScrollTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }
  document.addEventListener("scroll", onScrollTop, { passive: true });
  backToTop && backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  function setError(fieldName, message) {
    var input = form.querySelector("[name='" + fieldName + "']");
    var errorEl = form.querySelector(".form-error[data-for='" + fieldName + "']");
    var row = input ? input.closest(".form-row") : null;
    if (row) row.classList.toggle("has-error", !!message);
    if (errorEl) errorEl.textContent = message || "";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var valid = true;

      if (!name) { setError("name", "Please enter your name."); valid = false; }
      else setError("name", "");

      if (!email || !emailPattern.test(email)) { setError("email", "Please enter a valid email."); valid = false; }
      else setError("email", "");

      if (!message) { setError("message", "Please add a short message."); valid = false; }
      else setError("message", "");

      if (!valid) {
        status.textContent = "";
        return;
      }

      status.textContent = "Thanks, " + name.split(" ")[0] + " — your message is ready to send once a backend is connected.";
      form.reset();
    });
  }

  /* ---------- Newsletter form (client-side only placeholder) ---------- */
  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msgEl = newsletterForm.querySelector(".newsletter-status");
      if (msgEl) msgEl.textContent = "Thanks for subscribing! (connect an email service to activate this)";
      newsletterForm.reset();
    });
  }

})();
