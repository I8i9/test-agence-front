import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClientProvider} from '@tanstack/react-query'
import { client } from './api/queries/queryclient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
  </StrictMode>,
)
