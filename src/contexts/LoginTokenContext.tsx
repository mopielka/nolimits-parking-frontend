import { createContext } from 'react'

const LoginTokenContext = createContext<string | null>(null)

export default LoginTokenContext
