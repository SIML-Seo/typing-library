import { defineMessages } from './messages';
import { myWorksMessagesEn } from './shared-my-works';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Idioma',
    brandName: 'Typing Library',
    brandTagline: 'Digitação como cópia fiel do texto',
  },
  landing: {
    nav: {
      library: 'Biblioteca',
      preview: 'Prévia',
      principles: 'Princípios',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Leia literatura em domínio público e reescreva cada frase exatamente como está.',
      description:
        'Typing Library é um app de digitação por transcrição em que o ritmo da leitura e o ritmo da escrita coexistem na mesma tela. O texto original fica em cinza ao fundo, sua digitação se sobrepõe a ele e os erros aparecem imediatamente sem travar o progresso.',
      primaryAction: 'Explorar obras',
      secondaryAction: 'Ver princípios de custo zero',
    },
    facts: {
      principleLabel: 'Princípio do MVP',
      principleValue: 'Sem login · armazenamento local',
      worksLabel: 'Obras públicas',
      worksValue: 'works origin separado',
      typoLabel: 'Feedback de erros',
      typoValue: 'Marca imediata · sem bloqueio',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'A digitação aparece diretamente sobre o texto original',
      chunkBadge: 'Por parágrafo',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'Com o passar do tempo, a tristeza se torna mais branda. Um dia, quando ela passar, talvez você fique feliz por ter me conhecido.',
      typedPrefix: 'Com o passar do tempo, a tristeza se torna',
      typedError: ' ma',
      typedSuffix:
        'is dura. Um dia, quando ela passar, talvez você fique feliz por ter me conhecido.',
      accuracyLabel: 'Precisão',
      accuracyValue: '97.4%',
      speedLabel: 'Velocidade',
      speedValue: '312 CPM',
      typoCountLabel: 'Erros',
      typoCountValue: '1 neste parágrafo',
      noteRuleLabel: 'Regras de entrada',
      noteRuleBody: 'Espaços, quebras de linha, pontuação e letras maiúsculas seguem o texto original',
      noteResumeLabel: 'Retomar sessão',
      noteResumeBody: 'Restaurar a mesma posição e a mesma digitação após recarregar',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Fixar a experiência de transcrição e as regras de operação ao mesmo tempo',
      description:
        'Este projeto trata a qualidade da UX de digitação e a permanência de operação gratuita com a mesma prioridade.',
      item1Title: 'Comparação exata com o original',
      item1Body:
        'Espaços, quebras de linha e pontuação são comparados com o texto-fonte, e os erros aparecem apenas em vermelho.',
      item2Title: 'Nunca bloquear o progresso',
      item2Body:
        'Mesmo com erro, a pessoa continua digitando. Ao fim do parágrafo, ela pode revisar o que estava errado.',
      item3Title: 'Sem login · salvo localmente',
      item3Body:
        'Resultados, obras pessoais e rascunhos de continuação ficam neste dispositivo. O MVP não cria gravações em servidor.',
      item4Title: 'Obras públicas + obras pessoais',
      item4Body:
        'Você pode transcrever literatura em domínio público ou seus próprios textos, adicionados por colagem ou upload de `.txt`, com o mesmo motor.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'A pessoa usuária percorre um caminho curto e direto',
      description: 'Da escolha da obra ao salvamento do resultado, não há barreira de login nem gravação em servidor no meio.',
      step1: 'Escolher uma obra',
      step2: 'Digitar diretamente sobre o texto cinza',
      step3: 'Revisar erros por parágrafo e continuar',
      step4: 'Salvar localmente precisão, WPM e tempo ao terminar',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Regras já definidas antes da implementação',
      description: 'As respostas centrais são fixadas com antecedência para evitar desvio durante a construção.',
      item1Question: 'Por que começar sem login?',
      item1Answer:
        'Porque o MVP prioriza operação gratuita e acesso imediato. Registros e obras pessoais ficam primeiro no local, sem gerar custo de servidor.',
      item2Question: 'A digitação para quando erro?',
      item2Answer:
        'Não. O caractere errado é marcado em vermelho, mas a entrada continua. Ao fim do parágrafo, o resumo de erros aparece novamente.',
      item3Question: 'Espaços e quebras de linha também contam?',
      item3Answer:
        'Sim. O produto é sobre copiar o texto exatamente, então espaços, quebras de linha e pontuação precisam coincidir com o original.',
      item4Question: 'De onde vêm as obras públicas?',
      item4Answer:
        'Elas são lidas como arquivos estáticos a partir de um works origin separado, de modo que o catálogo possa mudar sem redeploy do app.',
      item5Question: 'Como manter o custo de operação em zero?',
      item5Answer:
        'Hospedagem estática, armazenamento local, deploy separado das obras, cache rigoroso e ausência de gravações no servidor são as regras centrais.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'Uma ferramenta de transcrição que não separa leitura e digitação',
      description:
        'As obras públicas servem apenas textos em domínio público, e os dados das pessoas usuárias ficam no local. Links de contato e política serão conectados no lançamento.',
      library: 'Biblioteca',
      preview: 'Prévia',
      principles: 'Princípios',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Catálogo de prévia',
      worksOrigin: 'Works origin conectado',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Entrada para obras públicas e locais',
      back: 'Voltar para a landing',
    },
    metrics: {
      publicWorksLabel: 'Obras públicas',
      publicWorksDescription: 'Baseado no catálogo público carregado do works origin',
      myWorksLabel: 'Minhas obras',
      myWorksPending: 'Verificando',
      myWorksError: 'Erro',
      myWorksDescription: 'Quantidade de obras pessoais armazenadas no IndexedDB deste dispositivo',
      modeLabel: 'Modo atual',
      liveMode: 'Dados reais',
      previewMode: 'Prévia',
      liveDescription: 'Conectado ao works origin separado',
      previewDescription: 'Usa catálogo de exemplo quando nenhum works origin está configurado',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Primeiro escolha uma obra; depois entre na tela de digitação',
      description:
        'Nesta etapa, a conexão com o works origin e a camada de dados local vêm primeiro. O próximo passo é ligar a obra escolhida à tela de digitação por parágrafos.',
      searchLabel: 'Search',
      searchPlaceholder: 'Buscar por título, autor ou idioma',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL ainda não foi configurado, então a tela mostra um catálogo de exemplo. Use isso para validar a UI e o fluxo antes da conexão real.',
      unknownLanguage: 'unknown',
      multipart: 'Obra dividida',
      singleFile: 'Arquivo único',
      authorFallback: 'Sem informação de autor',
      sourcePending: 'source pending',
      select: 'Selecionar',
      noResults: 'Nenhuma obra correspondente foi encontrada. Confira o título ou o autor e tente novamente.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Escolha uma obra na lista à esquerda para ver os detalhes aqui.',
      languageLabel: 'Idioma',
      languageFallback: 'Não especificado',
      pathLabel: 'Caminho do texto',
      sourceLabel: 'Fonte',
      sourceFallback: 'Será adicionado ao works catalog',
      nextLabel: 'Próxima conexão',
      nextDescription:
        'O próximo passo é conectar a obra escolhida à rota de digitação por parágrafos em /typing/[workId]. Por enquanto, apenas o fluxo de seleção e o limite de dados foram fixados.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'Ainda não está conectado. Defina NEXT_PUBLIC_WORKS_BASE_URL para ler o catálogo real.',
      worksOriginCurrent: 'Endpoint atual: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Obras pessoais, resultados e rascunhos usam IndexedDB como fonte de verdade. O store em memória fica reservado ao estado transitório da UI.',
    },
  },
  myWorks: myWorksMessagesEn,
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
