// Configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2lYuwtOUoK9sfhAkU9ddP3rWN-EpI_00COZEjL14NVgbmhUQ9RNTYMcBS9Ep5vmJeIA/exec';
const ADMIN_CREDENTIALS = {
    username: 'AdminRH',
    password: 'BaromètreRH25!' // À changer en production
};

// Éléments du DOM
const loginForm = document.getElementById('adminLogin');
const questionsManagement = document.getElementById('questionsManagement');
const questionsContainer = document.getElementById('questionsContainer');
const questionForm = document.getElementById('questionForm');
const questionFormElement = document.getElementById('questionFormElement');
const responseType = document.getElementById('responseType');
const optionsContainer = document.getElementById('optionsContainer');
const optionsList = document.getElementById('optionsList');
const addOptionBtn = document.getElementById('addOption');
const addQuestionBtn = document.getElementById('addQuestion');
const logoutButton = document.getElementById('logoutButton');

// Éléments DOM pour les sections
const addSectionBtn = document.getElementById('addSection');
const sectionModal = document.getElementById('sectionModal');
const closeSectionModal = document.getElementById('closeSectionModal');
const cancelSectionBtn = document.getElementById('cancelSection');
const sectionForm = document.getElementById('sectionForm');
const sectionStartQuestion = document.getElementById('sectionStartQuestion');
const sectionEndQuestion = document.getElementById('sectionEndQuestion');

// Ajout des éléments pour le modal d'édition
const editModal = document.createElement('div');
editModal.className = 'modal';
editModal.innerHTML = `
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Modifier la question</h2>
        <form id="editQuestionForm">
            <div class="form-group">
                <label for="editQuestionOrder">Ordre :</label>
                <input type="number" id="editQuestionOrder" required>
            </div>
            <div class="form-group">
                <label for="editQuestionText">Question :</label>
                <textarea id="editQuestionText" required></textarea>
            </div>
            <div class="form-group">
                <label for="editResponseType">Type de réponse :</label>
                <select id="editResponseType" required>
                    <option value="text">Champ texte</option>
                    <option value="radio">Choix unique</option>
                    <option value="checkbox">Choix multiple</option>
                    <option value="barem">Barem</option>
                    <option value="nps">NPS (0-5)</option>
                </select>
            </div>
            <div id="editOptionsContainer" style="display: none;">
                <h3>Options de réponse</h3>
                <div id="editOptionsList"></div>
                <button type="button" id="editAddOption">Ajouter une option</button>
                <div id="editMaxResponsesContainer" style="display: none; margin-top: 15px;">
                    <label for="editMaxResponses">Nombre de réponses attendues :</label>
                    <select id="editMaxResponses">
                        <option value="0">Illimité</option>
                        <option value="1">1 réponse</option>
                        <option value="2">2 réponses</option>
                        <option value="3">3 réponses</option>
                        <option value="4">4 réponses</option>
                        <option value="5">5 réponses</option>
                    </select>
                </div>
            </div>
            <button type="submit">Enregistrer les modifications</button>
        </form>
    </div>
`;
document.body.appendChild(editModal);

// Gestionnaire d'événements pour le bouton de fermeture du modal
editModal.querySelector('.close-button').addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Gestionnaire d'événements pour le bouton d'ajout d'option dans le modal d'édition
document.getElementById('editAddOption').addEventListener('click', function() {
    const optionInput = document.createElement('div');
    optionInput.className = 'option-input';
    optionInput.innerHTML = `
        <input type="text" placeholder="Option de réponse">
        <button type="button" onclick="this.parentElement.remove()">Supprimer</button>
    `;
    document.getElementById('editOptionsList').appendChild(optionInput);
});

// Gestionnaire d'événements pour le changement de type de réponse dans le modal d'édition
document.getElementById('editResponseType').addEventListener('change', function() {
    // Afficher le container d'options uniquement pour 'radio' ou 'checkbox'
    document.getElementById('editOptionsContainer').style.display = (this.value === 'radio' || this.value === 'checkbox') ? 'block' : 'none';
    // Afficher le container de max responses uniquement pour 'checkbox'
    document.getElementById('editMaxResponsesContainer').style.display = this.value === 'checkbox' ? 'block' : 'none';
});

// Fonction pour afficher des notifications stylées
function showNotification(message, type = 'success') {
    const colors = {
        success: 'linear-gradient(to right, #00b09b, #96c93d)',
        error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        warning: 'linear-gradient(to right, #f7b733, #fc4a1a)',
        info: 'linear-gradient(to right, #00b09b, #96c93d)'
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
        onClick: function(){} // Callback après le clic
    }).showToast();
}

// Gestionnaire d'événements pour le formulaire d'édition
document.getElementById('editQuestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const order = document.getElementById('editQuestionOrder').value;
    const text = document.getElementById('editQuestionText').value;
    const type = document.getElementById('editResponseType').value;
    const originalOrder = this.dataset.originalOrder;
    
    if (!order || !text || !type) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    let responses = [];
    let maxResponses = 0;
    
    if (type === 'radio' || type === 'checkbox') {
        responses = Array.from(document.getElementById('editOptionsList').children).map(option => 
            option.querySelector('input').value
        ).filter(value => value.trim() !== '');
        
        if (responses.length === 0) {
            showNotification('Veuillez ajouter au moins une option de réponse', 'error');
            return;
        }
        
        // Get maxResponses value if question type is checkbox
        if (type === 'checkbox') {
            maxResponses = parseInt(document.getElementById('editMaxResponses').value);
        }
    }

    // Ajouter la classe loading au formulaire
    this.classList.add('loading');

    const params = new URLSearchParams({
        action: 'editQuestion',
        originalOrder: originalOrder,
        order: order,
        question: text,
        type: type,
        responses: JSON.stringify(responses),
        maxResponses: maxResponses
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
            if (data.success) {
                showNotification('Question modifiée avec succès', 'success');
                editModal.style.display = 'none';
                loadQuestions();
            } else {
                throw new Error('Erreur inconnue lors de la modification de la question');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la modification de la question: ' + error.message, 'error');
        })
        .finally(() => {
            // Retirer la classe loading du formulaire
            this.classList.remove('loading');
        });
});

// Fonction pour créer le skeleton loading
function createSkeletonLoading() {
    questionsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton skeleton-text" style="width: 30%"></div>
            <div class="skeleton skeleton-text" style="width: 80%"></div>
            <div class="skeleton skeleton-text" style="width: 50%"></div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <div class="skeleton skeleton-button"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `;
        questionsContainer.appendChild(skeletonCard);
    }
}

// Fonction pour définir un cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Fonction pour obtenir un cookie
function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Fonction pour supprimer un cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Fonction pour connecter l'utilisateur
function loginUser() {
    document.getElementById('loginForm').style.display = 'none';
    questionsManagement.style.display = 'block';
    logoutButton.style.display = 'block';
    document.getElementById('toggleStats').style.display = 'block';
    loadQuestions();
    showNotification('Connexion réussie', 'success');
}

// Vérifier la connexion au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const sessionCookie = getCookie('adminSession');
    if (sessionCookie === 'true') {
        loginUser();
    } else {
        document.getElementById('toggleStats').style.display = 'none';
    }
});

// Gestion de l'authentification
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setCookie('adminSession', 'true', 1); // Cookie valide pour 1 jour
        loginUser();
    } else {
        showNotification('Identifiants incorrects', 'error');
    }
});

// Gestion de la déconnexion
logoutButton.addEventListener('click', function() {
    deleteCookie('adminSession');
    document.getElementById('toggleStats').style.display = 'none';
    window.location.reload();
});

// Gestion des questions
function loadQuestions() {
    const url = `${SCRIPT_URL}?action=getQuestions`;
    
    // Afficher le skeleton loading
    createSkeletonLoading();
    
    // Enregistrer le moment de début du chargement
    const loadStartTime = Date.now();
    // Définir une durée minimale pour le skeleton loading (en ms)
    const minLoadingTime = 2500; // Augmenté à 2.5 secondes
    
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
                    questionsContainer.innerHTML = '<p>Aucune question trouvée</p>';
                }
            }, remainingDelay);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des questions:', error);
            
            // Calculer le temps écoulé depuis le début du chargement
            const elapsedTime = Date.now() - loadStartTime;
            // Déterminer le délai restant pour atteindre la durée minimale
            const remainingDelay = Math.max(0, minLoadingTime - elapsedTime);
            
            // Afficher l'erreur après le délai minimum
            setTimeout(() => {
                questionsContainer.innerHTML = `<p class="error">Erreur lors du chargement des questions: ${error.message}</p>`;
            }, remainingDelay);
        });
}

function displayQuestions(questions, isInitialLoad = false) {
    // Ne pas effacer le skeleton pendant le chargement initial
    if (!isInitialLoad) {
        questionsContainer.innerHTML = '';
    }
    
    // Trier les questions par ordre
    questions.sort((a, b) => a.order - b.order);
    
    // Récupérer les sections (ajout d'une nouvelle requête)
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
                // Check if the error is related to the sheet not existing
                if (data.error.includes("Sheet not found") || data.error.includes("Sections")) {
                    throw new Error("La feuille 'Sections' n'existe pas. Elle sera créée la prochaine fois que vous ajouterez une section.");
                }
                // Check for spreadsheet access errors
                if (data.error.includes("openById") || data.error.includes("accéder à la feuille de calcul")) {
                    throw new Error("Impossible d'accéder à la feuille de calcul Google. Vérifiez l'ID et les permissions du script.");
                }
                throw new Error(data.error);
            }
            
            // Maintenant que nous avons les sections, effacer le contenu du conteneur
            questionsContainer.innerHTML = '';
            
            const sections = data.sections || [];
            
            // Afficher les questions avec les sections
            let currentOrder = 0;
            
            sections.forEach(section => {
                // Vérifier si la section doit être affichée ici
                if (parseInt(section.startQuestion) > currentOrder) {
                    // Afficher les questions avant la section
                    for (let i = currentOrder; i < parseInt(section.startQuestion); i++) {
                        const questionToDisplay = questions.find(q => q.order === i);
                        if (questionToDisplay) {
                            appendQuestionElement(questionToDisplay);
                        }
                    }
                }
                
                // Afficher la section
                appendSectionElement(section);
                
                // Afficher les questions contenues dans cette section
                for (let i = parseInt(section.startQuestion); i <= parseInt(section.endQuestion); i++) {
                    const questionToDisplay = questions.find(q => q.order === i);
                    if (questionToDisplay) {
                        appendQuestionElement(questionToDisplay);
                    }
                }
                
                // Mettre à jour l'ordre actuel
                currentOrder = parseInt(section.endQuestion) + 1;
            });
            
            // Afficher les questions restantes
            for (let i = currentOrder; i <= questions.length; i++) {
                const questionToDisplay = questions.find(q => q.order === i);
                if (questionToDisplay) {
                    appendQuestionElement(questionToDisplay);
                }
            }
            
            // S'il n'y a aucune section, afficher toutes les questions normalement
            if (sections.length === 0) {
                questions.forEach(question => {
                    appendQuestionElement(question);
                });
            }
            
            // Ajouter une animation de fade-in au contenu
            fadeInContent();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des sections:', error);
            
            // Maintenant que nous savons qu'il y a une erreur, effacer le contenu du conteneur
            questionsContainer.innerHTML = '';
            
            // Afficher un message plus convivial selon le type d'erreur
            if (error.message.includes("n'existe pas")) {
                showNotification("La feuille 'Sections' n'existe pas encore. Elle sera créée automatiquement lorsque vous ajouterez votre première section.", 'info');
            } else if (error.message.includes("Impossible d'accéder")) {
                showNotification("Impossible d'accéder à la feuille de calcul Google. Vérifiez l'ID de la feuille et les permissions du script Apps Script.", 'error');
            } else {
                showNotification("Erreur lors du chargement des sections: " + error.message, 'error');
            }
            
            // En cas d'erreur, afficher simplement les questions
            questions.forEach(question => {
                appendQuestionElement(question);
            });
            
            // Ajouter une animation de fade-in au contenu
            fadeInContent();
        });
}

// Fonction pour animer l'apparition du contenu
function fadeInContent() {
    // Sélectionner tous les éléments récemment ajoutés
    const elements = questionsContainer.querySelectorAll('.question-item, .section-item');
    
    // Ajouter une classe pour déclencher l'animation de fade-in
    elements.forEach((element, index) => {
        // Retarder chaque élément pour créer un effet de cascade
        setTimeout(() => {
            element.classList.add('fade-in');
        }, 50 * index);
    });
}

// Fonction pour ajouter un élément de question au conteneur
function appendQuestionElement(question) {
    const questionElement = document.createElement('div');
    questionElement.className = 'question-item';
    
    // Création de la section des réponses possibles
    let responsesHtml = '';
    if (question.type === 'radio' || question.type === 'checkbox') {
        responsesHtml = `
            <div class="responses-list">
                <h4>Réponses possibles :</h4>
                <ul>
                    ${question.responses.map(response => `
                        <li>${response}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    questionElement.innerHTML = `
        <div class="header">
            <h3>Question ${question.order}</h3>
            <span class="type-indicator">${question.type === 'text' ? 'Champ texte' : 
                question.type === 'radio' ? 'Choix unique' : 
                question.type === 'checkbox' ? 'Choix multiple' :
                question.type === 'barem' ? 'Barem' : 
                question.type === 'nps' ? 'NPS (0-5)' :  
                question.type
            }</span>
        </div>
        <div class="content">
            <p>${question.question}</p>
            ${responsesHtml}
        </div>
        <div class="actions">
            <button class="edit-button" onclick="editQuestion(${question.order})">Modifier</button>
            <button class="delete-button" onclick="deleteQuestion(${question.order})">Supprimer</button>
        </div>
    `;
    questionsContainer.appendChild(questionElement);
}

// Fonction pour ajouter un élément de section au conteneur
function appendSectionElement(section) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'section-item';
    sectionElement.dataset.sectionId = section.id;
    
    // Calculer le nombre de questions dans cette section
    const questionsCount = parseInt(section.endQuestion) - parseInt(section.startQuestion) + 1;
    
    sectionElement.innerHTML = `
        <h3>${section.title}</h3>
        ${section.description ? `<p>${section.description}</p>` : ''}
        <div class="section-range-display">
            <span class="questions-count-badge">${questionsCount} ${questionsCount > 1 ? 'questions' : 'question'}</span>
            Questions ${section.startQuestion} à ${section.endQuestion}
        </div>
        <div class="section-info">
            <i>Les questions de cette section apparaissent ci-dessous</i>
        </div>
        <div class="actions">
            <button class="edit-button" onclick="editSection('${section.id}')">Modifier</button>
            <button class="delete-button" onclick="deleteSection('${section.id}')">Supprimer</button>
        </div>
    `;
    
    questionsContainer.appendChild(sectionElement);
}

// Gestion du formulaire de question
responseType.addEventListener('change', function() {
    const selectedType = this.value;
    // Afficher les options uniquement pour 'radio' ou 'checkbox'
    optionsContainer.style.display = (selectedType === 'radio' || selectedType === 'checkbox') ? 'block' : 'none';
    // Afficher le container de max responses uniquement pour 'checkbox'
    document.getElementById('maxResponsesContainer').style.display = selectedType === 'checkbox' ? 'block' : 'none';
    
    // Ajuster le placeholder du texte de la question selon le type
    const questionText = document.getElementById('questionText');
    if (selectedType === 'barem') {
        questionText.placeholder = "Entrez la question pour l'évaluation sur 5";
    } else if (selectedType === 'nps') {
        questionText.placeholder = "Entrez la question pour l'évaluation sur 10";
    } else if (selectedType === 'radio') {
        questionText.placeholder = "Entrez la question pour le choix unique";
    } else if (selectedType === 'checkbox') {
        questionText.placeholder = "Entrez la question pour le choix multiple";
    } else {
        questionText.placeholder = "Entrez votre question";
    }
});


addOptionBtn.addEventListener('click', function() {
    const optionInput = document.createElement('div');
    optionInput.className = 'option-input';
    optionInput.innerHTML = `
        <input type="text" placeholder="Option de réponse">
        <button type="button" onclick="this.parentElement.remove()">Supprimer</button>
    `;
    optionsList.appendChild(optionInput);
});

addQuestionBtn.addEventListener('click', function() {
    // Récupérer le nombre de questions existantes
    const questions = Array.from(questionsContainer.children);
    const nextOrder = questions.length + 1;
    
    // Préremplir le champ d'ordre
    document.getElementById('questionOrder').value = nextOrder;
    
    // Afficher le modal
    questionForm.style.display = 'block';
});

questionFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const order = document.getElementById('questionOrder').value;
    const text = document.getElementById('questionText').value;
    const type = responseType.value;
    
    if (!order || !text || !type) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    let responses = [];
    let maxResponses = 0;
    if (type !== 'text' && type !== 'barem' && type !== 'nps') {
        responses = Array.from(optionsList.children).map(option => 
            option.querySelector('input').value
        ).filter(value => value.trim() !== '');
        
        if (responses.length === 0) {
            showNotification('Veuillez ajouter au moins une option de réponse', 'error');
            return;
        }
        
        // Get maxResponses value if question type is checkbox
        if (type === 'checkbox') {
            maxResponses = parseInt(document.getElementById('maxResponses').value);
        }
    }

    // Ajouter la classe loading au formulaire
    questionFormElement.classList.add('loading');

    const params = new URLSearchParams({
        action: 'addQuestion',
        order: order,
        question: text,
        type: type,
        responses: JSON.stringify(responses),
        maxResponses: maxResponses
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
            if (data.success) {
                showNotification('Question ajoutée avec succès', 'success');
                questionForm.style.display = 'none';
                loadQuestions();
            } else {
                throw new Error('Erreur inconnue lors de l\'ajout de la question');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de l\'ajout de la question: ' + error.message, 'error');
        })
        .finally(() => {
            // Retirer la classe loading du formulaire
            questionFormElement.classList.remove('loading');
        });
});

function editQuestion(order) {
    // Ajouter la classe loading au conteneur
    questionsContainer.classList.add('loading');

    const params = new URLSearchParams({
        action: 'getQuestion',
        order: order
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
            if (data.question) {
                const question = data.question;
                
                // Remplir le formulaire d'édition
                document.getElementById('editQuestionOrder').value = question.order;
                document.getElementById('editQuestionText').value = question.question;
                document.getElementById('editResponseType').value = question.type;
                
                // Gérer les options de réponse
                const optionsList = document.getElementById('editOptionsList');
                optionsList.innerHTML = '';
                
                if ((question.type === 'radio' || question.type === 'checkbox') && question.responses) {
                    question.responses.forEach(response => {
                        const optionInput = document.createElement('div');
                        optionInput.className = 'option-input';
                        optionInput.innerHTML = `
                            <input type="text" value="${response}" placeholder="Option de réponse">
                            <button type="button" onclick="this.parentElement.remove()">Supprimer</button>
                        `;
                        optionsList.appendChild(optionInput);
                    });
                }
                
                // Afficher/masquer le conteneur d'options
                document.getElementById('editOptionsContainer').style.display = 
                    (question.type === 'radio' || question.type === 'checkbox') ? 'block' : 'none';
                
                // Afficher/masquer et définir la valeur du conteneur maxResponses
                const editMaxResponsesContainer = document.getElementById('editMaxResponsesContainer');
                editMaxResponsesContainer.style.display = question.type === 'checkbox' ? 'block' : 'none';
                
                // Set maxResponses value if present
                if (question.type === 'checkbox' && question.maxResponses !== undefined) {
                    document.getElementById('editMaxResponses').value = question.maxResponses;
                } else {
                    // Default to unlimited (0) if not specified
                    document.getElementById('editMaxResponses').value = '0';
                }
                
                // Stocker l'ordre original pour la mise à jour
                document.getElementById('editQuestionForm').dataset.originalOrder = order;
                
                // Afficher le modal
                editModal.style.display = 'block';
            } else {
                throw new Error('Question non trouvée');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors du chargement de la question: ' + error.message, 'error');
        })
        .finally(() => {
            // Retirer la classe loading du conteneur
            questionsContainer.classList.remove('loading');
        });
}

// Variables pour le modal de confirmation
const confirmModal = document.getElementById('confirmModal');
const confirmCancel = document.getElementById('confirmCancel');
const confirmDelete = document.getElementById('confirmDelete');
let currentQuestionToDelete = null;

// Gestionnaires d'événements pour le modal de confirmation
confirmCancel.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});

confirmDelete.addEventListener('click', () => {
    if (currentQuestionToDelete) {
        deleteQuestionConfirmed(currentQuestionToDelete);
    }
    confirmModal.style.display = 'none';
});

// Fonction pour supprimer une question après confirmation
function deleteQuestionConfirmed(order) {
    // Ajouter la classe loading au conteneur
    questionsContainer.classList.add('loading');

    const params = new URLSearchParams({
        action: 'deleteQuestion',
        order: order
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
            if (data.success) {
                showNotification('Question supprimée avec succès', 'success');
                loadQuestions();
            } else {
                throw new Error('Erreur inconnue lors de la suppression de la question');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la suppression de la question: ' + error.message, 'error');
        })
        .finally(() => {
            // Retirer la classe loading du conteneur
            questionsContainer.classList.remove('loading');
        });
}

// Fonction pour afficher le modal de confirmation
function deleteQuestion(order) {
    currentQuestionToDelete = order;
    confirmModal.style.display = 'block';
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
    // Initialiser la navigation active
    setActiveNavLink();
});

// Modal de confirmation pour la clôture du baromètre
const closeQuestionnaireModal = document.createElement('div');
closeQuestionnaireModal.className = 'modal';
closeQuestionnaireModal.innerHTML = `
    <div class="modal-content confirm-modal">
        <div class="confirm-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h3>Confirmer la clôture du baromètre</h3>
        <p>Êtes-vous sûr de vouloir clôturer le baromètre ? Cette action est réversible.</p>
        <div class="confirm-buttons">
            <button id="closeQuestionnaireCancel" class="secondary-button">Annuler</button>
            <button id="closeQuestionnaireConfirm" class="delete-button">Clôturer</button>
        </div>
    </div>
`;
document.body.appendChild(closeQuestionnaireModal);

// Gestionnaire d'événements pour le bouton de clôture
document.getElementById('closeQuestionnaire').addEventListener('click', function() {
    closeQuestionnaireModal.style.display = 'block';
});

// Gestionnaire d'événements pour l'annulation de la clôture
document.getElementById('closeQuestionnaireCancel').addEventListener('click', function() {
    closeQuestionnaireModal.style.display = 'none';
});

// Fonction pour mettre à jour l'interface en fonction du statut
function updateUIForStatus(isOpen) {
    const closeButton = document.getElementById('closeQuestionnaire');
    const confirmButton = document.getElementById('closeQuestionnaireConfirm');
    const modalTitle = closeQuestionnaireModal.querySelector('h3');
    const modalText = closeQuestionnaireModal.querySelector('p');

    // S'assurer que isOpen est un booléen en comparant avec "TRUE"
    isOpen = isOpen === true || isOpen === "TRUE";

    if (isOpen) {
        closeButton.textContent = '🔒 Clôturer le baromètre';
        closeButton.className = 'cta-button warning';
        confirmButton.textContent = 'Clôturer';
        modalTitle.textContent = 'Confirmer la clôture du baromètre';
        modalText.textContent = 'Êtes-vous sûr de vouloir clôturer le baromètre ? Cette action est réversible.';
    } else {
        closeButton.textContent = '🔓 Ouvrir le baromètre';
        confirmButton.textContent = 'Ouvrir';
        modalTitle.textContent = 'Confirmer l\'ouverture du baromètre';
        modalText.textContent = 'Êtes-vous sûr de vouloir ouvrir le baromètre ? Cette action est réversible.';
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
            // Convertir explicitement le statut en booléen
            const isOpen = data.status === "TRUE";
            updateUIForStatus(isOpen);
        })
        .catch(error => {
            console.error('Erreur lors de la vérification du statut:', error);
        });
}

// Appeler checkQuestionnaireStatus au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    checkQuestionnaireStatus();
});

// Gestionnaire d'événements pour la confirmation de la clôture/ouverture
document.getElementById('closeQuestionnaireConfirm').addEventListener('click', function() {
    //disable the button for 2 seconds
    document.getElementById('closeQuestionnaireConfirm').disabled = true;
    document.getElementById('closeQuestionnaireConfirm').style.opacity = 0.5;
    document.getElementById('closeQuestionnaireConfirm').style.cursor = 'not-allowed';
    setTimeout(() => {
        document.getElementById('closeQuestionnaireConfirm').disabled = false;
        document.getElementById('closeQuestionnaireConfirm').style.opacity = 1;
        document.getElementById('closeQuestionnaireConfirm').style.cursor = 'pointer';
    }, 2000);
    const params = new URLSearchParams({
        action: 'toggleQuestionnaireStatus'
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
            if (data.success) {
                showNotification('Statut du questionnaire mis à jour avec succès', 'success');
                closeQuestionnaireModal.style.display = 'none';
                // Mettre à jour l'interface après le changement de statut
                checkQuestionnaireStatus();
            } else {
                throw new Error('Erreur inconnue lors de la mise à jour du statut');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la mise à jour du statut : ' + error.message, 'error');
        });
});

// Fonction pour mettre à jour les statistiques de clics
function updateClickStats() {
    const params = new URLSearchParams({
        action: 'getClickStats'
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
            
            // Mettre à jour les statistiques globales
            document.getElementById('totalClicks').textContent = data.totalClicks;
            document.getElementById('totalPageViews').textContent = data.totalPageViews;
            document.getElementById('clickThroughRate').textContent = `${data.ctr.toFixed(2)}%`;
            
            // Mettre à jour les statistiques des visiteurs et réponses
            document.getElementById('totalVisitors').textContent = data.totalVisitors || 0;
            
            // Récupérer le nombre de réponses au baromètre
            return fetch(`${SCRIPT_URL}?action=getTotalResponses`);
        })
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
            document.getElementById('totalResponses').textContent = data.totalResponses || 0;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des statistiques:', error);
        });
}

// Mettre à jour les statistiques de clics toutes les 30 secondes
setInterval(updateClickStats, 30000);

// Mettre à jour les statistiques de clics au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateClickStats();
});

// Gestionnaire d'événements pour le bouton de réinitialisation des statistiques
document.getElementById('resetClickStats').addEventListener('click', function() {
    // Afficher le modal de confirmation
    document.getElementById('resetStatsModal').style.display = 'block';
});

// Gestionnaire d'événements pour l'annulation de la réinitialisation des statistiques
document.getElementById('resetStatsCancel').addEventListener('click', function() {
    document.getElementById('resetStatsModal').style.display = 'none';
});

// Gestionnaire d'événements pour la confirmation de la réinitialisation des statistiques
document.getElementById('resetStatsConfirm').addEventListener('click', function() {
    // Désactiver le bouton pendant 2 secondes
    document.getElementById('resetStatsConfirm').disabled = true;
    document.getElementById('resetStatsConfirm').style.opacity = 0.5;
    document.getElementById('resetStatsConfirm').style.cursor = 'not-allowed';

    const params = new URLSearchParams({
        action: 'resetClickStats'
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
            if (data.success) {
                showNotification('Statistiques de clics réinitialisées avec succès', 'success');
                document.getElementById('resetStatsModal').style.display = 'none';
                // Mettre à jour les statistiques affichées
                updateClickStats();
            } else {
                throw new Error('Erreur inconnue lors de la réinitialisation des statistiques');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la réinitialisation des statistiques : ' + error.message, 'error');
        })
        .finally(() => {
            // Réactiver le bouton après 2 secondes
            setTimeout(() => {
                document.getElementById('resetStatsConfirm').disabled = false;
                document.getElementById('resetStatsConfirm').style.opacity = 1;
                document.getElementById('resetStatsConfirm').style.cursor = 'pointer';
            }, 2000);
        });
});

// Gestionnaire d'événements pour le bouton de suppression de toutes les questions
document.getElementById('deleteAllQuestions').addEventListener('click', function() {
    // Afficher le modal de confirmation
    document.getElementById('deleteAllQuestionsModal').style.display = 'block';
});

// Gestionnaire d'événements pour l'annulation de la suppression de toutes les questions
document.getElementById('deleteAllQuestionsCancel').addEventListener('click', function() {
    document.getElementById('deleteAllQuestionsModal').style.display = 'none';
});

// Gestionnaire d'événements pour la confirmation de la suppression de toutes les questions
document.getElementById('deleteAllQuestionsConfirm').addEventListener('click', function() {
    // Désactiver le bouton pendant 2 secondes
    document.getElementById('deleteAllQuestionsConfirm').disabled = true;
    document.getElementById('deleteAllQuestionsConfirm').style.opacity = 0.5;
    document.getElementById('deleteAllQuestionsConfirm').style.cursor = 'not-allowed';

    // Ajouter la classe loading au conteneur
    questionsContainer.classList.add('loading');

    const params = new URLSearchParams({
        action: 'deleteAllQuestions'
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
            if (data.success) {
                showNotification('Toutes les questions ont été supprimées avec succès', 'success');
                document.getElementById('deleteAllQuestionsModal').style.display = 'none';
                loadQuestions(); // Recharger la liste des questions
            } else {
                throw new Error('Erreur inconnue lors de la suppression des questions');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la suppression des questions : ' + error.message, 'error');
        })
        .finally(() => {
            // Retirer la classe loading du conteneur
            questionsContainer.classList.remove('loading');
            // Réactiver le bouton après 2 secondes
            setTimeout(() => {
                document.getElementById('deleteAllQuestionsConfirm').disabled = false;
                document.getElementById('deleteAllQuestionsConfirm').style.opacity = 1;
                document.getElementById('deleteAllQuestionsConfirm').style.cursor = 'pointer';
            }, 2000);
        });
});

// Gestionnaire d'événements pour le bouton de suppression de toutes les réponses
document.getElementById('deleteAllResponses').addEventListener('click', function() {
    // Afficher le modal de confirmation
    document.getElementById('deleteAllResponsesModal').style.display = 'block';
});

// Gestionnaire d'événements pour l'annulation de la suppression de toutes les réponses
document.getElementById('deleteAllResponsesCancel').addEventListener('click', function() {
    document.getElementById('deleteAllResponsesModal').style.display = 'none';
});

// Gestionnaire d'événements pour la confirmation de la suppression de toutes les réponses
document.getElementById('deleteAllResponsesConfirm').addEventListener('click', function() {
    // Désactiver le bouton pendant 2 secondes
    document.getElementById('deleteAllResponsesConfirm').disabled = true;
    document.getElementById('deleteAllResponsesConfirm').style.opacity = 0.5;
    document.getElementById('deleteAllResponsesConfirm').style.cursor = 'not-allowed';

    const params = new URLSearchParams({
        action: 'deleteAllResponses'
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
            if (data.success) {
                showNotification('Toutes les réponses ont été supprimées avec succès', 'success');
                document.getElementById('deleteAllResponsesModal').style.display = 'none';
                // Mettre à jour les statistiques
                updateClickStats();
                // Recharger les graphiques et statistiques
                if (typeof loadStats === 'function') {
                    loadStats();
                }
            } else {
                throw new Error('Erreur inconnue lors de la suppression des réponses');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la suppression des réponses : ' + error.message, 'error');
        })
        .finally(() => {
            // Réactiver le bouton après 2 secondes
            setTimeout(() => {
                document.getElementById('deleteAllResponsesConfirm').disabled = false;
                document.getElementById('deleteAllResponsesConfirm').style.opacity = 1;
                document.getElementById('deleteAllResponsesConfirm').style.cursor = 'pointer';
            }, 2000);
        });
});

// Ajout du gestionnaire d'événement pour le bouton d'ajout de section
if (addSectionBtn) {
    addSectionBtn.addEventListener('click', function() {
        console.log('addSectionBtn clicked');
        // Mettre à jour les listes déroulantes des questions
        updateQuestionSelects();
        // Réinitialiser le formulaire
        sectionForm.reset();
        // Modifier le titre du modal pour l'ajout
        document.querySelector('#sectionModal h2').innerHTML = '<span class="title-icon">📑</span> Ajouter une section';
        // Afficher le modal
        sectionModal.style.display = 'block';
    });
}

// Fermer le modal de section
if (closeSectionModal) {
    closeSectionModal.addEventListener('click', function() {
        sectionModal.style.display = 'none';
    });
}

// Annuler la création/édition de section
if (cancelSectionBtn) {
    cancelSectionBtn.addEventListener('click', function() {
        sectionModal.style.display = 'none';
    });
}

// Fonction pour mettre à jour les listes déroulantes des questions
function updateQuestionSelects() {
    if (!sectionStartQuestion || !sectionEndQuestion) return;
    
    // Vider les listes
    sectionStartQuestion.innerHTML = '<option value="">Sélectionnez...</option>';
    sectionEndQuestion.innerHTML = '<option value="">Sélectionnez...</option>';
    
    // Récupérer les questions existantes
    const params = new URLSearchParams({
        action: 'getQuestions'
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
            if (data.values) {
                // Trier les questions par ordre
                const questions = data.values.sort((a, b) => a.order - b.order);
                
                // Ajouter les options aux listes déroulantes
                questions.forEach(question => {
                    const option = document.createElement('option');
                    option.value = question.order;
                    option.textContent = `Question ${question.order}: ${question.question.substring(0, 40)}${question.question.length > 40 ? '...' : ''}`;
                    
                    sectionStartQuestion.appendChild(option.cloneNode(true));
                    sectionEndQuestion.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des questions :', error);
            showNotification('Erreur lors du chargement des questions : ' + error.message, 'error');
        });
}

// Événement de soumission du formulaire de section
if (sectionForm) {
    sectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('sectionTitle').value;
        const description = document.getElementById('sectionDescription').value;
        const startQuestion = sectionStartQuestion.value;
        const endQuestion = sectionEndQuestion.value;
        const sectionId = this.dataset.sectionId || '';
        
        if (!title || !startQuestion || !endQuestion) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        if (parseInt(startQuestion) > parseInt(endQuestion)) {
            showNotification('La question de début doit être avant la question de fin', 'error');
            return;
        }
        
        // Ajouter un indicateur de chargement
        this.classList.add('loading');
        
        // Préparer les paramètres de la requête
        const params = new URLSearchParams({
            action: sectionId ? 'editSection' : 'addSection',
            sectionId: sectionId,
            title: title,
            description: description,
            startQuestion: startQuestion,
            endQuestion: endQuestion
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
                if (data.success) {
                    showNotification(sectionId ? 'Section modifiée avec succès' : 'Section ajoutée avec succès', 'success');
                    sectionModal.style.display = 'none';
                    loadQuestions(); // Recharger les questions et sections
                } else {
                    throw new Error('Erreur inconnue lors de la ' + (sectionId ? 'modification' : 'création') + ' de la section');
                }
            })
            .catch(error => {
                console.error('Erreur détaillée:', error);
                showNotification('Erreur: ' + error.message, 'error');
            })
            .finally(() => {
                // Retirer l'indicateur de chargement
                this.classList.remove('loading');
            });
    });
}

// Fonction pour éditer une section
function editSection(sectionId) {
    // Récupérer les informations de la section
    const params = new URLSearchParams({
        action: 'getSection',
        sectionId: sectionId
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
            if (data.section) {
                // Mettre à jour les champs du formulaire
                document.getElementById('sectionTitle').value = data.section.title;
                document.getElementById('sectionDescription').value = data.section.description || '';
                
                // Mettre à jour les listes déroulantes avant de sélectionner les valeurs
                updateQuestionSelects();
                
                // Sélectionner les bonnes options après un court délai pour laisser le temps aux options d'être chargées
                setTimeout(() => {
                    sectionStartQuestion.value = data.section.startQuestion;
                    sectionEndQuestion.value = data.section.endQuestion;
                }, 500);
                
                // Stocker l'ID de la section
                sectionForm.dataset.sectionId = sectionId;
                
                // Modifier le titre du modal pour l'édition
                document.querySelector('#sectionModal h2').innerHTML = '<span class="title-icon">📑</span> Modifier la section';
                
                // Afficher le modal
                sectionModal.style.display = 'block';
            } else {
                throw new Error('Section non trouvée');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors du chargement de la section: ' + error.message, 'error');
        });
}

// Fonction pour supprimer une section
function deleteSection(sectionId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
        return;
    }
    
    // Ajouter un indicateur de chargement
    const sectionItem = document.querySelector(`.section-item[data-section-id="${sectionId}"]`);
    if (sectionItem) {
        sectionItem.classList.add('loading');
    }
    
    const params = new URLSearchParams({
        action: 'deleteSection',
        sectionId: sectionId
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
            if (data.success) {
                showNotification('Section supprimée avec succès', 'success');
                loadQuestions(); // Recharger les questions et sections
            } else {
                throw new Error('Erreur inconnue lors de la suppression de la section');
            }
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            showNotification('Erreur lors de la suppression de la section: ' + error.message, 'error');
            if (sectionItem) {
                sectionItem.classList.remove('loading');
            }
        });
} 