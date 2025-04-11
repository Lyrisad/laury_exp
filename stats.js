// Variables globales pour stocker les instances des graphiques globaux
let totalChart, genreChart, posteChart, satisfactionChart, ageChart, satisDistChart;

// Affichage / masquage de la section stats
document.getElementById('toggleStats').addEventListener('click', function() {
  const adminTitle = document.getElementById('adminTitle');
  const statsSection = document.getElementById('adminStatistics');
  const questionsManagement = document.getElementById('questionsManagement');
  if (!statsSection.style.display || statsSection.style.display === 'none') {
    statsSection.style.display = 'block';
    questionsManagement.style.display = 'none';
    adminTitle.innerText = 'Statistiques';
    adminTitle.style.color = '#00b09b';
    adminTitle.style.setProperty('--admin-title-border-color', '#00b09b');
    loadStats();
  } else {
    statsSection.style.display = 'none';
    questionsManagement.style.display = 'block';
    adminTitle.innerText = 'Administration';
    adminTitle.style.color =  "var(--primary-color)";
    adminTitle.style.setProperty('--admin-title-border-color', 'var(--primary-color)');
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
  
// Fonction principale de chargement des statistiques globales et par question
function loadStats() {
  const filters = getFiltersQuery();
  const url = `${SCRIPT_URL}?action=getStats${filters ? '&' + filters : ''}`;
  
  // Récupération des stats globales existantes
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
      return response.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.error);
      renderStats(data.stats);
      // Ensuite, on charge les statistiques détaillées par question
      loadQuestionStats();
    })
    .catch(error => {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement des statistiques : ' + error.message, 'error');
    });
}
  
// Vos fonctions renderStats() globales (exemples existants)
function renderStats(stats) {
  const canvasWidth = 500;
  const canvasHeight = 400;
  
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
  
  // Exemple 6 : Distribution des notes de satisfaction (Bar Chart)
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
  
// Chargement des statistiques par question avec filtrage client-side
// Chargement des statistiques par question avec filtrage client-side et résumé
function loadQuestionStats() {
  // On récupère la configuration des questions depuis la feuille Questions
  fetch(`${SCRIPT_URL}?action=getQuestions`)
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors du chargement des questions');
      return response.json();
    })
    .then(questionsData => {
      // Ensuite, on récupère les réponses brutes depuis la feuille Données
      return fetch(`${SCRIPT_URL}?action=getRawResponses`)
        .then(response => {
          if (!response.ok) throw new Error('Erreur lors du chargement des réponses');
          return response.json();
        })
        .then(rawData => {
          console.log('Raw Responses reçues :', rawData);
          renderQuestionStats(questionsData.values, rawData);
        });
    })
    .catch(error => {
      console.error("Erreur lors du chargement des stats par question:", error);
      showNotification('Erreur dans les statistiques par question : ' + error.message, 'error');
    });
}

// Fonctions utilitaires pour les calculs numériques
function calculateMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
  } else {
    return sorted[mid].toFixed(2);
  }
}

function calculateStdDev(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance).toFixed(2);
}

// Fonction pour retirer les accents d'une chaîne (si besoin)
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Fonction de normalisation : conversion en minuscule, retrait des accents et de la ponctuation
function normalizeString(str) {
  return removeAccents(str).trim().toLowerCase().replace(/[^\w\s]/g, '');
}

// Chargement des statistiques par question avec filtrage client-side et résumé enrichi
function loadQuestionStats() {
  fetch(`${SCRIPT_URL}?action=getQuestions`)
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors du chargement des questions');
      return response.json();
    })
    .then(questionsData => {
      return fetch(`${SCRIPT_URL}?action=getRawResponses`)
        .then(response => {
          if (!response.ok) throw new Error('Erreur lors du chargement des réponses');
          return response.json();
        })
        .then(rawData => {
          console.log('Raw Responses reçues :', rawData);
          renderQuestionStats(questionsData.values, rawData);
        });
    })
    .catch(error => {
      console.error("Erreur lors du chargement des stats par question:", error);
      showNotification('Erreur dans les statistiques par question : ' + error.message, 'error');
    });
}

function renderQuestionStats(questions, rawData) {
  const container = document.getElementById('questionStatsContainer');
  container.innerHTML = ''; // Réinitialiser le conteneur

  if (!rawData.headers || !rawData.responses) {
    console.error("La structure des données brutes n'est pas correcte :", rawData);
    container.innerHTML = "<p>Aucune donnée trouvée pour les réponses.</p>";
    return;
  }
  
  const headers = rawData.headers;
  let responses = rawData.responses;
  
  // --- Application des filtres sur les réponses ---
  const genreFilter = document.getElementById('filterGenre').value.trim().toLowerCase();
  const posteFilter = document.getElementById('filterPoste').value.trim().toLowerCase();
  const dateFrom = document.getElementById('filterDateFrom').value;
  const dateTo = document.getElementById('filterDateTo').value;
  
  // On suppose que rawData.responses suit cet ordre : 
  // index 0 = DATE, 1 = SEXE, 2 = AGE, 3 = POSTE, 4 = SATISFACTION, 5 = COMMENTAIRE, 6 = REPONSES, ...
  responses = responses.filter(row => {
    let include = true;
    if (genreFilter) {
      const rowGenre = row[1] ? row[1].toString().trim().toLowerCase() : "";
      if (rowGenre !== genreFilter) include = false;
    }
    if (posteFilter) {
      const rowPoste = row[3] ? row[3].toString().trim().toLowerCase() : "";
      if (rowPoste !== posteFilter) include = false;
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      const rowDate = new Date(row[0]);
      if (rowDate < fromDate) include = false;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      const rowDate = new Date(row[0]);
      if (rowDate > toDate) include = false;
    }
    return include;
  });
  
  console.log("En-têtes :", headers);
  console.log("Nombre total de réponses filtrées :", responses.length);
  
  // Recherche de la colonne "reponses"
  const responsesColIndex = headers.findIndex(h => h.trim().toLowerCase() === "reponses");
  if (responsesColIndex === -1) {
    console.error("Colonne 'Réponses' introuvable dans les en-têtes:", headers);
    container.innerHTML = "<p>Colonne 'Réponses' non trouvée.</p>";
    return;
  }
  console.log("Index de la colonne Réponses:", responsesColIndex);
  
  // Traitement de chaque question (pour les types agrégables)
  questions.forEach(question => {
    if (['radio', 'checkbox', 'barem', 'nps'].includes(question.type)) {
      
      let counts = {};          // Répartition des réponses
      let totalResponses = 0;   // Nombre total de réponses pour cette question
      let sumNumeric = 0;       // Somme des réponses numériques (pour moyenne)
      let countNumeric = 0;     // Nombre de réponses numériques
      let numericValues = [];   // Tableau pour calculer la médiane, min, max, écart-type
      let genreCounts = {};     // Répartition par genre pour la question
      let ageCounts = {};       // Répartition par tranche d'âge
      
      responses.forEach(row => {
        let answerStr = row[responsesColIndex];
        if (!answerStr) return;
        let rowHasAnswerForThisQuestion = false;
        let numericAnswer;
        // On extrait l'âge (colonne 2) et l'enregistre si présent
        let ageGroup = row[2] ? row[2].toString().trim() : "Inconnu";
        
        // Découpage de la chaîne par '|'
        let parts = answerStr.split('|');
        parts.forEach(part => {
          const splitIndex = part.indexOf(':');
          if (splitIndex === -1) return;
          let key = part.substring(0, splitIndex).trim();
          let value = part.substring(splitIndex + 1).trim();
          
          // Si la clé correspond à la question (normalisation)
          if (normalizeString(key) === normalizeString(question.question)) {
            counts[value] = (counts[value] || 0) + 1;
            rowHasAnswerForThisQuestion = true;
            if (['barem', 'nps'].includes(question.type)) {
              let num = parseFloat(value);
              if (!isNaN(num)) {
                numericAnswer = num;
                numericValues.push(num);
                sumNumeric += num;
                countNumeric++;
              }
            }
          }
        });
        
        if (rowHasAnswerForThisQuestion) {
          totalResponses++;
          // Compter le genre
          let rowGenre = row[1] ? row[1].toString().trim() : "Inconnu";
          genreCounts[rowGenre] = (genreCounts[rowGenre] || 0) + 1;
          // Compter la tranche d'âge
          ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
        }
      });
      
      console.log(`Données pour "${question.question}":`, counts);
      
      if (Object.keys(counts).length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.innerText = `Aucune réponse pour la question "${question.question}".`;
        container.appendChild(noDataMsg);
        return;
      }
      
      // Calculer le mode
      let modeAnswer = "";
      let modeCount = 0;
      for (let ans in counts) {
        if (counts[ans] > modeCount) {
          modeCount = counts[ans];
          modeAnswer = ans;
        }
      }
      
      // Calculs numériques (pour barem et nps)
      let average = "N/A", median = "N/A", minVal = "N/A", maxVal = "N/A", stdDev = "N/A";
      if (['barem', 'nps'].includes(question.type) && countNumeric > 0) {
        average = (sumNumeric / countNumeric).toFixed(2);
        median = calculateMedian(numericValues);
        minVal = Math.min(...numericValues).toFixed(2);
        maxVal = Math.max(...numericValues).toFixed(2);
        stdDev = calculateStdDev(numericValues);
      }
      
      // Construction du résumé HTML enrichi
      let summaryHTML = `<p><strong>Total réponses :</strong> ${totalResponses}</p>`;
      summaryHTML += `<p><strong>Réponse la plus fréquente :</strong> ${modeAnswer} (${modeCount} fois, ${(modeCount / totalResponses * 100).toFixed(1)}%)</p>`;
      summaryHTML += `<p><strong>Pourcentage par réponse :</strong></p>`;
      summaryHTML += `<ul class="response-percentage-list">`;
      for (let ans in counts) {
        let percent = (counts[ans] / totalResponses * 100).toFixed(1);
        summaryHTML += `<li>
          <span class="response-label">${ans}:</span>
          <span class="response-count">${counts[ans]}</span>
          (<span class="response-percent">${percent}%</span>)
        </li>`;
      }
      summaryHTML += `</ul>`;      
      
      if (['barem', 'nps'].includes(question.type)) {
        summaryHTML += `<p><strong>Moyenne :</strong> ${average}</p>`;
        summaryHTML += `<p><strong>Médiane :</strong> ${median}</p>`;
        summaryHTML += `<p><strong>Min - Max :</strong> ${minVal} - ${maxVal}</p>`;
        summaryHTML += `<p><strong>Écart-type :</strong> ${stdDev}</p>`;
      }
      
      summaryHTML += `<p><strong>Répartition par genre :</strong></p>`;
      summaryHTML += `<ul class="distribution-list genre-list">`;
      for (let g in genreCounts) {
        let percentGenre = (genreCounts[g] / totalResponses * 100).toFixed(1);
        summaryHTML += `<li>
          <span class="distribution-label">${g}:</span>
          <span class="distribution-count">${genreCounts[g]}</span>
          (<span class="distribution-percent">${percentGenre}%</span>)
        </li>`;
      }
      summaryHTML += `</ul>`;
      
      
      summaryHTML += `<p><strong>Répartition par tranche d'âge :</strong></p>`;
      summaryHTML += `<ul class="distribution-list age-list">`;
      for (let age in ageCounts) {
        let percentAge = (ageCounts[age] / totalResponses * 100).toFixed(1);
        summaryHTML += `<li>
          <span class="distribution-label">${age}:</span>
          <span class="distribution-count">${ageCounts[age]}</span>
          (<span class="distribution-percent">${percentAge}%</span>)
        </li>`;
      }
      summaryHTML += `</ul>`;
      
      
      // Création d'un wrapper affichant le graphique et le résumé côte à côte
      const wrapper = document.createElement('div');
      wrapper.classList.add('question-stats-wrapper');
      
      // Div contenant le canvas du graphique
      const canvasDiv = document.createElement('div');
      const canvas = document.createElement('canvas');
      canvas.id = 'questionChart_' + question.order;
      canvas.width = 500;
      canvas.height = 400;
      canvasDiv.appendChild(canvas);
      
      // Div contenant le résumé
      const summaryDiv = document.createElement('div');
      summaryDiv.classList.add('question-summary');
      summaryDiv.innerHTML = summaryHTML;
      
      wrapper.appendChild(canvasDiv);
      wrapper.appendChild(summaryDiv);
      
      // Titre de la question
      const questionTitle = document.createElement('h3');
      questionTitle.innerText = `Question ${question.order} : ${question.question}`;
      container.appendChild(questionTitle);
      container.appendChild(wrapper);
      
      // Création du graphique avec Chart.js
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(counts),
          datasets: [{
            label: 'Nombre de réponses',
            data: Object.values(counts),
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8e44ad', '#2ecc71']
          }]
        },
        options: {
          responsive: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    } // Fin du traitement pour cette question
  });
}

// Écouteur sur le bouton "Appliquer filtre" (pour relancer les stats)
document.getElementById('applyFilters').addEventListener('click', function(e) {
  e.preventDefault();
  loadStats();
});
