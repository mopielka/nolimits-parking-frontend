import type { TokenData } from '../clients/apiClient'

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

const clearStorage = () => {
  localStorage.removeItem(storageKey)
}

export { store, getStoredToken, clearStorage }
