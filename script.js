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
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
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

});
