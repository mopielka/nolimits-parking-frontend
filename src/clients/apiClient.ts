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
  exitTime?: number
  remainingPayment?: string
}

interface ParkingExitInfo {
  exitTime?: Date
  remainingPayment?: string
}

const login = async (
  username: string,
  password: string,
): Promise<TokenData> => {
  const url = `${apiUrl}/login`
  const payload = new URLSearchParams({ username, password }).toString()
  const options = {
    method: 'POST',
    body: payload,
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const errorData = await safeJsonParse(response)
    console.error('Login failed', errorData)
    throw new Error(
      `Logowanie nieudane, błąd: ${errorData.error ?? 'nieznany'}`,
    )
  }

  const data: LoginResponseData = await response.json()
  return {
    key: data.key,
    expires: new Date(data.expires * 1000),
  }
}

const validateTicket = async (
  ticketId: string,
  apiToken: string,
): Promise<ParkingExitInfo> => {
  if (!/^\d+$/.test(ticketId) || ticketId.length > 100) {
    throw new Error('Nieprawidłowy numer biletu.')
  }

  const url = `${apiUrl}/validate`
  const payload = new URLSearchParams({ ticketId, token: apiToken }).toString()
  const options = {
    method: 'POST',
    body: payload,
  }

  const response = await fetch(url, options)

  if (response.status === 404) {
    throw new Error('Nieprawidłowy numer biletu.')
  }

  if (response.status === 400) {
    throw new Error('Bilet już był walidowany.')
  }

  if (!response.ok) {
    console.error('Ticket validation failed', await response.json())
    throw new Error('Walidacja biletu nieudana, spróbuj ponownie.')
  }

  const data: ValidateResponseData = await response.json()

  return {
    exitTime: data.exitTime ? new Date(data.exitTime * 1000) : undefined,
    remainingPayment: data.remainingPayment ?? undefined,
  }
}

const safeJsonParse = async (
  response: Response,
): Promise<{ error?: string }> => {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

export { login, validateTicket }
export type { TokenData }
