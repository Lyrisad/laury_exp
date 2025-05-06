const translations = {
    fr: {
        // Navigation
        home: "Accueil",
        presentation: "Présentation",
        questionnaire: "Sondage",
        admin: "Administration",
        logout: "Déconnexion",

        // Index
        title: "Sondage de Satisfaction",
        subtitle: "Votre avis compte pour nous aider à nous améliorer",
        startQuestionnaire: "Commencer le sondage",
        whyQuestionnaire: "Pourquoi ce sondage ?",
        dataAnalysis: "Analyse des données",
        dataAnalysisDesc: "Des statistiques précises pour améliorer nos services",
        confidentiality: "Confidentialité",
        confidentialityDesc: "Vos réponses sont totalement anonymes",
        speed: "Rapidité",
        speedDesc: "Un questionnaire simple et rapide à remplir, cela prendra seulement quelques minutes de votre temps.",
        adaptability: "Adaptabilité",
        adaptabilityDesc: "Pas d'ordinateur ? Pas de téléphone ? Ce sondage est accessible sur ordinateur, tablette et smartphone.",

        // Section Comment ça marche
        howItWorks: "Comment ça marche",
        step0Title: "📚 Prendre connaissance de la page de présentation",
        step0Desc: "Consultez la page de présentation pour comprendre l'objectif et l'importance de ce questionnaire de satisfaction.",
        step1Title: "🚀 Commencez le questionnaire",
        step1Desc: "Cliquez sur le bouton \"Commencer le sondage\" pour débuter le processus en toute simplicité.",
        step2Title: "✍️ Répondez aux questions",
        step2Desc: "Prenez quelques minutes pour répondre aux questions qui vous sont posées sur votre expérience.",
        step3Title: "📮 Soumettez vos réponses",
        step3Desc: "Une fois terminé, soumettez vos réponses pour nous aider à améliorer nos services.",
        step4Title: "📊 Nous analysons vos retours",
        step4Desc: "Notre équipe analyse attentivement tous les retours pour identifier les points d'amélioration.",
        clickForMoreInfo: "Cliquez pour plus d'infos",
        
        // Modals
        step0ModalInfo: "La page de présentation vous explique en détail pourquoi nous avons besoin de vos retours et comment nous allons les utiliser pour améliorer nos services.",
        step1ModalInfo: "Le questionnaire a été conçu pour être intuitif et facile à utiliser. Vous pouvez y accéder depuis n'importe quel appareil avec une connexion internet, que ce soit un ordinateur, une tablette ou un smartphone.",
        step2ModalInfo: "Les questions sont organisées par thèmes pour faciliter votre réflexion. Pour chaque question, prenez le temps de réfléchir à votre expérience. N'hésitez pas à être honnête dans vos réponses - c'est ce qui nous aidera le plus à nous améliorer.",
        step3ModalInfo: "Avant de soumettre, vous aurez l'occasion de revoir et modifier vos réponses si nécessaire. Une fois soumises, vos réponses sont immédiatement enregistrées dans notre base de données sécurisée. Vous recevrez une confirmation à l'écran une fois l'envoi réussi.",
        step4ModalInfo: "Nous analyserons vos réponses avec attention pour pouvoir adapter nos services à vos besoins. Vos retours sont essentiels pour faire évoluer notre offre et améliorer la qualité de nos prestations. Ce sondage permettra d'identifier les tendances et de mettre en place des actions concrètes pour répondre au mieux à vos attentes.",
        gotoPresentation: "Aller à la page de présentation",
        startSurvey: "Commencer le sondage",
        closeModal: "Fermer",
        
        // Arrow down tooltip
        scrollToHow: "Voir comment ça marche",

        // Presentation
        whyTitle: "Pourquoi ce sondage ?",
        objective: "Objectif",
        objectiveDesc: "Ce sondage a pour but de recueillir votre retour d'expérience afin d'améliorer nos services et processus.",
        confidentialityTitle: "Confidentialité",
        confidentialityDesc: "Vos réponses sont totalement anonymes. Les données collectées seront utilisées uniquement à des fins statistiques.",
        duration: "Durée",
        durationDesc: "Le sondage ne prendra que quelques minutes de votre temps. Vos réponses sont précieuses pour nous.",
        consentText: "J'ai pris connaissance des informations ci-dessus et j'accepte de participer au questionnaire.",
        consentRequired: "Veuillez consulter la présentation et cocher la case de consentement pour accéder au questionnaire.",

        // Questionnaire
        generalInfo: "Informations générales",
        gender: "Genre",
        selectGender: "Sélectionnez votre genre",
        male: "Homme",
        female: "Femme",
        nonGendered: "Non genré",
        age: "Tranche d'âge",
        selectAge: "Sélectionnez votre tranche d'âge",
        age1: "Moins de 20 ans",
        age2: "20-29 ans",
        age3: "30-39 ans",
        age4: "40-49 ans",
        age5: "50-59 ans",
        age6: "Plus de 60 ans",
        position: "Fonction",
        selectPosition: "Sélectionnez votre fonction",
        position1: "Paie",
        position2: "Comptabilité",
        position3: "Ressources Humaines",
        position4: "Développement",
        position5: "Gestion",
        position6: "Agent",
        position7: "Manager",
        position8: "Fonctions supports",
        position9: "Managers Quadri",
        position10: "Exploitation",
        satisfaction: "Sondage de satisfaction",
        submit: "Envoyer le sondage",
        successMessage: "Merci pour votre participation ! Votre sondage a été envoyé avec succès.",
        errorMessage: "Une erreur est survenue lors de l'envoi du sondage. Veuillez réessayer.",
        questionnaireClosed: "Sondage fermé",
        questionnaireClosedMessage: "Le sondage est actuellement fermé. Veuillez réessayer ultérieurement.",
        questionnaireError: "Erreur lors de la vérification du statut du sondage",

        // Disclaimer Modal
        disclaimerTitle: "Confidentialité et Utilisation des Données",
        disclaimerText1: "Ce sondage est entièrement anonyme. Aucune information permettant de vous identifier ne sera collectée.",
        disclaimerText2: "Les données recueillies seront utilisées par le",
        disclaimerText3: "à des fins statistiques pour :",
        disclaimerList1: "Améliorer nos services et produits",
        disclaimerList2: "Analyser les tendances et besoins",
        disclaimerList3: "Développer de nouvelles idées",
        disclaimerList4: "Optimiser l'expérience au travail",
        disclaimerText4: "En participant à ce sondage, vous acceptez que vos réponses soient utilisées dans le cadre de ces analyses statistiques.",
        disclaimerAccept: "J'accepte et je continue",

        // Form Labels and Placeholders
        experienceRating: "Comment évaluez-vous votre expérience avec ce sondage ?",
        commentsLabel: "Avez-vous des commentaires/suggestions à nous partager ?",
        commentsPlaceholder: "Vos commentaires sont précieux pour nous aider à améliorer ce sondage...",
        textAnswerPlaceholder: "Écrivez votre réponse ici",

        // Footer
        copyright: "© 2024 Sondage de Satisfaction crée par Daryl PARISI pour l'entreprise CANDOR. Tous droits réservés.",

        // Messages de notification
        notificationPersonalInfo: "Veuillez remplir tous les champs obligatoires (Genre, Age, Fonction).",
        notificationQuestions: "Veuillez répondre à toutes les questions du questionnaire.",
        notificationSatisfaction: "Veuillez sélectionner une note de satisfaction.",
        notificationSuccess: "Merci pour votre participation ! Votre questionnaire a été envoyé avec succès.",
        notificationError: "Une erreur est survenue lors de l'envoi du questionnaire. Veuillez réessayer.",
        notificationSending: "Envoi en cours...",
        notificationSubmit: "Envoyer le questionnaire",
        notificationStatusError: "Erreur lors de la vérification du statut du questionnaire",
        notificationLoadingError: "Erreur lors du chargement des questions",
        notificationNoQuestions: "Aucune question trouvée",
        singleChoice: "Choix unique",
        multipleChoice: "Choix multiple",
        requiredResponses: "réponses obligatoires",
        maxResponsesExceeded: "Vous ne pouvez sélectionner que {max} réponses maximum",
        exactResponsesRequired: "Veuillez sélectionner exactement {count} réponses",

        // Notifications et messages
        notificationRequired: "Veuillez répondre à toutes les questions obligatoires.",
        notificationCheckboxLimit: "Veuillez sélectionner exactement {0} réponses.",
        notificationCheckboxMin: "Veuillez sélectionner au moins {0} réponses.",
        notificationCheckboxMax: "Veuillez sélectionner au maximum {0} réponses.",
        required: "obligatoire",
        requiredAnswers: "réponses obligatoires",
        
        // Éléments de progression
        progressText: "Progression",

        // NPS
        nps: "NPS",

        // Questions (pour les badges du nombre de questions dans les sections)
        question: "question",
        questions: "questions",

        // Messages de succès
        successTitle: "Félicitations !",
        successMessage: "Merci pour votre participation ! Votre questionnaire a été envoyé avec succès.",
        successAppreciation: "Vos réponses sont précieuses pour nous et nous aideront à améliorer nos services.",
        finishButton: "Terminer",

        // Accès au questionnaire
        accessDenied: "Accès au questionnaire",
        goToPresentation: "Aller à la présentation",

        // Ajouter les traductions pour les messages de questionnaire déjà complété
        questionnaireCompleted: "Questionnaire déjà complété",
        questionnaireCompletedMessage: "Vous avez déjà réalisé ce questionnaire. Merci pour votre participation!"
    },
    en: {
        // Navigation
        home: "Home",
        presentation: "Presentation",
        questionnaire: "Survey",
        admin: "Administration",
        logout: "Logout",

        // Index
        title: "Satisfaction Survey",
        subtitle: "Your opinion matters to help us improve",
        startQuestionnaire: "Start the survey",
        whyQuestionnaire: "Why this survey?",
        dataAnalysis: "Data Analysis",
        dataAnalysisDesc: "Accurate statistics to improve our services",
        confidentiality: "Confidentiality",
        confidentialityDesc: "Your answers are completely anonymous",
        speed: "Speed",
        speedDesc: "A simple and quick questionnaire to fill out, it will only take a few minutes of your time.",
        adaptability: "Adaptability",
        adaptabilityDesc: "No computer? No phone? This survey is accessible on computer, tablet and smartphone.",

        // Section How it works
        howItWorks: "How it works",
        step0Title: "📚 Read the presentation page",
        step0Desc: "Review the presentation page to understand the purpose and importance of this satisfaction survey.",
        step1Title: "🚀 Start the survey",
        step1Desc: "Click on the \"Start the survey\" button to begin the process with ease.",
        step2Title: "✍️ Answer the questions",
        step2Desc: "Take a few minutes to answer the questions about your experience.",
        step3Title: "📮 Submit your answers",
        step3Desc: "Once complete, submit your answers to help us improve our services.",
        step4Title: "📊 We analyze your feedback",
        step4Desc: "Our team carefully analyzes all feedback to identify areas for improvement.",
        clickForMoreInfo: "Click for more info",
        
        // Modals
        step0ModalInfo: "The presentation page explains in detail why we need your feedback and how we will use it to improve our services.",
        step1ModalInfo: "The survey has been designed to be intuitive and easy to use. You can access it from any device with an internet connection, whether it's a computer, tablet, or smartphone.",
        step2ModalInfo: "The questions are organized by themes to facilitate your reflection. For each question, take the time to think about your experience. Don't hesitate to be honest in your answers - that's what will help us improve the most.",
        step3ModalInfo: "Before submitting, you will have the opportunity to review and modify your answers if necessary. Once submitted, your answers are immediately recorded in our secure database. You will receive on-screen confirmation once the submission is successful.",
        step4ModalInfo: "We will analyze your responses carefully to adapt our services to your needs. Your feedback is essential to evolve our offering and improve the quality of our services. This survey will identify trends and implement concrete actions to best meet your expectations.",
        gotoPresentation: "Go to the presentation page",
        startSurvey: "Start the survey",
        closeModal: "Close",
        
        // Arrow down tooltip
        scrollToHow: "See how it works",

        // Presentation
        whyTitle: "Why this survey?",
        objective: "Objective",
        objectiveDesc: "This survey aims to collect your feedback to improve our services and processes.",
        confidentialityTitle: "Confidentiality",
        confidentialityDesc: "Your answers are completely anonymous. The collected data will be used for statistical purposes only.",
        duration: "Duration",
        durationDesc: "The survey will only take a few minutes of your time. Your answers are valuable to us.",
        consentText: "I have read the information above and agree to participate in the survey.",
        consentRequired: "Please review the presentation and check the consent box to access the questionnaire.",

        // Questionnaire
        generalInfo: "General Information",
        gender: "Gender",
        selectGender: "Select your gender",
        male: "Male",
        female: "Female",
        nonGendered: "Non-gendered",
        age: "Age Range",
        selectAge: "Select your age range",
        age1: "Under 20 years",
        age2: "20-29 years",
        age3: "30-39 years",
        age4: "40-49 years",
        age5: "50-59 years",
        age6: "Over 60 years",
        position: "Function",
        selectPosition: "Select your function",
        position1: "Payroll",
        position2: "Accounting",
        position3: "Human Resources",
        position4: "Development",
        position5: "Management",
        position6: "Agent",
        position7: "Manager",
        position8: "Support Functions",
        position9: "Quadri Managers",
        position10: "Operations",
        satisfaction: "Satisfaction Survey",
        submit: "Submit survey",
        successMessage: "Thank you for your participation! Your survey has been successfully submitted.",
        errorMessage: "An error occurred while submitting the survey. Please try again.",
        questionnaireClosed: "Survey Closed",
        questionnaireClosedMessage: "The survey is currently closed. Please try again later.",
        questionnaireError: "Error checking survey status",

        // Disclaimer Modal
        disclaimerTitle: "Confidentiality and Data Usage",
        disclaimerText1: "This survey is completely anonymous. No information that could identify you will be collected.",
        disclaimerText2: "The collected data will be used by",
        disclaimerText3: "for statistical purposes to:",
        disclaimerList1: "Improve our services and products",
        disclaimerList2: "Analyze trends and needs",
        disclaimerList3: "Develop new ideas",
        disclaimerList4: "Optimize work experience",
        disclaimerText4: "By participating in this survey, you agree that your responses will be used for these statistical analyses.",
        disclaimerAccept: "I accept and continue",

        // Form Labels and Placeholders
        experienceRating: "How do you rate your experience with this survey?",
        commentsLabel: "Do you have any comments or suggestions to share with us?",
        commentsPlaceholder: "Your comments are valuable to help us improve this survey...",
        textAnswerPlaceholder: "Write your answer here",

        // Footer
        copyright: "© 2024 Satisfaction Survey created by Daryl PARISI for CANDOR company. All rights reserved.",

        // Notification messages
        notificationPersonalInfo: "Please fill in all required fields (Gender, Age, Position).",
        notificationQuestions: "Please answer all questions in the questionnaire.",
        notificationSatisfaction: "Please select a satisfaction rating.",
        notificationSuccess: "Thank you for your participation! Your Survey has been successfully submitted.",
        notificationError: "An error occurred while submitting the questionnaire. Please try again.",
        notificationSending: "Sending...",
        notificationSubmit: "Submit questionnaire",
        notificationStatusError: "Error checking questionnaire status",
        notificationLoadingError: "Error loading questions",
        notificationNoQuestions: "No questions found",
        singleChoice: "Single choice",
        multipleChoice: "Multiple choice",
        requiredResponses: "required answers",
        maxResponsesExceeded: "You can select a maximum of {max} answers",
        exactResponsesRequired: "Please select exactly {count} answers",

        // Notifications et messages
        notificationRequired: "Please answer all required questions.",
        notificationCheckboxLimit: "Please select exactly {0} answers.",
        notificationCheckboxMin: "Please select at least {0} answers.",
        notificationCheckboxMax: "Please select at most {0} answers.",
        required: "required",
        requiredAnswers: "required answers",
        
        // Éléments de progression
        progressText: "Progress",

        // NPS
        nps: "NPS",

        // Questions (pour les badges du nombre de questions dans les sections)
        question: "question",
        questions: "questions",

        // Messages de succès
        successTitle: "Congratulations!",
        successMessage: "Thank you for your participation! Your questionnaire has been successfully submitted.",
        successAppreciation: "Your answers are valuable to us and will help us improve our services.",
        finishButton: "Finish",

        // Questionnaire access
        accessDenied: "Questionnaire Access",
        goToPresentation: "Go to presentation",

        // Ajouter les traductions pour les messages de questionnaire déjà complété
        questionnaireCompleted: "Survey already completed",
        questionnaireCompletedMessage: "You have already completed this survey. Thank you for your participation!"
    },
    es: {
        // Navigation
        home: "Inicio",
        presentation: "Presentación",
        questionnaire: "Encuesta",
        admin: "Administración",
        logout: "Cerrar sesión",

        // Index
        title: "Encuesta de Satisfacción",
        subtitle: "Tu opinión es importante para ayudarnos a mejorar",
        startQuestionnaire: "Comenzar la encuesta",
        whyQuestionnaire: "¿Por qué esta encuesta?",
        dataAnalysis: "Análisis de datos",
        dataAnalysisDesc: "Estadísticas precisas para mejorar nuestros servicios",
        confidentiality: "Confidencialidad",
        confidentialityDesc: "Tus respuestas son completamente anónimas",
        speed: "Rapidez",
        speedDesc: "Un cuestionario simple y rápido de completar, solo tomará unos pocos minutos de tu tiempo.",
        adaptability: "Adaptabilidad",
        adaptabilityDesc: "¿No tienes ordenador? ¿No tienes teléfono? Esta encuesta es accesible en ordenador, tableta y smartphone.",

        // Section Cómo funciona
        howItWorks: "Cómo funciona",
        step0Title: "📚 Revisar la página de presentación",
        step0Desc: "Consulta la página de presentación para comprender el objetivo y la importancia de esta encuesta de satisfacción.",
        step1Title: "🚀 Comienza la encuesta",
        step1Desc: "Haz clic en el botón \"Comenzar la encuesta\" para iniciar el proceso con facilidad.",
        step2Title: "✍️ Responda a las preguntas",
        step2Desc: "Tómate unos minutos para responder a las preguntas sobre tu experiencia.",
        step3Title: "📮 Envía tus respuestas",
        step3Desc: "Una vez completadas, envía tus respuestas para ayudarnos a mejorar nuestros servicios.",
        step4Title: "📊 Analizamos tus comentarios",
        step4Desc: "Nuestro equipo analiza cuidadosamente todos los comentarios para identificar áreas de mejora.",
        clickForMoreInfo: "Haz clic para más información",
        
        // Modals
        step0ModalInfo: "La página de presentación explica en detalle por qué necesitamos tus comentarios y cómo los utilizaremos para mejorar nuestros servicios.",
        step1ModalInfo: "La encuesta ha sido diseñada para ser intuitiva y fácil de usar. Puedes acceder a ella desde cualquier dispositivo con conexión a Internet, ya sea un ordenador, tableta o smartphone.",
        step2ModalInfo: "Las preguntas están organizadas por temas para facilitar tu reflexión. Para cada pregunta, tómate el tiempo de pensar en tu experiencia. No dudes en ser honesto en tus respuestas - eso es lo que más nos ayudará a mejorar.",
        step3ModalInfo: "Antes de enviar, tendrás la oportunidad de revisar y modificar tus respuestas si es necesario. Una vez enviadas, tus respuestas se registran inmediatamente en nuestra base de datos segura. Recibirás una confirmación en pantalla una vez que el envío sea exitoso.",
        step4ModalInfo: "Analizaremos tus respuestas cuidadosamente para adaptar nuestros servicios a tus necesidades. Tus comentarios son esenciales para evolucionar nuestra oferta y mejorar la calidad de nuestros servicios. Esta encuesta permitirá identificar tendencias e implementar acciones concretas para satisfacer mejor tus expectativas.",
        gotoPresentation: "Ir a la página de presentación",
        startSurvey: "Comenzar la encuesta",
        closeModal: "Cerrar",
        
        // Arrow down tooltip
        scrollToHow: "Ver cómo funciona",

        // Presentation
        whyTitle: "¿Por qué esta encuesta?",
        objective: "Objetivo",
        objectiveDesc: "Esta encuesta tiene como objetivo recopilar tu retroalimentación para mejorar nuestros servicios y procesos.",
        confidentialityTitle: "Confidencialidad",
        confidentialityDesc: "Tus respuestas son completamente anónimas. Los datos recopilados se utilizarán únicamente con fines estadísticos.",
        duration: "Duración",
        durationDesc: "La encuesta solo tomará unos minutos de tu tiempo. Tus respuestas son valiosas para nosotros.",
        consentText: "He leído la información anterior y acepto participar en la encuesta.",
        consentRequired: "Por favor, revise la presentación y marque la casilla de consentimiento para acceder al cuestionario.",

        // Disclaimer Modal
        disclaimerTitle: "Confidencialidad y Uso de Datos",
        disclaimerText1: "Esta encuesta es completamente anónima. No se recopilará ninguna información que pueda identificarte.",
        disclaimerText2: "Los datos recopilados serán utilizados por",
        disclaimerText3: "con fines estadísticos para:",
        disclaimerList1: "Mejorar nuestros servicios y productos",
        disclaimerList2: "Analisar tendencias y necesidades",
        disclaimerList3: "Desarrollar nuevas ideas",
        disclaimerList4: "Optimizar la experiencia laboral",
        disclaimerText4: "Ao participar en esta encuesta, você concorda que suas respostas serão utilizadas para estas análises estatísticas.",
        disclaimerAccept: "Acepto y continuo",

        // Form Labels and Placeholders
        experienceRating: "¿Cómo calificas tu experiencia con esta encuesta?",
        commentsLabel: "¿Tienes algún comentario o sugestión que compartir con nosotros?",
        commentsPlaceholder: "Tus comentarios son valiosos para ayudarnos a mejorar esta encuesta...",
        textAnswerPlaceholder: "Escribe tu respuesta aquí",

        // Footer
        copyright: "© 2024 Encuesta de Satisfacción creada por Daryl PARISI para la empresa CANDOR. Todos los derechos reservados.",

        // Notifications and messages
        notificationPersonalInfo: "Por favor complete todos los campos obligatorios (Género, Edad, Función).",
        notificationQuestions: "Por favor responda todas las preguntas del cuestionario.",
        notificationSatisfaction: "Por favor seleccione una calificación de satisfacción.",
        notificationSuccess: "¡Gracias por su participación! Su cuestionario ha sido enviado con éxito.",
        notificationError: "Ocurrió un error al enviar el cuestionario. Por favor intente nuevamente.",
        notificationSending: "Enviando...",
        notificationSubmit: "Enviar cuestionario",
        notificationStatusError: "Error al verificar el estado del cuestionario",
        notificationLoadingError: "Error al cargar las preguntas",
        notificationNoQuestions: "No se encontraron preguntas",
        singleChoice: "Elección única",
        multipleChoice: "Elección múltiple",
        requiredResponses: "respuestas requeridas",
        maxResponsesExceeded: "Puede seleccionar un máximo de {max} respuestas",
        exactResponsesRequired: "Por favor seleccione exactamente {count} respuestas",
        notificationRequired: "Por favor responda todas las preguntas obligatorias.",
        notificationCheckboxLimit: "Por favor seleccione exactamente {0} respuestas.",
        notificationCheckboxMin: "Por favor seleccione al menos {0} respuestas.",
        notificationCheckboxMax: "Por favor seleccione como máximo {0} respuestas.",
        required: "obligatorio",
        requiredAnswers: "respuestas requeridas",
        
        // Progress elements
        progressText: "Progreso",

        // NPS
        nps: "NPS",

        // Questions (for section badges)
        question: "pregunta",
        questions: "preguntas",

        // Success messages
        successTitle: "¡Felicidades!",
        successMessage: "¡Gracias por su participación! Su cuestionario ha sido enviado con éxito.",
        successAppreciation: "Sus respuestas son valiosas para nosotros y nos ayudarán a mejorar nuestros servicios.",
        finishButton: "Terminar",

        // Questionnaire access
        accessDenied: "Acceso al cuestionario",
        goToPresentation: "Ir a la presentación",

        // Questionnaire already completed
        questionnaireCompleted: "Cuestionario ya completado",
        questionnaireCompletedMessage: "Ya has realizado este cuestionario. ¡Gracias por tu participación!"
    },
    pt: {
        // Navigation
        home: "Início",
        presentation: "Apresentação",
        questionnaire: "Pesquisa",
        admin: "Administração",
        logout: "Sair",

        // Index
        title: "Pesquisa de Satisfação",
        subtitle: "Sua opinião é importante para nos ajudar a melhorar",
        startQuestionnaire: "Iniciar a pesquisa",
        whyQuestionnaire: "Por que esta pesquisa?",
        dataAnalysis: "Análise de dados",
        dataAnalysisDesc: "Estatísticas precisas para melhorar nossos serviços",
        confidentiality: "Confidencialidade",
        confidentialityDesc: "Suas respostas são completamente anônimas",
        speed: "Rapidez",
        speedDesc: "Um questionário simples e rápido de preencher, levará apenas alguns minutos do seu tempo.",
        adaptability: "Adaptabilidade",
        adaptabilityDesc: "Sem computador? Sem telefone? Esta pesquisa é acessível em computador, tablet e smartphone.",

        // Section Como funciona
        howItWorks: "Como funciona",
        step0Title: "📚 Revisar a página de apresentação",
        step0Desc: "Consulte a página de apresentação para entender o objetivo e a importância desta pesquisa de satisfação.",
        step1Title: "🚀 Inicie a pesquisa",
        step1Desc: "Clique no botão \"Iniciar a pesquisa\" para começar o processo com facilidade.",
        step2Title: "✍️ Responda às perguntas",
        step2Desc: "Dedique alguns minutos para responder às perguntas sobre sua experiência.",
        step3Title: "📮 Envie suas respostas",
        step3Desc: "Ao terminar, envie suas respostas para nos ajudar a melhorar nossos serviços.",
        step4Title: "📊 Analisamos seu feedback",
        step4Desc: "Nossa equipe analisa cuidadosamente todos os feedbacks para identificar áreas de melhoria.",
        clickForMoreInfo: "Clique para mais informações",
        
        // Modals
        step0ModalInfo: "A página de apresentação explica em detalhes por que precisamos do seu feedback e como o utilizaremos para melhorar nossos serviços.",
        step1ModalInfo: "A pesquisa foi projetada para ser intuitiva e fácil de usar. Você pode acessá-la de qualquer dispositivo com conexão à internet, seja um computador, tablet ou smartphone.",
        step2ModalInfo: "As perguntas estão organizadas por temas para facilitar sua reflexão. Para cada pergunta, tire um tempo para pensar sobre sua experiência. Não hesite em ser honesto em suas respostas - isso é o que mais nos ajudará a melhorar.",
        step3ModalInfo: "Antes de enviar, você terá a oportunidade de revisar e modificar suas respostas, se necessário. Uma vez enviadas, suas respostas são imediatamente registradas em nosso banco de dados seguro. Você receberá uma confirmação na tela assim que o envio for bem-sucedido.",
        step4ModalInfo: "Analisaremos suas respostas cuidadosamente para adaptar nossos serviços às suas necessidades. Seu feedback é essencial para evoluir nossa oferta e melhorar a qualidade de nossos serviços. Esta pesquisa permitirá identificar tendências e implementar ações concretas para atender melhor às suas expectativas.",
        gotoPresentation: "Ir para a página de apresentação",
        startSurvey: "Iniciar a pesquisa",
        closeModal: "Fechar",
        
        // Arrow down tooltip
        scrollToHow: "Ver como funciona",

        // Presentation
        whyTitle: "Por que esta pesquisa?",
        objective: "Objetivo",
        objectiveDesc: "Esta pesquisa tem como objetivo coletar seu feedback para melhorar nossos serviços e processos.",
        confidentialityTitle: "Confidencialidade",
        confidentialityDesc: "Suas respostas são completamente anônimas. Os dados coletados serão usados apenas para fins estatísticos.",
        duration: "Duração",
        durationDesc: "A pesquisa levará apenas alguns minutos do seu tempo. Suas respostas são valiosas para nós.",
        consentText: "Li as informações acima e concordo em participar da pesquisa.",
        consentRequired: "Por favor, revise a apresentação e marque a caixa de consentimento para acessar o questionário.",

        // Questionnaire
        generalInfo: "Informações gerais",
        gender: "Gênero",
        selectGender: "Selecione seu gênero",
        male: "Masculino",
        female: "Feminino",
        nonGendered: "Não-gênero",
        age: "Faixa etária",
        selectAge: "Selecione sua faixa etária",
        age1: "Menos de 20 anos",
        age2: "20-29 anos",
        age3: "30-39 anos",
        age4: "40-49 anos",
        age5: "50-59 anos",
        age6: "Mais de 60 anos",
        position: "Função",
        selectPosition: "Selecione sua função",
        position1: "Folha de pagamento",
        position2: "Contabilidade",
        position3: "Recursos Humanos",
        position4: "Desenvolvimento",
        position5: "Gestão",
        position6: "Agente",
        position7: "Gerente",
        position8: "Funções de Suporte",
        position9: "Gerentes Quadri",
        position10: "Operações",
        satisfaction: "Pesquisa de satisfação",
        submit: "Enviar pesquisa",
        successMessage: "Obrigado por sua participação! Sua pesquisa foi enviada com sucesso.",
        errorMessage: "Ocorreu um erro ao enviar a pesquisa. Por favor, tente novamente.",
        questionnaireClosed: "Pesquisa Fechada",
        questionnaireClosedMessage: "A pesquisa está atualmente fechada. Por favor, tente novamente mais tarde.",
        questionnaireError: "Erro ao verificar o status da pesquisa",

        // Disclaimer Modal
        disclaimerTitle: "Confidencialidade e Uso de Dados",
        disclaimerText1: "Esta pesquisa é completamente anônima. Nenhuma informação que possa identificá-lo será coletada.",
        disclaimerText2: "Os dados coletados serão utilizados pela",
        disclaimerText3: "para fins estatísticos para:",
        disclaimerList1: "Melhorar nossos serviços e produtos",
        disclaimerList2: "Analisar tendências e necessidades",
        disclaimerList3: "Desenvolver novas ideias",
        disclaimerList4: "Otimizar a experiência de trabalho",
        disclaimerText4: "Ao participar desta pesquisa, você concorda que suas respostas serão utilizadas para estas análises estatísticas.",
        disclaimerAccept: "Aceito e continuo",

        // Form Labels and Placeholders
        experienceRating: "Como você avalia sua experiência com esta pesquisa?",
        commentsLabel: "Você tem algum comentário ou sugestão para compartilhar conosco?",
        commentsPlaceholder: "Seus comentários são valiosos para nos ajudar a melhorar esta pesquisa...",
        textAnswerPlaceholder: "Escreva sua resposta aqui",

        // Footer
        copyright: "© 2024 Pesquisa de Satisfação criada por Daryl PARISI para a empresa CANDOR. Todos os direitos reservados.",

        // Notifications and messages
        notificationPersonalInfo: "Por favor preencha todos os campos obrigatórios (Gênero, Idade, Função).",
        notificationQuestions: "Por favor responda a todas as perguntas do questionário.",
        notificationSatisfaction: "Por favor selecione uma nota de satisfação.",
        notificationSuccess: "Obrigado pela sua participação! Seu questionário foi enviado com sucesso.",
        notificationError: "Ocorreu um erro ao enviar o questionário. Por favor tente novamente.",
        notificationSending: "Enviando...",
        notificationSubmit: "Enviar questionário",
        notificationStatusError: "Erro ao verificar o status do questionário",
        notificationLoadingError: "Erro ao carregar as perguntas",
        notificationNoQuestions: "Nenhuma pergunta encontrada",
        singleChoice: "Escolha única",
        multipleChoice: "Escolha múltipla",
        requiredResponses: "respostas obrigatórias",
        maxResponsesExceeded: "Você pode selecionar um máximo de {max} respostas",
        exactResponsesRequired: "Por favor selecione exatamente {count} respostas",
        notificationRequired: "Por favor responda a todas as perguntas obrigatórias.",
        notificationCheckboxLimit: "Por favor selecione exatamente {0} respostas.",
        notificationCheckboxMin: "Por favor selecione ao menos {0} respostas.",
        notificationCheckboxMax: "Por favor selecione no máximo {0} respostas.",
        required: "obrigatório",
        requiredAnswers: "respostas obrigatórias",
        
        // Progress elements
        progressText: "Progresso",

        // NPS
        nps: "NPS",

        // Questions (for section badges)
        question: "pergunta",
        questions: "perguntas",

        // Success messages
        successTitle: "Parabéns!",
        successMessage: "Obrigado pela sua participação! Seu questionário foi enviado com sucesso.",
        successAppreciation: "Suas respostas são valiosas para nós e nos ajudarão a melhorar nossos serviços.",
        finishButton: "Finalizar",

        // Questionnaire access
        accessDenied: "Acesso ao questionário",
        goToPresentation: "Ir para a apresentação",

        // Questionnaire already completed
        questionnaireCompleted: "Questionário já completo",
        questionnaireCompletedMessage: "Você já completou este questionário. Obrigado pela sua participação!"
    },
    ar: {
        // Navigation
        home: "الرئيسية",
        presentation: "العرض",
        questionnaire: "استطلاع",
        admin: "الإدارة",
        logout: "تسجيل الخروج",

        // Index
        title: "استطلاع الرضا",
        subtitle: "رأيك مهم لمساعدتنا على التحسين",
        startQuestionnaire: "بدء الاستطلاع",
        whyQuestionnaire: "لماذا هذا الاستطلاع؟",
        dataAnalysis: "تحليل البيانات",
        dataAnalysisDesc: "إحصائيات دقيقة لتحسين خدماتنا",
        confidentiality: "السرية",
        confidentialityDesc: "إجاباتك مجهولة تماماً",
        speed: "السرعة",
        speedDesc: "استبيان بسيط وسريع للإجابة، سيستغرق بضع دقائق فقط من وقتك.",
        adaptability: "التكيف",
        adaptabilityDesc: "لا يوجد كمبيوتر؟ لا يوجد هاتف؟ هذا الاستطلاع متاح على الكمبيوتر والجهاز اللوحي والهاتف الذكي.",

        // Section كيف يعمل
        howItWorks: "كيف يعمل",
        step0Title: "📚 مراجعة صفحة العرض",
        step0Desc: "اطلع على صفحة العرض لفهم هدف وأهمية استطلاع الرضا هذا.",
        step1Title: "🚀 ابدأ الاستطلاع",
        step1Desc: "انقر على زر \"بدء الاستطلاع\" لبدء العملية بسهولة.",
        step2Title: "✍️ أجب على الأسئلة",
        step2Desc: "خذ بضع دقائق للإجابة على الأسئلة حول تجربتك.",
        step3Title: "📮 أرسل إجاباتك",
        step3Desc: "بمجرد الانتهاء، أرسل إجاباتك لمساعدتنا على تحسين خدماتنا.",
        step4Title: "📊 نحلل ملاحظاتك",
        step4Desc: "يقوم فريقنا بتحليل جميع الملاحظات بعناية لتحديد مجالات التحسين.",
        clickForMoreInfo: "انقر لمزيد من المعلومات",
        
        // Modals
        step0ModalInfo: "تشرح صفحة العرض بالتفصيل سبب حاجتنا إلى ملاحظاتك وكيف سنستخدمها لتحسين خدماتنا.",
        step1ModalInfo: "تم تصميم الاستطلاع ليكون بديهيًا وسهل الاستخدام. يمكنك الوصول إليه من أي جهاز متصل بالإنترنت، سواء كان جهاز كمبيوتر أو جهاز لوحي أو هاتف ذكي.",
        step2ModalInfo: "الأسئلة منظمة حسب المواضيع لتسهيل تفكيرك. لكل سؤال، خذ وقتك للتفكير في تجربتك. لا تتردد في أن تكون صادقًا في إجاباتك - هذا ما سيساعدنا على التحسن أكثر.",
        step3ModalInfo: "قبل الإرسال، ستتاح لك الفرصة لمراجعة وتعديل إجاباتك إذا لزم الأمر. بمجرد الإرسال، يتم تسجيل إجاباتك فورًا في قاعدة بياناتنا الآمنة. ستتلقى تأكيدًا على الشاشة بمجرد نجاح الإرسال.",
        step4ModalInfo: "سنحلل إجاباتك بعناية لتكييف خدماتنا مع احتياجاتك. ملاحظاتك ضرورية لتطوير عرضنا وتحسين جودة خدماتنا. سيسمح هذا الاستطلاع بتحديد الاتجاهات وتنفيذ إجراءات ملموسة لتلبية توقعاتك بشكل أفضل.",
        gotoPresentation: "اذهب إلى صفحة العرض",
        startSurvey: "ابدأ الاستطلاع",
        closeModal: "إغلاق",
        
        // Arrow down tooltip
        scrollToHow: "شاهد كيف يعمل",

        // Presentation
        whyTitle: "لماذا هذا الاستطلاع؟",
        objective: "الهدف",
        objectiveDesc: "يهدف هذا الاستطلاع إلى جمع ملاحظاتك لتحسين خدماتنا وعملياتنا.",
        confidentialityTitle: "السرية",
        confidentialityDesc: "إجاباتك مجهولة تماماً. سيتم استخدام البيانات المجمعة لأغراض إحصائية فقط.",
        duration: "المدة",
        durationDesc: "سيستغرق الاستطلاع بضع دقائق فقط من وقتك. إجاباتك قيمة بالنسبة لنا.",
        consentText: "لقد قرأت المعلومات أعلاه وأوافق على المشاركة في الاستبيان.",
        consentRequired: "يرجى مراجعة العرض التقديمي والتحقق من مربع الموافقة للوصول إلى الاستبيان.",

        // Questionnaire
        generalInfo: "معلومات عامة",
        gender: "الجنس",
        selectGender: "اختر جنسك",
        male: "ذكر",
        female: "أنثى",
        nonGendered: "غير محدد الجنس",
        age: "الفئة العمرية",
        selectAge: "اختر فئتك العمرية",
        age1: "أقل من 20 سنة",
        age2: "20-29 سنة",
        age3: "30-39 سنة",
        age4: "40-49 سنة",
        age5: "50-59 سنة",
        age6: "أكثر من 60 سنة",
        position: "الوظيفة",
        selectPosition: "اختر وظيفتك",
        position1: "الرواتب",
        position2: "المحاسبة",
        position3: "الموارد البشرية",
        position4: "التطوير",
        position5: "الإدارة",
        position6: "وكيل",
        position7: "مدير",
        position8: "وظائف الدعم",
        position9: "مديرو كوادري",
        position10: "التشغيل",
        satisfaction: "استطلاع الرضا",
        submit: "إرسال الاستطلاع",
        successMessage: "شكراً لمشاركتك! تم إرسال استطلاعك بنجاح.",
        errorMessage: "حدث خطأ أثناء إرسال الاستطلاع. يرجى المحاولة مرة أخرى.",
        questionnaireClosed: "الاستطلاع مغلق",
        questionnaireClosedMessage: "الاستطلاع مغلق حالياً. يرجى المحاولة مرة أخرى لاحقاً.",
        questionnaireError: "خطأ في التحقق من حالة الاستطلاع",

        // Disclaimer Modal
        disclaimerTitle: "السرية واستخدام البيانات",
        disclaimerText1: "هذا الاستطلاع مجهول تماماً. لن يتم جمع أي معلومات يمكن أن تحدد هويتك.",
        disclaimerText2: "سيتم استخدام البيانات المجمعة من قبل",
        disclaimerText3: "لأغراض إحصائية من أجل:",
        disclaimerList1: "تحسين خدماتنا ومنتجاتنا",
        disclaimerList2: "تحليل الاتجاهات والاحتياجات",
        disclaimerList3: "تطوير أفكار جديدة",
        disclaimerList4: "تحسين تجربة العمل",
        disclaimerText4: "بالمشاركة في هذا الاستطلاع، فإنك توافق على استخدام إجاباتك في هذه التحليلات الإحصائية.",
        disclaimerAccept: "أوافق وأستمر",

        // Form Labels and Placeholders
        experienceRating: "كيف تقيم تجربتك مع هذا الاستطلاع؟",
        commentsLabel: "هل لديك أي تعليقات أو اقتراحات لمشاركتها معنا؟",
        commentsPlaceholder: "تعليقاتك قيمة لمساعدتنا في تحسين هذا الاستطلاع...",
        textAnswerPlaceholder: "اكتب إجابتك هنا",

        // Footer
        copyright: "© 2024 استطلاع الرضا من إنشاء داريل باريزي لشركة كاندور. جميع الحقوق محفوظة.",

        // رسائل الإشعارات
        notificationPersonalInfo: "يرجى ملء جميع الحقول المطلوبة (الجنس، العمر، الوظيفة).",
        notificationQuestions: "يرجى الإجابة على جميع أسئلة الاستبيان.",
        notificationSatisfaction: "يرجى اختيار درجة الرضا.",
        notificationSuccess: "شكراً لمشاركتك! تم إرسال استبيانك بنجاح.",
        notificationError: "حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.",
        notificationSending: "جاري الإرسال...",
        notificationSubmit: "إرسال الاستبيان",
        notificationStatusError: "خطأ في التحقق من حالة الاستبيان",
        notificationLoadingError: "خطأ في تحميل الأسئلة",
        notificationNoQuestions: "لم يتم العثور على أسئلة",
        singleChoice: "اختيار واحد",
        multipleChoice: "اختيار متعدد",
        requiredResponses: "إجابات مطلوبة",
        maxResponsesExceeded: "يمكنك اختيار أقصى عدد {max} إجابات",
        exactResponsesRequired: "يرجى اختيار مباشرة {count} إجابات",
        notificationRequired: "يرجى الإجابة على جميع أسئلة المطلوبة.",
        notificationCheckboxLimit: "يرجى اختيار مباشرة {0} إجابات.",
        notificationCheckboxMin: "يرجى اختيار على الأقل {0} إجابات.",
        notificationCheckboxMax: "يرجى اختيار على الأكثر {0} إجابات.",
        required: "مطلوب",
        requiredAnswers: "إجابات مطلوبة",
        
        // Éléments de progression
        progressText: "التقدم",

        // NPS
        nps: "NPS",

        // Questions (pour les badges du nombre de questions dans les sections)
        question: "سؤال",
        questions: "أسئلة",

        // Messages de succès
        successTitle: "تهانينا!",
        successMessage: "شكرا على مشاركتك! تم إرسال الاستبيان الخاص بك بنجاح.",
        successAppreciation: "إجاباتك قيمة بالنسبة لنا وستساعدنا على تحسين خدماتنا.",
        finishButton: "إنهاء",

        // الوصول إلى الاستبيان
        accessDenied: "الوصول إلى الاستبيان",
        goToPresentation: "الذهاب إلى العرض التقديمي",

        // Ajouter les traductions pour les messages de questionnaire déjà complété
        questionnaireCompleted: "الاستبيان مكتمل بالفعل",
        questionnaireCompletedMessage: "لقد أكملت هذا الاستبيان بالفعل. شكرا لمشاركتك!"
    }
}; 