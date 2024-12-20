import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App'
import { lockActions, setUpAutoRefresh } from './utils/kioskMode'

lockActions()
setUpAutoRefresh()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
