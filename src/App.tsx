import './App.css'
import Lift from './views/Lift'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Auth from './views/Auth'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import useAuth from './hooks/useAuth'
import { LoadingIndicator } from './components/StatusIndicators'

const queryClient = new QueryClient();

function App() {
  const { error, user, isAuthenticated, isLoading } = useAuth();

  useEffect(()=> {
    console.log(user)
  },[user, isAuthenticated, isLoading])

  return (
    <QueryClientProvider client={queryClient}>
        {error &&
          <div className="app-container">
            <div className="error-state">
              <div className="error-title">Oops!</div>
              <div className="error-message">Something went wrong. Let's try that again...</div>
            </div>
          </div>
        }
        {isLoading && <LoadingIndicator />}
        {user && isAuthenticated && !isLoading ?
          <Lift user={user} />
          :
          <Auth />}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' position='bottom' />
    </QueryClientProvider>
  )
}

export default App
