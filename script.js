/**
 * Enhanced JavaScript for RV Rental Site with Hamburger Menu and Welcome Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    
    // Wait for i18n to be initialized before showing welcome animation
    // This ensures the animation doesn't start before translations are loaded
    if (typeof i18n !== 'undefined') {
        i18n.onLanguageChange(() => {
            // Re-apply any dynamic content that might need translation
            console.log("Language changed, updating dynamic content");
        });

    // --- Welcome Logo Animation ---
    const showWelcomeAnimation = () => {
        // Check if this is the first visit
        const hasVisitedBefore = localStorage.getItem('hasVisitedKenguru');
        
        if (!hasVisitedBefore) {
            // Get the logo source
            const headerLogo = document.querySelector('header a[href="index.html"] img');
            
            if (headerLogo) {
                const logoSrc = headerLogo.src;
                const logoAlt = headerLogo.alt || 'Viac Ako Štandard Logo';
                
                // Create welcome overlay
                const welcomeOverlay = document.createElement('div');
                welcomeOverlay.classList.add('welcome-overlay');
                welcomeOverlay.style.position = 'fixed';
                welcomeOverlay.style.top = '0';
                welcomeOverlay.style.left = '0';
                welcomeOverlay.style.width = '100%';
                welcomeOverlay.style.height = '100%';
                welcomeOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                welcomeOverlay.style.display = 'flex';
                welcomeOverlay.style.justifyContent = 'center';
                welcomeOverlay.style.alignItems = 'center';
                welcomeOverlay.style.zIndex = '9999';
                welcomeOverlay.style.opacity = '0';
                welcomeOverlay.style.transition = 'opacity 0.5s ease-in-out';
                
                // Create welcome logo
                const welcomeLogo = document.createElement('img');
                welcomeLogo.src = logoSrc;
                welcomeLogo.alt = logoAlt;
                welcomeLogo.style.maxWidth = '300px';
                welcomeLogo.style.transform = 'scale(1.2)';
                welcomeLogo.style.transition = 'transform 1.2s ease-in-out';
                
                // Add logo to overlay
                welcomeOverlay.appendChild(welcomeLogo);
                document.body.appendChild(welcomeOverlay);
                
                // Fade in animation
                setTimeout(() => {
                    welcomeOverlay.style.opacity = '1';
                }, 100);
                
                // Begin animation sequence after a short delay
                setTimeout(() => {
                    // Get the header logo position for the animation target
                    const headerLogoRect = headerLogo.getBoundingClientRect();
                    const overlayRect = welcomeOverlay.getBoundingClientRect();
                    
                    // Calculate position to move to
                    const moveX = headerLogoRect.left + (headerLogoRect.width / 2) - (overlayRect.width / 2);
                    const moveY = headerLogoRect.top + (headerLogoRect.height / 2) - (overlayRect.height / 2);
                    
                    // Calculate scale to match header logo size
                    const scaleFactor = headerLogoRect.width / welcomeLogo.offsetWidth;
                    
                    // Apply the animation
                    welcomeLogo.style.transform = `scale(${scaleFactor}) translate(${moveX / scaleFactor}px, ${moveY / scaleFactor}px)`;
                    welcomeOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    
                    // Remove overlay after animation completes
                    setTimeout(() => {
                        welcomeOverlay.remove();
                        // Set flag in localStorage so animation doesn't play again
                        localStorage.setItem('hasVisitedKenguru', 'true');
                    }, 1200);
                }, 5000); // Show logo centered for 3.8 seconds before moving (total 5 seconds)
            }
        }
    };
    
    // Only run the welcome animation if we're on the home page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        showWelcomeAnimation();
    }

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

    console.log("RV Rental Site Script Initialized with Hamburger Menu and Welcome Animation");
    }
});