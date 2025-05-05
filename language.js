// Gestionnaire de langue
let currentLanguage = localStorage.getItem('language') || 'fr';

// Fonction pour changer la langue
function changeLanguage(lang) {
    console.log(`Changing language from ${currentLanguage} to ${lang}`);
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    translatePage();
    
    // Première tentative de mise à jour après un court délai
    setTimeout(() => {
        console.log('First update attempt for translated questions');
        if (typeof updateTranslatedQuestions === 'function') {
            updateTranslatedQuestions();
        }
        
        // Vérifier spécifiquement les éléments de section
        updateSectionTranslations();
    }, 100);
    
    // Deuxième tentative avec un délai plus long pour s'assurer que tout est chargé
    setTimeout(() => {
        console.log('Second update attempt for translated questions');
        if (typeof updateTranslatedQuestions === 'function') {
            updateTranslatedQuestions();
        }
        
        // Deuxième vérification des éléments de section
        updateSectionTranslations();
    }, 500);
}

// Fonction pour traduire un texte spécifique
function translateText(key) {
    if (typeof translations === 'undefined' || typeof currentLanguage === 'undefined') {
        return key; // Si les traductions ne sont pas chargées, retourner la clé
    }
    
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    
    // Si la traduction n'existe pas pour cette langue, essayer avec le français
    if (translations.fr && translations.fr[key]) {
        return translations.fr[key];
    }
    
    // Si aucune traduction n'est trouvée, retourner la clé
    return key;
}

// Exposer la fonction translateText globalement
window.translateText = translateText;

// Fonction pour traduire la page
function translatePage() {
    // Traduire les éléments avec data-translate
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Traduire les placeholders des inputs et textareas
    const inputs = document.querySelectorAll('input[data-translate-placeholder], textarea[data-translate-placeholder]');
    inputs.forEach(input => {
        const key = input.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage][key]) {
            input.placeholder = translations[currentLanguage][key];
        }
    });

    // Traduire les options des selects
    const selects = document.querySelectorAll('select[data-translate-options]');
    selects.forEach(select => {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            const key = option.getAttribute('data-translate');
            if (key && translations[currentLanguage][key]) {
                option.textContent = translations[currentLanguage][key];
            }
        });
    });

    // Traduire les messages dynamiques
    const questionnaireClosed = document.getElementById('questionnaire-closed');
    if (questionnaireClosed) {
        const title = questionnaireClosed.querySelector('h2');
        const message = questionnaireClosed.querySelector('p');
        if (title) title.textContent = translateText('questionnaireClosed');
        if (message) message.textContent = translateText('questionnaireClosedMessage');
    }

    // Mettre à jour la direction du texte pour l'arabe
    if (currentLanguage === 'ar') {
        document.body.style.direction = 'rtl';
    } else {
        document.body.style.direction = 'ltr';
    }
}

// Fonction spécifique pour mettre à jour les traductions des sections
function updateSectionTranslations() {
    // Mettre à jour les titres des sections
    const sectionTitles = document.querySelectorAll('.section-title[data-original]');
    sectionTitles.forEach(title => {
        const originalText = title.getAttribute('data-original');
        if (originalText && currentLanguage !== 'fr') {
            autoTranslateText(originalText, currentLanguage)
                .then(translatedText => {
                    title.textContent = translatedText;
                })
                .catch(err => {
                    console.error("Section title translation error:", err);
                    title.textContent = originalText;
                });
        } else if (originalText) {
            title.textContent = originalText;
        }
    });

    // Mettre à jour les descriptions des sections
    const sectionDescriptions = document.querySelectorAll('.section-description[data-original]');
    sectionDescriptions.forEach(description => {
        const originalText = description.getAttribute('data-original');
        if (originalText && currentLanguage !== 'fr') {
            autoTranslateText(originalText, currentLanguage)
                .then(translatedText => {
                    description.textContent = translatedText;
                })
                .catch(err => {
                    console.error("Section description translation error:", err);
                    description.textContent = originalText;
                });
        } else if (originalText) {
            description.textContent = originalText;
        }
    });

    // Mettre à jour les badges du nombre de questions
    const sectionHeaders = document.querySelectorAll('.section-header[data-question-count]');
    sectionHeaders.forEach(header => {
        const countText = header.getAttribute('data-question-count');
        if (countText) {
            const countMatch = countText.match(/^(\d+)\s+/);
            if (countMatch && countMatch[1]) {
                const count = parseInt(countMatch[1]);
                const questionWord = count > 1 ? translateText('questions') : translateText('question');
                header.setAttribute('data-question-count', `${count} ${questionWord}`);
            }
        }
    });
}

// Créer le sélecteur de langue
function createLanguageSelector() {
    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    languageSelector.innerHTML = `
        <select id="languageSelect" onchange="changeLanguage(this.value)">
            <option value="fr" ${currentLanguage === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
            <option value="pt" ${currentLanguage === 'pt' ? 'selected' : ''}>🇵🇹 Português</option>
            <option value="ar" ${currentLanguage === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
        </select>
    `;
    return languageSelector;
}

// Ajouter le sélecteur de langue au header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header) {
        const languageSelector = createLanguageSelector();
        header.appendChild(languageSelector);
    }
    translatePage();
}); 