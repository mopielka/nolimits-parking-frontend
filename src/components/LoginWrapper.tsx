/* eslint-disable react-hooks/exhaustive-deps */
import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import LoginTokenContext from '../contexts/LoginTokenContext'
import useLoginToken from '../hooks/useLoginToken'

import LoginPage from './LoginPage'

interface Props extends PropsWithChildren {
  onLogin?: () => void
  onLogout?: () => void
}

const LoginWrapper: FC<Props> = ({ children, onLogin, onLogout }) => {
  const { token, refetch, error, loading } = useLoginToken()

  useEffect(() => {
    ;(token ? onLogin : onLogout)?.()
  }, [token])

  if (!token) {
    return <LoginPage onSubmit={refetch} error={error} loading={loading} />
  }

  return <LoginTokenContext.Provider value={token} children={children} />
}

export default LoginWrapper
