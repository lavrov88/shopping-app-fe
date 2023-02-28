export const LS = {
  get user() {
    const userDataStr = localStorage.getItem('user')
    if (!userDataStr) {
      return null
    }
    return JSON.parse(localStorage.getItem('user') || '')
  },
  set user(value) {
    if (!value) {
      localStorage.removeItem('user')
    } else {
      localStorage.setItem('user', JSON.stringify(value))
    }
  },
}