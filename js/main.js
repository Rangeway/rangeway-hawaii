// Rangeway Hawaiʻi Island. Minimal progressive enhancement.
(function () {
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector("[data-toggle]");
  var mobile = document.querySelector("[data-mobile]");
  var lastFocused = null;

  if (toggle && mobile) {
    var setOpen = function (open) {
      mobile.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);

      if (open) {
        lastFocused = document.activeElement;
        var firstLink = mobile.querySelector("a");
        if (firstLink) {
          firstLink.focus();
        }
      } else if (lastFocused) {
        lastFocused.focus();
      }
    };

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(mobile.hidden);
    });

    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobile.hidden) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920 && !mobile.hidden) {
        setOpen(false);
      }
    });
  }

  var reveal = document.querySelectorAll(".reveal");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveal.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
    );

    reveal.forEach(function (element) {
      observer.observe(element);
    });
  }
})();
