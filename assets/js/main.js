(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(isotopeItem.querySelector(".isotope-container"), {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
      });
    });

    isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (filters) {
      filters.addEventListener(
        "click",
        function () {
          isotopeItem
            .querySelector(".isotope-filters .filter-active")
            .classList.remove("filter-active");
          this.classList.add("filter-active");
          initIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          if (typeof aosInit === "function") {
            aosInit();
          }
        },
        false
      );
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /**
   * Comment Form Submission
   */
  document.getElementById("opinionForm")?.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    const username = document.getElementById("username").value;
    const opinion = document.getElementById("opinion").value;
    const timestamp = new Date().toLocaleString();

    // Create a new comment object
    const newComment = {
      username: username,
      opinion: opinion,
      timestamp: timestamp,
    };

    // Save the new comment to local storage
    saveCommentToLocalStorage(newComment);

    // Add the new comment to the comments list
    addCommentToDOM(newComment);

    // Clear the form fields
    document.getElementById("username").value = "";
    document.getElementById("opinion").value = "";
  });

  /**
   * Save a comment to local storage
   */
  function saveCommentToLocalStorage(comment) {
    // Get existing comments from local storage
    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Add the new comment to the list
    comments.push(comment);

    // Save the updated list back to local storage
    localStorage.setItem("comments", JSON.stringify(comments));
  }

  /**
   * Load comments from local storage and display them
   */
  function loadCommentsFromLocalStorage() {
    // Get comments from local storage
    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Add each comment to the DOM
    comments.forEach((comment) => {
      addCommentToDOM(comment);
    });
  }

  /**
   * Add a comment to the DOM
   */
  function addCommentToDOM(comment) {
    const commentElement = document.createElement("li");
    commentElement.classList.add("opinion-item");
    commentElement.innerHTML = `
      <strong>${comment.username}</strong>
      <p>${comment.opinion}</p>
      <small>${comment.timestamp}</small>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    `;

    // Add event listener to the delete button
    commentElement.querySelector(".delete-btn").addEventListener("click", function () {
      deleteCommentFromLocalStorage(comment);
      commentElement.remove();
    });

    // Add the new comment to the comments list
    document.getElementById("opinionsList").appendChild(commentElement);
  }

  /**
   * Delete a comment from local storage
   */
  function deleteCommentFromLocalStorage(comment) {
    // Get existing comments from local storage
    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Filter out the comment to delete
    const updatedComments = comments.filter(
      (c) =>
        c.username !== comment.username ||
        c.opinion !== comment.opinion ||
        c.timestamp !== comment.timestamp
    );

    // Save the updated list back to local storage
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  }

  // Load comments when the page loads
  window.addEventListener("load", loadCommentsFromLocalStorage);
})();