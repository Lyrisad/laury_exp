// Configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnhyoZPM8J_Oyme6TFQlO79XLhSHJJstekElArYzn_sLBKxMhErKVTwWfSvISFvw4mYg/exec';

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
        loadQuestions();
        form.addEventListener('submit', submitQuestionnaire);
    }
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
                questionsContainer.innerHTML = '<p>Aucune question trouvée</p>';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            questionsContainer.innerHTML = `<p class="error">Erreur lors du chargement des questions: ${error.message}</p>`;
        });
}

// Afficher les questions dans le formulaire
function displayQuestions(questions) {
    questionsContainer.innerHTML = '';
    questions.sort((a, b) => a.order - b.order);

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'form-group';
        questionElement.innerHTML = `
            <div class="question-separator">Question ${index + 1}</div>
            <label data-question="Question ${question.order}">${question.question}</label>
            ${createResponseInput(question.type, question.responses, index)}
        `;
        questionsContainer.appendChild(questionElement);
    });

    // Initialiser les étoiles de notation
    initializeRatingStars();
}

// Créer l'input approprié selon le type de réponse
function createResponseInput(type, responses, index) {
    switch(type) {
        case 'text':
            return `<textarea name="q${index}" required></textarea>`;
        case 'radio':
            return `
                <div class="rating">
                    ${responses.map((option, i) => `
                        <input type="radio" id="q${index}-${i}" name="q${index}" value="${option}" required>
                        <label for="q${index}-${i}">${option}</label>
                    `).join('')}
                </div>
            `;
        case 'checkbox':
            return `
                <div class="checkbox-group">
                    ${responses.map((option, i) => `
                        <input type="checkbox" id="q${index}-${i}" name="q${index}[]" value="${option}">
                        <label for="q${index}-${i}">${option}</label>
                    `).join('')}
                </div>
            `;
        case 'barem':
            return `
                <div class="rating-container">
                    <div class="rating-stars">
                        ${Array.from({length: 5}, (_, i) => `
                            <div class="star-container" data-value="${i + 1}">
                                <div class="star" data-value="${i + 1}">★</div>
                            </div>
                        `).join('')}
                    </div>
                    <input type="hidden" name="q${index}" class="rating-value" required>
                </div>
            `;
            case 'nps':
                return `
                    <div class="nps-container">
                        <div class="nps-scale">
                            ${Array.from({length: 11}, (_, i) => `
                                <div class="nps-item" data-value="${i}">
                                    <div class="nps-smiley">${getNpsSmiley(i)}</div>
                                    <div class="nps-number">${i}</div>
                                </div>
                            `).join('')}
                        </div>
                        <input type="hidden" name="q${index}" class="nps-value" value="-1" required>
                    </div>
                `;            
        default:
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
        showNotification("Veuillez remplir tous les champs obligatoires (Genre, Age, Poste).", "error");
        return;
    }
    
    // 2. Validation du questionnaire dynamique
    // Sélectionner uniquement les groupes de questions situés dans #questionsContainer
    const questionnaireResponses = [];
    let allQuestionsAnswered = true;
    const dynamicQuestionGroups = document.querySelectorAll('#questionsContainer .form-group');

    for (const group of dynamicQuestionGroups) {
        // On ne traite que les groupes possédant un label obligatoire (avec data-question)
        const labelElem = group.querySelector('label[data-question]');
        if (!labelElem) {
            continue;
        }
        const questionText = labelElem.textContent.trim();
        let answer = "";

        // Gestion des types d'inputs
        // • Type radio (par exemple, pour les questions à choix unique)
        if (group.querySelector('.rating')) {
            const selectedRadio = group.querySelector('input[type="radio"]:checked');
            answer = selectedRadio ? selectedRadio.nextElementSibling.textContent.trim() : "";
        }
        // • Type checkbox (plusieurs réponses possibles)
        else if (group.querySelector('.checkbox-group')) {
            const checkboxes = group.querySelectorAll('input[type="checkbox"]:checked');
            const selected = [];
            checkboxes.forEach(cb => {
                const txt = cb.nextElementSibling ? cb.nextElementSibling.textContent.trim() : "";
                if (txt) selected.push(txt);
            });
            answer = selected.join(', ');
        }
        // • Zone de texte (pour les réponses écrites)
        else if (group.querySelector('textarea')) {
            answer = group.querySelector('textarea').value.trim();
        }
        // • Type barem (si présent dans le questionnaire dynamique)
        else if (group.querySelector('.rating-container')) {
            const ratingInput = group.querySelector('.rating-value');
            answer = ratingInput ? ratingInput.value.trim() : "";
        }
        // • Type NPS (si présent, même si vous ne l'utilisez pas pour la satisfaction finale)
        else if (group.querySelector('.nps-container')) {
            const npsInput = group.querySelector('.nps-value');
            answer = npsInput ? npsInput.value.trim() : "";
        }
        
        if (!answer) {
            allQuestionsAnswered = false;
            break;
        }
        questionnaireResponses.push(`${questionText}: ${answer}`);
    }
    
    if (!allQuestionsAnswered) {
        showNotification("Vous n'avez pas terminé le questionnaire.", "error");
        return;
    }
    
    // 3. Validation de la note de satisfaction (note sur 5 via étoiles)
    const satisfactionInput = document.querySelector('input[name="satisfaction"].rating-value');
    let satisfaction = satisfactionInput ? satisfactionInput.value.trim() : "";
    // On considère qu'une note non renseignée est "0"
    if (!satisfaction || satisfaction === "0") {
        showNotification("Veuillez sélectionner une note de satisfaction.", "error");
        return;
    }
    
    // 4. Récupération du commentaire final (optionnel)
    const commentairesElem = document.getElementById('commentaires');
    const commentaires = commentairesElem ? (commentairesElem.value.trim() || "Aucun message") : "Aucun message";
    
    // 5. Préparation des données à envoyer
    const data = {
        sexe: genreFinal,
        age: age,
        poste: poste,
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
    
    // 6. Envoi des données vers Google Sheets via la Web App
    try {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = "Envoi en cours...";
        
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi des données");
        }
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        
        showNotification("Merci pour votre participation ! Votre questionnaire a été envoyé avec succès.", "success");
        form.reset();

            // Rafraîchir la page après 2 secondes
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
    } catch (error) {
        console.error("Erreur:", error);
        showNotification("Une erreur est survenue lors de l'envoi du questionnaire. Veuillez réessayer.", "error");
    } finally {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = false;
        submitButton.innerHTML = "Envoyer le questionnaire";
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Toujours initialiser la navigation active
    setActiveNavLink();
    
    // Gestion du disclaimer (uniquement sur la page questionnaire)
    if (window.location.pathname.includes('questionnaire.html')) {
        const disclaimerModal = document.getElementById('disclaimerModal');
        const acceptButton = document.getElementById('acceptDisclaimer');
        const questionnaireForm = document.getElementById('questionnaireForm');

        if (disclaimerModal && acceptButton && questionnaireForm) {
            // Vérifier si le disclaimer a déjà été accepté
            if (!localStorage.getItem('disclaimerAccepted')) {
                disclaimerModal.style.display = 'block';
                questionnaireForm.style.display = 'none';
            } else {
                disclaimerModal.style.display = 'none';
                questionnaireForm.style.display = 'block';
            }

            // Gérer l'acceptation du disclaimer
            acceptButton.addEventListener('click', function() {
                disclaimerModal.style.display = 'none';
                questionnaireForm.style.display = 'block';
                localStorage.setItem('disclaimerAccepted', 'true');
            });

            // Initialiser le questionnaire
            initQuestionnaire();
        }
    }

    initializeNps();
});
