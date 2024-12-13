import { Container } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FC } from 'react'

import LoginWrapper from './LoginWrapper'
import ParkingTicketPage from './ParkingTicketPage'

import './App.css'

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
  },
})

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <Container maxWidth="sm">
      <LoginWrapper>
        <ParkingTicketPage />
      </LoginWrapper>
    </Container>
  </ThemeProvider>
)

export default App
