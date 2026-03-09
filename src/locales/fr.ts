import { defineMessages } from './messages';
import { myWorksMessagesEn } from './shared-my-works';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Langue',
    brandName: 'Typing Library',
    brandTagline: 'Une saisie de recopie fidèle, caractère par caractère',
  },
  landing: {
    nav: {
      library: 'Bibliothèque',
      preview: 'Aperçu',
      principles: 'Principes',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Lire la littérature du domaine public et la recopier exactement au clavier.',
      description:
        'Typing Library est une application de frappe par transcription où le rythme de lecture et celui de la saisie se superposent sur un même écran. Le texte original reste en gris derrière la saisie, et les fautes apparaissent immédiatement sans bloquer la progression.',
      primaryAction: 'Parcourir les œuvres',
      secondaryAction: 'Voir les principes zéro coût',
    },
    facts: {
      principleLabel: 'Principe MVP',
      principleValue: 'Sans connexion · stockage local',
      worksLabel: 'Œuvres publiques',
      worksValue: 'works origin séparé',
      typoLabel: 'Retour sur les fautes',
      typoValue: 'Signalement immédiat · pas de blocage',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'La saisie se pose directement sur le texte source',
      chunkBadge: 'Par paragraphe',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'Avec le temps, la tristesse s’émousse. Un jour, lorsque cette peine passera, tu seras peut-être heureux de m’avoir connu.',
      typedPrefix: 'Avec le temps, la tristesse',
      typedError: ' s',
      typedSuffix:
        'e durcit. Un jour, lorsque cette peine passera, tu seras peut-être heureux de m’avoir connu.',
      accuracyLabel: 'Précision',
      accuracyValue: '97.4%',
      speedLabel: 'Vitesse',
      speedValue: '312 CPM',
      typoCountLabel: 'Fautes',
      typoCountValue: '1 dans ce paragraphe',
      noteRuleLabel: 'Règles de saisie',
      noteRuleBody: 'Les espaces, retours, ponctuation et majuscules suivent le texte original',
      noteResumeLabel: 'Reprise de session',
      noteResumeBody: 'Restaurer la même position et la même saisie après rechargement',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Fixer en même temps l’expérience de recopie et les règles d’exploitation',
      description:
        'Ce projet donne la même priorité à la qualité de l’expérience de frappe et au maintien d’une exploitation totalement gratuite.',
      item1Title: 'Comparer exactement au texte source',
      item1Body:
        'Les espaces, les retours et la ponctuation sont comparés au texte original, et les fautes sont affichées uniquement en rouge.',
      item2Title: 'Ne jamais bloquer la progression',
      item2Body:
        'Même en cas d’erreur, la personne continue à taper. À la fin du paragraphe, elle peut revoir ce qui était faux.',
      item3Title: 'Sans connexion · stockage local',
      item3Body:
        'Résultats, œuvres personnelles et brouillons de reprise restent sur cet appareil. Le MVP ne crée aucune écriture côté serveur.',
      item4Title: 'Œuvres publiques + œuvres personnelles',
      item4Body:
        'Vous pouvez recopier des textes du domaine public ou vos propres textes ajoutés par collage ou import `.txt` avec le même moteur.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'L’utilisateur suit un parcours court et explicite',
      description:
        'Du choix d’une œuvre à l’enregistrement du résultat, il n’y a ni mur de connexion ni sauvegarde serveur au milieu.',
      step1: 'Choisir une œuvre',
      step2: 'Taper directement sur le texte gris',
      step3: 'Revoir les fautes paragraphe par paragraphe puis continuer',
      step4: 'Enregistrer localement précision, WPM et temps une fois terminé',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Règles déjà fixées avant l’implémentation',
      description: 'Les réponses clés sont décidées à l’avance pour éviter toute dérive pendant le développement.',
      item1Question: 'Pourquoi commencer sans connexion ?',
      item1Answer:
        'Parce que le MVP privilégie l’exploitation gratuite et l’accès immédiat. Les historiques et œuvres personnelles restent d’abord en local, sans coût serveur.',
      item2Question: 'La frappe s’arrête-t-elle en cas de faute ?',
      item2Answer:
        'Non. Le caractère erroné est marqué en rouge, mais la saisie continue. À la fin du paragraphe, un récapitulatif des fautes réapparaît.',
      item3Question: 'Les espaces et retours à la ligne comptent-ils aussi ?',
      item3Answer:
        'Oui. Le but du produit est de recopier le texte exactement, donc espaces, retours et ponctuation doivent correspondre à l’original.',
      item4Question: 'D’où viennent les œuvres publiques ?',
      item4Answer:
        'Elles sont lues comme des fichiers statiques depuis un works origin séparé, afin que le catalogue puisse évoluer sans redéployer l’application.',
      item5Question: 'Comment garder un coût d’exploitation nul ?',
      item5Answer:
        'Hébergement statique, stockage local, déploiement séparé des œuvres, cache strict et absence d’écritures serveur sont les règles centrales.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'Un outil de recopie qui ne sépare pas lecture et saisie',
      description:
        'Les œuvres publiques ne servent que des textes du domaine public, et les données utilisateur restent en local. Les liens de contact et de politique seront ajoutés au lancement.',
      library: 'Bibliothèque',
      preview: 'Aperçu',
      principles: 'Principes',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Catalogue de prévisualisation',
      worksOrigin: 'Works origin connecté',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Point d’entrée pour œuvres publiques et locales',
      back: 'Retour à la landing',
    },
    metrics: {
      publicWorksLabel: 'Œuvres publiques',
      publicWorksDescription: 'Basé sur le catalogue public chargé depuis le works origin',
      myWorksLabel: 'Mes œuvres',
      myWorksPending: 'Vérification',
      myWorksError: 'Erreur',
      myWorksDescription: 'Nombre d’œuvres personnelles stockées dans IndexedDB sur cet appareil',
      modeLabel: 'Mode actuel',
      liveMode: 'Données réelles',
      previewMode: 'Prévisualisation',
      liveDescription: 'Connecté au works origin séparé',
      previewDescription: 'Utilise un catalogue exemple si aucun works origin n’est configuré',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Choisir une œuvre d’abord, puis entrer dans l’écran de recopie',
      description:
        'À ce stade, la connexion au works origin et la couche de données locale sont mises en place en premier. L’étape suivante consiste à relier l’œuvre choisie à l’écran de frappe par paragraphe.',
      searchLabel: 'Search',
      searchPlaceholder: 'Rechercher par titre, auteur ou langue',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL n’est pas encore configuré, donc l’écran affiche un catalogue de démonstration. Il sert à valider l’interface et le flux avant la connexion réelle.',
      unknownLanguage: 'unknown',
      multipart: 'Œuvre découpée',
      singleFile: 'Fichier unique',
      authorFallback: 'Aucune information auteur',
      sourcePending: 'source pending',
      select: 'Choisir',
      noResults: 'Aucune œuvre correspondante. Vérifiez le titre ou l’auteur puis réessayez.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Choisissez une œuvre dans la liste de gauche pour afficher ici ses détails.',
      languageLabel: 'Langue',
      languageFallback: 'Non précisé',
      pathLabel: 'Chemin du texte',
      sourceLabel: 'Source',
      sourceFallback: 'À ajouter au works catalog',
      nextLabel: 'Connexion suivante',
      nextDescription:
        'L’étape suivante consiste à relier l’œuvre choisie à l’écran de frappe par paragraphe. Pour l’instant, seul le flux de sélection et la frontière de données sont fixés.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'Pas encore connecté. Définissez NEXT_PUBLIC_WORKS_BASE_URL pour lire le catalogue réel.',
      worksOriginCurrent: 'Point actuel : {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Les œuvres personnelles, résultats et brouillons utilisent IndexedDB comme source de vérité. Le store mémoire reste limité à l’état temporaire de l’interface.',
    },
  },
  myWorks: myWorksMessagesEn,
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
