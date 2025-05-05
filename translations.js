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
        speedDesc: "Un questionnaire simple et rapide à remplir",

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
        goToPresentation: "Aller à la présentation"
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
        speedDesc: "A simple and quick questionnaire to fill out",

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
        goToPresentation: "Go to presentation"
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
        speedDesc: "Un cuestionario simple y rápido de completar",

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

        // Questionnaire
        generalInfo: "Información general",
        gender: "Género",
        selectGender: "Selecciona tu género",
        male: "Hombre",
        female: "Mujer",
        nonGendered: "No género",
        age: "Rango de edad",
        selectAge: "Selecciona tu rango de edad",
        age1: "Menos de 20 años",
        age2: "20-29 años",
        age3: "30-39 años",
        age4: "40-49 años",
        age5: "50-59 años",
        age6: "Más de 60 años",
        position: "Función",
        selectPosition: "Selecciona tu función",
        position1: "Nómina",
        position2: "Contabilidad",
        position3: "Recursos Humanos",
        position4: "Desarrollo",
        position5: "Gestión",
        position6: "Agente",
        position7: "Gerente",
        position8: "Funciones de Apoyo",
        position9: "Gerentes Quadri",
        position10: "Explotación",
        satisfaction: "Encuesta de satisfacción",
        submit: "Enviar encuesta",
        successMessage: "¡Gracias por tu participación! Tu encuesta ha sido enviada con éxito.",
        errorMessage: "Ocurrió un error al enviar la encuesta. Por favor, inténtalo de nuevo.",
        questionnaireClosed: "Encuesta Cerrada",
        questionnaireClosedMessage: "La encuesta está actualmente cerrada. Por favor, inténtalo más tarde.",
        questionnaireError: "Error al verificar el estado de la encuesta",

        // Disclaimer Modal
        disclaimerTitle: "Confidencialidad y Uso de Datos",
        disclaimerText1: "Esta encuesta es completamente anónima. No se recopilará ninguna información que pueda identificarte.",
        disclaimerText2: "Los datos recopilados serán utilizados por",
        disclaimerText3: "con fines estadísticos para:",
        disclaimerList1: "Mejorar nuestros servicios y productos",
        disclaimerList2: "Analizar tendencias y necesidades",
        disclaimerList3: "Desarrollar nuevas ideas",
        disclaimerList4: "Optimizar la experiencia laboral",
        disclaimerText4: "Al participar en esta encuesta, aceptas que tus respuestas se utilizarán para estos análisis estadísticos.",
        disclaimerAccept: "Acepto y continúo",

        // Form Labels and Placeholders
        experienceRating: "¿Cómo calificas tu experiencia con esta encuesta?",
        commentsLabel: "¿Tienes algún comentario o sugerencia que compartir con nosotros?",
        commentsPlaceholder: "Tus comentarios son valiosos para ayudarnos a mejorar esta encuesta...",
        textAnswerPlaceholder: "Escribe tu respuesta aquí",

        // Footer
        copyright: "© 2024 Encuesta de Satisfacción creada por Daryl PARISI para la empresa CANDOR. Todos los derechos reservados.",

        // Mensajes de notificación
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

        // Notifications et messages
        notificationRequired: "Por favor responda todas las preguntas obligatorias.",
        notificationCheckboxLimit: "Por favor seleccione exactamente {0} respuestas.",
        notificationCheckboxMin: "Por favor seleccione al menos {0} respuestas.",
        notificationCheckboxMax: "Por favor seleccione como máximo {0} respuestas.",
        required: "obligatorio",
        requiredAnswers: "respuestas requeridas",
        
        // Éléments de progression
        progressText: "Progreso",

        // NPS
        nps: "NPS",

        // Questions (pour les badges du nombre de questions dans les sections)
        question: "pregunta",
        questions: "preguntas",

        // Messages de succès
        successTitle: "¡Felicidades!",
        successMessage: "¡Gracias por su participación! Su cuestionario ha sido enviado con éxito.",
        successAppreciation: "Sus respuestas son valiosas para nosotros y nos ayudarán a mejorar nuestros servicios.",
        finishButton: "Terminar",

        // Acceso al cuestionario
        accessDenied: "Acceso al cuestionario",
        goToPresentation: "Ir a la presentación"
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
        speedDesc: "Um questionário simples e rápido de preencher",

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

        // Mensagens de notificação
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

        // Notifications et messages
        notificationRequired: "Por favor responda a todas as perguntas obrigatórias.",
        notificationCheckboxLimit: "Por favor selecione exatamente {0} respostas.",
        notificationCheckboxMin: "Por favor selecione ao menos {0} respostas.",
        notificationCheckboxMax: "Por favor selecione no máximo {0} respostas.",
        required: "obrigatório",
        requiredAnswers: "respostas obrigatórias",
        
        // Éléments de progression
        progressText: "Progresso",

        // NPS
        nps: "NPS",

        // Questions (pour les badges du nombre de questions dans les sections)
        question: "pergunta",
        questions: "perguntas",

        // Messages de succès
        successTitle: "Parabéns!",
        successMessage: "Obrigado pela sua participação! Seu questionário foi enviado com sucesso.",
        successAppreciation: "Suas respostas são valiosas para nós e nos ajudarão a melhorar nossos serviços.",
        finishButton: "Finalizar",

        // Acesso ao questionário
        accessDenied: "Acesso ao questionário",
        goToPresentation: "Ir para a apresentação"
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
        speedDesc: "استبيان بسيط وسريع للإجابة",

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

        // Notifications et messages
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
        goToPresentation: "الذهاب إلى العرض التقديمي"
    }
}; 