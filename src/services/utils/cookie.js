import cookies from 'js-cookie'

//将所有token存入cookie
export function saveAllToken(accessToken, refreshToken) {
    cookies.set('accessToken', `Bearer ${accessToken}`)
    cookies.set('refreshToken', `Bearer ${refreshToken}`)

}

export function saveToken(token) {
    cookies.set('accessToken', `Bearer ${token}`)
}

export function getToken(key) {
    return cookies.get(key)
}

export function removeAlltoken() {
    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    sessionStorage.clear()
    localStorage.clear()
}