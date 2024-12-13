import type { FC, PropsWithChildren } from 'react'

import LoginTokenContext from '../contexts/LoginTokenContext'
import useLoginToken from '../hooks/useLoginToken'

import LoginPage from './LoginPage'

const LoginWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { token, refetch, error, loading } = useLoginToken()

  if (!token) {
    return <LoginPage onSubmit={refetch} error={error} loading={loading} />
  }

  return <LoginTokenContext.Provider value={token} children={children} />
}

export default LoginWrapper
