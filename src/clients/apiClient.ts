const apiUrl = import.meta.env.VITE_API_BASE_URL

interface TokenData {
  key: string
  expires: Date
}

interface LoginResponseData {
  key: string
  expires: number
}

interface ValidateResponseData {
  exitTime: number
}

const login = async (
  username: string,
  password: string,
): Promise<TokenData> => {
  const url = `${apiUrl}/login`
  const payload = JSON.stringify({ username, password })
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  }

  const response = await fetch(url, options)
  if (response.status !== 200) {
    let errorData: { error?: string } = {}
    try {
      errorData = await response.json()
    } catch {
      // no-op
    }
    console.error('Login failed', errorData)

    throw new Error(
      'Logowanie nieudane, błąd: ' + (errorData.error ?? 'nieznany'),
    )
  }

  const data = (await response.json()) as LoginResponseData

  return {
    key: data.key,
    expires: new Date(data.expires * 1000),
  }
}

const validateTicketAndGetExitTime = async (
  ticketId: string,
  apiToken: string,
): Promise<Date> => {
  if (!ticketId.match(/^[0-9]+$/) || ticketId.length > 100) {
    throw new Error('Nieprawidłowy numer biletu.')
  }
  const url = `${apiUrl}/validate/${ticketId}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${apiToken}`,
    },
  }

  const response = await fetch(url, options)
  if (response.status !== 200) {
    console.error('Ticket validation failed', await response.json())

    throw new Error('Walidacja biletu nieudana, spróbuj ponownie.')
  }

  const data = (await response.json()) as ValidateResponseData

  return new Date(data.exitTime)
}

export { login, validateTicketAndGetExitTime }

export type { TokenData }
