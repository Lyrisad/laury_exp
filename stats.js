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
    adminTitle.innerText = 'Statistiques et Réponses';
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
  const genreFilter = document.getElementById('filterGenre').value.trim().toLowerCase();
  const posteFilter = document.getElementById('filterPoste').value.trim().toLowerCase();
  const ageFilter = document.getElementById('filterAge').value.trim().toLowerCase();
  const dateFrom = document.getElementById('filterDateFrom').value;
  const dateTo = document.getElementById('filterDateTo').value;
  
  const params = new URLSearchParams();
  if (genreFilter) params.append('genre', genreFilter);
  if (posteFilter) params.append('poste', posteFilter);
  if (ageFilter) params.append('age', ageFilter);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  return params.toString();
}

let globalStatsData = null;
  
function loadStats() {
  const filters = getFiltersQuery();
  const url = `${SCRIPT_URL}?action=getStats${filters ? '&' + filters : ''}`;
  
  // Retrieve global stats from the API
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
      return response.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.error);
      globalStatsData = data.stats; // Save for extraction later
      renderStats(data.stats);
      loadQuestionStats();
      loadOpenResponses();
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
  
  // Total questionnaires (Doughnut)
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
      plugins: { 
        legend: { display: false },
        title: {
          display: true,
          text: 'Total des Questionnaires',
          font: {
            size: 16
          }
        }
      }
    }
  });
    
  // Répartition par genre (Pie)
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
      plugins: { 
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Répartition par Genre',
          font: {
            size: 16
          }
        }
      }
    }
  });
    
  // Répartition par poste (Bar Chart)
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
      plugins: {
        title: {
          display: true,
          text: 'Répartition par Poste',
          font: {
            size: 16
          }
        }
      },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
    
  // Satisfaction moyenne (Bar Chart)
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
      plugins: {
        title: {
          display: true,
          text: 'Satisfaction Moyenne',
          font: {
            size: 16
          }
        }
      },
      scales: { y: { beginAtZero: true, suggestedMax: 10 } }
    }
  });
    
  // Répartition par tranche d'âge (Pie)
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
          backgroundColor: ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6']
        }]
      },
      options: {
        responsive: false,
        plugins: { 
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Répartition par Tranche d\'Âge',
            font: {
              size: 16
            }
          }
        }
      }
    });
  }
  
  // Distribution des notes de satisfaction (Bar Chart)
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
        plugins: {
          title: {
            display: true,
            text: 'Distribution des Notes de Satisfaction',
            font: {
              size: 16
            }
          }
        },
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
  container.innerHTML = ''; // Reset the container

  if (!rawData.headers || !rawData.responses) {
    console.error("The raw data structure is incorrect:", rawData);
    container.innerHTML = "<p>No response data found.</p>";
    return;
  }
  
  const headers = rawData.headers;
  let responses = rawData.responses;
  
  // --- Apply filters on responses ---
  const genreFilter = document.getElementById('filterGenre').value.trim().toLowerCase();
  const posteFilter = document.getElementById('filterPoste').value.trim().toLowerCase();
  const dateFrom = document.getElementById('filterDateFrom').value;
  const dateTo = document.getElementById('filterDateTo').value;
  const ageFilter = document.getElementById('filterAge').value.trim().toLowerCase(); // New filter for age
  
  // We assume rawData.responses follows this order:
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
    // New: filtering by age (index 2)
    if (ageFilter) {
      const rowAge = row[2] ? row[2].toString().trim().toLowerCase() : "";
      if (rowAge !== ageFilter) include = false;
    }
    return include;
  });
  
  console.log("Headers:", headers);
  console.log("Filtered responses count:", responses.length);
  
  // Find the "reponses" column (converted to lowercase)
  const responsesColIndex = headers.findIndex(h => h.trim().toLowerCase() === "reponses");
  if (responsesColIndex === -1) {
    console.error("Column 'Réponses' not found in headers:", headers);
    container.innerHTML = "<p>Column 'Réponses' not found.</p>";
    return;
  }
  console.log("Responses column index:", responsesColIndex);
  
  // Process each question (for aggregatable types)
  questions.forEach(question => {
    if (['radio', 'checkbox', 'barem', 'nps'].includes(question.type)) {
      
      let counts = {};          // Count of responses
      let totalResponses = 0;   // Number of responses for this question
      let sumNumeric = 0;       // Sum for numeric responses (for average)
      let countNumeric = 0;     // Count of numeric responses
      let numericValues = [];   // Array for calculating median, min, max, and std. dev.
      let genreCounts = {};     // Response distribution by gender
      let ageCounts = {};       // Response distribution by age
      
      responses.forEach(row => {
        let answerStr = row[responsesColIndex];
        if (!answerStr) return;
        let rowHasAnswerForThisQuestion = false;
        let numericAnswer;
        // Get age from column 2
        let ageGroup = row[2] ? row[2].toString().trim() : "Inconnu";
        
        // Split the response string by '|'
        let parts = answerStr.split('|');
        parts.forEach(part => {
          const splitIndex = part.indexOf(':');
          if (splitIndex === -1) return;
          let key = part.substring(0, splitIndex).trim();
          let value = part.substring(splitIndex + 1).trim();
          
          // If the key matches the question (after normalization)
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
          // Count gender (index 1)
          let rowGenre = row[1] ? row[1].toString().trim() : "Inconnu";
          genreCounts[rowGenre] = (genreCounts[rowGenre] || 0) + 1;
          // Count age distribution (using ageGroup)
          ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
        }
      });
      
      console.log(`Data for "${question.question}":`, counts);
      
      if (Object.keys(counts).length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.innerText = `No responses for question "${question.question}".`;
        container.appendChild(noDataMsg);
        return;
      }
      
      // Calculate mode
      let modeAnswer = "";
      let modeCount = 0;
      for (let ans in counts) {
        if (counts[ans] > modeCount) {
          modeCount = counts[ans];
          modeAnswer = ans;
        }
      }
      
      // Numerical calculations (for barem and nps)
      let average = "N/A", median = "N/A", minVal = "N/A", maxVal = "N/A", stdDev = "N/A";
      if (['barem', 'nps'].includes(question.type) && countNumeric > 0) {
        average = (sumNumeric / countNumeric).toFixed(2);
        median = calculateMedian(numericValues);
        minVal = Math.min(...numericValues).toFixed(2);
        maxVal = Math.max(...numericValues).toFixed(2);
        stdDev = calculateStdDev(numericValues);
      }
      
      // Build the enriched summary HTML
      let summaryHTML = `<p><strong>Total responses:</strong> ${totalResponses}</p>`;
      summaryHTML += `<p><strong>Most frequent response:</strong> ${modeAnswer} (${modeCount} times, ${(modeCount / totalResponses * 100).toFixed(1)}%)</p>`;
      summaryHTML += `<p><strong>Percentage per response:</strong></p>`;
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
        summaryHTML += `<p><strong>Average:</strong> ${average}</p>`;
        summaryHTML += `<p><strong>Median:</strong> ${median}</p>`;
        summaryHTML += `<p><strong>Min - Max:</strong> ${minVal} - ${maxVal}</p>`;
        summaryHTML += `<p><strong>Std. Dev.:</strong> ${stdDev}</p>`;
      }
      
      summaryHTML += `<p><strong>Distribution by gender:</strong></p>`;
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
      
      summaryHTML += `<p><strong>Distribution by age:</strong></p>`;
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
      
      // Create a wrapper displaying the chart and summary side by side
      const wrapper = document.createElement('div');
      wrapper.classList.add('question-stats-wrapper');
      
      // Div containing the chart canvas
      const canvasDiv = document.createElement('div');
      const canvas = document.createElement('canvas');
      canvas.id = 'questionChart_' + question.order;
      canvas.width = 500;
      canvas.height = 400;
      canvasDiv.appendChild(canvas);
      
      // Div containing the summary
      const summaryDiv = document.createElement('div');
      summaryDiv.classList.add('question-summary');
      summaryDiv.innerHTML = summaryHTML;
      
      wrapper.appendChild(canvasDiv);
      wrapper.appendChild(summaryDiv);
      
      // Title of the question
      const questionTitle = document.createElement('h3');
      questionTitle.innerText = `Question ${question.order} : ${question.question}`;
      container.appendChild(questionTitle);
      container.appendChild(wrapper);
      
      // Create the chart using Chart.js
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(counts),
          datasets: [{
            label: 'Number of responses',
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
    } // End processing for this question
  });
}


// Fonction pour charger les réponses ouvertes
function loadOpenResponses() {
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
          renderOpenResponses(questionsData.values, rawData);
        });
    })
    .catch(error => {
      console.error("Erreur lors du chargement des réponses ouvertes:", error);
      showNotification('Erreur dans les réponses ouvertes : ' + error.message, 'error');
    });
}

function getEmojiForUser(age, gender) {
  // On s'assure de nettoyer les valeurs
  age = age.trim();
  gender = gender.toLowerCase().trim();

  // Cas particuliers pour non-binaire ou genre fluide
  if (gender === "non-binaire" || gender === "genre fluide") {
    return "🧑"; // emoji neutre
  }
  
  // Pour chaque tranche d'âge, on effectue un test exact (en fonction de vos valeurs dans le select)
  if (age === "18-25") {
    if (gender === "homme") return "👦";
    if (gender === "femme") return "👧";
    return "🧒";
  }
  if (age === "26-35") {
    if (gender === "homme") return "👨";
    if (gender === "femme") return "👩";
    return "🧑";
  }
  if (age === "36-45") {
    if (gender === "homme") return "🧔";
    if (gender === "femme") return "👩‍🦰";
    return "🧑";
  }
  if (age === "46-55") {
    if (gender === "homme") return "👨‍🦳";
    if (gender === "femme") return "👩‍🦳";
    return "🧓";
  }
  if (age === "56+") {
    if (gender === "homme") return "👴";
    if (gender === "femme") return "👵";
    return "🧓";
  }
  
  // En cas de valeur non reconnue, retourner un emoji par défaut.
  return "👤";
}

// Fonction pour charger et afficher les réponses ouvertes (questions de type text)
function renderOpenResponses(questions, rawData) {
  const container = document.getElementById('openResponsesContainer');
  container.innerHTML = ''; // Réinitialiser le conteneur
  
  if (!rawData.headers || !rawData.responses) {
    console.error("La structure des données brutes n'est pas correcte :", rawData);
    container.innerHTML = '<p>Aucune donnée trouvée pour les réponses ouvertes.</p>';
    return;
  }
  
  const headers = rawData.headers;
  const responses = rawData.responses;
  
  // Recherche de la colonne "reponses" (convertie en minuscules)
  const responsesColIndex = headers.findIndex(h => h.trim().toLowerCase() === 'reponses');
  if (responsesColIndex === -1) {
    console.error("Colonne 'Réponses' introuvable dans les en-têtes:", headers);
    container.innerHTML = '<p>Colonne "Réponses" non trouvée.</p>';
    return;
  }
  
  // Récupérer les valeurs des filtres
  const filterGenre = document.getElementById('filterGenre').value.trim().toLowerCase();
  const filterPoste = document.getElementById('filterPoste').value.trim().toLowerCase();
  const filterAge = document.getElementById('filterAge').value.trim().toLowerCase();
  const filterDateFrom = document.getElementById('filterDateFrom').value;
  const filterDateTo = document.getElementById('filterDateTo').value;
  
  // Filtrer les réponses en fonction des filtres appliqués
  let filteredResponses = responses.filter(row => {
    let include = true;
    // Date (index 0)
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      const rowDate = new Date(row[0]);
      if (rowDate < fromDate) include = false;
    }
    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      const rowDate = new Date(row[0]);
      if (rowDate > toDate) include = false;
    }
    // Genre (index 1)
    if (filterGenre) {
      const rowGenre = row[1] ? row[1].toString().trim().toLowerCase() : "";
      if (rowGenre !== filterGenre) include = false;
    }
    // Poste (index 3)
    if (filterPoste) {
      const rowPoste = row[3] ? row[3].toString().trim().toLowerCase() : "";
      if (rowPoste !== filterPoste) include = false;
    }
    // Age (index 2)
    if (filterAge) {
      const rowAge = row[2] ? row[2].toString().trim().toLowerCase() : "";
      if (rowAge !== filterAge) include = false;
    }
    return include;
  });
  
  // Filtrer uniquement les questions de type "text"
  const openQuestions = questions.filter(q => q.type === 'text');
  if (openQuestions.length === 0) {
    container.innerHTML = '<p>Aucune question ouverte trouvée.</p>';
    return;
  }
  
  // Pour chaque question ouverte, collecter et afficher les réponses
  openQuestions.forEach(question => {
    // Créer un titre pour la question
    const questionHeader = document.createElement('h4');
    questionHeader.classList.add('open-responses-header-inside');
    questionHeader.innerText = `Question ${question.order} : ${question.question}`;
    container.appendChild(questionHeader);
    
    // Créer une liste pour les réponses
    const ul = document.createElement('ul');
    ul.classList.add('open-responses-list');
    
    // Parcourir chaque ligne de réponse dans le tableau filtré
    filteredResponses.forEach(row => {
      const answerStr = row[responsesColIndex];
      if (!answerStr) return;
      
      // Récupérer le genre (index 1), l'âge (index 2) et le poste (index 3)
      const genderStr = row[1] ? row[1].toString().trim() : "Inconnu";
      const ageStr = row[2] ? row[2].toString().trim() : "Inconnu";
      const posteStr = row[3] ? row[3].toString().trim() : "Inconnu";
      
      // Découper la chaîne des réponses avec le séparateur "|"
      const parts = answerStr.split('|');
      parts.forEach(part => {
        const splitIndex = part.indexOf(':');
        if (splitIndex === -1) return;
        
        const key = part.substring(0, splitIndex).trim();
        const value = part.substring(splitIndex + 1).trim();
        
        // Comparer la clé (normalisée) avec le texte de la question
        if (normalizeString(key) === normalizeString(question.question)) {
          // Récupérer l'emoji en fonction de l'âge et du genre
          const emoji = getEmojiForUser(ageStr, genderStr);
          // Créer un élément de liste avec l'emoji, le texte de la réponse et le détail dans des spans
          const li = document.createElement('li');
          li.innerHTML = `<span class="user-icon">${emoji}</span> <span class="response-text">"${value}"</span> <span class="user-details">( <span class="user-gender">${genderStr}</span>, <span class="user-age">${ageStr}</span>, <span class="user-poste">${posteStr}</span> )</span>`;
          ul.appendChild(li);
        }
      });
    });
    
    // Si aucune réponse trouvée pour cette question, afficher un message
    if (!ul.hasChildNodes()) {
      const li = document.createElement('li');
      li.innerText = 'Aucune réponse.';
      ul.appendChild(li);
    }
    
    container.appendChild(ul);
  });
}

// Écouteur sur le bouton "Appliquer filtre" (pour relancer les stats)
document.getElementById('applyFilters').addEventListener('click', function(e) {
  e.preventDefault();
  const applyFilters = document.getElementById('applyFilters');
  applyFilters.style.opacity = '0.5';
  applyFilters.style.cursor = 'not-allowed';
  applyFilters.disabled = true;
  applyFilters.textContent = 'Chargement...';
  setTimeout(() => {
    applyFilters.style.opacity = '1';
    applyFilters.style.cursor = 'pointer';
    applyFilters.disabled = false;
    applyFilters.textContent = 'Appliquer filtres';
  }, 3000);
  loadStats();
});

// Fonction utilitaire pour formater la date
function getFormattedDate() {
  const now = new Date();
  return now.toISOString().split('T')[0].replace(/-/g, '');
}

// Fonction utilitaire pour créer une cellule avec style
function createStyledCell(value, isBold = false) {
  return {
    v: value,
    t: 's',
    s: {
      font: {
        bold: isBold,
        sz: isBold ? 12 : 11,
        color: { rgb: "000000" }
      },
      alignment: {
        horizontal: "left",
        vertical: "center"
      },
      fill: {
        fgColor: { rgb: isBold ? "E6E6E6" : "FFFFFF" }
      }
    }
  };
}

// --- Extraction for ALL stats into one Excel workbook
function exportAllToExcel() {
  if (!globalStatsData) {
    alert("Global statistics are not yet loaded.");
    return;
  }
  
  // ----------- Global Stats Sheet ---------------
  let globalSheetData = [];
  
  // En-tête avec style
  globalSheetData.push([createStyledCell("Statistiques Globales - " + new Date().toLocaleDateString(), true)]);
  globalSheetData.push([]);
  
  // Statistiques de base
  globalSheetData.push([createStyledCell("Statistiques Générales", true)]);
  globalSheetData.push([createStyledCell("Métrique", true), createStyledCell("Valeur", true)]);
  globalSheetData.push(["Total des Questionnaires", globalStatsData.totalQuestionnaires]);
  globalSheetData.push(["Satisfaction Moyenne", globalStatsData.moyenneSatisfaction.toFixed(2)]);
  globalSheetData.push([]);
  
  // Distribution par Genre
  globalSheetData.push([createStyledCell("Distribution par Genre", true)]);
  globalSheetData.push([createStyledCell("Genre", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalGenre = Object.values(globalStatsData.parGenre).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parGenre) {
    const count = globalStatsData.parGenre[key];
    const percentage = ((count / totalGenre) * 100).toFixed(1) + "%";
    globalSheetData.push([key, count, percentage]);
  }
  globalSheetData.push([]);
  
  // Distribution par Poste
  globalSheetData.push([createStyledCell("Distribution par Poste", true)]);
  globalSheetData.push([createStyledCell("Poste", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalPoste = Object.values(globalStatsData.parPoste).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parPoste) {
    const count = globalStatsData.parPoste[key];
    const percentage = ((count / totalPoste) * 100).toFixed(1) + "%";
    globalSheetData.push([key, count, percentage]);
  }
  globalSheetData.push([]);
  
  // Distribution par Âge
  globalSheetData.push([createStyledCell("Distribution par Tranche d'Âge", true)]);
  globalSheetData.push([createStyledCell("Tranche d'Âge", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalAge = Object.values(globalStatsData.parAge).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parAge) {
    const count = globalStatsData.parAge[key];
    const percentage = ((count / totalAge) * 100).toFixed(1) + "%";
    globalSheetData.push([key, count, percentage]);
  }
  globalSheetData.push([]);
  
  // Distribution des Notes de Satisfaction
  globalSheetData.push([createStyledCell("Distribution des Notes de Satisfaction", true)]);
  globalSheetData.push([createStyledCell("Note", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalSatisfaction = Object.values(globalStatsData.satisfactionDistribution).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.satisfactionDistribution) {
    const count = globalStatsData.satisfactionDistribution[key];
    const percentage = ((count / totalSatisfaction) * 100).toFixed(1) + "%";
    globalSheetData.push([key, count, percentage]);
  }
  
  let wsGlobal = XLSX.utils.aoa_to_sheet(globalSheetData);
  wsGlobal['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];
  
  // ----------- Question Stats Sheet ---------------
  const qsContainer = document.getElementById('questionStatsContainer');
  let qsSheetData = [[createStyledCell("Statistiques par Question - " + new Date().toLocaleDateString(), true)]];
  qsSheetData.push([]);
  
  if (qsContainer) {
    const questions = qsContainer.querySelectorAll('.question-stats-wrapper');
    questions.forEach((question, index) => {
      const title = question.previousElementSibling.textContent;
      qsSheetData.push([createStyledCell(title, true)]);
      qsSheetData.push([createStyledCell("Réponse", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
      
      const summaryDiv = question.querySelector('.question-summary');
      if (summaryDiv) {
        const responseList = summaryDiv.querySelector('.response-percentage-list');
        if (responseList) {
          const responses = responseList.querySelectorAll('li');
          responses.forEach(response => {
            const label = response.querySelector('.response-label').textContent.replace(':', '');
            const count = response.querySelector('.response-count').textContent;
            const percent = response.querySelector('.response-percent').textContent;
            qsSheetData.push([label, count, percent]);
          });
        }
      }
      qsSheetData.push([]);
    });
  }
  
  let wsQuestions = XLSX.utils.aoa_to_sheet(qsSheetData);
  wsQuestions['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }];
  
  // ----------- Open Responses Sheet ---------------
  const orContainer = document.getElementById('openResponsesContainer');
  let orSheetData = [[createStyledCell("Réponses Ouvertes - " + new Date().toLocaleDateString(), true)]];
  orSheetData.push([]);
  
  if (orContainer) {
    const questions = orContainer.querySelectorAll('h4');
    questions.forEach(question => {
      orSheetData.push([createStyledCell(question.textContent, true)]);
      orSheetData.push([createStyledCell("Réponse", true), createStyledCell("Genre", true), createStyledCell("Âge", true), createStyledCell("Poste", true)]);
      
      const responses = question.nextElementSibling.querySelectorAll('li');
      responses.forEach(response => {
        const text = response.querySelector('.response-text').textContent.replace(/"/g, '');
        const gender = response.querySelector('.user-gender').textContent;
        const age = response.querySelector('.user-age').textContent;
        const poste = response.querySelector('.user-poste').textContent;
        orSheetData.push([text, gender, age, poste]);
      });
      orSheetData.push([]);
    });
  }
  
  let wsOpen = XLSX.utils.aoa_to_sheet(orSheetData);
  wsOpen['!cols'] = [{ wch: 50 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
  
  // Créer le workbook et ajouter les feuilles
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsGlobal, "Statistiques Globales");
  XLSX.utils.book_append_sheet(wb, wsQuestions, "Statistiques Questions");
  XLSX.utils.book_append_sheet(wb, wsOpen, "Réponses Ouvertes");
  
  const dateStr = getFormattedDate();
  XLSX.writeFile(wb, `Questionnaire_Statistics_${dateStr}.xlsx`);
}

// --- Extraction for Global Stats individually
function exportGlobalStatsToExcel() {
  if (!globalStatsData) {
    alert("Les statistiques globales ne sont pas chargées.");
    return;
  }
  
  let data = [];
  data.push([createStyledCell("Statistiques Globales - " + new Date().toLocaleDateString(), true)]);
  data.push([]);
  
  // Statistiques de base
  data.push([createStyledCell("Statistiques Générales", true)]);
  data.push([createStyledCell("Métrique", true), createStyledCell("Valeur", true)]);
  data.push(["Total des Questionnaires", globalStatsData.totalQuestionnaires]);
  data.push(["Satisfaction Moyenne", globalStatsData.moyenneSatisfaction.toFixed(2)]);
  data.push([]);
  
  // Distribution par Genre
  data.push([createStyledCell("Distribution par Genre", true)]);
  data.push([createStyledCell("Genre", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalGenre = Object.values(globalStatsData.parGenre).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parGenre) {
    const count = globalStatsData.parGenre[key];
    const percentage = ((count / totalGenre) * 100).toFixed(1) + "%";
    data.push([key, count, percentage]);
  }
  data.push([]);
  
  // Distribution par Poste
  data.push([createStyledCell("Distribution par Poste", true)]);
  data.push([createStyledCell("Poste", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalPoste = Object.values(globalStatsData.parPoste).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parPoste) {
    const count = globalStatsData.parPoste[key];
    const percentage = ((count / totalPoste) * 100).toFixed(1) + "%";
    data.push([key, count, percentage]);
  }
  data.push([]);
  
  // Distribution par Âge
  data.push([createStyledCell("Distribution par Tranche d'Âge", true)]);
  data.push([createStyledCell("Tranche d'Âge", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalAge = Object.values(globalStatsData.parAge).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.parAge) {
    const count = globalStatsData.parAge[key];
    const percentage = ((count / totalAge) * 100).toFixed(1) + "%";
    data.push([key, count, percentage]);
  }
  data.push([]);
  
  // Distribution des Notes de Satisfaction
  data.push([createStyledCell("Distribution des Notes de Satisfaction", true)]);
  data.push([createStyledCell("Note", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
  const totalSatisfaction = Object.values(globalStatsData.satisfactionDistribution).reduce((a, b) => a + b, 0);
  for (let key in globalStatsData.satisfactionDistribution) {
    const count = globalStatsData.satisfactionDistribution[key];
    const percentage = ((count / totalSatisfaction) * 100).toFixed(1) + "%";
    data.push([key, count, percentage]);
  }
  
  let ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];
  
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Statistiques Globales");
  
  const dateStr = getFormattedDate();
  XLSX.writeFile(wb, `Global_Statistics_${dateStr}.xlsx`);
}

// --- Extraction for Question Stats individually
function exportQuestionStatsToExcel() {
  const container = document.getElementById('questionStatsContainer');
  let data = [[createStyledCell("Statistiques par Question - " + new Date().toLocaleDateString(), true)]];
  data.push([]);
  
  if (container) {
    const questions = container.querySelectorAll('.question-stats-wrapper');
    questions.forEach((question, index) => {
      const title = question.previousElementSibling.textContent;
      data.push([createStyledCell(title, true)]);
      data.push([createStyledCell("Réponse", true), createStyledCell("Nombre", true), createStyledCell("Pourcentage", true)]);
      
      const summaryDiv = question.querySelector('.question-summary');
      if (summaryDiv) {
        const responseList = summaryDiv.querySelector('.response-percentage-list');
        if (responseList) {
          const responses = responseList.querySelectorAll('li');
          responses.forEach(response => {
            const label = response.querySelector('.response-label').textContent.replace(':', '');
            const count = response.querySelector('.response-count').textContent;
            const percent = response.querySelector('.response-percent').textContent;
            data.push([label, count, percent]);
          });
        }
      }
      data.push([]);
    });
  }
  
  let ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }];
  
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Statistiques Questions");
  
  const dateStr = getFormattedDate();
  XLSX.writeFile(wb, `Question_Statistics_${dateStr}.xlsx`);
}

// --- Extraction for Open Responses individually
function exportOpenResponsesToExcel() {
  const container = document.getElementById('openResponsesContainer');
  let data = [[createStyledCell("Réponses Ouvertes - " + new Date().toLocaleDateString(), true)]];
  data.push([]);
  
  if (container) {
    const questions = container.querySelectorAll('h4');
    questions.forEach(question => {
      data.push([createStyledCell(question.textContent, true)]);
      data.push([createStyledCell("Réponse", true), createStyledCell("Genre", true), createStyledCell("Âge", true), createStyledCell("Poste", true)]);
      
      const responses = question.nextElementSibling.querySelectorAll('li');
      responses.forEach(response => {
        const text = response.querySelector('.response-text').textContent.replace(/"/g, '');
        const gender = response.querySelector('.user-gender').textContent;
        const age = response.querySelector('.user-age').textContent;
        const poste = response.querySelector('.user-poste').textContent;
        data.push([text, gender, age, poste]);
      });
      data.push([]);
    });
  }
  
  let ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 50 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
  
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Réponses Ouvertes");
  
  const dateStr = getFormattedDate();
  XLSX.writeFile(wb, `Open_Responses_${dateStr}.xlsx`);
}

// --- Attach event listeners to extraction buttons
document.getElementById('extractStats').addEventListener('click', exportAllToExcel);
document.getElementById('extractGeneralStats').addEventListener('click', exportGlobalStatsToExcel);
document.getElementById('extractQuestionStats').addEventListener('click', exportQuestionStatsToExcel);
document.getElementById('extractOpenResponses').addEventListener('click', exportOpenResponsesToExcel);