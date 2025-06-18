import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundaryProvider } from './components/shared/error-boundary/components'
import Routes from "./routes"
import "./styles/global.css"

// Configuração otimizada do React Query para evitar re-renderizações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity, // Dados nunca ficam stale automaticamente
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchInterval: false, // Não refetch automático
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      onSuccess: () => {
        // Não invalida queries automaticamente
      },
      onError: () => {
        // Não invalida queries automaticamente
      },
    },
  },
})

function App() {
  return (
    <ErrorBoundaryProvider
      onError={(error, errorInfo) => {
        // Log do erro para monitoramento
        console.error('App Error Boundary caught an error:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        })
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </ErrorBoundaryProvider>
  )
}

export default App
