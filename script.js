/**
 * High-End Modern Portfolio
 * JS Logic - Features:
 * 1. Dark/Light Theme Toggle (with localStorage persistence)
 * 2. Intersection Observer (Scroll Reveal Animations)
 * 3. Smooth Scrolling & Active Nav Link Highlighting
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== THEME TOGGLE LOGIC ===== */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Check for saved user preference, or default to dark mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        htmlElement.setAttribute("data-theme", savedTheme);
    } else {
        htmlElement.setAttribute("data-theme", "dark");
    }

    // Toggle theme on click
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        
        // Sync particle background colors if particles are running
        if (typeof updateParticleColors === 'function') {
            updateParticleColors(newTheme);
        }
    });

    /* ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===== */
    const revealElements = document.querySelectorAll(".reveal");

    // Configure the observer
    const revealOptions = {
        threshold: 0.15,      // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset to wait before triggering
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Do nothing if not on screen
            } else {
                // Add the smooth animation class
                entry.target.classList.add("active");
                // Stop observing once animated to keep performance clean
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Attach observer to all target elements
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* ===== SMOOTH SCROLLING FOR NAVIGATION ===== */
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            // Only use smooth scroll for internal anchors starting with '#'
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    /* ===== ACTIVE NAVBAR HIGHLIGHTING ===== */
    const sections = document.querySelectorAll(".section");

    window.addEventListener("scroll", () => {
        let current = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Detect which section is currently centered on screen
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    /* ===== DYNAMIC PROJECT ROUTING & RENDERING ===== */
    
    // 1. Save title and description before navigating
    const projectLinks = document.querySelectorAll(".project-link");
    projectLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            // If the link goes to our dynamic project.html
            if (href && href.startsWith("project.html")) {
                const card = this.closest(".project-card");
                if (card) {
                    const title = card.querySelector(".project-title").innerText;
                    const desc = card.querySelector(".project-desc").innerText;
                    localStorage.setItem("currentProjectTitle", title);
                    localStorage.setItem("currentProjectDesc", desc);
                }
            }
        });
    });

    // 2. Render content if we are on project.html
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId && document.getElementById("dynamic-title")) {
        // Read text from local storage
        const title = localStorage.getItem("currentProjectTitle");
        const desc = localStorage.getItem("currentProjectDesc");
        
        if (title) {
            document.getElementById("dynamic-title").innerText = title;
            document.title = "Youssef_El-Neel - " + title;

            // Set WhatsApp link dynamically
            const waFab = document.getElementById("whatsapp-fab");
            if (waFab) {
                const waNumber = "201552688221";
                const message = `أهلاً يوسف، أنا مهتم بطلب عمل مشروع مماثل لمشروع ${title}`;
                waFab.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
            }
        }
        if (desc) {
            document.getElementById("dynamic-desc").innerText = desc;
        }

        // Load images from projects-data.js (if available)
        if (typeof projectsData !== 'undefined' && projectsData[projectId]) {
            const projectData = projectsData[projectId];
            const gallery = document.getElementById("dynamic-gallery");
            
            // Clear loading state or previous content
            gallery.innerHTML = "";
            
            if (projectData.images && projectData.images.length > 0) {
                projectData.images.forEach(imgSrc => {
                    const img = document.createElement("img");
                    img.src = imgSrc;
                    img.alt = (title || "Project") + " Screenshot";
                    img.className = "gallery-image";
                    
                    // Handle broken images gracefully
                    img.onerror = function() {
                        const fallbackDiv = document.createElement("div");
                        fallbackDiv.className = "gallery-image image-placeholder-fallback";
                        fallbackDiv.innerHTML = `<span><i class="fa-solid fa-image-slash" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><br>Image could not be loaded</span>`;
                        this.replaceWith(fallbackDiv);
                    };

                    gallery.appendChild(img);
                });
            }
        }
    }

});
