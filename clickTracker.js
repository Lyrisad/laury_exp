
// Variables pour le suivi des clics
let totalClicks = 0;
let totalPageViews = 0;
let clickData = {
    buttons: {},
    links: {},
    navigation: {}
};

// Fonction pour enregistrer un clic
function trackClick(element, category) {
    const elementId = element.id || element.className || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Incrémenter le compteur total de clics
    totalClicks++;
    
    // Enregistrer le clic dans la catégorie appropriée
    if (!clickData[category]) {
        clickData[category] = {};
    }
    
    if (!clickData[category][elementId]) {
        clickData[category][elementId] = {
            count: 0,
            timestamps: []
        };
    }
    
    clickData[category][elementId].count++;
    clickData[category][elementId].timestamps.push(timestamp);
    
    // Envoyer les données au serveur
    sendClickData(elementId, category, timestamp);
}

// Fonction pour envoyer les données au serveur
function sendClickData(elementId, category, timestamp) {
    const params = new URLSearchParams({
        action: 'trackClick',
        elementId: elementId,
        category: category, 
        timestamp: timestamp
    });

    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .catch(error => {
            console.error('Erreur lors de l\'envoi des données de clic:', error);
        });
}

// Fonction pour calculer le CTR
function calculateCTR() {
    if (totalPageViews === 0) return 0;
    return (totalClicks / totalPageViews) * 100;
}

// Fonction pour obtenir les statistiques de clics
function getClickStats() {
    return {
        totalClicks,
        totalPageViews,
        ctr: calculateCTR(),
        clickData
    };
}

// Initialisation du suivi des clics
document.addEventListener('DOMContentLoaded', function() {
    // Incrémenter le compteur de vues de page
    totalPageViews++;
    
    // Suivre les clics sur les boutons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => trackClick(button, 'buttons'));
    });
    
    // Suivre les clics sur les liens
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => trackClick(link, 'links'));
    });
    
    // Suivre les clics sur les éléments de navigation
    document.querySelectorAll('nav a').forEach(navItem => {
        navItem.addEventListener('click', () => trackClick(navItem, 'navigation'));
    });
    
    // Envoyer les données de vue de page au serveur
    const params = new URLSearchParams({
        action: 'trackPageView',
        timestamp: new Date().toISOString()
    });

    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .catch(error => {
            console.error('Erreur lors de l\'envoi des données de vue de page:', error);
        });
}); 