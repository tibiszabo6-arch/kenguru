/**
 * Enhanced JavaScript for RV Rental Site with Hamburger Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // --- Hamburger Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu-button');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const closeButton = document.getElementById('close-menu-button');

    if (menuButton && sideMenu) {
        // Open menu when hamburger is clicked
        menuButton.addEventListener('click', () => {
            sideMenu.classList.remove('-translate-x-full'); // Changed to target left-hidden state
            sideMenu.classList.add('translate-x-0');
            overlay.classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Prevent scrolling when menu is open
            menuButton.setAttribute('aria-expanded', 'true');
        });

        // Close menu when overlay is clicked
        if (overlay) {
            overlay.addEventListener('click', () => {
                sideMenu.classList.remove('translate-x-0');
                sideMenu.classList.add('-translate-x-full'); // Changed to hide to the left
                overlay.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        }

        // Close menu when X button is clicked
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                sideMenu.classList.remove('translate-x-0');
                sideMenu.classList.add('-translate-x-full'); // Changed to hide to the left
                overlay.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        }
    } else {
        console.error("Menu elements not found");
    }

    // --- Footer Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    console.log("RV Rental Site Script Initialized with Hamburger Menu");
});