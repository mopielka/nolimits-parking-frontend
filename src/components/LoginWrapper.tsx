import type { FC, PropsWithChildren } from 'react'

import useLoginToken from '../hooks/useLoginToken.ts'

import LoginPage from './LoginPage.tsx'

const LoginWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { token, refetch, error, loading } = useLoginToken()

  if (!token) {
    return <LoginPage onSubmit={refetch} error={error} loading={loading} />
  }

  return children
}

export default LoginWrapper
