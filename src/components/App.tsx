import { Container } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FC } from 'react'

import { clearStorage } from '../service/tokenStorage'

import LoginWrapper from './LoginWrapper'
import ParkingTicketPage from './ParkingTicketPage'
import SecretPressZone from './SecretPressZone'

import './App.css'

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
      <Container maxWidth="sm">
        <SecretPressZone onPress={onSecretPress}>
          <LoginWrapper>
            <ParkingTicketPage />
          </LoginWrapper>
        </SecretPressZone>
      </Container>
    </ThemeProvider>
  )
}

export default App
