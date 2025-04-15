// Variables pour le suivi des clics et visiteurs
let totalClicks = 0;
let totalPageViews = 0;
let uniqueVisitors = new Set();

// Fonction pour générer un identifiant unique pour le visiteur
function generateVisitorId() {
    return 'visitor_' + Math.random().toString(36).substr(2, 9);
}

// Fonction pour obtenir l'identifiant du visiteur
function getVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = generateVisitorId();
        localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
}

// Fonction pour envoyer une requête de suivi sans bloquer la navigation
function sendTrackingRequest(params) {
    const img = new Image();
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    img.src = `${SCRIPT_URL}?${queryString}`;
}

// Fonction pour enregistrer un clic
function trackClick(event) {
    const visitorId = getVisitorId();
    totalClicks++;
    
    // Si c'est un lien de navigation, on utilise la requête de suivi
    if (event.target.tagName === 'A' && event.target.href) {
        event.preventDefault();
        const targetUrl = event.target.href;
        
        // Envoyer les données de clic
        sendTrackingRequest({
            action: 'trackClick',
            timestamp: new Date().toISOString(),
            visitorId: visitorId
        });
        
        // Naviguer immédiatement
        window.location.href = targetUrl;
    } else {
        // Pour les autres éléments (boutons), comportement normal avec fetch
        const params = new URLSearchParams({
            action: 'trackClick',
            timestamp: new Date().toISOString(),
            visitorId: visitorId
        });
        
        fetch(`${SCRIPT_URL}?${params.toString()}`)
            .catch(error => {
                console.error('Erreur lors de l\'envoi des données de clic:', error);
            });
    }
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
        totalVisitors: uniqueVisitors.size
    };
}

// Initialisation du suivi des clics et visiteurs
document.addEventListener('DOMContentLoaded', function() {
    // Incrémenter le compteur de vues de page
    totalPageViews++;
    
    // Enregistrer le visiteur
    const visitorId = getVisitorId();
    uniqueVisitors.add(visitorId);
    
    // Suivre les clics sur les boutons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', trackClick);
    });
    
    // Suivre les clics sur les liens
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', trackClick);
    });
    
    // Envoyer les données de vue de page au serveur
    sendTrackingRequest({
        action: 'trackPageView',
        timestamp: new Date().toISOString(),
        visitorId: visitorId
    });
}); 