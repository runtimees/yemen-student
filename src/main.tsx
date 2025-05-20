
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { createStorageBucketIfNotExists } from './utils/createStorageBucket';

// Create a client
const queryClient = new QueryClient();

// Initialize the storage bucket
createStorageBucketIfNotExists().then((success) => {
  console.log('Storage bucket initialization result:', success ? 'Success' : 'Failed');
  
  if (!success) {
    console.warn('Storage bucket could not be created automatically. This is normal if you created it manually in Supabase.');
    console.warn('Check that your bucket is named "files" and is set to public access in Supabase dashboard.');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
