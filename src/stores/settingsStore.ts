import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { authApi, settingsApi } from '../utils/api'
import { LS } from '../utils/localStorage'
import { useListsStore } from './listsStore'

export const useSettingsStore = defineStore('settingsStore', {
  state: () =>({
    optionsMenuIsOpen: false,
    loginDialogIsOpen: false,
    loginInProgress: false,
    isAuthorized: false,
    user: null as UserData | null,
    userSettings: null as UserSettings | null,
  }),
  actions: {
    async login(username: string, password: string) {
      this.loginInProgress = true
      const res = await authApi.login(username, password) as AxiosResponse
      if (res.status === 200) {
        const userData = { username, token: res.data.token }
        this.user = userData
        LS.user = userData
        this.isAuthorized = true
        await this.getUserSettings()
        this.loginInProgress = false

        const listsStore = useListsStore()
        listsStore.getLists()
        return true
      }
      this.loginInProgress = false
      return false
    },

    logout() {
      this.isAuthorized = false
      this.user = null
      LS.user = null
    },

    checkLocalStorageAuth() {
      if (LS.user && LS.user.token) {
        this.isAuthorized = true
        this.user = LS.user

        const listsStore = useListsStore()
        listsStore.getLists()
      }
    },

    async getUserSettings() {
      const res = await settingsApi.getSettings() as AxiosResponse
      if (res.status === 200) {
        this.userSettings = res.data
      }
    },
  },
})

interface UserData {
  username: string
  token: string
}
interface UserSettings {
  listOrder: string[]
  minimizedLists: string[]
  sharedListsRequests: string[]
}