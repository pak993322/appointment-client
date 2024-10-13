import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { NextUIProvider } from '@nextui-org/react';

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-kdctnw7xrvmjlvhh.us.auth0.com"
    clientId="YbzhaEj9xWNorK9YNgkN3CbRNfo2kH0d"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
     <NextUIProvider>
    <App />
    </NextUIProvider>
  </Auth0Provider>
)
