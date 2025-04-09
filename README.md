# Questionnaire de Satisfaction

Un site statique pour recueillir des retours d'expérience, déployable sur Netlify.

## Fonctionnalités

- Pages d'information et de présentation
- Formulaire anonyme avec :
  - Sexe
  - Tranche d'âge
  - Poste
- Questionnaire de satisfaction
- Envoi des données vers Google Sheets via Google Apps Script

## Structure du Projet

```
.
├── index.html          # Page d'accueil
├── presentation.html   # Page de présentation
├── questionnaire.html  # Page du questionnaire
├── styles.css         # Styles CSS
├── script.js          # Logique JavaScript
└── README.md          # Documentation
```

## Configuration Google Apps Script

1. Créez un nouveau projet Google Apps Script
2. Créez un Google Sheet pour stocker les données
3. Copiez le code suivant dans votre projet Apps Script :

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.date,
    data.sexe,
    data.age,
    data.poste,
    data.satisfaction,
    data.commentaire
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Déployez le script en tant qu'application web
5. Copiez l'URL de déploiement dans la variable `scriptUrl` du fichier `script.js`

## Déploiement sur Netlify

1. Créez un compte Netlify
2. Connectez votre dépôt Git
3. Configurez le déploiement automatique
4. Votre site sera déployé à chaque push

## Technologies Utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Apps Script
- Netlify (hébergement)

## Licence

MIT 