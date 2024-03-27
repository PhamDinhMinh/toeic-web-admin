import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import { vi } from './vi';

const initLang = async () => {
  i18n.use(initReactI18next).init({
    initImmediate: false,
    compatibilityJSON: 'v3',
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    react: {
      useSuspense: false,
    },
  });
};

initLang();

export default i18n;
