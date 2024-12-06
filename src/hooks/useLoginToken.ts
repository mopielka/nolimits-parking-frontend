import { useEffect, useState } from 'react'

import type { TokenData } from '../clients/apiClient'
import { login } from '../clients/apiClient'

const storageKey = 'token'

const store = (tokenData: TokenData) => {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      key: tokenData.key,
      expires: tokenData.expires.getTime(),
    }),
  )
}

const getStoredToken = (): TokenData | null => {
  const token = localStorage.getItem(storageKey)
  if (!token) {
    return null
  }

  const rawTokenData = JSON.parse(token) as { key: string; expires: number }
  if (rawTokenData.expires * 1000 < new Date().getTime()) {
    return null
  }

  return {
    key: rawTokenData.key,
    expires: new Date(rawTokenData.expires * 1000),
  }
}

let invalidateTimeout: number | NodeJS.Timeout

const useLoginToken = () => {
  const [state, setState] = useState<{
    tokenData: TokenData | null
    error: string | null
    loading: boolean
  }>({
    tokenData: getStoredToken(),
    error: null,
    loading: false,
  })

  useEffect(() => {
    clearTimeout(invalidateTimeout)
    if (!state.tokenData) {
      return
    }
    invalidateTimeout = setTimeout(() => {
      setState((prevState) => ({ ...prevState, tokenData: null }))
    }, state.tokenData.expires.getTime() - new Date().getTime())

    return () => clearTimeout(invalidateTimeout)
  }, [state.tokenData])

  return {
    refetch: async (username: string, password: string): Promise<void> => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }))
      try {
        const tokenData = await login(username, password)
        store(tokenData)
        setState((prevState) => ({ ...prevState, tokenData, loading: false }))
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: (error as Error).message,
          loading: false,
        }))
      }
    },
    token: state.tokenData?.key,
    error: state.error,
    loading: state.loading,
  }
}

export default useLoginToken
