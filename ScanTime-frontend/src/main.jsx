import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux';
import store from './store/store.js';


const queryClient = new QueryClient();

// const localStoragePersistor = createSyncStoragePersister({
//   storage: window.localStorage
// })

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // <PersistQueryClientProvider persistOptions={{persister: localStoragePersistor, maxAge: 1000*60*60*24*7}} client={queryClient} >
    <QueryClientProvider client={queryClient} >
      <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={store}>
          <App />
        </Provider>
    </QueryClientProvider>
    // </PersistQueryClientProvider>
  // </StrictMode>
)
