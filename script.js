    /**
     * Basic JavaScript for RV Rental Static Site
     */

    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM fully loaded and parsed"); // Debug log

        // --- Mobile Menu Toggle ---
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        console.log("Menu Button:", menuButton); // Debug log
        console.log("Mobile Menu:", mobileMenu); // Debug log

        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => {
                console.log("Menu button clicked"); // Debug log
                const isHidden = mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                // Toggle aria-expanded attribute for accessibility
                menuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
                console.log("Menu toggled, hidden:", !isHidden); // Debug log
            });
        } else {
            console.error("Mobile menu button or menu element not found.");
        }

        // --- Footer Copyright Year ---
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
            console.log("Copyright year updated."); // Debug log
        } else {
            console.error("Current year span not found.");
        }

        // --- Potential Future Enhancements ---
        // 1. Simple Image Gallery Interaction (e.g., click thumbnail to change main image)
        // 2. Contact Form AJAX Submission (example provided in contact.html comments)
        // 3. Smooth Scrolling for anchor links

        console.log("RV Rental Site Script Initialized.");
    });
    