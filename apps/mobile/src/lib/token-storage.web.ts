const KEY = 'carcaj-token'

export async function getToken() {
  return localStorage.getItem(KEY)
}

export async function setToken(token: string) {
  localStorage.setItem(KEY, token)
}

export async function deleteToken() {
  localStorage.removeItem(KEY)
}
