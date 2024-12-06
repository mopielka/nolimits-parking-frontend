import type { FC, PropsWithChildren } from 'react'

import useLoginToken from '../hooks/useLoginToken'

import LoginPage from './LoginPage'

const LoginWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { token, refetch, error, loading } = useLoginToken()

  console.log('token', token)

  if (!token) {
    return <LoginPage onSubmit={refetch} error={error} loading={loading} />
  }

  return children
}

export default LoginWrapper
