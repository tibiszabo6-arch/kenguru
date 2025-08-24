/**
 * Alternative i18n implementation that works without server
 * This version embeds translations directly to avoid CORS issues
 */

class I18nManagerEmbedded {
    constructor() {
        // Embedded translations to avoid CORS issues when opening files directly
        this.translations = {
            'en': null, // Will be loaded from file if possible
            'sk': null, // Will be loaded from file if possible  
            'hu': null  // Will be loaded from file if possible
        };
        
        // Fallback embedded translations (partial, for testing)
        this.embeddedTranslations = {
            'hu': {
                "nav": {
                    "home": "Főoldal",
                    "our_rvs": "Ford Siena 395 F",
                    "caravanning": "Lakókocsizás",
                    "pricing": "Árlista",
                    "contact": "Kapcsolat"
                },
                "hero": {
                    "title": "Üdvözöljük a Kenguru Campers-nél!",
                    "subtitle": "Az Ön partnere az utakon. Béreljen modern és teljesen felszerelt lakókocsit, és éljen át felejthetetlen kalandokat Szlovákiában és egész Európában.",
                    "cta": "Ford Siena 395 F megtekintése"
                }
            },
            'sk': {
                "nav": {
                    "home": "Domov",
                    "our_rvs": "Ford Siena 395 F",
                    "caravanning": "Karavánovanie",
                    "pricing": "Cenník",
                    "contact": "Kontakt"
                },
                "hero": {
                    "title": "Vitajte v Kenguru Campers!",
                    "subtitle": "Sme vaším partnerom na cestách. Prenajmite si moderný a plne vybavený karavan a zažite nezabudnuteľné dobrodružstvo na Slovensku a v celej Európe.",
                    "cta": "Pozrieť Ford Siena 395 F"
                }
            },
            'en': {
                "nav": {
                    "home": "Home",
                    "our_rvs": "Our RVs",
                    "caravanning": "Caravanning",
                    "pricing": "Pricing",
                    "contact": "Contact"
                },
                "hero": {
                    "title": "Welcome to Kenguru Campers!",
                    "subtitle": "Your partner on the road. Rent a modern and fully equipped RV and experience unforgettable adventures in Slovakia and throughout Europe.",
                    "cta": "View Ford Siena 395 F"
                }
            }
        };
        
        this.currentLanguage = null;
        this.defaultLanguage = 'en';
        this.languageChangeCallbacks = [];
    }

    async init() {
        const savedLanguage = localStorage.getItem('userLanguage');
        
        if (!savedLanguage) {
            const browserLang = navigator.language.split('-')[0];
            if (this.isLanguageSupported(browserLang)) {
                this.currentLanguage = browserLang;
            } else {
                this.currentLanguage = this.defaultLanguage;
            }
        } else {
            this.currentLanguage = savedLanguage;
        }
        
        // Try to load from file first, fall back to embedded if it fails
        try {
            await this.loadLanguage(this.currentLanguage);
        } catch (e) {
            console.log('Using embedded translations due to CORS restrictions');
            this.translations[this.currentLanguage] = this.embeddedTranslations[this.currentLanguage];
        }
        
        this.updatePageTranslations();
        this.updateLanguageSelector();
        console.log(`Initialized i18n with language: ${this.currentLanguage}`);
    }
    
    isLanguageSupported(lang) {
        return ['en', 'sk', 'hu'].includes(lang);
    }
    
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
            console.log(`Loaded translations for ${lang} from file`);
        } catch (error) {
            console.log(`Could not load ${lang} from file, using embedded translations`);
            this.translations[lang] = this.embeddedTranslations[lang];
        }
    }
    
    async changeLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }
        
        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('userLanguage', lang);
        this.updatePageTranslations();
        this.updateLanguageSelector();
        this.languageChangeCallbacks.forEach(callback => callback(lang));
        console.log(`Changed language to: ${lang}`);
    }
    
    translate(key) {
        const path = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const segment of path) {
            if (translation && translation[segment] !== undefined) {
                translation = translation[segment];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        return translation;
    }
    
    updatePageTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, translation);
            } else {
                element.innerText = translation;
            }
        });
    }
    
    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
        
        const mobileSelector = document.getElementById('mobile-language-selector');
        if (mobileSelector) {
            mobileSelector.value = this.currentLanguage;
        }
    }
    
    onLanguageChange(callback) {
        if (typeof callback === 'function') {
            this.languageChangeCallbacks.push(callback);
        }
    }
}

// Use the embedded version
const i18n = new I18nManagerEmbedded();

document.addEventListener('DOMContentLoaded', async () => {
    await i18n.init();
    
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            i18n.changeLanguage(event.target.value);
        });
    }
    
    const mobileLanguageSelector = document.getElementById('mobile-language-selector');
    if (mobileLanguageSelector) {
        mobileLanguageSelector.addEventListener('change', (event) => {
            i18n.changeLanguage(event.target.value);
        });
    }
});