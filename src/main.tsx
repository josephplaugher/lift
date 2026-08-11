import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (window.confirm('A new version of Lift is available. Reload now?')) {
      updateSW(true)
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        cacheLocation="localstorage"
        authorizationParams={{
          redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
          scope: 'openid profile email offline_access',
          audience: import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_API_URL_PROD
            : import.meta.env.VITE_API_URL_DEV
        }}
        useRefreshTokens={true}
        onRedirectCallback={(appState) => {
          window.history.replaceState(
            {},
            document.title,
            appState?.returnTo || '/',
          )
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
