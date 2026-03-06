import { defineMessages } from './messages';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Sprache',
    brandName: 'Typing Library',
    brandTagline: 'Abschreiben als exaktes Tippen',
  },
  landing: {
    nav: {
      library: 'Bibliothek',
      preview: 'Vorschau',
      principles: 'Prinzipien',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Gemeinfreie Literatur lesen und sie exakt Zeichen für Zeichen abschreiben.',
      description:
        'Typing Library ist eine Abschreib-App, in der Lesetempo und Eingaberhythmus auf einer Oberfläche zusammenlaufen. Der Originaltext bleibt grau im Hintergrund sichtbar, und Tippfehler erscheinen sofort, ohne den Schreibfluss zu blockieren.',
      primaryAction: 'Werke ansehen',
      secondaryAction: 'Nullkosten-Prinzipien ansehen',
    },
    facts: {
      principleLabel: 'MVP-Prinzip',
      principleValue: 'Ohne Login · lokal gespeichert',
      worksLabel: 'Öffentliche Werke',
      worksValue: 'Separater works origin',
      typoLabel: 'Fehler-Feedback',
      typoValue: 'Sofort markiert · kein Stopp',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'Die Eingabe liegt direkt über dem Originaltext',
      chunkBadge: 'Absatzbasiert',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'Mit der Zeit wird Trauer stumpfer. Eines Tages, wenn sie vergangen ist, wirst du vielleicht froh sein, mich gekannt zu haben.',
      typedPrefix: 'Mit der Zeit wird Trauer',
      typedError: ' st',
      typedSuffix:
        'ärker. Eines Tages, wenn sie vergangen ist, wirst du vielleicht froh sein, mich gekannt zu haben.',
      accuracyLabel: 'Genauigkeit',
      accuracyValue: '97.4%',
      speedLabel: 'Tempo',
      speedValue: '312 CPM',
      typoCountLabel: 'Fehler',
      typoCountValue: '1 in diesem Absatz',
      noteRuleLabel: 'Eingaberegeln',
      noteRuleBody: 'Leerzeichen, Zeilenumbrüche, Zeichensetzung und Großschreibung folgen dem Original',
      noteResumeLabel: 'Sitzung fortsetzen',
      noteResumeBody: 'Nach einem Reload dieselbe Position und Eingabe wiederherstellen',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Schreiberlebnis und Betriebsregeln gleichzeitig festlegen',
      description:
        'Dieses Projekt behandelt die Qualität der Tipp-Erfahrung und dauerhaft kostenlose Betriebsführung mit derselben Priorität.',
      item1Title: 'Streng gegen das Original prüfen',
      item1Body:
        'Leerzeichen, Zeilenumbrüche und Zeichensetzung werden mit dem Quelltext verglichen, und Fehler erscheinen nur rot markiert.',
      item2Title: 'Fortschritt nie blockieren',
      item2Body:
        'Auch bei einem Fehler wird weitergetippt. Am Ende des Absatzes kann man prüfen, was falsch war.',
      item3Title: 'Ohne Login · lokale Speicherung',
      item3Body:
        'Ergebnisse, eigene Werke und Fortsetzungsentwürfe bleiben auf diesem Gerät. Das MVP erzeugt keine Server-Schreibvorgänge.',
      item4Title: 'Öffentliche Werke + eigene Werke',
      item4Body:
        'Neben gemeinfreier Literatur können auch eigene Texte per Einfügen oder `.txt`-Upload mit derselben Engine abgeschrieben werden.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'Nutzende folgen einem kurzen und klaren Ablauf',
      description:
        'Von der Werkauswahl bis zum Speichern des Ergebnisses gibt es weder Login-Hürde noch Server-Speicherung dazwischen.',
      step1: 'Werk auswählen',
      step2: 'Direkt über dem grauen Originaltext tippen',
      step3: 'Fehler absatzweise prüfen und weiterschreiben',
      step4: 'Genauigkeit, WPM und Zeit lokal speichern',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Regeln, die schon vor der Implementierung feststehen',
      description: 'Die wichtigsten Antworten werden vorab festgelegt, damit die Umsetzung später nicht abdriftet.',
      item1Question: 'Warum ohne Login starten?',
      item1Answer:
        'Weil das MVP kostenlose Betriebsführung und unmittelbaren Einstieg priorisiert. Aufzeichnungen und eigene Werke bleiben zuerst lokal, ohne Serverkosten zu erzeugen.',
      item2Question: 'Stoppt die Eingabe bei einem Fehler?',
      item2Answer:
        'Nein. Das falsche Zeichen wird rot markiert, aber die Eingabe läuft weiter. Am Absatzende erscheint die Fehlerzusammenfassung erneut.',
      item3Question: 'Zählen auch Leerzeichen und Zeilenumbrüche?',
      item3Answer:
        'Ja. Das Produkt dreht sich um exaktes Abschreiben, daher müssen Leerzeichen, Zeilenumbrüche und Zeichensetzung mit dem Original übereinstimmen.',
      item4Question: 'Woher kommen die öffentlichen Werke?',
      item4Answer:
        'Sie werden als statische Dateien aus einem separaten works origin geladen, damit sich der Katalog ohne erneutes App-Deployment ändern kann.',
      item5Question: 'Wie bleiben die Betriebskosten bei null?',
      item5Answer:
        'Statisches Hosting, lokale Speicherung, getrenntes Deployment der Werke, striktes Caching und keine Server-Schreibvorgänge sind die Kernregeln.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'Ein Abschreib-Werkzeug, das Lesen und Tippen nicht trennt',
      description:
        'Als öffentliche Werke werden nur gemeinfreie Texte bereitgestellt, und Nutzerdaten bleiben lokal. Kontakt- und Policy-Links werden zum Launch ergänzt.',
      library: 'Bibliothek',
      preview: 'Vorschau',
      principles: 'Prinzipien',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Vorschau-Katalog',
      worksOrigin: 'Works origin verbunden',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Einstieg für öffentliche und lokale Werke',
      back: 'Zur Landing zurück',
    },
    metrics: {
      publicWorksLabel: 'Öffentliche Werke',
      publicWorksDescription: 'Basierend auf dem öffentlichen Katalog aus dem works origin',
      myWorksLabel: 'Meine Werke',
      myWorksPending: 'Wird geprüft',
      myWorksError: 'Fehler',
      myWorksDescription: 'Anzahl persönlicher Werke in IndexedDB auf diesem Gerät',
      modeLabel: 'Aktueller Modus',
      liveMode: 'Echte Daten',
      previewMode: 'Vorschau',
      liveDescription: 'Mit separatem works origin verbunden',
      previewDescription: 'Verwendet einen Beispielkatalog, wenn kein works origin konfiguriert ist',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Zuerst ein Werk wählen, danach in den Tippbildschirm wechseln',
      description:
        'In dieser Phase werden zuerst die works-origin-Verbindung und die lokale Datenschicht aufgebaut. Im nächsten Schritt wird das gewählte Werk an die absatzbasierte Tippansicht angeschlossen.',
      searchLabel: 'Search',
      searchPlaceholder: 'Nach Titel, Autor oder Sprache suchen',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL ist noch nicht gesetzt, daher wird ein Beispielkatalog angezeigt. Nutze diese Ansicht, um UI und Ablauf vor der echten Anbindung zu prüfen.',
      unknownLanguage: 'unknown',
      multipart: 'Geteiltes Werk',
      singleFile: 'Einzeldatei',
      authorFallback: 'Keine Autor:innenangabe',
      sourcePending: 'source pending',
      select: 'Auswählen',
      noResults: 'Keine passenden Werke gefunden. Bitte Titel oder Autor prüfen.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Wähle links ein Werk aus, dann erscheinen die Details hier.',
      languageLabel: 'Sprache',
      languageFallback: 'Nicht angegeben',
      pathLabel: 'Textpfad',
      sourceLabel: 'Quelle',
      sourceFallback: 'Wird später im works catalog ergänzt',
      nextLabel: 'Nächste Verbindung',
      nextDescription:
        'Im nächsten Schritt wird das gewählte Werk an die absatzbasierte Route /typing/[workId] angeschlossen. Vorerst werden nur Auswahlfluss und Datengrenze festgelegt.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'Noch nicht verbunden. Setze NEXT_PUBLIC_WORKS_BASE_URL, um den echten Katalog zu laden.',
      worksOriginCurrent: 'Aktueller Endpunkt: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Eigene Werke, Ergebnisse und Entwürfe verwenden IndexedDB als Quelle der Wahrheit. Der In-Memory-Store bleibt auf temporäre UI-Zustände beschränkt.',
    },
  },
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
