/**
 * GDPR-compliant Local Storage Notice
 * Minimal implementation for informing users about local storage usage
 */

class StorageNotice {
    constructor() {
        this.storageKey = 'storageConsentAccepted';
        this.noticeId = 'storage-notice';
        this.noticeShown = false;
    }

    init() {
        // Check if user has already accepted
        if (this.hasUserAccepted()) {
            return;
        }

        // Create and append the notice
        this.createNotice();
        
        // Show the notice after a short delay (better user experience)
        setTimeout(() => {
            this.showNotice();
        }, 500);
    }

    hasUserAccepted() {
        return localStorage.getItem(this.storageKey) === 'true';
    }

    createNotice() {
        // Create elements
        const notice = document.createElement('div');
        notice.id = this.noticeId;
        notice.className = 'storage-notice';
        
        // Add styles for the notice
        notice.style.position = 'fixed';
        notice.style.bottom = '0';
        notice.style.left = '0';
        notice.style.width = '100%';
        notice.style.backgroundColor = '#f1f1f1';
        notice.style.color = '#333';
        notice.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
        notice.style.zIndex = '1000';
        notice.style.display = 'none';

        // Create content container
        const content = document.createElement('div');
        content.className = 'storage-notice-content';
        content.style.maxWidth = '1200px';
        content.style.margin = '0 auto';
        content.style.padding = '15px';
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'space-between';
        content.style.flexWrap = 'wrap';

        // Create message
        const message = document.createElement('p');
        message.innerHTML = this.getLocalizedMessage();
        message.style.margin = '0';
        message.style.padding = '0';
        message.style.flex = '1';
        message.style.minWidth = '200px';
        message.style.marginRight = '20px';
        message.setAttribute('data-i18n', 'storage_notice.message');

        // Create accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = this.getLocalizedButtonText();
        acceptButton.className = 'storage-button';
        acceptButton.style.backgroundColor = '#4682B4';
        acceptButton.style.color = 'white';
        acceptButton.style.border = 'none';
        acceptButton.style.padding = '8px 16px';
        acceptButton.style.cursor = 'pointer';
        acceptButton.style.borderRadius = '4px';
        acceptButton.style.fontWeight = 'bold';
        acceptButton.setAttribute('data-i18n', 'storage_notice.accept');

        // Add event listener to the button
        acceptButton.addEventListener('click', () => this.acceptConsent());

        // Append elements
        content.appendChild(message);
        content.appendChild(acceptButton);
        notice.appendChild(content);
        document.body.appendChild(notice);
    }

    showNotice() {
        const notice = document.getElementById(this.noticeId);
        if (notice) {
            notice.style.display = 'block';
            this.noticeShown = true;
        }
    }

    hideNotice() {
        const notice = document.getElementById(this.noticeId);
        if (notice) {
            notice.style.display = 'none';
            this.noticeShown = false;
        }
    }

    acceptConsent() {
        localStorage.setItem(this.storageKey, 'true');
        this.hideNotice();
    }
    
    getLocalizedMessage() {
        // Check if i18n is available and initialized
        if (typeof i18n !== 'undefined') {
            // Try to get localized message if key exists
            if (i18n.translations[i18n.currentLanguage]?.storage_notice?.message) {
                return i18n.translate('storage_notice.message');
            }
        }
        
        // Fallback message in English and Slovak
        const lang = navigator.language.split('-')[0];
        if (lang === 'sk') {
            return 'Táto webová stránka používa lokálne úložisko na zlepšenie vašich skúseností, napríklad na zapamätanie jazyka a status návštevníka.';
        }
        return 'This website uses local storage to improve your experience, such as remembering your language preference and visitor status.';
    }
    
    getLocalizedButtonText() {
        // Check if i18n is available and initialized
        if (typeof i18n !== 'undefined') {
            // Try to get localized button text if key exists
            if (i18n.translations[i18n.currentLanguage]?.storage_notice?.accept) {
                return i18n.translate('storage_notice.accept');
            }
        }
        
        // Fallback text in English and Slovak
        const lang = navigator.language.split('-')[0];
        if (lang === 'sk') {
            return 'Prijať';
        }
        return 'Accept';
    }
}

// Initialize the storage notice when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure i18n has initialized if present
    setTimeout(() => {
        const storageNotice = new StorageNotice();
        storageNotice.init();
    }, 300);
});