// Configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby01JYE_cdckYrG_cHLQMcsgkqKb_0JJD_oxlqDf2_-OeKglJMgVOqDGAmFKQ3Pba5OSQ/exec';
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123' // À changer en production
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
                    <option value="nps">NPS (0-10)</option>
                </select>
            </div>
            <div id="editOptionsContainer" style="display: none;">
                <h3>Options de réponse</h3>
                <div id="editOptionsList"></div>
                <button type="button" id="editAddOption">Ajouter une option</button>
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
});

// Fonction pour afficher des notifications stylées
function showNotification(message, type = 'success') {
    const colors = {
        success: 'linear-gradient(to right, #00b09b, #96c93d)',
        error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        warning: 'linear-gradient(to right, #f7b733, #fc4a1a)'
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
    if (type !== 'text') {
        responses = Array.from(document.getElementById('editOptionsList').children).map(option => 
            option.querySelector('input').value
        ).filter(value => value.trim() !== '');
        
        if (responses.length === 0) {
            showNotification('Veuillez ajouter au moins une option de réponse', 'error');
            return;
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
        responses: JSON.stringify(responses)
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
    loadQuestions();
    showNotification('Connexion réussie', 'success');
}

// Vérifier la connexion au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const sessionCookie = getCookie('adminSession');
    if (sessionCookie === 'true') {
        loginUser();
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
    window.location.reload();
});

// Gestion des questions
function loadQuestions() {
    const url = `${SCRIPT_URL}?action=getQuestions`;
    
    // Afficher le skeleton loading
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
            console.error('Erreur lors du chargement des questions:', error);
            questionsContainer.innerHTML = `<p class="error">Erreur lors du chargement des questions: ${error.message}</p>`;
        });
}

function displayQuestions(questions) {
    questionsContainer.innerHTML = '';
    questions.sort((a, b) => a.order - b.order);

    questions.forEach((question, index) => {
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
                    question.type === 'nps' ? 'NPS (0-10)' :  
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
    });
}

// Gestion du formulaire de question
responseType.addEventListener('change', function() {
    const selectedType = this.value;
    // Afficher les options uniquement pour 'radio' ou 'checkbox'
    optionsContainer.style.display = (selectedType === 'radio' || selectedType === 'checkbox') ? 'block' : 'none';
    
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
    if (type !== 'text' && type !== 'barem' && type !== 'nps') {
        responses = Array.from(optionsList.children).map(option => 
            option.querySelector('input').value
        ).filter(value => value.trim() !== '');
        
        if (responses.length === 0) {
            showNotification('Veuillez ajouter au moins une option de réponse', 'error');
            return;
        }
    }

    // Ajouter la classe loading au formulaire
    questionFormElement.classList.add('loading');

    const params = new URLSearchParams({
        action: 'addQuestion',
        order: order,
        question: text,
        type: type,
        responses: JSON.stringify(responses)
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
                
                if (question.type !== 'text' && question.responses) {
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
                    question.type !== 'text' ? 'block' : 'none';
                
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