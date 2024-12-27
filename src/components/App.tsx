import { Container } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FC } from 'react'

import { clearStorage } from '../service/tokenStorage'
import { enableFullScreen, exitFullScreen } from '../utils/kioskMode'

import LoginWrapper from './LoginWrapper'
import ParkingTicketPage from './ParkingTicketPage'
import SecretPressZone from './SecretPressZone'

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
  },
})

const App: FC = () => {
  const onSecretPress = () => {
    clearStorage()
    window.location.reload()
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <SecretPressZone onPress={onSecretPress}>
          <LoginWrapper onLogin={enableFullScreen} onLogout={exitFullScreen}>
            <ParkingTicketPage />
          </LoginWrapper>
        </SecretPressZone>
      </Container>
    </ThemeProvider>
  )
}

export default App
