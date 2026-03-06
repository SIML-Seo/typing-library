import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import id from './id';
import ja from './ja';
import ko from './ko';
import ptBR from './pt-BR';
import zhCN from './zh-CN';
import zhTW from './zh-TW';
import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from './config';

const localeMessages = {
  ko,
  en,
  ja,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  fr,
  de,
  'pt-BR': ptBR,
  id,
} as const;

export function getLocaleMessages(locale: string | AppLocale) {
  const normalizedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  return localeMessages[normalizedLocale];
}
