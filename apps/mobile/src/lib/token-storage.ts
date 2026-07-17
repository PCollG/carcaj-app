import * as SecureStore from 'expo-secure-store'

const KEY = 'carcaj-token'

export function getToken() {
  return SecureStore.getItemAsync(KEY)
}

export function setToken(token: string) {
  return SecureStore.setItemAsync(KEY, token)
}

export function deleteToken() {
  return SecureStore.deleteItemAsync(KEY)
}
