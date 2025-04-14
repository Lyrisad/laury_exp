// Gestionnaire de langue
let currentLanguage = localStorage.getItem('language') || 'fr';

// Fonction pour changer la langue
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    translatePage();
    updateTranslatedQuestions();
}

// Fonction pour traduire un texte spécifique
function translateText(key) {
    return translations[currentLanguage][key] || key;
}

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