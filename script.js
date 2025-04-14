// Configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgw7jsDjOOsOOIHP7QiuQhcsujugSL_zh676HN0K6tjuWFSAqXs-wsyRqLq8Nc3nb8cA/exec';

// Éléments du DOM
let form = null;
let questionsContainer = null;

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
    
    if (form && questionsContainer) {
        checkQuestionnaireStatus();
    }
}

// Fonction pour vérifier l'état du questionnaire
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
            if (data.values) {
                displayQuestions(data.values);
            } else {
                console.warn('Aucune question trouvée');
                questionsContainer.innerHTML = `<p>${translations[currentLanguage].notificationNoQuestions}</p>`;
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            questionsContainer.innerHTML = `<p class="error">${translations[currentLanguage].notificationLoadingError}: ${error.message}</p>`;
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
  
  function displayQuestions(questions) {
    // Clear container and sort questions by order
    questionsContainer.innerHTML = '';
    questions.sort((a, b) => a.order - b.order);

    questions.forEach((question, index) => {
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
        let inputContent = createResponseInput(question.type, question.responses, index);
        // If inputContent is a string (e.g. for textarea), use innerHTML,
        // otherwise (for radio, checkbox, barem, nps) it is a DOM node.
        if (typeof inputContent === "string") {
            const inputContainer = document.createElement('div');
            inputContainer.innerHTML = inputContent;
            questionElement.appendChild(inputContainer);
        } else {
            questionElement.appendChild(inputContent);
        }

        // Append the question element to the container
        questionsContainer.appendChild(questionElement);
    });

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
    }, 0);
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

    // Update choice type labels
    const ratingContainers = document.querySelectorAll('.rating');
    const checkboxContainers = document.querySelectorAll('.checkbox-group');
    
    ratingContainers.forEach(container => {
        container.setAttribute('data-translate-single-choice', translateText('singleChoice'));
    });
    
    checkboxContainers.forEach(container => {
        container.setAttribute('data-translate-multiple-choice', translateText('multipleChoice'));
    });
}


function createResponseInput(type, responses, index) {
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

// Gérer l'affichage du champ libre pour le genre
if (window.location.pathname.includes('questionnaire.html')) {
document.getElementById('sexe').addEventListener('change', function() {
    const autreGenreContainer = document.getElementById('autreGenreContainer');
    const autreGenreInput = document.getElementById('autreGenre');
    
    if (this.value === 'Autre') {
        autreGenreContainer.style.display = 'block';
        autreGenreInput.required = true;
    } else {
        autreGenreContainer.style.display = 'none';
        autreGenreInput.required = false;
        autreGenreInput.value = '';
    }
});
};

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
    const genreFinal = (sexe === 'Autre')
                         ? document.getElementById('autreGenre').value.trim()
                         : sexe;
    if (!sexe || !age || !poste || (sexe === 'Autre' && !genreFinal)) {
        showNotification(translations[currentLanguage].notificationPersonalInfo, "error");
        return;
    }
    
    // 2. Validation du questionnaire dynamique
    const questionnaireResponses = [];
    let firstEmptyQuestion = null;
    const dynamicQuestionGroups = document.querySelectorAll('#questionsContainer .form-group');

    for (const group of dynamicQuestionGroups) {
        const labelElem = group.querySelector('label[data-question]');
        if (!labelElem) continue;

        // On récupère le texte original en français (stocké dans data-original)
        const questionText = labelElem.getAttribute('data-original');
        let answer = "";
        let hasAnswer = false;

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
            const selectedCheckboxes = group.querySelectorAll('input[type="checkbox"]:checked');
            hasAnswer = selectedCheckboxes.length > 0;
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
        } else if (hasAnswer) {
            // Assemble la réponse en utilisant la question originale (en français)
            questionnaireResponses.push(`${questionText}: ${answer}`);
        }
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
        
        showNotification(translations[currentLanguage].notificationSuccess, "success");
        form.reset();
            
        setTimeout(() => {
            window.location.reload();
        }, 2000);
            
    } catch (error) {
        console.error("Erreur:", error);
        showNotification(translations[currentLanguage].notificationError, "error");
    } finally {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = false;
        submitButton.innerHTML = translations[currentLanguage].notificationSubmit;
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
            
            // Ajouter l'écouteur d'événement de soumission du formulaire
            questionnaireForm.addEventListener('submit', submitQuestionnaire);
        }
    }

    // Initialiser NPS (si présent sur la page)
    initializeNps();
});
