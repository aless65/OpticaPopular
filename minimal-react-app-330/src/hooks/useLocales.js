import { useTranslation } from 'react-i18next';
// '@mui
import { esES } from '@mui/material/locale';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'Español',
    value: 'es',
    systemValue: esES,
    icon: 'https://cdn4.iconfinder.com/data/icons/world-flags-6/900/honduras_national_country_flag-512.png',
  }
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[0];

  const handleChangeLanguage = (newlang) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
