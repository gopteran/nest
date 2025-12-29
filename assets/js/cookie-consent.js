/**
 * Cookie Consent System for Gopteran Documentation
 *
 * This module initializes and manages the Vanilla Cookie Consent library
 * with configuration loaded from Hugo data files.
 */

class GopteranCookieConsent {
  constructor() {
    this.config = null;
    this.isInitialized = false;
    this.libraryLoaded = false;
    this.fallbackActive = false;

    // Bind methods to preserve context
    this.init = this.init.bind(this);
    this.loadLibrary = this.loadLibrary.bind(this);
    this.initializeConsent = this.initializeConsent.bind(this);
    this.handleConsentChange = this.handleConsentChange.bind(this);
    this.showPreferences = this.showPreferences.bind(this);
  }

  /**
   * Initialize the cookie consent system
   * @param {Object} hugoConfig - Configuration object from Hugo data
   */
  async init(hugoConfig) {
    try {
      this.config = this.processConfig(hugoConfig);
      console.log('Cookie consent configuration loaded:', this.config);

      // Load the library
      await this.loadLibrary();

      // Initialize the consent system
      this.initializeConsent();

      // Set up global access for preference management
      this.setupGlobalAccess();

      this.isInitialized = true;
      console.log('Cookie consent system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize cookie consent:', error);
      this.activateFallback();
    }
  }

  /**
   * Process and validate Hugo configuration
   * @param {Object} hugoConfig - Raw configuration from Hugo
   * @returns {Object} Processed configuration
   */
  processConfig(hugoConfig) {
    if (!hugoConfig) {
      throw new Error('No configuration provided');
    }

    // Build the configuration object for Vanilla Cookie Consent
    const config = {
      // Basic settings
      mode: hugoConfig.consent?.mode || 'opt-in',
      autoShow: hugoConfig.consent?.auto_show !== false,
      revision: hugoConfig.consent?.revision || 1,

      // Cookie settings
      cookie: {
        name: hugoConfig.consent?.cookie_name || 'gopteran_cookie_consent',
        expiresAfterDays: hugoConfig.consent?.expires_days || 365,
        domain: hugoConfig.consent?.domain || window.location.hostname,
        sameSite: hugoConfig.consent?.same_site || 'Lax',
        path: '/',
      },

      // GUI options
      guiOptions: {
        consentModal: {
          layout: hugoConfig.gui?.consent_modal?.layout || 'box',
          position: hugoConfig.gui?.consent_modal?.position || 'bottom right',
          transition: hugoConfig.gui?.consent_modal?.transition || 'slide',
        },
        preferencesModal: {
          layout: hugoConfig.gui?.preferences_modal?.layout || 'box',
          position: hugoConfig.gui?.preferences_modal?.position || 'right',
          transition: hugoConfig.gui?.preferences_modal?.transition || 'slide',
        },
      },

      // Advanced options
      disablePageInteraction: hugoConfig.advanced?.disable_page_interaction || false,
      hideFromBots: hugoConfig.advanced?.hide_from_bots !== false,
      lazyHtmlGeneration: hugoConfig.advanced?.lazy_html_generation !== false,

      // Categories
      categories: this.buildCategories(hugoConfig.categories),

      // Language and UI
      language: {
        default: 'en',
        translations: {
          en: this.buildTranslations(hugoConfig.ui),
        },
      },

      // Callbacks
      onFirstConsent: this.handleConsentChange,
      onConsent: this.handleConsentChange,
      onChange: this.handleConsentChange,
    };

    return config;
  }

  /**
   * Build categories configuration
   * @param {Object} categories - Categories from Hugo config
   * @returns {Object} Categories configuration
   */
  buildCategories(categories) {
    const result = {};

    for (const [key, category] of Object.entries(categories || {})) {
      result[key] = {
        enabled: category.enabled || false,
        readOnly: category.readonly || false,
        autoClear: category.auto_clear || false,
      };
    }

    return result;
  }

  /**
   * Build translations from UI configuration
   * @param {Object} ui - UI configuration from Hugo
   * @returns {Object} Translations object
   */
  buildTranslations(ui) {
    const consentModal = ui?.consent_modal || {};
    const preferencesModal = ui?.preferences_modal || {};

    return {
      consentModal: {
        title: consentModal.title || 'We use cookies',
        description:
          consentModal.description ||
          'This website uses cookies to ensure you get the best experience.',
        acceptAllBtn: consentModal.primary_button || 'Accept all',
        acceptNecessaryBtn: consentModal.secondary_button || 'Reject all',
        showPreferencesBtn: consentModal.settings_button || 'Manage preferences',
        footer: consentModal.footer_text || 'You can change your preferences at any time.',
      },
      preferencesModal: {
        title: preferencesModal.title || 'Cookie Preferences',
        acceptAllBtn: preferencesModal.accept_all_button || 'Accept all',
        acceptNecessaryBtn: preferencesModal.reject_all_button || 'Reject all',
        savePreferencesBtn: preferencesModal.save_button || 'Save preferences',
        closeIconLabel: preferencesModal.close_button || 'Close',
        sections: this.buildSections(preferencesModal.sections || []),
      },
    };
  }

  /**
   * Build sections for preferences modal
   * @param {Array} sections - Sections configuration
   * @returns {Array} Processed sections
   */
  buildSections(sections) {
    return sections.map(section => ({
      title: section.title,
      description: section.description,
      linkedCategory: section.linked_category,
    }));
  }

  /**
   * Load the Vanilla Cookie Consent library
   * @returns {Promise} Promise that resolves when library is loaded
   */
  async loadLibrary() {
    return new Promise((resolve, reject) => {
      // Check if library is already loaded
      if (window.CookieConsent) {
        this.libraryLoaded = true;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src =
        this.config.library?.cdn_url ||
        'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.1/dist/cookieconsent.umd.js';
      script.async = true;

      script.onload = () => {
        this.libraryLoaded = true;
        console.log('Cookie consent library loaded from CDN');
        resolve();
      };

      script.onerror = () => {
        console.warn('Failed to load from CDN, trying fallback...');
        this.loadFallback().then(resolve).catch(reject);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Load fallback library from local assets
   * @returns {Promise} Promise that resolves when fallback is loaded
   */
  async loadFallback() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.config.library?.fallback_url || '/js/cookieconsent.umd.js';
      script.async = true;

      script.onload = () => {
        this.libraryLoaded = true;
        this.fallbackActive = true;
        console.log('Cookie consent library loaded from fallback');
        resolve();
      };

      script.onerror = () => {
        console.error('Failed to load cookie consent library from fallback');
        reject(new Error('Library loading failed'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize the cookie consent system
   */
  initializeConsent() {
    if (!window.CookieConsent) {
      throw new Error('CookieConsent library not available');
    }

    try {
      // Initialize the library with our configuration
      window.CookieConsent.run(this.config);
      console.log('Cookie consent initialized with config:', this.config);

      // Set up script management
      this.setupScriptManagement();
    } catch (error) {
      console.error('Failed to initialize cookie consent:', error);
      throw error;
    }
  }

  /**
   * Set up script management based on consent
   */
  setupScriptManagement() {
    // Find all scripts with data-category attribute
    const managedScripts = document.querySelectorAll('script[data-category]');

    managedScripts.forEach(script => {
      const category = script.getAttribute('data-category');

      // Check if category is accepted
      if (window.CookieConsent.acceptedCategory(category)) {
        this.enableScript(script);
      } else {
        this.disableScript(script);
      }
    });
  }

  /**
   * Enable a script based on consent
   * @param {HTMLElement} script - Script element to enable
   */
  enableScript(script) {
    if (script.hasAttribute('data-src')) {
      script.src = script.getAttribute('data-src');
      script.removeAttribute('data-src');
    }

    if (script.hasAttribute('data-code')) {
      const code = script.getAttribute('data-code');
      const newScript = document.createElement('script');
      newScript.textContent = code;
      script.parentNode.insertBefore(newScript, script);
    }
  }

  /**
   * Disable a script by preventing execution
   * @param {HTMLElement} script - Script element to disable
   */
  disableScript(script) {
    if (script.src && !script.hasAttribute('data-src')) {
      script.setAttribute('data-src', script.src);
      script.removeAttribute('src');
    }
  }

  /**
   * Handle consent changes
   */
  handleConsentChange() {
    console.log('Consent changed, updating script management');
    this.setupScriptManagement();

    // Trigger custom event for other parts of the application
    const event = new CustomEvent('cookieConsentChanged', {
      detail: {
        consent: window.CookieConsent.getUserPreferences(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Set up global access methods
   */
  setupGlobalAccess() {
    // Add global method to show preferences
    window.showCookiePreferences = this.showPreferences;

    // Add method to check consent status
    window.getCookieConsent = () => {
      if (!window.CookieConsent) return null;
      return window.CookieConsent.getUserPreferences();
    };
  }

  /**
   * Show cookie preferences modal
   */
  showPreferences() {
    if (window.CookieConsent) {
      window.CookieConsent.showPreferences();
    } else {
      console.warn('Cookie consent not initialized');
    }
  }

  /**
   * Activate fallback mode for basic consent
   */
  activateFallback() {
    console.warn('Activating cookie consent fallback mode');
    this.fallbackActive = true;

    // Create a simple consent notice
    this.createFallbackNotice();
  }

  /**
   * Create a basic fallback consent notice
   */
  createFallbackNotice() {
    // Check if notice already exists
    if (document.getElementById('fallback-cookie-notice')) {
      return;
    }

    const notice = document.createElement('div');
    notice.id = 'fallback-cookie-notice';
    notice.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 400px;
                z-index: 10000;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 14px;
                line-height: 1.4;
            ">
                <p style="margin: 0 0 15px 0;">
                    This website uses cookies to ensure you get the best experience.
                </p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); localStorage.setItem('cookie_consent_fallback', 'accepted');"
                            style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                        Accept
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); localStorage.setItem('cookie_consent_fallback', 'rejected');"
                            style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                        Decline
                    </button>
                </div>
            </div>
        `;

    // Only show if not already consented
    const existingConsent = localStorage.getItem('cookie_consent_fallback');
    if (!existingConsent) {
      document.body.appendChild(notice);
    }
  }

  /**
   * Get current consent status
   * @returns {Object|null} Current consent status
   */
  getConsentStatus() {
    if (window.CookieConsent) {
      return window.CookieConsent.getUserPreferences();
    }

    // Fallback mode
    const fallbackConsent = localStorage.getItem('cookie_consent_fallback');
    if (fallbackConsent) {
      return {
        fallback: true,
        accepted: fallbackConsent === 'accepted',
      };
    }

    return null;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Configuration will be injected by Hugo template
  if (typeof window.cookieConsentConfig !== 'undefined') {
    const cookieConsent = new GopteranCookieConsent();
    cookieConsent.init(window.cookieConsentConfig);

    // Make instance globally available
    window.gopteranCookieConsent = cookieConsent;
  } else {
    console.warn('Cookie consent configuration not found');
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GopteranCookieConsent;
}
