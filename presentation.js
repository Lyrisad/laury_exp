// Gestion du consentement
document.addEventListener('DOMContentLoaded', function() {
    // Debug pour afficher les cookies disponibles
    debugCheckCookies();
    
    // Vérifie si on doit activer le mode admin à des fins de test
    checkForAdminTestMode();
    
    // Récupérer les éléments DOM
    const consentCheckbox = document.getElementById('consentCheckbox');
    const startButton = document.getElementById('startButton');
    
    // Vérifier si le consentement a déjà été donné (stocké dans localStorage)
    const consentGiven = localStorage.getItem('consentGiven') === 'true';
    
    // Si le consentement a déjà été donné, activer le bouton
    if (consentGiven && consentCheckbox && startButton) {
        consentCheckbox.checked = true;
        startButton.classList.remove('disabled');
        startButton.classList.add('enabled');
    }
    
    // Ajouter un gestionnaire d'événement à la case à cocher
    if (consentCheckbox && startButton) {
        consentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Activer le bouton et enregistrer le consentement
                startButton.classList.remove('disabled');
                startButton.classList.add('enabled');
                localStorage.setItem('consentGiven', 'true');
            } else {
                // Désactiver le bouton et supprimer le consentement enregistré
                startButton.classList.remove('enabled');
                startButton.classList.add('disabled');
                localStorage.removeItem('consentGiven');
            }
        });
    }
    
    // Charger les textes de présentation depuis l'API
    loadPresentationTexts();
});

// Fonction de débogage pour vérifier tous les cookies
function debugCheckCookies() {
    console.log("========= COOKIE DEBUG =========");
    console.log("All cookies:", document.cookie);
    
    const cookies = document.cookie.split(';');
    if (cookies.length === 0 || (cookies.length === 1 && cookies[0] === '')) {
        console.log("No cookies found");
    } else {
        cookies.forEach((cookie, index) => {
            console.log(`Cookie ${index}:`, cookie.trim());
        });
    }
    
    // Check specifically for admin cookie
    const adminCookie = cookies.find(c => c.trim().startsWith('adminSession='));
    console.log("Admin cookie found:", adminCookie || "No adminSession cookie");
    
    console.log("===============================");
}

// Fonction pour vérifier que le consentement a été donné
function checkConsent() {
    const consentGiven = localStorage.getItem('consentGiven') === 'true';
    if (!consentGiven) {
        // Rediriger vers la page de présentation avec un message d'erreur
        window.location.href = 'presentation.html?consent=required';
        return false;
    }
    return true;
}

// Fonction pour récupérer un cookie (réutilisation de celle dans script.js)
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

// Fonction pour charger les textes de présentation
function loadPresentationTexts() {
    const presentationCards = document.getElementById('presentationCards');
    if (!presentationCards) return;
    
    // Afficher le skeleton loader pendant le chargement
    presentationCards.innerHTML = `
        <div class="info-card skeleton-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
        <div class="info-card skeleton-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
        <div class="info-card skeleton-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    `;
    
    // Faire une requête à l'API pour récupérer les textes
    fetch(`${SCRIPT_URL}?action=getPresentationTexts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des textes');
            }
            return response.json();
        })
        .then(data => {
            console.log("Données textes reçues:", data);
            
            // Effacer les cartes de chargement
            presentationCards.innerHTML = '';
            
            if (data.success && data.texts && data.texts.length > 0) {
                // Trier les textes par section
                const sortedTexts = data.texts.sort((a, b) => parseInt(a.section) - parseInt(b.section));
                
                // Créer une carte pour chaque texte
                sortedTexts.forEach(textData => {
                    const card = createTextCard(textData.title, textData.text);
                    presentationCards.appendChild(card);
                });
            } else {
                // Seulement en cas d'échec de l'API, afficher les textes par défaut
                displayDefaultTexts();
            }
            
            // Vérifier si l'admin est connecté et ajouter les contrôles d'édition
            checkAdminAndAddEditControls();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des textes:', error);
            // En cas d'erreur, afficher les textes par défaut
            displayDefaultTexts();
            // Vérifier si l'admin est connecté et ajouter les contrôles d'édition
            checkAdminAndAddEditControls();
        });
}

// Fonction pour afficher les textes par défaut (uniquement en cas d'erreur)
function displayDefaultTexts() {
    console.log("Affichage des textes par défaut (fallback)");
    
    const presentationCards = document.getElementById('presentationCards');
    if (!presentationCards) return;
    
    presentationCards.innerHTML = '';
    
    // Textes par défaut
    const defaultTexts = [
        { title: 'Objectif', text: 'Ce questionnaire a pour but de recueillir votre retour d\'expérience afin d\'améliorer nos services et processus.' },
        { title: 'Confidentialité', text: 'Vos réponses sont totalement anonymes. Les données collectées seront utilisées uniquement à des fins statistiques.' },
        { title: 'Durée', text: 'Le questionnaire ne prendra que quelques minutes de votre temps. Vos réponses sont précieuses pour nous.' }
    ];
    
    // Créer une carte pour chaque texte par défaut
    defaultTexts.forEach(textData => {
        const card = createTextCard(textData.title, textData.text);
        presentationCards.appendChild(card);
    });
}

// Fonction pour créer une carte de texte
function createTextCard(title, text) {
    const card = document.createElement('div');
    card.className = 'info-card';
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    
    const textElement = document.createElement('p');
    textElement.textContent = text;
    
    card.appendChild(titleElement);
    card.appendChild(textElement);
    
    return card;
}

// Fonction pour vérifier si l'utilisateur est admin et ajouter les contrôles d'édition
function checkAdminAndAddEditControls() {
    console.log("Checking for admin cookie...");
    
    // Read all cookies and check for admin cookie
    const cookies = document.cookie.split(';');
    let isAdmin = false;
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('adminSession=')) {
            const value = cookie.substring('adminSession='.length, cookie.length);
            isAdmin = (value === 'true');
            console.log("Found adminSession cookie with value:", value);
            break;
        }
    }
    
    console.log("Admin status:", isAdmin);
    
    if (!isAdmin) {
        console.log("User is not admin, not adding edit controls");
        return;
    }
    
    console.log("Admin is logged in, adding edit controls...");
    
    // L'utilisateur est admin, ajouter les boutons d'édition
    const infoCards = document.querySelectorAll('.info-card');
    console.log("Found info cards:", infoCards.length);
    
    infoCards.forEach((card, index) => {
        console.log(`Adding edit button to card ${index}`);
        
        // Créer un bouton d'édition
        const editButton = document.createElement('button');
        editButton.className = 'edit-text-button';
        editButton.innerHTML = '✏️';
        editButton.title = 'Modifier ce texte';
        
        // Ajouter le gestionnaire d'événement
        editButton.addEventListener('click', function() {
            const cardTitle = card.querySelector('h2').textContent;
            const cardText = card.querySelector('p').textContent;
            openEditModal(cardTitle, cardText, index);
        });
        
        // Ajouter le bouton à la carte
        card.appendChild(editButton);
    });
    
    // Ajouter un bouton pour créer une nouvelle section
    addNewSectionButton();
    
    // Créer le modal d'édition de texte s'il n'existe pas déjà
    createEditModal();
    
    // Créer le modal d'ajout de section s'il n'existe pas déjà
    createAddSectionModal();
}

// Fonction pour ajouter un bouton "Ajouter une section"
function addNewSectionButton() {
    const presentationCards = document.getElementById('presentationCards');
    if (!presentationCards) return;
    
    // Vérifier si le bouton existe déjà
    if (document.getElementById('addSectionButton')) return;
    
    // Créer un conteneur pour le bouton d'ajout
    const addButtonContainer = document.createElement('div');
    addButtonContainer.className = 'add-section-container';
    
    // Créer le bouton d'ajout
    const addButton = document.createElement('button');
    addButton.id = 'addSectionButton';
    addButton.className = 'add-section-button';
    addButton.innerHTML = '<span>+</span> Ajouter une section';
    addButton.title = 'Ajouter une nouvelle section';
    
    // Ajouter le gestionnaire d'événement
    addButton.addEventListener('click', function() {
        openAddSectionModal();
    });
    
    // Ajouter le bouton au conteneur
    addButtonContainer.appendChild(addButton);
    
    // Ajouter le conteneur après les cartes existantes
    presentationCards.appendChild(addButtonContainer);
}

// Fonction pour créer le modal d'édition
function createEditModal() {
    if (document.getElementById('editTextModal')) return;
    
    const modalHTML = `
    <div id="editTextModal" class="edit-modal">
        <div class="edit-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Modifier le texte</h2>
            <div class="edit-form">
                <div class="form-group">
                    <label for="editTitle">Titre:</label>
                    <input type="text" id="editTitle" class="edit-input">
                </div>
                <div class="form-group">
                    <label for="editText">Texte:</label>
                    <textarea id="editText" class="edit-textarea" rows="5"></textarea>
                </div>
                <input type="hidden" id="editSection">
                <button id="saveTextButton" class="save-button">Enregistrer</button>
            </div>
        </div>
    </div>`;
    
    // Ajouter le modal au body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Ajouter les gestionnaires d'événements
    const modal = document.getElementById('editTextModal');
    const closeButton = modal.querySelector('.close-modal');
    const saveButton = document.getElementById('saveTextButton');
    
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    saveButton.addEventListener('click', savePresText);
    
    // Fermer le modal si on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Fonction pour ouvrir le modal d'édition
function openEditModal(title, text, sectionIndex) {
    const modal = document.getElementById('editTextModal');
    const titleInput = document.getElementById('editTitle');
    const textInput = document.getElementById('editText');
    const sectionInput = document.getElementById('editSection');
    
    titleInput.value = title;
    textInput.value = text;
    sectionInput.value = sectionIndex;
    
    modal.style.display = 'block';
}

// Fonction pour sauvegarder le texte modifié
function savePresText() {
    const titleInput = document.getElementById('editTitle');
    const textInput = document.getElementById('editText');
    const sectionInput = document.getElementById('editSection');
    
    const title = titleInput.value;
    const text = textInput.value;
    const sectionIndex = sectionInput.value;
    
    // Valider les entrées
    if (!title.trim() || !text.trim()) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Afficher un indicateur de chargement
    const saveButton = document.getElementById('saveTextButton');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Enregistrement...';
    saveButton.disabled = true;
    
    // Construire les paramètres dans l'URL au lieu d'un body JSON
    const params = new URLSearchParams({
        action: 'updatePresentationText',
        title: title,
        text: text,
        section: sectionIndex
    });
    
    // Envoyer les données à l'API avec GET au lieu de POST
    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du texte');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Mettre à jour le texte dans l'interface
                const infoCards = document.querySelectorAll('.info-card');
                if (infoCards[sectionIndex]) {
                    const card = infoCards[sectionIndex];
                    card.querySelector('h2').textContent = title;
                    card.querySelector('p').textContent = text;
                }
                
                // Fermer le modal
                document.getElementById('editTextModal').style.display = 'none';
                
                // Afficher un message de succès
                showNotification('Texte mis à jour avec succès', 'success');
            } else {
                showNotification('Erreur lors de la mise à jour: ' + (data.message || 'Erreur inconnue'), 'error');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showNotification('Erreur lors de la mise à jour du texte', 'error');
        })
        .finally(() => {
            // Restaurer le bouton
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        });
}

// Fonction pour vérifier le mode admin de test
function checkForAdminTestMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin_test') && urlParams.get('admin_test') === 'true') {
        console.log("Setting adminSession cookie for testing...");
        document.cookie = "adminSession=true; path=/; max-age=3600";
        // Reload the page without the parameter to prevent endless cookie setting
        window.location.href = window.location.pathname;
    }
}

// Fonction pour créer le modal d'ajout de section
function createAddSectionModal() {
    if (document.getElementById('addSectionModal')) return;
    
    const modalHTML = `
    <div id="addSectionModal" class="edit-modal">
        <div class="edit-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Ajouter une nouvelle section</h2>
            <div class="edit-form">
                <div class="form-group">
                    <label for="newSectionTitle">Titre:</label>
                    <input type="text" id="newSectionTitle" class="edit-input" placeholder="Ex: Fonctionnalités">
                </div>
                <div class="form-group">
                    <label for="newSectionText">Texte:</label>
                    <textarea id="newSectionText" class="edit-textarea" rows="5" placeholder="Entrez le contenu de la section ici"></textarea>
                </div>
                <button id="saveSectionButton" class="save-button">Ajouter</button>
            </div>
        </div>
    </div>`;
    
    // Ajouter le modal au body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Ajouter les gestionnaires d'événements
    const modal = document.getElementById('addSectionModal');
    const closeButton = modal.querySelector('.close-modal');
    const saveButton = document.getElementById('saveSectionButton');
    
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    saveButton.addEventListener('click', saveNewSection);
    
    // Fermer le modal si on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Fonction pour ouvrir le modal d'ajout de section
function openAddSectionModal() {
    const modal = document.getElementById('addSectionModal');
    if (!modal) {
        createAddSectionModal();
        return openAddSectionModal();
    }
    
    // Réinitialiser les champs
    document.getElementById('newSectionTitle').value = '';
    document.getElementById('newSectionText').value = '';
    
    // Afficher le modal
    modal.style.display = 'block';
}

// Fonction pour sauvegarder une nouvelle section
function saveNewSection() {
    const titleInput = document.getElementById('newSectionTitle');
    const textInput = document.getElementById('newSectionText');
    
    const title = titleInput.value;
    const text = textInput.value;
    
    // Valider les entrées
    if (!title.trim() || !text.trim()) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Afficher un indicateur de chargement
    const saveButton = document.getElementById('saveSectionButton');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Enregistrement...';
    saveButton.disabled = true;
    
    // Déterminer le prochain index de section
    const presentationCards = document.getElementById('presentationCards');
    const sectionCount = presentationCards.querySelectorAll('.info-card').length;
    const newSectionIndex = sectionCount;
    
    // Construire les paramètres dans l'URL
    const params = new URLSearchParams({
        action: 'updatePresentationText',
        title: title,
        text: text,
        section: newSectionIndex
    });
    
    // Envoyer les données à l'API
    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la section');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Ajouter la carte à l'interface
                const newCard = createTextCard(title, text);
                
                // Ajouter la carte avant le bouton d'ajout
                const addButton = document.querySelector('.add-section-container');
                presentationCards.insertBefore(newCard, addButton);
                
                // Ajouter le bouton d'édition à la nouvelle carte
                const editButton = document.createElement('button');
                editButton.className = 'edit-text-button';
                editButton.innerHTML = '✏️';
                editButton.title = 'Modifier ce texte';
                
                // Ajouter le gestionnaire d'événement au bouton d'édition
                editButton.addEventListener('click', function() {
                    openEditModal(title, text, newSectionIndex);
                });
                
                // Ajouter le bouton à la carte
                newCard.appendChild(editButton);
                
                // Fermer le modal
                document.getElementById('addSectionModal').style.display = 'none';
                
                // Afficher un message de succès
                showNotification('Section ajoutée avec succès', 'success');
            } else {
                showNotification('Erreur lors de l\'ajout: ' + (data.message || 'Erreur inconnue'), 'error');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showNotification('Erreur lors de l\'ajout de la section', 'error');
        })
        .finally(() => {
            // Restaurer le bouton
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        });
} 