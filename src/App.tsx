import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/vi';

import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';

import { DateTimeLocaleText } from './constants/locale';
import DialogProvider from './contexts/Dialog';
import InitLoadingProvider from './contexts/InitLoadingProvider';
import { NotificationProvider } from './contexts/Notification';
import { SettingsProvider } from './contexts/Settings';

import './i18n';

import Routers from './routers';
import store from './store';
import i18n from './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <SettingsProvider>
            <NotificationProvider>
              <DialogProvider>
                <InitLoadingProvider>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={i18n.language}
                    localeText={DateTimeLocaleText()}
                  >
                    <Routers />
                  </LocalizationProvider>
                </InitLoadingProvider>
              </DialogProvider>
            </NotificationProvider>
          </SettingsProvider>
        </ReduxProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
