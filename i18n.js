/**
 * Simple i18n implementation for static websites
 */

class I18nManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = null;
        this.defaultLanguage = 'en';
        this.languageChangeCallbacks = [];
    }

    /**
     * Initialize the i18n system
     */
    async init() {
        // Try to get saved language from localStorage
        const savedLanguage = localStorage.getItem('userLanguage');
        
        // If no saved language, try to detect browser language
        if (!savedLanguage) {
            const browserLang = navigator.language.split('-')[0];
            
            // Check if we support this language
            if (this.isLanguageSupported(browserLang)) {
                this.currentLanguage = browserLang;
            } else {
                // Fall back to default language
                this.currentLanguage = this.defaultLanguage;
            }
        } else {
            this.currentLanguage = savedLanguage;
        }
        
        // Load the current language translations
        await this.loadLanguage(this.currentLanguage);
        
        // Apply translations to the page
        this.updatePageTranslations();
        
        // Update language selector if it exists
        this.updateLanguageSelector();
        
        console.log(`Initialized i18n with language: ${this.currentLanguage}`);
    }
    
    /**
     * Check if a language is supported
     */
    isLanguageSupported(lang) {
        return ['en', 'sk'].includes(lang);
    }
    
    /**
     * Load language translation file
     */
    async loadLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }
        
        try {
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translation file for ${lang}`);
            }
            this.translations[lang] = await response.json();
            console.log(`Loaded translations for ${lang}`);
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            // If we can't load the requested language, try to fall back to default
            if (lang !== this.defaultLanguage) {
                console.log(`Falling back to ${this.defaultLanguage}`);
                await this.loadLanguage(this.defaultLanguage);
            }
        }
    }
    
    /**
     * Change the current language
     */
    async changeLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }
        
        // If we don't have this language loaded yet, load it
        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        }
        
        // Update current language
        this.currentLanguage = lang;
        
        // Save to localStorage
        localStorage.setItem('userLanguage', lang);
        
        // Update the page
        this.updatePageTranslations();
        
        // Update language selector
        this.updateLanguageSelector();
        
        // Call any registered callbacks
        this.languageChangeCallbacks.forEach(callback => callback(lang));
        
        console.log(`Changed language to: ${lang}`);
    }
    
    /**
     * Get a translation by key
     */
    translate(key) {
        // Split the key by dots to navigate the nested structure
        const path = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through the path
        for (const segment of path) {
            if (translation && translation[segment] !== undefined) {
                translation = translation[segment];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key; // Return the key if translation not found
            }
        }
        
        return translation;
    }
    
    /**
     * Update all elements with data-i18n attribute
     */
    updatePageTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            // If the element has a data-i18n-attr attribute, set that attribute
            // instead of innerText (useful for alt, placeholder, etc.)
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, translation);
            } else {
                element.innerText = translation;
            }
        });
    }
    
    /**
     * Update the language selector to reflect current language
     */
    updateLanguageSelector() {
        // Update desktop selector
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
        
        // Update mobile selector
        const mobileSelector = document.getElementById('mobile-language-selector');
        if (mobileSelector) {
            mobileSelector.value = this.currentLanguage;
        }
    }
    
    /**
     * Register a callback to be called when language changes
     */
    onLanguageChange(callback) {
        if (typeof callback === 'function') {
            this.languageChangeCallbacks.push(callback);
        }
    }
}

// Create global i18n instance
const i18n = new I18nManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize i18n
    await i18n.init();
    
    // Set up language selectors if they exist
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            i18n.changeLanguage(event.target.value);
        });
    }
    
    // Set up mobile language selector
    const mobileLanguageSelector = document.getElementById('mobile-language-selector');
    if (mobileLanguageSelector) {
        mobileLanguageSelector.addEventListener('change', (event) => {
            i18n.changeLanguage(event.target.value);
        });
    }
});