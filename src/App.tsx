import './App.css'
import Authenticated from './views/Authenticated'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import UnAuthenticated from './views/UnAuthenticated'
import useAuth from './hooks/useAuth'
import { LoadingIndicator } from './components/StatusIndicators'

const queryClient = new QueryClient();

function App() {
  const { error, user, isAuthenticated, isLoading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      {error &&
        <div className="app-container">
          <div className="error-state">
            <div className="error-title">Oops!</div>
            <div className="error-message">Something went wrong. Let's try that again...</div>
            <div className="error-message">{error.message}</div>
          </div>
        </div>
      }
      {isLoading && <LoadingIndicator />}
      {user && isAuthenticated && !isLoading ?
        <Authenticated user={user} />
        :
        <UnAuthenticated />}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' position='bottom' />
    </QueryClientProvider>
  )
}

export default App
