// Gestion du consentement
document.addEventListener('DOMContentLoaded', function() {
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
});

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