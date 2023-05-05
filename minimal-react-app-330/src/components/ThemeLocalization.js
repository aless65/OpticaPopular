import PropTypes from 'prop-types';
// @mui
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
// hooks
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
  children: PropTypes.node,
};

export default function ThemeLocalization({ children }) {
  const defaultTheme = useTheme();
  const { currentLang } = useLocales();

<<<<<<< HEAD
  const theme = createTheme(defaultTheme, currentLang.systemValue);
=======
  const theme = createTheme(defaultTheme, currentLang?.systemValue);
>>>>>>> aless

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
