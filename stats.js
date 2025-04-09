// Variables globales pour stocker les instances des graphiques
let totalChart, genreChart, posteChart, satisfactionChart, ageChart, satisDistChart;

document.getElementById('toggleStats').addEventListener('click', function() {
  const statsSection = document.getElementById('adminStatistics');
  const questionsManagement = document.getElementById('questionsManagement');
  if (!statsSection.style.display || statsSection.style.display === 'none') {
    statsSection.style.display = 'block';
    questionsManagement.style.display = 'none';
    loadStats();
  } else {
    statsSection.style.display = 'none';
    questionsManagement.style.display = 'block';
  }
});

// Récupération des filtres et construction de la query string
function getFiltersQuery() {
  const genreFilter = document.getElementById('filterGenre').value;
  const posteFilter = document.getElementById('filterPoste').value;
  const dateFrom = document.getElementById('filterDateFrom').value;
  const dateTo = document.getElementById('filterDateTo').value;
  
  const params = new URLSearchParams();
  if (genreFilter) params.append('genre', genreFilter);
  if (posteFilter) params.append('poste', posteFilter);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  return params.toString();
}
  
function loadStats() {
  const filters = getFiltersQuery();
  const url = `${SCRIPT_URL}?action=getStats${filters ? '&' + filters : ''}`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      renderStats(data.stats);
    })
    .catch(error => {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement des statistiques : ' + error.message, 'error');
    });
}
  
function renderStats(stats) {
  // Dimensions fixes pour chaque canvas
  const canvasWidth = 500;
  const canvasHeight = 400;
  
  // Fonction utilitaire pour préparer un canvas
  function prepareCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    return canvas.getContext('2d');
  }
  
  // Exemple 1 : Total questionnaires (Doughnut)
  const totalCtx = prepareCanvas('totalQuestionnairesChart');
  if (totalChart) totalChart.destroy();
  totalChart = new Chart(totalCtx, {
    type: 'doughnut',
    data: {
      labels: ['Total questionnaires'],
      datasets: [{
        data: [stats.totalQuestionnaires],
        backgroundColor: ['#00b09b']
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } }
    }
  });
    
  // Exemple 2 : Répartition par genre (Pie)
  const genres = Object.keys(stats.parGenre);
  const genreValues = Object.values(stats.parGenre);
  const genreCtx = prepareCanvas('genreChart');
  if (genreChart) genreChart.destroy();
  genreChart = new Chart(genreCtx, {
    type: 'pie',
    data: {
      labels: genres,
      datasets: [{
        data: genreValues,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8e44ad', '#2ecc71']
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
    
  // Exemple 3 : Répartition par poste (Bar Chart)
  const postes = Object.keys(stats.parPoste);
  const posteValues = Object.values(stats.parPoste);
  const posteCtx = prepareCanvas('posteChart');
  if (posteChart) posteChart.destroy();
  posteChart = new Chart(posteCtx, {
    type: 'bar',
    data: {
      labels: postes,
      datasets: [{
        label: 'Réponses par poste',
        data: posteValues,
        backgroundColor: '#36a2eb'
      }]
    },
    options: {
      responsive: false,
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
    
  // Exemple 4 : Satisfaction moyenne (Bar Chart)
  const satisfactionCtx = prepareCanvas('satisfactionChart');
  if (satisfactionChart) satisfactionChart.destroy();
  satisfactionChart = new Chart(satisfactionCtx, {
    type: 'bar',
    data: {
      labels: ['Satisfaction moyenne'],
      datasets: [{
        label: 'Satisfaction',
        data: [stats.moyenneSatisfaction.toFixed(2)],
        backgroundColor: '#ff6384'
      }]
    },
    options: {
      responsive: false,
      scales: { y: { beginAtZero: true, suggestedMax: 10 } }
    }
  });
    
  // Exemple 5 : Répartition par tranche d'âge (Pie) – si stats.parAge existe
  if (stats.parAge) {
    const ages = Object.keys(stats.parAge);
    const ageValues = Object.values(stats.parAge);
    const ageCtx = prepareCanvas('ageChart');
    if (ageChart) ageChart.destroy();
    ageChart = new Chart(ageCtx, {
      type: 'pie',
      data: {
        labels: ages,
        datasets: [{
          data: ageValues,
          backgroundColor: ['#f39c12', '#e74c3c', '#3498db']
        }]
      },
      options: {
        responsive: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
  
  // Exemple 6 : Distribution des notes de satisfaction (Bar Chart) – si stats.satisfactionDistribution existe
  if (stats.satisfactionDistribution) {
    const satisLabels = Object.keys(stats.satisfactionDistribution);
    const satisValues = Object.values(stats.satisfactionDistribution);
    const satisCtx = prepareCanvas('satisfactionDistributionChart');
    if (satisDistChart) satisDistChart.destroy();
    satisDistChart = new Chart(satisCtx, {
      type: 'bar',
      data: {
        labels: satisLabels,
        datasets: [{
          label: 'Distribution des notes',
          data: satisValues,
          backgroundColor: '#2ecc71'
        }]
      },
      options: {
        responsive: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}

// Écouteur sur le bouton "Appliquer filtre"
document.getElementById('applyFilters').addEventListener('click', function(e) {
  e.preventDefault();
  loadStats();
});
