import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from 'react-oidc-context'
import { oidcConfig } from './config/oidcConfig.ts'
import SessionGuard from './components/auth/SessionGuard.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
        <SessionGuard />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
