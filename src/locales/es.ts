import { defineMessages } from './messages';
import { myWorksMessagesEn } from './shared-my-works';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Idioma',
    brandName: 'Typing Library',
    brandTagline: 'Escritura mecánica de transcripción exacta',
  },
  landing: {
    nav: {
      library: 'Biblioteca',
      preview: 'Vista previa',
      principles: 'Principios',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Lee literatura de dominio público y reescríbela exactamente, carácter por carácter.',
      description:
        'Typing Library es una app de mecanografía por transcripción donde el ritmo de lectura y el de escritura se superponen en una misma pantalla. El texto original permanece en gris detrás de tu entrada, y los errores aparecen al instante sin bloquear el avance.',
      primaryAction: 'Explorar obras',
      secondaryAction: 'Ver principios de costo cero',
    },
    facts: {
      principleLabel: 'Principio MVP',
      principleValue: 'Sin login · almacenamiento local',
      worksLabel: 'Obras públicas',
      worksValue: 'works origin separado',
      typoLabel: 'Feedback de errores',
      typoValue: 'Marcado inmediato · sin bloqueo',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'La entrada se superpone directamente al texto original',
      chunkBadge: 'Por párrafo',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'Con el paso del tiempo, la tristeza se vuelve menos aguda. Un día, cuando se vaya, quizá te alegre haberme conocido.',
      typedPrefix: 'Con el paso del tiempo, la tristeza se vuelve',
      typedError: ' ma',
      typedSuffix:
        's tenue. Un día, cuando se vaya, quizá te alegre haberme conocido.',
      accuracyLabel: 'Precisión',
      accuracyValue: '97.4%',
      speedLabel: 'Velocidad',
      speedValue: '312 CPM',
      typoCountLabel: 'Errores',
      typoCountValue: '1 en este párrafo',
      noteRuleLabel: 'Reglas de entrada',
      noteRuleBody: 'Los espacios, saltos de línea, puntuación y mayúsculas siguen el texto original',
      noteResumeLabel: 'Reanudar sesión',
      noteResumeBody: 'Restaurar la misma posición y entrada después de recargar',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Fijar al mismo tiempo la experiencia de transcripción y las reglas de operación',
      description:
        'Este proyecto da la misma prioridad a la calidad de la experiencia de escritura y a mantener la operación completamente gratuita.',
      item1Title: 'Comparación exacta con el original',
      item1Body:
        'Espacios, saltos de línea y puntuación se comparan contra el texto fuente, y los errores se muestran solo en rojo.',
      item2Title: 'Nunca bloquear el avance',
      item2Body:
        'Aunque haya un error, la persona sigue escribiendo. Al terminar el párrafo, puede revisar qué salió mal.',
      item3Title: 'Sin login · guardado local',
      item3Body:
        'Resultados, obras personales y borradores de reanudación permanecen en este dispositivo. El MVP no crea escrituras en servidor.',
      item4Title: 'Obras públicas + obras personales',
      item4Body:
        'Puedes transcribir literatura de dominio público o tus propios textos añadidos por pegado o carga de `.txt` usando el mismo motor.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'La persona usuaria sigue un recorrido corto y claro',
      description: 'Desde elegir una obra hasta guardar el resultado, no hay muro de login ni guardado en servidor en medio.',
      step1: 'Elegir una obra',
      step2: 'Escribir directamente sobre el texto gris',
      step3: 'Revisar errores por párrafo y continuar',
      step4: 'Guardar precisión, WPM y tiempo de forma local al terminar',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Reglas fijadas antes de implementar',
      description: 'Las respuestas clave se definen por adelantado para que el producto no se desvíe después.',
      item1Question: '¿Por qué empezar sin login?',
      item1Answer:
        'Porque el MVP prioriza operación gratuita y acceso inmediato. Los registros y obras personales quedan primero en local, sin generar costo de servidor.',
      item2Question: '¿La escritura se detiene si cometo un error?',
      item2Answer:
        'No. El carácter incorrecto se marca en rojo, pero la entrada continúa. Al terminar el párrafo, se vuelve a mostrar el resumen de errores.',
      item3Question: '¿También importan los espacios y saltos de línea?',
      item3Answer:
        'Sí. El objetivo del producto es copiar el texto exactamente, así que espacios, saltos de línea y puntuación deben coincidir con el original.',
      item4Question: '¿De dónde vienen las obras públicas?',
      item4Answer:
        'Se leen como archivos estáticos desde un works origin separado, de modo que el catálogo pueda cambiar sin redesplegar la app.',
      item5Question: '¿Cómo se mantiene el costo de operación en cero?',
      item5Answer:
        'Hosting estático, almacenamiento local, despliegue separado de obras, caché estricta y ausencia de escrituras en servidor son las reglas centrales.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'Una herramienta de transcripción que no separa lectura y escritura',
      description:
        'Las obras públicas solo sirven textos de dominio público y los datos de usuario permanecen en local. Los enlaces de contacto y políticas se conectarán al lanzar.',
      library: 'Biblioteca',
      preview: 'Vista previa',
      principles: 'Principios',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Catálogo de vista previa',
      worksOrigin: 'Works origin conectado',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Punto de entrada para obras públicas y locales',
      back: 'Volver a la landing',
    },
    metrics: {
      publicWorksLabel: 'Obras públicas',
      publicWorksDescription: 'Basado en el catálogo público cargado desde works origin',
      myWorksLabel: 'Mis obras',
      myWorksPending: 'Comprobando',
      myWorksError: 'Error',
      myWorksDescription: 'Cantidad de obras personales almacenadas en IndexedDB en este dispositivo',
      modeLabel: 'Modo actual',
      liveMode: 'Datos reales',
      previewMode: 'Vista previa',
      liveDescription: 'Conectado al works origin separado',
      previewDescription: 'Usa un catálogo de muestra cuando no hay works origin configurado',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Primero elige una obra; después entra en la pantalla de transcripción',
      description:
        'En esta etapa se conectan primero el works origin y la capa de datos local. El siguiente paso es enlazar la obra seleccionada a la vista de escritura por párrafos.',
      searchLabel: 'Search',
      searchPlaceholder: 'Buscar por título, autor o idioma',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL aún no está configurado, por eso se muestra un catálogo de muestra. Úsalo para validar la UI y el flujo antes de conectar obras reales.',
      unknownLanguage: 'unknown',
      multipart: 'Obra dividida',
      singleFile: 'Archivo único',
      authorFallback: 'Sin información de autor',
      sourcePending: 'source pending',
      select: 'Seleccionar',
      noResults: 'No se encontraron obras coincidentes. Revisa el título o el autor e inténtalo otra vez.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Elige una obra de la lista de la izquierda para ver aquí sus detalles.',
      languageLabel: 'Idioma',
      languageFallback: 'No especificado',
      pathLabel: 'Ruta del texto',
      sourceLabel: 'Fuente',
      sourceFallback: 'Se añadirá al works catalog',
      nextLabel: 'Siguiente conexión',
      nextDescription:
        'El siguiente paso es conectar la obra elegida a la ruta de transcripción por párrafos en /typing/[workId]. Por ahora solo se fija el flujo de selección y el límite de datos.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'Todavía no está conectado. Configura NEXT_PUBLIC_WORKS_BASE_URL para leer el catálogo real.',
      worksOriginCurrent: 'Endpoint actual: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Las obras personales, resultados y borradores usan IndexedDB como fuente de verdad. El store en memoria queda reservado al estado temporal de la UI.',
    },
  },
  myWorks: myWorksMessagesEn,
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
