import { Container } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FC } from 'react'

import { clearStorage } from '../service/tokenStorage'
import { enableFullScreen, exitFullScreen } from '../utils/kioskMode'

import CebulaDealsWrapper from './CebulaDealsWrapper'
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
      <Container style={{ position: 'relative', height: '80vh' }}>
        <SecretPressZone onPress={onSecretPress}>
          <LoginWrapper onLogin={enableFullScreen} onLogout={exitFullScreen}>
            <CebulaDealsWrapper
              color="red"
              topThickness="10vh"
              bottomThickness="10vh"
            >
              <ParkingTicketPage />
            </CebulaDealsWrapper>
          </LoginWrapper>
        </SecretPressZone>
      </Container>
    </ThemeProvider>
  )
}

export default App
