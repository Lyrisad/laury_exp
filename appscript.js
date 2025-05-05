/**
 * Fonction principale traitant les requêtes GET.
 * Possibles actions :
 *   - getQuestions
 *   - getQuestion
 *   - addQuestion
 *   - editQuestion
 *   - deleteQuestion
 *   - submitResponse
 *   - getStat
 *   - toggleQuestionnaireStatus
 *   - getQuestionnaireStatus
 */

function translateText(text, targetLang) {
  if (targetLang === "fr") {
    return text;
  }
  try {
    // LanguageApp.translate(sourceText, sourceLang, targetLang)
    return LanguageApp.translate(text, "fr", targetLang);
  } catch (error) {
    return text;
  }
}

function trackPageView(visitorId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = new Date().toISOString();
  
  // Récupérer ou créer la feuille "Visitors"
  var visitorSheet = ss.getSheetByName("Visitors");
  if (!visitorSheet) {
    visitorSheet = ss.insertSheet("Visitors");
    visitorSheet.appendRow(["Visitor ID", "First Visit", "Last Visit", "Visit Count"]);
  }
  
  // Vérifier si le visiteur existe déjà
  var visitorData = visitorSheet.getDataRange().getValues();
  var visitorRow = -1;
  for (var i = 1; i < visitorData.length; i++) {
    if (visitorData[i][0] === visitorId) {
      visitorRow = i + 1;
      break;
    }
  }
  
  if (visitorRow === -1) {
    // Nouveau visiteur
    visitorSheet.appendRow([visitorId, timestamp, timestamp, 1]);
  } else {
    // Visiteur existant - mettre à jour la dernière visite et le compteur
    var visitCount = visitorData[visitorRow - 1][3] + 1;
    visitorSheet.getRange(visitorRow, 3, 1, 2).setValues([[timestamp, visitCount]]);
  }
  
  // Enregistrer la vue de page
  var viewSheet = ss.getSheetByName("PageViews");
  if (!viewSheet) {
    viewSheet = ss.insertSheet("PageViews");
    viewSheet.appendRow(["Timestamp", "Visitor ID"]);
  }
  viewSheet.appendRow([timestamp, visitorId]);
  
  return { success: true };
}

function trackClick(visitorId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = new Date().toISOString();
  
  // Récupérer ou créer la feuille "Clicks"
  var clickSheet = ss.getSheetByName("Clicks");
  if (!clickSheet) {
    clickSheet = ss.insertSheet("Clicks");
    clickSheet.appendRow(["Timestamp", "Visitor ID"]);
  }
  
  // Enregistrer le clic
  clickSheet.appendRow([timestamp, visitorId]);
  
  return { success: true };
}

function getClickStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var visitorSheet = ss.getSheetByName("Visitors");
  var clickSheet = ss.getSheetByName("Clicks");
  var viewSheet = ss.getSheetByName("PageViews");
  
  if (!visitorSheet || !clickSheet || !viewSheet) {
    return {
      totalVisitors: 0,
      totalClicks: 0,
      totalPageViews: 0,
      ctr: 0
    };
  }
  
  // Compter le nombre total de visiteurs uniques
  var totalVisitors = visitorSheet.getLastRow() - 1;
  
  // Compter le nombre total de clics
  var totalClicks = clickSheet.getLastRow() - 1;
  
  // Compter le nombre total de vues de page
  var totalPageViews = viewSheet.getLastRow() - 1;
  
  // Calculer le CTR
  var ctr = totalPageViews > 0 ? (totalClicks / totalPageViews) * 100 : 0;
  
  return {
    totalVisitors,
    totalClicks,
    totalPageViews,
    ctr
  };
}

function getTotalResponses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Données");
  
  if (!dataSheet) {
    return { totalResponses: 0 };
  }
  
  return { totalResponses: dataSheet.getLastRow() - 1 };
}

function doGet(e) {
  const action = e.parameter.action;
  var result = {};
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "trackPageView") {
      result = trackPageView(e.parameter.visitorId);
    } else if (action === "trackClick") {
      result = trackClick(e.parameter.visitorId);
    } else if (action === "getClickStats") {
      result = getClickStats();
    } else if (action === "getTotalResponses") {
      result = getTotalResponses();
    } else if (action === "toggleQuestionnaireStatus") {
      var sheet = ss.getSheetByName("Questionnaire");
      if (!sheet) {
        // Créer la feuille si elle n'existe pas
        sheet = ss.insertSheet("Questionnaire");
        sheet.appendRow(["DATE", "OUVERT"]);
      }
      
      // Récupérer la dernière ligne
      var lastRow = sheet.getLastRow();
      var currentStatus = "FALSE";
      
      if (lastRow > 1) {
        // Si la feuille contient déjà des données, récupérer le dernier statut
        var statusValue = sheet.getRange(lastRow, 2).getValue();
        // Convertir en chaîne et mettre en majuscules
        currentStatus = statusValue.toString().toUpperCase();
      }
      
      // Inverser le statut
      var newStatus = currentStatus === "TRUE" ? "FALSE" : "TRUE";
      
      // Formater la date actuelle
      var now = new Date();
      var formattedDate = Utilities.formatDate(now, "Europe/Paris", "dd/MM/yyyy HH:mm");
      
      // Mettre à jour la dernière ligne au lieu d'en ajouter une nouvelle
      if (lastRow > 1) {
        sheet.getRange(lastRow, 1, 1, 2).setValues([[formattedDate, newStatus]]);
      } else {
        sheet.appendRow([formattedDate, newStatus]);
      }
      
      result.success = true;
      result.message = "Statut du questionnaire mis à jour avec succès";
      result.newStatus = newStatus;
      
    } else if (action === "translate") {
      // Optionnel : pour la traduction (cf. votre autre script)
      var text = e.parameter.text;
      var targetLang = e.parameter.targetLang;
      result.translatedText = translateText(text, targetLang);
      result.success = true;
    } else if (action == "getQuestions") {
      var sheet = ss.getSheetByName("Questions");
      var data = sheet.getDataRange().getValues();
      // La première ligne contient les en-têtes.
      result.values = data.slice(1).map(function(row) {
        return {
          order: row[0],
          question: row[1],
          type: row[2],
          responses: row[3] ? JSON.parse(row[3]) : [],
          maxResponses: row[4] ? parseInt(row[4]) : 0
        };
      });
      
    } else if (action == "getQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var order = parseInt(e.parameter.order);
      if (!order) {
        throw new Error("Ordre de question manquant");
      }
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == order) {
          result.question = {
            order: data[i][0],
            question: data[i][1],
            type: data[i][2],
            responses: data[i][3] ? JSON.parse(data[i][3]) : [],
            maxResponses: data[i][4] ? parseInt(data[i][4]) : 0
          };
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error("Question non trouvée");
      }
      
    } else if (action == "addQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var order = parseInt(e.parameter.order);
      var question = e.parameter.question;
      var type = e.parameter.type;
      var responses = e.parameter.responses ? JSON.parse(e.parameter.responses) : [];
      var maxResponses = parseInt(e.parameter.maxResponses || 0);
      
      if (!order || !question || !type) {
        throw new Error("Paramètres manquants");
      }
      
      // Vérifier que l'ordre n'existe pas déjà.
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == order) {
          throw new Error("Une question avec cet ordre existe déjà");
        }
      }
      
      sheet.appendRow([order, question, type, JSON.stringify(responses), maxResponses]);
      result.success = true;
      result.message = "Question ajoutée avec succès";
      
    } else if (action == "editQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var originalOrder = parseInt(e.parameter.originalOrder);
      var order = parseInt(e.parameter.order);
      var question = e.parameter.question;
      var type = e.parameter.type;
      var responses = e.parameter.responses ? JSON.parse(e.parameter.responses) : [];
      var maxResponses = parseInt(e.parameter.maxResponses || 0);
      
      if (!order || !question || !type) {
        throw new Error("Paramètres manquants");
      }
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == originalOrder) {
          // Mise à jour des colonnes ORDER, QUESTION, TYPE, REPONSES et MAXRESPONSES
          sheet.getRange(i + 1, 1, 1, 5).setValues([[order, question, type, JSON.stringify(responses), maxResponses]]);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error("Question non trouvée");
      }
      result.success = true;
      result.message = "Question modifiée avec succès";
      
    } else if (action == "deleteQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var order = parseInt(e.parameter.order);
      if (!order) {
        throw new Error("Ordre de question manquant");
      }
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == order) {
          sheet.deleteRow(i + 1);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error("Question non trouvée");
      }
      result.success = true;
      result.message = "Question supprimée avec succès";
      
    } else if (action == "deleteAllQuestions") {
      var sheet = ss.getSheetByName("Questions");
      if (!sheet) {
        throw new Error("La feuille 'Questions' n'existe pas");
      }
      
      // Supprimer toutes les lignes sauf l'en-tête
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      
      result.success = true;
      result.message = "Toutes les questions ont été supprimées avec succès";
      
    } else if (action == "deleteAllResponses") {
      var sheet = ss.getSheetByName("Données");
      if (!sheet) {
        throw new Error("La feuille 'Données' n'existe pas");
      }
      
      // Supprimer toutes les lignes sauf l'en-tête
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      
      result.success = true;
      result.message = "Toutes les réponses ont été supprimées avec succès";
      
    } else if (action == "submitResponse") {
      var sheet = ss.getSheetByName("Données");
      // Si la feuille n'existe pas, on la crée et on y écrit les en-têtes.
      if (!sheet) {
        sheet = ss.insertSheet("Données");
        var headers = ["Date", "Sexe", "Age", "Poste", "Satisfaction", "Commentaire", "Réponses"];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      
      // Formater la date
      var timestamp = new Date(e.parameter.timestamp);
      var formattedDate = Utilities.formatDate(timestamp, "Europe/Paris", "dd/MM/yyyy HH:mm");
      
      // Vérifier que nous avons bien les réponses du questionnaire
      var questionnaireResponses = e.parameter.questionnaireResponses || "";
      
      // Préparer la ligne de données
      var rowData = [
        formattedDate,           // Date
        e.parameter.sexe,        // Sexe
        e.parameter.age,         // Age
        e.parameter.poste,       // Poste
        e.parameter.satisfaction,// Note de satisfaction finale
        e.parameter.commentaires,// Commentaire final
        questionnaireResponses   // Réponses au questionnaire
      ];
      
      // Ajouter la ligne
      sheet.appendRow(rowData);
      result.success = true;
      result.message = "Réponses enregistrées avec succès";
      
   } else if (action == "getStats") {
  var sheet = ss.getSheetByName("Données");
  if (!sheet) {
    throw new Error("La feuille 'Données' n'existe pas.");
  }
  var data = sheet.getDataRange().getValues();
  // Si aucune réponse n'est enregistrée, renvoyer des statistiques vides
  if (data.length < 2) {
    result.stats = {
      totalQuestionnaires: 0,
      parGenre: {},
      parPoste: {},
      parAge: {},
      moyenneSatisfaction: 0,
      satisfactionDistribution: {}
    };
  } else {
    // Récupérer les filtres (optionnels) et les normaliser (trim et toLowerCase)
    var filterGenre = e.parameter.genre ? e.parameter.genre.trim().toLowerCase() : "";
    var filterPoste = e.parameter.poste ? e.parameter.poste.trim().toLowerCase() : "";
    var filterAge = e.parameter.age ? e.parameter.age.trim().toLowerCase() : "";  // NEW: filter for age
    var filterDateFrom = e.parameter.dateFrom ? e.parameter.dateFrom.trim() : "";
    var filterDateTo = e.parameter.dateTo ? e.parameter.dateTo.trim() : "";
    
    // Indices attendus (à adapter si besoin) : 
    // 0 = Date, 1 = Sexe, 2 = Age, 3 = Poste, 4 = Satisfaction, 5 = Commentaire, 6 = Réponses
    var filteredData = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowDate = new Date(row[0]);
      var rowGenre = row[1] ? row[1].toString().trim().toLowerCase() : "";
      var rowAge = row[2] ? row[2].toString().trim().toLowerCase() : "";
      var rowPoste = row[3] ? row[3].toString().trim().toLowerCase() : "";
      
      if (filterGenre && rowGenre !== filterGenre) continue;
      if (filterPoste && rowPoste !== filterPoste) continue;
      if (filterAge && rowAge !== filterAge) continue; // NEW: apply age filter
      if (filterDateFrom) {
        var fromDate = new Date(filterDateFrom);
        if (rowDate < fromDate) continue;
      }
      if (filterDateTo) {
        var toDate = new Date(filterDateTo);
        if (rowDate > toDate) continue;
      }
      filteredData.push(row);
    }
    
    var stats = {
      totalQuestionnaires: filteredData.length,
      parGenre: {},
      parPoste: {},
      parAge: {},
      moyenneSatisfaction: 0,
      satisfactionDistribution: {}
    };
    var totalSatisfaction = 0;
    var countSatisfaction = 0;
    
    for (var i = 0; i < filteredData.length; i++) {
      var row = filteredData[i];
      var genre = row[1] ? row[1].toString().trim() : "";
      var age = row[2] ? row[2].toString().trim() : "";
      var poste = row[3] ? row[3].toString().trim() : "";
      var satisfaction = parseFloat(row[4]);
      
      stats.parGenre[genre] = (stats.parGenre[genre] || 0) + 1;
      stats.parPoste[poste] = (stats.parPoste[poste] || 0) + 1;
      stats.parAge[age] = (stats.parAge[age] || 0) + 1;
      
      if (!isNaN(satisfaction)) {
        stats.satisfactionDistribution[satisfaction] = (stats.satisfactionDistribution[satisfaction] || 0) + 1;
        totalSatisfaction += satisfaction;
        countSatisfaction++;
      }
    }
    stats.moyenneSatisfaction = countSatisfaction > 0 ? totalSatisfaction / countSatisfaction : 0;
    result.stats = stats;
  }
}
 else if (action == "getRawResponses") {
  var sheet = ss.getSheetByName("Données");
  if (!sheet) {
    throw new Error("La feuille 'Données' n'existe pas.");
  }
  var data = sheet.getDataRange().getValues();
  if (data.length < 1) {
    result.error = "Aucune donnée trouvée.";
  } else {
    result.headers = data[0];      // Première ligne avec les intitulés
    result.responses = data.slice(1); // Toutes les autres lignes
  }
  result.success = true;
  } else if (action == "getQuestionnaireStatus") {
    var sheet = ss.getSheetByName("Questionnaire");
    if (!sheet) {
      // Si la feuille n'existe pas, le questionnaire est considéré comme fermé
      result.status = "FALSE";
    } else {
      // Récupérer la dernière ligne
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var statusValue = sheet.getRange(lastRow, 2).getValue();
        // Convertir en chaîne et mettre en majuscules
        result.status = statusValue.toString().toUpperCase();
      } else {
        result.status = "FALSE";
      }
    }
    result.success = true;
  } else if (action == "resetClickStats") {
    // Réinitialiser les feuilles de statistiques
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Réinitialiser la feuille Visitors
    var visitorSheet = ss.getSheetByName("Visitors");
    if (visitorSheet) {
      visitorSheet.clear();
      visitorSheet.appendRow(["Visitor ID", "First Visit", "Last Visit", "Visit Count"]);
    }
    
    // Réinitialiser la feuille PageViews
    var viewSheet = ss.getSheetByName("PageViews");
    if (viewSheet) {
      viewSheet.clear();
      viewSheet.appendRow(["Timestamp", "Visitor ID"]);
    }
    
    // Réinitialiser la feuille Clicks
    var clickSheet = ss.getSheetByName("Clicks");
    if (clickSheet) {
      clickSheet.clear();
      clickSheet.appendRow(["Timestamp", "Visitor ID"]);
    }
    
    result.success = true;
    result.message = "Statistiques de clics réinitialisées avec succès";
  } else if (action == "translate") {
    var text = e.parameter.text;
    var targetLang = e.parameter.targetLang;
    result.translatedText = translateText(text, targetLang);
    result.success = true;
  } else if (action === 'addSection') {
    return addSection(e);
  } else if (action === 'editSection') {
    return editSection(e);
  } else if (action === 'deleteSection') {
    return deleteSection(e);
  } else if (action === 'getSections') {
    return getSections();
  } else if (action === 'getSection') {
    return getSection(e);
  } else {
      throw new Error("Action non reconnue");
    }
  } catch (err) {
    result.error = err.toString();
  }
  
  // Si une callback est demandée (JSONP), on l'applique.
  var output = JSON.stringify(result);
  if (e.parameter.callback) {
    output = e.parameter.callback + "(" + output + ")";
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}


/**
 * Fonction principale traitant les requêtes POST.
 * Elle est surtout utilisée pour la soumission des réponses du questionnaire.
 */
function doPost(e) {
  var result = {};
  
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.sexe && data.age && data.poste && data.responses) {
      var sheet = ss.getSheetByName("Données");
      // Création de la feuille "Données" si elle n'existe pas.
      if (!sheet) {
        sheet = ss.insertSheet("Données");
        var qSheet = ss.getSheetByName("Questions");
        var qData = qSheet.getDataRange().getValues();
        var headers = ["Date", "Sexe", "Age", "Poste"];
        for (var i = 1; i < qData.length; i++) {
          headers.push(qData[i][1]);
        }
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      
      var rowData = [data.timestamp, data.sexe, data.age, data.poste];
      var qSheet = ss.getSheetByName("Questions");
      var qData = qSheet.getDataRange().getValues();
      for (var i = 1; i < qData.length; i++) {
        var qText = qData[i][1];
        var resp = "";
        for (var j = 0; j < data.responses.length; j++) {
          if (data.responses[j].question == qText) {
            resp = data.responses[j].answer;
            break;
          }
        }
        rowData.push(resp);
      }
      sheet.appendRow(rowData);
      result.success = true;
      result.message = "Réponses enregistrées avec succès";
    } else {
      throw new Error("Paramètres manquants dans le POST");
    }
  } catch (err) {
    result.error = err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ======= GESTION DES SECTIONS =======
// Fonctions à ajouter à votre code Google Apps Script existant

/**
 * Fonction pour récupérer les sections
 */
function getSections() {
  try {
    // Utiliser le classeur actif au lieu d'utiliser l'ID
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Récupérer ou créer la feuille des sections
    var sectionsSheet = getOrCreateSectionsSheet(spreadsheet);
    
    // Lire les données de la feuille
    const dataRange = sectionsSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Ignorer la ligne d'en-tête
    const sections = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i][0]) { // Vérifiez que l'ID n'est pas vide
        sections.push({
          id: values[i][0],
          title: values[i][1],
          description: values[i][2],
          startQuestion: values[i][3],
          endQuestion: values[i][4]
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ sections: sections }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Erreur générale dans getSections:", error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Récupère ou crée la feuille Sections
 */
function getOrCreateSectionsSheet(spreadsheet) {
  try {
    // Tenter de récupérer la feuille existante
    let sectionsSheet = spreadsheet.getSheetByName('Sections');
    
    // Si la feuille n'existe pas, la créer
    if (!sectionsSheet) {
      console.log('Création de la feuille Sections...');
      sectionsSheet = spreadsheet.insertSheet('Sections');
      
      // Ajouter les en-têtes
      sectionsSheet.getRange('A1:E1').setValues([['ID', 'Titre', 'Description', 'Question début', 'Question fin']]);
      
      // Mettre en forme les en-têtes
      sectionsSheet.getRange('A1:E1').setFontWeight('bold');
      sectionsSheet.setFrozenRows(1);
      
      // Ajuster les largeurs de colonnes
      sectionsSheet.setColumnWidth(1, 150); // ID
      sectionsSheet.setColumnWidth(2, 250); // Titre
      sectionsSheet.setColumnWidth(3, 350); // Description
      sectionsSheet.setColumnWidth(4, 150); // Question début
      sectionsSheet.setColumnWidth(5, 150); // Question fin
      
      console.log('Feuille Sections créée avec succès');
    }
    
    return sectionsSheet;
  } catch (error) {
    console.error('Erreur lors de la création de la feuille Sections:', error);
    throw new Error('Erreur lors de la création de la feuille Sections: ' + error.toString());
  }
}

// Assurez-vous que cette fonction est correctement appelée pour l'action addSection
function addSection(e) {
  try {
    const title = e.parameter.title;
    const description = e.parameter.description || '';
    const startQuestion = e.parameter.startQuestion;
    const endQuestion = e.parameter.endQuestion;
    
    if (!title || !startQuestion || !endQuestion) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Titre, question de début et question de fin sont requis' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Utiliser le classeur actif au lieu d'utiliser l'ID
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Récupérer ou créer la feuille des sections
    var sectionsSheet = getOrCreateSectionsSheet(spreadsheet);
    
    // Générer un ID unique
    const id = Utilities.getUuid();
    
    // Ajouter la section
    sectionsSheet.appendRow([id, title, description, startQuestion, endQuestion]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, sectionId: id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Erreur générale dans addSection:", error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction pour modifier une section existante
function editSection(e) {
  try {
    // Utiliser le classeur actif au lieu d'utiliser l'ID
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sectionsSheet = getOrCreateSectionsSheet(spreadsheet);
    
    // Récupérer les paramètres de la requête
    const sectionId = e.parameter.sectionId;
    const title = e.parameter.title;
    const description = e.parameter.description || '';
    const startQuestion = parseInt(e.parameter.startQuestion);
    const endQuestion = parseInt(e.parameter.endQuestion);
    
    // Rechercher la section par son ID
    const data = sectionsSheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === sectionId) {
        rowIndex = i + 1; // +1 car les indices commencent à 1 dans Sheets
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createErrorResponse('Section non trouvée');
    }
    
    // Mettre à jour la section
    sectionsSheet.getRange(rowIndex, 2).setValue(title);
    sectionsSheet.getRange(rowIndex, 3).setValue(description);
    sectionsSheet.getRange(rowIndex, 4).setValue(startQuestion);
    sectionsSheet.getRange(rowIndex, 5).setValue(endQuestion);
    
    return createSuccessResponse({ success: true });
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

// Fonction pour supprimer une section
function deleteSection(e) {
  try {
    // Utiliser le classeur actif au lieu d'utiliser l'ID
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sectionsSheet = getOrCreateSectionsSheet(spreadsheet);
    
    // Récupérer l'ID de la section à supprimer
    const sectionId = e.parameter.sectionId;
    
    // Rechercher la section par son ID
    const data = sectionsSheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === sectionId) {
        rowIndex = i + 1; // +1 car les indices commencent à 1 dans Sheets
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createErrorResponse('Section non trouvée');
    }
    
    // Supprimer la ligne
    sectionsSheet.deleteRow(rowIndex);
    
    return createSuccessResponse({ success: true });
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

// Fonction pour récupérer les détails d'une section spécifique
function getSection(e) {
  try {
    // Utiliser le classeur actif au lieu d'utiliser l'ID
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sectionsSheet = getOrCreateSectionsSheet(spreadsheet);
    
    // Récupérer l'ID de la section
    const sectionId = e.parameter.sectionId;
    
    // Rechercher la section par son ID
    const data = sectionsSheet.getDataRange().getValues();
    let section = null;
    
    // Ignorer la ligne d'en-tête si elle existe
    const startRow = data[0][0] === 'id' ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      if (data[i][0] === sectionId) {
        section = {
          id: data[i][0],
          title: data[i][1],
          description: data[i][2],
          startQuestion: data[i][3],
          endQuestion: data[i][4],
          created: data[i][5]
        };
        break;
      }
    }
    
    if (!section) {
      return createErrorResponse('Section non trouvée');
    }
    
    return createSuccessResponse({ section: section });
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

// Fonctions utilitaires pour les réponses JSON
function createSuccessResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(errorMessage) {
  return ContentService.createTextOutput(JSON.stringify({ error: errorMessage }))
    .setMimeType(ContentService.MimeType.JSON);
}
