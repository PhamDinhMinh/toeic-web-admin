import { useTranslation as useNTranslation } from 'react-i18next';

import { vi } from '@/i18n/vi';

function useTranslation() {
  const { t, i18n, ...rest } = useNTranslation();
  return {
    t: (key: keyof typeof vi) => t(vi[key]),
    i18n,
    locale: i18n.language,
    ...rest,
  };
}

export default useTranslation;
