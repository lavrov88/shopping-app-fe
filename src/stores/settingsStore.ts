import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { authApi, settingsApi } from '../api/api'
import { getRandom } from '../utils/common'
import { LS } from '../api/localStorage'
import { useListsStore } from './listsStore'

export const useSettingsStore = defineStore('settingsStore', {
  state: () =>({
    alertsToShow: [] as AlertToShow[],

    optionsMenuIsOpen: false,
    loginDialogIsOpen: false,
    listsManageDialogIsOpen: false,
    purchasesManageDialog: {
      isOpen: false,
      listId: null as string | null,
    },

    loginInProgress: false,
    isAuthorized: false,
    user: null as UserData | null,
    userSettings: null as UserSettings | null,
  }),
  actions: {

    openPurchasesManageDialog(listId: string) {
      this. purchasesManageDialog = {
        isOpen: true,
        listId
      }
    },

    closePurchasesManageDialog() {
      this. purchasesManageDialog = {
        isOpen: false,
        listId: null
      }
    },

    // AUTH

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

    // SETTINGS

    async getUserSettings() {
      const res = await settingsApi.getSettings() as AxiosResponse
      if (res.status === 200) {
        this.userSettings = res.data
      }
    },

    async updateListOrder(newListOrder: string[]) {
      const originalListOrder = this.userSettings?.listOrder || []
      let listOrderChanged = false

      newListOrder.forEach((nItem, idx) => {
        if (originalListOrder[idx] !== nItem) {
          console.log(`differense! old: ${originalListOrder[idx]}, new: ${nItem}`)
          listOrderChanged = true
        }
      })
      if (!listOrderChanged) {
        return
      }

      const res = await settingsApi.setSettings({ listOrder: newListOrder }) as AxiosResponse
      if (res.status === 200 && this.userSettings) {
        this.userSettings.listOrder = res.data.listOrder
      }
    },

    // ALERTS

    addAlert(message: string, type: AlertTypes = 'error') {
      const newAlert = {
        id: getRandom('alert'),
        type,
        message
      }
      this.alertsToShow = [ ...this.alertsToShow, newAlert ]
    },

    removeAlert(id: string) {
      this.alertsToShow = this.alertsToShow.filter(a => a.id !== id)
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
interface AlertToShow {
  id: string
  type: AlertTypes
  message: string
}
type AlertTypes = 'error' | 'info' | 'success'