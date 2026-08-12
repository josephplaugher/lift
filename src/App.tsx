import './App.css'
import Authenticated from './views/Authenticated'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import UnAuthenticated from './views/UnAuthenticated'
import CompleteProfile from './views/CompleteProfile'
import VerifyEmail from './views/VerifyEmail'
import OnboardingGate from './components/OnboardingGate'
import { ProfileProvider } from './hooks/ProfileContext'
import useAuth from './hooks/useAuth'
import { LoadingIndicator } from './components/StatusIndicators'
import { Navigate, Route, Routes } from 'react-router-dom'

const queryClient = new QueryClient();

function AppRoutes() {
  const { error, user, isAuthenticated, isLoading } = useAuth();

  const missingRefreshToken = typeof error?.message === "string"
    && (error.message.toLowerCase().includes("missing refresh token") || error.error === "missing_refresh_token");

  if (error && missingRefreshToken) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong. Let's try that again...</div>
          <div className="error-message">{error.message}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <UnAuthenticated />}
      />
      <Route
        path="/verify-email"
        element={isAuthenticated ? <VerifyEmail /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/complete-profile"
        element={isAuthenticated ? <CompleteProfile /> : <Navigate to="/login" replace />}
      />
      <Route element={<OnboardingGate />}>
        <Route
          path="/"
          element={
            user && isAuthenticated
              ? <Authenticated user={user} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <AppRoutes />
      </ProfileProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' position='bottom' />
    </QueryClientProvider>
  )
}

export default App
