// Configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygLRqkAa4FFFwUJ11XsewgnIPD_mFp7VuvdtSaBbBJ7y3ouGMak0K8gGpKY7ZHq-rWPA/exec';

// Éléments du DOM
let form = null;
let questionsContainer = null;
let progressBar = null;
let progressPercentage = null;

// Fonction pour définir un cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Fonction pour récupérer un cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Fonction pour afficher des notifications stylées
function showNotification(message, type = 'success') {
    const colors = {
        success: 'linear-gradient(to right, #00b09b, #96c93d)',
        error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        warning: 'linear-gradient(to right, #f7b733, #fc4a1a)',
        info: 'linear-gradient(to right, #2193b0, #6dd5ed)'
    };

    Toastify({
        text: message,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: colors[type],
            borderRadius: "8px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
        },
        onClick: function(){}
    }).showToast();
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    if (!progressBar || !progressPercentage) return;
    
    const totalQuestions = document.querySelectorAll('#questionsContainer .form-group').length + 3; // +3 pour le genre, l'âge, le poste
    
    let answeredQuestions = 0;
    
    // Vérifier les informations générales
    const sexe = document.getElementById('sexe');
    if (sexe && sexe.value) answeredQuestions++;
    
    const age = document.getElementById('age');
    if (age && age.value) answeredQuestions++;
    
    const poste = document.getElementById('poste');
    if (poste && poste.value) answeredQuestions++;
    
    // Vérifier les réponses aux questions dynamiques
    document.querySelectorAll('#questionsContainer .form-group').forEach(group => {
        // Pour les questions de type radio
        const radioChecked = group.querySelector('input[type="radio"]:checked');
        if (radioChecked) {
            answeredQuestions++;
            return;
        }
        
        // Pour les questions de type checkbox
        const checkboxGroup = group.querySelector('.checkbox-group');
        if (checkboxGroup) {
            const checkboxesChecked = checkboxGroup.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxesChecked.length > 0) {
                // Vérifier si le nombre requis est atteint
                const maxRequired = checkboxGroup.getAttribute('data-max');
                if (!maxRequired || parseInt(maxRequired) === 0 || checkboxesChecked.length === parseInt(maxRequired)) {
                    answeredQuestions++;
                }
            }
            return;
        }
        
        // Pour les questions de type texte
        const textarea = group.querySelector('textarea');
        if (textarea && textarea.value.trim()) {
            answeredQuestions++;
            return;
        }
        
        // Pour les barems
        const ratingValue = group.querySelector('.rating-value');
        if (ratingValue && ratingValue.value && ratingValue.value !== "0") {
            answeredQuestions++;
            return;
        }
        
        // Pour les NPS
        const npsValue = group.querySelector('.nps-value');
        if (npsValue && npsValue.value && npsValue.value !== "-1") {
            answeredQuestions++;
            return;
        }
    });
    
    // Vérifier la satisfaction
    const satisfaction = document.querySelector('input[name="satisfaction"].rating-value');
    if (satisfaction && satisfaction.value && satisfaction.value !== "0") {
        answeredQuestions++;
    }
    
    // Calcul du pourcentage
    const percent = Math.round((answeredQuestions / (totalQuestions + 1)) * 100); // +1 pour la question de satisfaction à la fin
    
    // Détecter si l'appareil est mobile (adapté pour les media queries)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // Mise à jour de la barre de progression (verticale sur desktop, horizontale sur mobile)
    if (isMobile) {
        progressBar.style.width = `${percent}%`;
        progressBar.style.height = '100%';
    } else {
        progressBar.style.height = `${percent}%`;
        progressBar.style.width = '100%';
    }
    
    progressPercentage.textContent = `${percent}%`;
    
    // Mettre à jour l'attribut data-percent pour d'éventuelles animations CSS
    if (progressBar.parentElement) {
        progressBar.parentElement.setAttribute('data-percent', percent);
    }
    
    // Changer la couleur en fonction du pourcentage
    const gradientDirection = isMobile ? 'to right' : 'to top';
    
    if (percent <= 33) {
        progressBar.style.background = `linear-gradient(${gradientDirection}, #ff5f6d, #ffc371)`;
    } else if (percent <= 66) {
        progressBar.style.background = `linear-gradient(${gradientDirection}, #f7b733, #fc4a1a)`;
    } else {
        progressBar.style.background = `linear-gradient(${gradientDirection}, #00b09b, #96c93d)`;
    }
}

// Fonction pour gérer l'effet de scroll sur la barre de progression
function handleProgressScroll() {
    const progressSticky = document.getElementById('progressSticky');
    if (!progressSticky) return;
    
    // Détection de la position de défilement
    const scrollPosition = window.scrollY;
    
    // Ajouter ou supprimer la classe scrolled en fonction de la position
    if (scrollPosition > 50) {
        progressSticky.classList.add('scrolled');
    } else {
        progressSticky.classList.remove('scrolled');
    }
}

// Fonction pour créer le skeleton loading
function createSkeletonLoading() {
    if (!questionsContainer) return;
    
    questionsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const skeletonGroup = document.createElement('div');
        skeletonGroup.className = 'form-group';
        skeletonGroup.innerHTML = `
            <div class="skeleton skeleton-text" style="width: 60%"></div>
            <div class="skeleton skeleton-option" style="width: 100%"></div>
            <div class="skeleton skeleton-option" style="width: 100%"></div>
            <div class="skeleton skeleton-option" style="width: 100%"></div>
        `;
        questionsContainer.appendChild(skeletonGroup);
    }
}

// Initialisation du questionnaire
function initQuestionnaire() {
    form = document.getElementById('questionnaireForm');
    questionsContainer = document.getElementById('questionsContainer');
    progressBar = document.getElementById('progressFill');
    progressPercentage = document.getElementById('progressPercentage');
    
    // Vérifier si l'utilisateur a déjà soumis le questionnaire
    const hasCompletedQuestionnaire = getCookie('questionnaireCompleted');
    
    if (hasCompletedQuestionnaire) {
        // L'utilisateur a déjà rempli le questionnaire
        const questionnaireContent = document.getElementById('questionnaire-content');
        
        // Créer un message personnalisé
        const completedMessage = document.createElement('div');
        completedMessage.className = 'questionnaire-completed';
        completedMessage.innerHTML = `
            <div class="completed-icon">✅</div>
            <h2 data-translate="questionnaireCompleted">${translateText('questionnaireCompleted') || 'Questionnaire déjà complété'}</h2>
            <p data-translate="questionnaireCompletedMessage">${translateText('questionnaireCompletedMessage') || 'Vous avez déjà réalisé ce questionnaire. Merci pour votre participation!'}</p>
        `;
        
        // Remplacer le contenu du questionnaire par le message
        if (questionnaireContent) {
            // Garder le titre principal
            const title = questionnaireContent.querySelector('h1');
            questionnaireContent.innerHTML = '';
            if (title) questionnaireContent.appendChild(title);
            questionnaireContent.appendChild(completedMessage);
        }
        return; // Arrêter l'initialisation du questionnaire
    }
    
    // Vérifier le consentement
    const consentGiven = localStorage.getItem('consentGiven') === 'true';
    const consentCheck = document.getElementById('consent-check');
    const questionnaireContent = document.getElementById('questionnaire-content');
    
    if (!consentGiven) {
        // Afficher le message de vérification du consentement
        if (consentCheck) consentCheck.style.display = 'block';
        if (questionnaireContent) questionnaireContent.style.display = 'none';
        return; // Arrêter l'initialisation du questionnaire
    } else {
        // Cacher le message de vérification et afficher le questionnaire
        if (consentCheck) consentCheck.style.display = 'none';
        if (questionnaireContent) questionnaireContent.style.display = 'block';
    }
    
    if (form && questionsContainer) {
        checkQuestionnaireStatus();

        // Ajouter des écouteurs d'événements pour mettre à jour la barre de progression
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', updateProgressBar);
                input.addEventListener('input', updateProgressBar);
            });
        }
        
        // Ajouter l'écouteur d'événement pour le défilement
        window.addEventListener('scroll', handleProgressScroll);
        // Initialiser l'état du scroll
        handleProgressScroll();
    }
}

// Fonction pour envoyer une requête de suivi sans bloquer la navigation
function sendTrackingRequest(params) {
    const img = new Image();
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    img.src = `${SCRIPT_URL}?${queryString}`;
}

// Fonction pour vérifier le statut du questionnaire
function checkQuestionnaireStatus() {
    const params = new URLSearchParams({
        action: 'getQuestionnaireStatus'
    });

    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            const questionnaireClosed = document.getElementById('questionnaire-closed');
            const questionnaireForm = document.getElementById('questionnaireForm');
            
            if (data.status === "TRUE") {
                questionnaireClosed.style.display = 'none';
                questionnaireForm.style.display = 'block';
                loadQuestions();
            } else {
                questionnaireClosed.style.display = 'block';
                questionnaireForm.style.display = 'none';
                questionsContainer.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la vérification du statut:', error);
            showNotification(translations[currentLanguage].notificationStatusError, 'error');
            
            const questionnaireClosed = document.getElementById('questionnaire-closed');
            const questionnaireForm = document.getElementById('questionnaireForm');
            questionnaireClosed.style.display = 'block';
            questionnaireForm.style.display = 'none';
            questionsContainer.innerHTML = '';
        });
}

// Charger les questions depuis la Web App (via GET)
function loadQuestions() {
    if (!questionsContainer) return;
    
    const url = `${SCRIPT_URL}?action=getQuestions`;
    createSkeletonLoading();
    
    // Enregistrer le moment de début du chargement
    const loadStartTime = Date.now();
    // Définir une durée minimale pour le skeleton loading (en ms)
    const minLoadingTime = 2500; // Augmenté à 2.5 secondes pour une expérience plus fluide
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Calculer le temps écoulé depuis le début du chargement
            const elapsedTime = Date.now() - loadStartTime;
            // Déterminer le délai restant pour atteindre la durée minimale
            const remainingDelay = Math.max(0, minLoadingTime - elapsedTime);
            
            // Afficher les questions après le délai minimum
            setTimeout(() => {
            if (data.values) {
                    displayQuestions(data.values, true); // Ajouter un paramètre pour indiquer le chargement initial
            } else {
                console.warn('Aucune question trouvée');
                questionsContainer.innerHTML = `<p>${translations[currentLanguage].notificationNoQuestions}</p>`;
            }
            }, remainingDelay);
        })
        .catch(error => {
            console.error('Erreur:', error);
            
            // Calculer le temps écoulé depuis le début du chargement
            const elapsedTime = Date.now() - loadStartTime;
            // Déterminer le délai restant pour atteindre la durée minimale
            const remainingDelay = Math.max(0, minLoadingTime - elapsedTime);
            
            // Afficher l'erreur après le délai minimum
            setTimeout(() => {
            questionsContainer.innerHTML = `<p class="error">${translations[currentLanguage].notificationLoadingError}: ${error.message}</p>`;
            }, remainingDelay);
        });
}

function autoTranslateText(text, targetLang) {
    if (targetLang === 'fr') return Promise.resolve(text);
    const params = new URLSearchParams({
      action: "translate",
      text: text,
      targetLang: targetLang
    });
    return fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET"
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(errText => { 
          throw new Error("Translation error: " + errText);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Server translation result:", data);
      return data.translatedText;
    })
    .catch(error => {
      console.error("Translation error:", error);
      return text;
    });
  }
  
// Exposer la fonction autoTranslateText globalement pour permettre son accès par language.js
window.autoTranslateText = autoTranslateText;

function displayQuestions(questions, isInitialLoad = false) {
    // Ne pas effacer le conteneur pendant le chargement initial
    if (!isInitialLoad) {
    questionsContainer.innerHTML = '';
    }

    // Récupérer les sections du questionnaire
    const params = new URLSearchParams({
        action: 'getSections'
    });

    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Maintenant que nous avons les sections, effacer le conteneur
            questionsContainer.innerHTML = '';
            
            const sections = data.sections || [];
            
            // Organiser les questions par sections
            let currentOrder = 1;
            let currentSection = null;
            let sectionContainer = null;
            
            // Fonction pour créer un élément de question
            const createQuestionElement = (question, index) => {
        // Create a container for each question
        const questionElement = document.createElement('div');
        questionElement.className = 'form-group';

        // Create and append a separator (e.g. "Question 1")
        const separator = document.createElement('div');
        separator.className = 'question-separator';
        separator.textContent = `Question ${index + 1}`;
        questionElement.appendChild(separator);

        // Create the label for the question and store the original text
        const label = document.createElement('label');
        label.setAttribute('data-original', question.question);
        label.setAttribute('data-question', `Question ${question.order}`);
        label.textContent = question.question;
        // If the current language is not French, translate the text
        if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
            label.textContent = "translation loading...";
            autoTranslateText(question.question, currentLanguage)
                .then(translatedText => {
                    console.log(`Question ${question.order} translated:`, translatedText);
                    label.textContent = translatedText;
                })
                .catch(error => {
                    console.error("Error during question translation:", error);
                    label.textContent = question.question;
                });
        }
        questionElement.appendChild(label);

        // Create the response input element by calling createResponseInput
                let inputContent = createResponseInput(question.type, question.responses, index, question.maxResponses);
        // If inputContent is a string (e.g. for textarea), use innerHTML,
        // otherwise (for radio, checkbox, barem, nps) it is a DOM node.
        if (typeof inputContent === "string") {
            const inputContainer = document.createElement('div');
            inputContainer.innerHTML = inputContent;
            questionElement.appendChild(inputContainer);
        } else {
            questionElement.appendChild(inputContent);
        }

                return questionElement;
            };
            
            // Traitement des questions en fonction des sections
            if (sections.length > 0) {
                sections.forEach(section => {
                    // Traiter les questions avant cette section
                    for (let i = currentOrder; i < parseInt(section.startQuestion); i++) {
                        const question = questions.find(q => q.order === i);
                        if (question) {
                            const questionIndex = questions.findIndex(q => q.order === i);
                            const questionElement = createQuestionElement(question, questionIndex);
        questionsContainer.appendChild(questionElement);
                        }
                    }
                    
                    // Créer la section
                    sectionContainer = document.createElement('div');
                    sectionContainer.className = 'questionnaire-section';
                    
                    // Calculer le nombre de questions dans cette section
                    const questionsCount = parseInt(section.endQuestion) - parseInt(section.startQuestion) + 1;
                    
                    // En-tête de la section
                    const sectionHeader = document.createElement('div');
                    sectionHeader.className = 'section-header';
                    // Ajouter le nombre de questions comme attribut de donnée avec traduction du mot "question(s)"
                    const questionWord = questionsCount > 1 ? 
                        (typeof translateText === 'function' ? translateText('questions') : 'questions') : 
                        (typeof translateText === 'function' ? translateText('question') : 'question');
                    sectionHeader.setAttribute('data-question-count', questionsCount + ' ' + questionWord);
                    
                    const sectionTitle = document.createElement('h3');
                    sectionTitle.className = 'section-title';
                    sectionTitle.textContent = section.title;
                    
                    // Ajouter le titre de la section à l'en-tête
                    sectionHeader.appendChild(sectionTitle);
                    
                    // Ajouter la description si elle existe
                    if (section.description) {
                        const sectionDescription = document.createElement('p');
                        sectionDescription.className = 'section-description';
                        sectionDescription.textContent = section.description;
                        sectionHeader.appendChild(sectionDescription);
                    }
                    
                    // Ajouter un indicateur visuel (flèche vers le bas)
                    const sectionArrow = document.createElement('div');
                    sectionArrow.className = 'section-arrow';
                    sectionArrow.innerHTML = '↓';
                    sectionHeader.appendChild(sectionArrow);
                    
                    // Ajouter l'en-tête à la section
                    sectionContainer.appendChild(sectionHeader);
                    
                    // Traduction du titre et de la description si nécessaire
                    if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
                        // Traduire le titre
                        sectionTitle.setAttribute('data-original', section.title);
                        sectionTitle.textContent = "translation loading...";
                        autoTranslateText(section.title, currentLanguage)
                            .then(translatedTitle => {
                                sectionTitle.textContent = translatedTitle;
                            })
                            .catch(error => {
                                console.error("Error during section title translation:", error);
                                sectionTitle.textContent = section.title;
                            });
                        
                        // Traduire la description si elle existe
                        if (section.description) {
                            const sectionDescription = sectionHeader.querySelector('.section-description');
                            sectionDescription.setAttribute('data-original', section.description);
                            sectionDescription.textContent = "translation loading...";
                            autoTranslateText(section.description, currentLanguage)
                                .then(translatedDesc => {
                                    sectionDescription.textContent = translatedDesc;
                                })
                                .catch(error => {
                                    console.error("Error during section description translation:", error);
                                    sectionDescription.textContent = section.description;
                                });
                        }
                    }
                    
                    // Ajouter la section au conteneur principal
                    questionsContainer.appendChild(sectionContainer);
                    
                    // Ajouter les questions de cette section
                    for (let i = parseInt(section.startQuestion); i <= parseInt(section.endQuestion); i++) {
                        const question = questions.find(q => q.order === i);
                        if (question) {
                            const questionIndex = questions.findIndex(q => q.order === i);
                            const questionElement = createQuestionElement(question, questionIndex);
                            sectionContainer.appendChild(questionElement);
                        }
                    }
                    
                    // Mettre à jour l'ordre courant
                    currentOrder = parseInt(section.endQuestion) + 1;
                });
                
                // Ajouter les questions restantes après la dernière section
                for (let i = currentOrder; i <= questions.length; i++) {
                    const question = questions.find(q => q.order === i);
                    if (question) {
                        const questionIndex = questions.findIndex(q => q.order === i);
                        const questionElement = createQuestionElement(question, questionIndex);
                        questionsContainer.appendChild(questionElement);
                    }
                }
            } else {
                // S'il n'y a pas de sections, afficher toutes les questions normalement
                questions.forEach((question, index) => {
                    const questionElement = createQuestionElement(question, index);
                    questionsContainer.appendChild(questionElement);
                });
            }

    // After building the questions, reassign IDs and call initialization for rating and nps events
    setTimeout(() => {
        const formGroups = questionsContainer.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            const questionName = `q${index + 1}`;
            const inputs = group.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (!input.id) {
                    input.id = `${questionName}-${input.type || 'text'}`;
                }
                if (!input.name) {
                    input.name = questionName;
                }
                input.tabIndex = 0;
                        
                        // Ajouter les écouteurs d'événements pour la progression
                        input.addEventListener('change', updateProgressBar);
                        input.addEventListener('input', updateProgressBar);
            });
            const labels = group.querySelectorAll('label');
            labels.forEach(label => {
                if (label.htmlFor && !document.getElementById(label.htmlFor)) {
                    const firstInput = group.querySelector('input, textarea');
                    if (firstInput) {
                        label.htmlFor = firstInput.id;
                    }
                }
            });
        });
        // Reinitialize rating and nps events for barem and nps types:
        initializeRatingStars();
        initializeNps();
                
                // Mettre à jour la barre de progression
                updateProgressBar();
                
                // Ajouter une animation de fade-in au contenu
                fadeInContent();
    }, 0);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des sections:', error);
            // En cas d'erreur, afficher simplement les questions sans sections
            questionsContainer.innerHTML = '';
            
            questions.forEach((question, index) => {
                // Create a container for each question
                const questionElement = document.createElement('div');
                questionElement.className = 'form-group';

                // Utiliser la fonction createQuestionElement pour créer l'élément de question
                const createQuestionElement = (question, index) => {
                    // Create and append a separator (e.g. "Question 1")
                    const separator = document.createElement('div');
                    separator.className = 'question-separator';
                    separator.textContent = `Question ${index + 1}`;
                    questionElement.appendChild(separator);

                    // Create the label for the question and store the original text
                    const label = document.createElement('label');
                    label.setAttribute('data-original', question.question);
                    label.setAttribute('data-question', `Question ${question.order}`);
                    label.textContent = question.question;
                    // If the current language is not French, translate the text
                    if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
                        label.textContent = "translation loading...";
                        autoTranslateText(question.question, currentLanguage)
                            .then(translatedText => {
                                console.log(`Question ${question.order} translated:`, translatedText);
                                label.textContent = translatedText;
                            })
                            .catch(error => {
                                console.error("Error during question translation:", error);
                                label.textContent = question.question;
                            });
                    }
                    questionElement.appendChild(label);

                    // Create the response input element by calling createResponseInput
                    let inputContent = createResponseInput(question.type, question.responses, index, question.maxResponses);
                    // If inputContent is a string (e.g. for textarea), use innerHTML,
                    // otherwise (for radio, checkbox, barem, nps) it is a DOM node.
                    if (typeof inputContent === "string") {
                        const inputContainer = document.createElement('div');
                        inputContainer.innerHTML = inputContent;
                        questionElement.appendChild(inputContainer);
                    } else {
                        questionElement.appendChild(inputContent);
                    }

                    return questionElement;
                };
                
                const element = createQuestionElement(question, index);
                questionsContainer.appendChild(element);
            });
            
            // Initialiser les comportements après avoir affiché les questions
            setTimeout(() => {
                const formGroups = questionsContainer.querySelectorAll('.form-group');
                formGroups.forEach((group, index) => {
                    const questionName = `q${index + 1}`;
                    const inputs = group.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        if (!input.id) {
                            input.id = `${questionName}-${input.type || 'text'}`;
                        }
                        if (!input.name) {
                            input.name = questionName;
                        }
                        input.tabIndex = 0;
                        
                        // Ajouter les écouteurs d'événements pour la progression
                        input.addEventListener('change', updateProgressBar);
                        input.addEventListener('input', updateProgressBar);
                    });
                    const labels = group.querySelectorAll('label');
                    labels.forEach(label => {
                        if (label.htmlFor && !document.getElementById(label.htmlFor)) {
                            const firstInput = group.querySelector('input, textarea');
                            if (firstInput) {
                                label.htmlFor = firstInput.id;
                            }
                        }
                    });
                });
                
                initializeRatingStars();
                initializeNps();
                updateProgressBar();
                
                // Ajouter une animation de fade-in au contenu
                fadeInContent();
            }, 0);
        });
}

// Fonction pour animer l'apparition du contenu
function fadeInContent() {
    // Sélectionner tous les éléments récemment ajoutés
    const elements = questionsContainer.querySelectorAll('.form-group, .questionnaire-section');
    
    // Ajouter une classe pour déclencher l'animation de fade-in
    elements.forEach((element, index) => {
        // Retarder chaque élément pour créer un effet de cascade
        setTimeout(() => {
            element.classList.add('fade-in');
        }, 50 * index);
    });
}

// Function to update all question labels (and option labels) when language changes
function updateTranslatedQuestions() {
    // Update question labels
    const questionLabels = document.querySelectorAll('label[data-original]');
    questionLabels.forEach(label => {
        const originalText = label.getAttribute('data-original');
        if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
            label.textContent = "translation loading...";
            autoTranslateText(originalText, currentLanguage)
              .then(translatedText => {
                  console.log(`Translated: ${originalText} -> ${translatedText}`);
                  label.textContent = translatedText;
              })
              .catch(err => {
                  console.error("Translation error on update:", err);
                  label.textContent = originalText;
              });
        } else {
            label.textContent = originalText;
        }
    });
    
    // Update radio and checkbox options, if any
    const optionLabels = document.querySelectorAll('.checkbox-group label, .rating label');
    optionLabels.forEach(label => {
        const originalText = label.getAttribute('data-original');
        if (originalText) {
            if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
                label.textContent = "translation loading...";
                autoTranslateText(originalText, currentLanguage)
                  .then(translatedText => {
                      console.log(`Option translated: ${originalText} -> ${translatedText}`);
                      label.textContent = translatedText;
                  })
                  .catch(err => {
                      console.error("Option translation error:", err);
                      label.textContent = originalText;
                  });
            } else {
                label.textContent = originalText;
            }
        }
    });

    // Update section titles and descriptions
    const sectionTitles = document.querySelectorAll('.section-title[data-original]');
    sectionTitles.forEach(title => {
        const originalText = title.getAttribute('data-original');
        if (originalText && typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
            title.textContent = "translation loading...";
            autoTranslateText(originalText, currentLanguage)
                .then(translatedText => {
                    console.log(`Section title translated: ${originalText} -> ${translatedText}`);
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

    const sectionDescriptions = document.querySelectorAll('.section-description[data-original]');
    sectionDescriptions.forEach(description => {
        const originalText = description.getAttribute('data-original');
        if (originalText && typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
            description.textContent = "translation loading...";
            autoTranslateText(originalText, currentLanguage)
                .then(translatedText => {
                    console.log(`Section description translated: ${originalText} -> ${translatedText}`);
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

    // Update section question count badges
    const sectionHeaders = document.querySelectorAll('.section-header[data-question-count]');
    sectionHeaders.forEach(header => {
        const countText = header.getAttribute('data-question-count');
        if (countText) {
            // Extraire le nombre de questions
            const countMatch = countText.match(/^(\d+)\s+/);
            if (countMatch && countMatch[1]) {
                const count = parseInt(countMatch[1]);
                const questionWord = count > 1 ? translateText('questions') : translateText('question');
                header.setAttribute('data-question-count', `${count} ${questionWord}`);
            }
        }
    });

    // Update choice type labels
    const ratingContainers = document.querySelectorAll('.rating');
    const checkboxContainers = document.querySelectorAll('.checkbox-group');
    
    ratingContainers.forEach(container => {
        container.setAttribute('data-translate-single-choice', translateText('singleChoice'));
    });
    
    checkboxContainers.forEach(container => {
        container.setAttribute('data-translate-multiple-choice', translateText('multipleChoice'));
        container.setAttribute('data-translate-required', translateText('requiredResponses'));
    });
}

function createResponseInput(type, responses, index, maxResponses = 0) {
    const questionName = `q${index + 1}`;
    const baseId = `${questionName}-input`;

    if (type === 'text') {
        const textarea = document.createElement('textarea');
        textarea.id = baseId;
        textarea.name = questionName;
        textarea.setAttribute('data-translate-placeholder', 'textAnswerPlaceholder');
        textarea.placeholder = translateText('textAnswerPlaceholder');
        return textarea;
    }
    else if (type === 'radio') {
        const container = document.createElement('div');
        container.className = 'rating';
        container.setAttribute('data-translate-single-choice', translateText('singleChoice'));
        responses.forEach((option, i) => {
            const optionId = `${baseId}-${i}`;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = optionId;
            radio.name = questionName;
            radio.value = option;

            const label = document.createElement('label');
            label.setAttribute('for', optionId);
            label.setAttribute('data-original', option);
            label.textContent = option;

            if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
                label.textContent = "translation loading...";
                autoTranslateText(option, currentLanguage)
                    .then(translated => {
                        console.log(`Option translated: ${option} -> ${translated}`);
                        label.textContent = translated;
                    })
                    .catch(err => {
                        console.error("Error translating radio option:", err);
                        label.textContent = option;
                    });
            }

            container.appendChild(radio);
            container.appendChild(label);
        });
        return container;
    } else if (type === 'checkbox') {
        const container = document.createElement('div');
        container.className = 'checkbox-group';
        container.setAttribute('data-translate-multiple-choice', translateText('multipleChoice'));
        container.setAttribute('data-translate-required', translateText('requiredResponses'));
        
        // Set max responses attribute if specified
        if (maxResponses > 0) {
            container.setAttribute('data-max-responses', maxResponses);
            container.setAttribute('data-max', maxResponses);
        }
        
        responses.forEach((option, i) => {
            const optionId = `${baseId}-${i}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = optionId;
            checkbox.name = questionName + '[]';
            checkbox.value = option;

            const label = document.createElement('label');
            label.setAttribute('for', optionId);
            label.setAttribute('data-original', option);
            label.textContent = option;

            if (typeof currentLanguage !== 'undefined' && currentLanguage !== 'fr') {
                label.textContent = "translation loading...";
                autoTranslateText(option, currentLanguage)
                    .then(translated => {
                        console.log(`Checkbox option translated: ${option} -> ${translated}`);
                        label.textContent = translated;
                    })
                    .catch(err => {
                        console.error("Error translating checkbox option:", err);
                        label.textContent = option;
                    });
            }

            container.appendChild(checkbox);
            container.appendChild(label);
        });
        
        // Add event listeners to enforce maxResponses
        if (maxResponses > 0) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const checked = container.querySelectorAll('input[type="checkbox"]:checked');
                    if (checked.length > maxResponses) {
                        this.checked = false;
                        showNotification(
                            translateText('maxResponsesExceeded').replace('{max}', maxResponses), 
                            'warning'
                        );
                    }
                });
            });
        }
        
        return container;
    } else if (type === 'barem') {
        // Create barem as a DOM node
        const container = document.createElement('div');
        container.className = 'rating-container';
        
        const starsDiv = document.createElement('div');
        starsDiv.className = 'rating-stars';
        
        for (let i = 0; i < 5; i++) {
            const starContainer = document.createElement('div');
            starContainer.className = 'star-container';
            starContainer.setAttribute('data-value', i + 1);
            
            const star = document.createElement('div');
            star.className = 'star';
            star.setAttribute('data-value', i + 1);
            star.textContent = '★';
            
            starContainer.appendChild(star);
            starsDiv.appendChild(starContainer);
        }
        container.appendChild(starsDiv);
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = baseId;
        hiddenInput.name = questionName;
        hiddenInput.className = 'rating-value';
        container.appendChild(hiddenInput);
        
        return container;
    }
    else if (type === 'nps') {
        // Create nps as a DOM node
        const container = document.createElement('div');
        container.className = 'nps-container';
        
        const scaleDiv = document.createElement('div');
        scaleDiv.className = 'nps-scale';
        
        for (let i = 0; i < 11; i++) {
            const npsItem = document.createElement('div');
            npsItem.className = 'nps-item';
            npsItem.setAttribute('data-value', i);
            
            const npsSmiley = document.createElement('div');
            npsSmiley.className = 'nps-smiley';
            npsSmiley.textContent = getNpsSmiley(i);
            
            const npsNumber = document.createElement('div');
            npsNumber.className = 'nps-number';
            npsNumber.textContent = i;
            
            npsItem.appendChild(npsSmiley);
            npsItem.appendChild(npsNumber);
            scaleDiv.appendChild(npsItem);
        }
        container.appendChild(scaleDiv);
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = baseId;
        hiddenInput.name = questionName;
        hiddenInput.className = 'nps-value';
        hiddenInput.value = "-1";
        container.appendChild(hiddenInput);
        
        return container;
    }
    else {
        return '';
    }
}

// Fonction pour obtenir le smiley correspondant à la note NPS
function getNpsSmiley(value) {
    if (value <= 3) return '😡'; // Très mécontent
    if (value <= 5) return '😕'; // Mécontent
    if (value <= 7) return '😐'; // Neutre
    if (value <= 9) return '😊'; // Content
    return '😍'; // Très content
}

// Fonction pour initialiser les étoiles de notation
function initializeRatingStars() {
    document.querySelectorAll('.rating-stars, .nps-scale').forEach(container => {
        const isNps = container.classList.contains('nps-scale');
        const items = container.querySelectorAll(isNps ? '.nps-item' : '.star-container');
        const hiddenInput = container.nextElementSibling;
        
        items.forEach(item => {
            item.addEventListener('mouseover', () => {
                const value = parseInt(item.dataset.value);
                if (isNps) {
                    highlightNps(container, value);
                } else {
                    highlightStars(container, value);
                }
            });
            
            item.addEventListener('click', () => {
                const value = parseInt(item.dataset.value);
                hiddenInput.value = value;
                if (isNps) {
                    highlightNps(container, value);
                } else {
                    highlightStars(container, value);
                }
            });
        });
        
        container.addEventListener('mouseleave', () => {
            let currentValue = parseInt(hiddenInput.value);
            // Si aucune sélection n'a été faite, currentValue vaudra -1
            if (isNaN(currentValue) || currentValue < 0) {
                currentValue = -1;
            }
            if (isNps) {
                highlightNps(container, currentValue);
            } else {
                highlightStars(container, currentValue);
            }
        });        
    });
}

// Fonction pour mettre en surbrillance les étoiles
function highlightStars(container, value) {
    const stars = container.querySelectorAll('.star');
    stars.forEach(star => {
        const starValue = parseFloat(star.dataset.value);
        if (starValue <= value) {
            star.style.color = '#ffd700';
        } else {
            star.style.color = '#ccc';
        }
    });
}

// Fonction pour mettre en surbrillance les éléments NPS
function highlightNps(container, value) {
    const items = container.querySelectorAll('.nps-item');
    items.forEach(item => {
        const itemValue = parseInt(item.dataset.value);
        if (itemValue <= value) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Fonction pour gérer les clics sur les éléments NPS
function handleNpsClick(container, value) {
    const hiddenInput = container.nextElementSibling;
    hiddenInput.value = value;
    highlightNps(container, value);
}

// Initialisation des éléments NPS
function initializeNps() {
    document.querySelectorAll('.nps-scale').forEach(container => {
        const items = container.querySelectorAll('.nps-item');
        const hiddenInput = container.nextElementSibling;
        
        items.forEach(item => {
            const value = parseInt(item.dataset.value);
            
            // Gestion du survol
            item.addEventListener('mouseover', () => {
                highlightNps(container, value);
            });
            
            // Gestion du clic
            item.addEventListener('click', () => {
                handleNpsClick(container, value);
            });
        });
        
        // Réinitialisation au survol de la sortie
        container.addEventListener('mouseleave', () => {
            const currentValue = parseInt(hiddenInput.value) || 0;
            highlightNps(container, currentValue);
        });
    });
}

// Fonction pour afficher la fenêtre modale de succès
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'flex';
        
        // Ajouter un gestionnaire d'événement au bouton "Terminer"
        const finishButton = document.getElementById('finishButton');
        if (finishButton) {
            finishButton.addEventListener('click', function() {
                // Rediriger vers la page d'accueil
                window.location.href = 'index.html';
            });
        }
    }
}

/*
  La fonction de soumission du formulaire utilise désormais la méthode GET.
  Elle construit une URL avec un paramètre "action=submitResponse" et encode
  toutes les données dans les query string.
*/
async function submitQuestionnaire(event) {
    event.preventDefault();

    // 1. Validation des informations personnelles
    const sexe = document.getElementById('sexe').value.trim();
    const age = document.getElementById('age').value.trim();
    const poste = document.getElementById('poste').value.trim();
    // Le genre est toujours égal à la valeur sélectionnée dans le dropdown
    const genreFinal = sexe;
    
    if (!sexe || !age || !poste) {
        showNotification(translations[currentLanguage].notificationPersonalInfo, "error");
        return;
    }
    
    // 2. Validation du questionnaire dynamique
    const questionnaireResponses = [];
    let firstEmptyQuestion = null;
    let firstInvalidQuestion = null;
    const dynamicQuestionGroups = document.querySelectorAll('#questionsContainer .form-group');

    for (const group of dynamicQuestionGroups) {
        const labelElem = group.querySelector('label[data-question]');
        if (!labelElem) continue;

        // On récupère le texte original en français (stocké dans data-original)
        const questionText = labelElem.getAttribute('data-original');
        let answer = "";
        let hasAnswer = false;
        let isValid = true;

        // Pour une question de type radio, utiliser la valeur (value) de l'input sélectionné (qui reste en français)
        if (group.querySelector('.rating')) {
            const selectedRadio = group.querySelector('input[type="radio"]:checked');
            hasAnswer = selectedRadio !== null;
            if (hasAnswer) {
                answer = selectedRadio.value;
            }
        }
        // Pour une question de type checkbox, utiliser les valeurs de chaque checkbox cochée
        else if (group.querySelector('.checkbox-group')) {
            const checkboxGroup = group.querySelector('.checkbox-group');
            const selectedCheckboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]:checked');
            const maxRequired = checkboxGroup.getAttribute('data-max');
            
            hasAnswer = selectedCheckboxes.length > 0;
            
            // Check if the required number of responses is met
            if (hasAnswer && maxRequired && parseInt(maxRequired) > 0) {
                if (selectedCheckboxes.length !== parseInt(maxRequired)) {
                    isValid = false;
                    if (!firstInvalidQuestion) {
                        firstInvalidQuestion = group;
                        showNotification(
                            translations[currentLanguage].exactResponsesRequired.replace('{count}', maxRequired),
                            "error"
                        );
                    }
                }
            }
            
            if (hasAnswer) {
                const selected = Array.from(selectedCheckboxes).map(cb => cb.value).filter(Boolean);
                answer = selected.join(', ');
            }
        }
        // Pour une question de type text, utiliser la valeur du textarea
        else if (group.querySelector('textarea')) {
            const textarea = group.querySelector('textarea');
            hasAnswer = textarea && textarea.value.trim().length > 0;
            if (hasAnswer) {
                answer = textarea.value.trim();
            }
        }
        // Pour les types barem et nps, on récupère la valeur des inputs cachés
        else if (group.querySelector('.rating-container')) {
            const ratingInput = group.querySelector('.rating-value');
            hasAnswer = ratingInput && ratingInput.value.trim() && ratingInput.value !== "0";
            if (hasAnswer) {
                answer = ratingInput.value.trim();
            }
        }
        else if (group.querySelector('.nps-container')) {
            const npsInput = group.querySelector('.nps-value');
            hasAnswer = npsInput && npsInput.value.trim() && npsInput.value !== "-1";
            if (hasAnswer) {
                answer = npsInput.value.trim();
            }
        }

        if (!hasAnswer && !firstEmptyQuestion) {
            firstEmptyQuestion = group;
            // On continue la boucle pour collecter les réponses valides
        } else if (!isValid) {
            // Already handled above
        } else if (hasAnswer) {
            // Assemble la réponse en utilisant la question originale (en français)
            questionnaireResponses.push(`${questionText}: ${answer}`);
        }
    }
    
    if (firstInvalidQuestion) {
        firstInvalidQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    if (firstEmptyQuestion) {
        showNotification(translations[currentLanguage].notificationQuestions, "error");
        firstEmptyQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // 3. Validation de la note de satisfaction (la valeur des inputs rating/nps reste inchangée)
    const satisfactionInput = document.querySelector('input[name="satisfaction"].rating-value');
    const satisfaction = satisfactionInput ? satisfactionInput.value.trim() : "";
    
    if (!satisfaction || satisfaction === "0") {
        showNotification(translations[currentLanguage].notificationSatisfaction, "error");
        const satisfactionContainer = document.querySelector('.rating-container');
        if (satisfactionContainer) {
            satisfactionContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // 4. Récupération du commentaire final
    const commentairesElem = document.getElementById('commentaires');
    const commentaires = commentairesElem ? (commentairesElem.value.trim() || "Aucun message") : "Aucun message";
    
    // 5. Préparation des données à envoyer
    const data = {
        sexe: genreFinal,
        age: age,
        poste: poste,
        // On envoie la liste des réponses avec les questions originales (en français)
        questionnaireResponses: questionnaireResponses.join(' | '),
        satisfaction: satisfaction,
        commentaires: commentaires,
        timestamp: new Date().toISOString()
    };
    
    const params = new URLSearchParams({
        action: "submitResponse",
        sexe: data.sexe,
        age: data.age,
        poste: data.poste,
        questionnaireResponses: data.questionnaireResponses,
        satisfaction: data.satisfaction,
        commentaires: data.commentaires,
        timestamp: data.timestamp
    });
    
    // 6. Envoi des données
    try {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = translations[currentLanguage].notificationSending;
        
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi des données");
        }
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        
        // Afficher la notification de succès
        showNotification(translations[currentLanguage].successMessage, "success");
        
        // Définir un cookie pour indiquer que le questionnaire a été complété
        setCookie('questionnaireCompleted', 'true', 7); // Cookie valide pendant 1 semaine
        
        // Réinitialiser le formulaire
        form.reset();
            
        // Afficher la fenêtre modale de succès au lieu de rafraîchir la page
        showSuccessModal();
    } catch (error) {
        console.error("Erreur:", error);
        showNotification(translations[currentLanguage].notificationError, "error");
        
        // Réactiver le bouton d'envoi
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = false;
        submitButton.innerHTML = translations[currentLanguage].submit;
    }
}

// Fonction pour mettre en évidence le lien actif dans la navigation
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.endsWith(linkPath) || 
            (currentPath === '/' && linkPath === 'index.html') ||
            (currentPath === '/' && linkPath === './index.html') ||
            (currentPath.endsWith('/index.html') && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialisation au chargement de la page fix du problème de la navigation active !
document.addEventListener('DOMContentLoaded', function() {
    // Toujours initialiser la navigation active
    setActiveNavLink();

    // Vérifier si le formulaire questionnaire existe ; s'il existe, l'initialiser.
    const questionnaireForm = document.getElementById('questionnaireForm');
    const disclaimerModal = document.getElementById('disclaimerModal');
    
    if (questionnaireForm) {
        // Vérifier le consentement avant même de montrer le disclaimer modal
        const consentGiven = localStorage.getItem('consentGiven') === 'true';
        const consentCheck = document.getElementById('consent-check');
        const questionnaireContent = document.getElementById('questionnaire-content');
        
        if (!consentGiven && (window.location.pathname.includes('questionnaire.html') || questionnaireForm)) {
            // Afficher la section de blocage d'accès et masquer le questionnaire
            if (consentCheck) consentCheck.style.display = 'block';
            if (questionnaireContent) questionnaireContent.style.display = 'none';
            return; // Sortir de l'initialisation
        } else {
            // Masquer la section de blocage et afficher le questionnaire
            if (consentCheck) consentCheck.style.display = 'none';
            if (questionnaireContent) questionnaireContent.style.display = 'block';
            
        // Pour s'assurer que le modal de disclaimer est géré uniquement quand il existe
        if (window.location.pathname.includes('questionnaire.html') || questionnaireForm) {
            if (disclaimerModal) {
                const acceptButton = document.getElementById('acceptDisclaimer');
                if (!localStorage.getItem('disclaimerAccepted')) {
                    disclaimerModal.style.display = 'block';
                    questionnaireForm.style.display = 'none';
                } else {
                    disclaimerModal.style.display = 'none';
                    questionnaireForm.style.display = 'block';
                }

                // Gestion du disclaimer
                acceptButton.addEventListener('click', function() {
                    disclaimerModal.style.display = 'none';
                    questionnaireForm.style.display = 'block';
                    localStorage.setItem('disclaimerAccepted', 'true');
                });
            }
            // Initialiser le questionnaire (si l'élément existe, on l'appelle)
            initQuestionnaire();
                
                // Initialiser la barre de progression
                updateProgressBar();
                
                // Make sure translations are applied once questions are loaded
                setTimeout(() => {
                    if (typeof updateTranslatedQuestions === 'function') {
                        updateTranslatedQuestions();
                    }
                }, 500);
            
            // Ajouter l'écouteur d'événement de soumission du formulaire
            questionnaireForm.addEventListener('submit', submitQuestionnaire);
            }
        }
    }

    // Initialiser NPS (si présent sur la page)
    initializeNps();
});

// Fonction pour obtenir une traduction à partir d'une clé
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
