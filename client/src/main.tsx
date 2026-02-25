import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import '@/styles/global.css'

async function bootstrap() {
  if (import.meta.env.VITE_API_MOCKING !== 'off') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

bootstrap()
