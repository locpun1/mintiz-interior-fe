import { TOptions } from 'i18next';

import i18n from '@/i18n';

export const getTranslation = (prefix: string | string[]) => (key: string, options?: TOptions) =>
  i18n.t(key, { ns: prefix, ...options });
