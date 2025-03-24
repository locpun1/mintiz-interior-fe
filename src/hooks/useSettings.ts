import SettingsContext from 'contexts/Settings';
import { useContext } from 'react';

const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('Forgot to wrap component in ThemeProvider');
  }

  const { settings, saveSettings } = context;

  return [settings, saveSettings] as const;
};

export default useSettings;
