import type { EducationLesson } from "@/types";

const now = new Date().toISOString();

export const BASE_EDUCATION_LESSONS: EducationLesson[] = [
  {
    id: "lesson-pollution-basics",
    title: "¿Qué es la contaminación ambiental?",
    summary:
      "Una introducción a los tipos de contaminación y cómo afectan a la comunidad.",
    content:
      "La contaminación ambiental ocurre cuando sustancias, residuos o actividades humanas alteran negativamente el aire, el agua, el suelo o los ecosistemas. Puede manifestarse como basura acumulada, humo, ruido excesivo, aguas contaminadas o pérdida de áreas verdes. Comprender la contaminación es el primer paso para prevenirla y reportarla de forma responsable.",
    estimatedMinutes: 5,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué describe mejor la contaminación ambiental?",
        options: [
          { id: "a", text: "La alteración negativa del ambiente." },
          { id: "b", text: "La creación de jardines urbanos." },
          { id: "c", text: "El uso responsable del agua." },
        ],
        correctOptionId: "a",
        explanation:
          "La contaminación implica una alteración negativa del ambiente.",
      },
      {
        id: "q2",
        question: "¿Cuál puede ser un ejemplo de contaminación?",
        options: [
          { id: "a", text: "Separar residuos reciclables." },
          { id: "b", text: "Acumulación de basura en zonas comunes." },
          { id: "c", text: "Sembrar árboles." },
        ],
        correctOptionId: "b",
        explanation:
          "La basura acumulada puede afectar el suelo, la salud y la imagen del entorno.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-waste-management",
    title: "Manejo responsable de residuos",
    summary:
      "Aprende por qué separar, reducir y disponer correctamente los residuos es importante.",
    content:
      "El manejo responsable de residuos consiste en reducir lo que consumimos, reutilizar materiales cuando sea posible y separar los residuos para facilitar su reciclaje. Una mala disposición puede generar malos olores, plagas y contaminación del suelo y el agua. En una comunidad educativa, pequeños hábitos como usar contenedores adecuados y evitar tirar basura fuera de lugar generan un impacto positivo.",
    estimatedMinutes: 6,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Cuál es una acción responsable con los residuos?",
        options: [
          { id: "a", text: "Mezclar todos los residuos." },
          { id: "b", text: "Separar y depositar residuos adecuadamente." },
          { id: "c", text: "Dejar basura en áreas verdes." },
        ],
        correctOptionId: "b",
        explanation:
          "Separar y depositar correctamente ayuda al reciclaje y reduce riesgos.",
      },
      {
        id: "q2",
        question: "¿Qué puede causar la mala disposición de basura?",
        options: [
          { id: "a", text: "Plagas y malos olores." },
          { id: "b", text: "Mayor biodiversidad." },
          { id: "c", text: "Mejor calidad del aire." },
        ],
        correctOptionId: "a",
        explanation:
          "La basura mal gestionada puede atraer plagas y generar malos olores.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-water-care",
    title: "Cuidado del agua",
    summary:
      "Conoce prácticas básicas para proteger y usar responsablemente el agua.",
    content:
      "El agua es un recurso esencial para la vida. Su contaminación puede ocurrir por residuos, químicos, aceites o descargas inadecuadas. Cuidarla implica cerrar grifos, reportar fugas, evitar tirar basura en drenajes y promover hábitos responsables. En una institución, detectar fugas a tiempo puede evitar desperdicio y reducir costos.",
    estimatedMinutes: 5,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Cuál acción ayuda al cuidado del agua?",
        options: [
          { id: "a", text: "Reportar fugas." },
          { id: "b", text: "Tirar aceite al drenaje." },
          { id: "c", text: "Dejar grifos abiertos." },
        ],
        correctOptionId: "a",
        explanation:
          "Reportar fugas permite corregir desperdicios de agua a tiempo.",
      },
      {
        id: "q2",
        question: "¿Por qué es importante no contaminar el agua?",
        options: [
          { id: "a", text: "Porque es un recurso esencial." },
          { id: "b", text: "Porque no afecta a nadie." },
          { id: "c", text: "Porque siempre se reemplaza fácilmente." },
        ],
        correctOptionId: "a",
        explanation:
          "El agua es esencial para las personas, animales, plantas y ecosistemas.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-air-quality",
    title: "Calidad del aire",
    summary:
      "Comprende cómo las emisiones, el humo y el polvo afectan la salud ambiental.",
    content:
      "La calidad del aire se ve afectada por humo, polvo, gases y otras partículas. Respirar aire contaminado puede causar molestias y afectar la salud. Acciones como evitar quemas, mantener áreas limpias y reportar fuentes de humo o malos olores ayudan a proteger la calidad del aire en espacios comunitarios.",
    estimatedMinutes: 5,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué puede afectar la calidad del aire?",
        options: [
          { id: "a", text: "Humo y partículas." },
          { id: "b", text: "Árboles sanos." },
          { id: "c", text: "Reciclaje responsable." },
        ],
        correctOptionId: "a",
        explanation:
          "El humo y las partículas pueden reducir la calidad del aire.",
      },
      {
        id: "q2",
        question: "¿Qué acción ayuda a proteger el aire?",
        options: [
          { id: "a", text: "Evitar quemas." },
          { id: "b", text: "Quemar basura." },
          { id: "c", text: "Generar más humo." },
        ],
        correctOptionId: "a",
        explanation:
          "Evitar quemas reduce emisiones contaminantes en el entorno.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-green-areas",
    title: "Importancia de las áreas verdes",
    summary:
      "Aprende cómo las zonas verdes ayudan al bienestar y equilibrio ambiental.",
    content:
      "Las áreas verdes ayudan a mejorar la calidad del aire, reducir el calor, proteger el suelo y ofrecer espacios de convivencia. También favorecen la biodiversidad y hacen más agradable el entorno. Cuidarlas implica no tirar basura, no dañar plantas y reportar afectaciones como tala, abandono o deterioro.",
    estimatedMinutes: 6,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué beneficio tienen las áreas verdes?",
        options: [
          { id: "a", text: "Mejoran el entorno y la calidad del aire." },
          { id: "b", text: "Aumentan la basura." },
          { id: "c", text: "Dañan el suelo." },
        ],
        correctOptionId: "a",
        explanation:
          "Las áreas verdes aportan beneficios ambientales y sociales.",
      },
      {
        id: "q2",
        question: "¿Qué acción ayuda a cuidar zonas verdes?",
        options: [
          { id: "a", text: "Reportar daños o deterioro." },
          { id: "b", text: "Tirar basura en jardines." },
          { id: "c", text: "Arrancar plantas." },
        ],
        correctOptionId: "a",
        explanation:
          "Reportar daños permite dar seguimiento a problemas ambientales.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-noise-pollution",
    title: "Contaminación sonora",
    summary:
      "Identifica cómo el ruido excesivo afecta la convivencia y el bienestar.",
    content:
      "La contaminación sonora ocurre cuando el ruido supera niveles adecuados y afecta la tranquilidad, concentración o salud de las personas. En espacios educativos puede dificultar clases, reuniones y actividades. Reportar ruido excesivo permite identificar horarios, zonas y fuentes del problema.",
    estimatedMinutes: 5,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué es la contaminación sonora?",
        options: [
          { id: "a", text: "Ruido excesivo que afecta el bienestar." },
          { id: "b", text: "Separación de residuos." },
          { id: "c", text: "Cuidado de árboles." },
        ],
        correctOptionId: "a",
        explanation:
          "La contaminación sonora se relaciona con ruido que afecta a las personas.",
      },
      {
        id: "q2",
        question: "¿Dónde puede afectar el ruido excesivo?",
        options: [
          { id: "a", text: "En clases y espacios de concentración." },
          { id: "b", text: "Solo en bosques lejanos." },
          { id: "c", text: "No afecta ningún espacio." },
        ],
        correctOptionId: "a",
        explanation:
          "El ruido excesivo puede afectar la concentración y la convivencia.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-recycling",
    title: "Reciclaje y economía circular",
    summary:
      "Comprende cómo el reciclaje reduce residuos y promueve el aprovechamiento.",
    content:
      "El reciclaje permite transformar ciertos residuos en nuevos materiales o productos. Forma parte de una visión de economía circular, donde se busca aprovechar recursos y reducir desperdicios. Separar papel, plástico, vidrio o metal ayuda a que los materiales puedan reincorporarse a nuevos procesos.",
    estimatedMinutes: 6,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué busca el reciclaje?",
        options: [
          { id: "a", text: "Aprovechar materiales nuevamente." },
          { id: "b", text: "Aumentar desperdicios." },
          { id: "c", text: "Mezclar todos los residuos." },
        ],
        correctOptionId: "a",
        explanation:
          "El reciclaje busca recuperar materiales para nuevos usos.",
      },
      {
        id: "q2",
        question: "¿Qué acción facilita el reciclaje?",
        options: [
          { id: "a", text: "Separar residuos por tipo." },
          { id: "b", text: "Tirar todo junto." },
          { id: "c", text: "Ensuciar materiales reciclables." },
        ],
        correctOptionId: "a",
        explanation:
          "La separación ayuda a que los materiales puedan reciclarse mejor.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-climate-change",
    title: "Cambio climático y acciones locales",
    summary:
      "Relaciona problemas globales con acciones ambientales en la comunidad.",
    content:
      "El cambio climático se relaciona con alteraciones en los patrones del clima. Aunque es un problema global, las acciones locales también importan. Reducir residuos, cuidar áreas verdes, evitar quemas, ahorrar energía y reportar problemas ambientales contribuye a construir comunidades más sostenibles.",
    estimatedMinutes: 7,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Las acciones locales pueden aportar al ambiente?",
        options: [
          { id: "a", text: "Sí, ayudan a crear comunidades sostenibles." },
          { id: "b", text: "No, nunca tienen impacto." },
          { id: "c", text: "Solo si son obligatorias." },
        ],
        correctOptionId: "a",
        explanation:
          "Las acciones locales contribuyen a mejorar el entorno y crear hábitos sostenibles.",
      },
      {
        id: "q2",
        question: "¿Cuál es una acción local positiva?",
        options: [
          { id: "a", text: "Cuidar áreas verdes." },
          { id: "b", text: "Quemar basura." },
          { id: "c", text: "Desperdiciar agua." },
        ],
        correctOptionId: "a",
        explanation:
          "Cuidar áreas verdes aporta al bienestar ambiental de la comunidad.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-environmental-reporting",
    title: "Importancia de reportar incidencias",
    summary:
      "Descubre por qué registrar problemas ambientales ayuda a tomar decisiones.",
    content:
      "Reportar incidencias ambientales permite transformar observaciones aisladas en información organizada. Cuando se registran datos como ubicación, categoría, estado y prioridad, es más fácil dar seguimiento, identificar zonas críticas y tomar decisiones. Un reporte claro puede ayudar a resolver problemas antes de que crezcan.",
    estimatedMinutes: 5,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Por qué es útil reportar incidencias?",
        options: [
          { id: "a", text: "Porque organiza información para dar seguimiento." },
          { id: "b", text: "Porque oculta los problemas." },
          { id: "c", text: "Porque elimina datos importantes." },
        ],
        correctOptionId: "a",
        explanation:
          "Reportar permite organizar datos y dar seguimiento a problemas.",
      },
      {
        id: "q2",
        question: "¿Qué dato ayuda a ubicar una incidencia?",
        options: [
          { id: "a", text: "Latitud y longitud." },
          { id: "b", text: "Color favorito." },
          { id: "c", text: "Contraseña del usuario." },
        ],
        correctOptionId: "a",
        explanation:
          "La latitud y longitud permiten mostrar la incidencia en un mapa.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lesson-community-action",
    title: "Participación comunitaria ambiental",
    summary:
      "Comprende cómo la participación colectiva mejora el cuidado ambiental.",
    content:
      "La participación comunitaria permite que más personas identifiquen, reporten y ayuden a resolver problemas ambientales. Cuando una comunidad se involucra, aumenta la conciencia ambiental y se vuelve más fácil priorizar acciones. GreenPulse promueve esa participación al facilitar reportes y seguimiento.",
    estimatedMinutes: 6,
    source: "base",
    questions: [
      {
        id: "q1",
        question: "¿Qué promueve la participación comunitaria?",
        options: [
          { id: "a", text: "Mayor conciencia y acción ambiental." },
          { id: "b", text: "Menos comunicación." },
          { id: "c", text: "Desorden en los reportes." },
        ],
        correctOptionId: "a",
        explanation:
          "La participación comunitaria fortalece el cuidado del entorno.",
      },
      {
        id: "q2",
        question: "¿Cómo ayuda GreenPulse a la comunidad?",
        options: [
          { id: "a", text: "Facilita reportar y dar seguimiento." },
          { id: "b", text: "Elimina reportes." },
          { id: "c", text: "Impide ver problemas." },
        ],
        correctOptionId: "a",
        explanation:
          "GreenPulse ayuda a registrar y visualizar incidencias ambientales.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
];