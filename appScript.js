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
  var action = e.parameter.action;
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
          responses: row[3] ? JSON.parse(row[3]) : []
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
            responses: data[i][3] ? JSON.parse(data[i][3]) : []
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
      
      sheet.appendRow([order, question, type, JSON.stringify(responses)]);
      result.success = true;
      result.message = "Question ajoutée avec succès";
      
    } else if (action == "editQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var originalOrder = parseInt(e.parameter.originalOrder);
      var order = parseInt(e.parameter.order);
      var question = e.parameter.question;
      var type = e.parameter.type;
      var responses = e.parameter.responses ? JSON.parse(e.parameter.responses) : [];
      
      if (!order || !question || !type) {
        throw new Error("Paramètres manquants");
      }
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == originalOrder) {
          // Mise à jour des colonnes ORDER, QUESTION, TYPE et REPONSES
          sheet.getRange(i + 1, 1, 1, 4).setValues([[order, question, type, JSON.stringify(responses)]]);
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
  } else if (action == "translate") {
  var text = e.parameter.text;
  var targetLang = e.parameter.targetLang;
  result.translatedText = translateText(text, targetLang);
  result.success = true;
}  else {
      throw new Error("Action non reconnue");
    }
  } catch (err) {
    result.error = err.toString();
  }
  
  // Si une callback est demandée (JSONP), on l'applique.
  var output = JSON.stringify(result);
  if (e.parameter.callback) {
    output = e.parameter.callback + "(" + output + ")";
    return ContentService.createTextOutput(output)
      .setMimeType(ContentService.MimeType.JAVASCRIPT)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}


/**
 * Fonction principale traitant les requêtes POST.
 * Elle est surtout utilisée pour la soumission des réponses du questionnaire.
 */
function doPost(e) {
  var result = {};
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e.parameter.action;
    
    if (action === "trackClick") {
      var visitorId = e.parameter.visitorId;
      var timestamp = e.parameter.timestamp || new Date().toISOString();
      
      // Récupérer ou créer la feuille "Clicks"
      var clickSheet = ss.getSheetByName("Clicks");
      if (!clickSheet) {
        clickSheet = ss.insertSheet("Clicks");
        clickSheet.appendRow(["Timestamp", "Visitor ID"]);
      }
      
      // Enregistrer le clic
      clickSheet.appendRow([timestamp, visitorId]);
      
      result.success = true;
    } else if (action === "trackPageView") {
      result = trackPageView(e.parameter.visitorId);
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
          responses: row[3] ? JSON.parse(row[3]) : []
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
            responses: data[i][3] ? JSON.parse(data[i][3]) : []
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
      
      sheet.appendRow([order, question, type, JSON.stringify(responses)]);
      result.success = true;
      result.message = "Question ajoutée avec succès";
      
    } else if (action == "editQuestion") {
      var sheet = ss.getSheetByName("Questions");
      var originalOrder = parseInt(e.parameter.originalOrder);
      var order = parseInt(e.parameter.order);
      var question = e.parameter.question;
      var type = e.parameter.type;
      var responses = e.parameter.responses ? JSON.parse(e.parameter.responses) : [];
      
      if (!order || !question || !type) {
        throw new Error("Paramètres manquants");
      }
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == originalOrder) {
          // Mise à jour des colonnes ORDER, QUESTION, TYPE et REPONSES
          sheet.getRange(i + 1, 1, 1, 4).setValues([[order, question, type, JSON.stringify(responses)]]);
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
      
    } else if (action == "submitResponse") {
      var sheet = ss.getSheetByName("Données");
      // Si la feuille n'existe pas, on la crée et on y écrit les en-têtes.
      if (!sheet) {
        sheet = ss.insertSheet("Données");
        var headers = ["Date", "Sexe", "Age", "Poste"];
        var qSheet = ss.getSheetByName("Questions");
        var qData = qSheet.getDataRange().getValues();
        for (var i = 1; i < qData.length; i++) {
          headers.push(qData[i][1]);
        }
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      
      // Formater la date
      var timestamp = new Date(e.parameter.timestamp);
      var formattedDate = Utilities.formatDate(timestamp, "Europe/Paris", "dd/MM/yyyy HH:mm");
      
      // Vérifier que nous avons bien les réponses du questionnaire
      var questionnaireResponses = e.parameter.questionnaireResponses || "";
      
      // Préparer la ligne de données
      var rowData = [formattedDate];
      var qSheet = ss.getSheetByName("Questions");
      var qData = qSheet.getDataRange().getValues();
      for (var i = 1; i < qData.length; i++) {
        var qText = qData[i][1];
        var resp = "";
        for (var j = 0; j < e.parameter.responses.length; j++) {
          if (e.parameter.responses[j].question == qText) {
            resp = e.parameter.responses[j].answer;
            break;
          }
        }
        rowData.push(resp);
      }
      sheet.appendRow(rowData);
      result.success = true;
      result.message = "Réponses enregistrées avec succès";
    } else {
      throw new Error("Action non reconnue");
    }
  } catch (err) {
    result.error = err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
