import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { authApi, settingsApi } from '../api/api'
import { getRandom } from '../utils/common'
import { LS } from '../api/localStorage'
import { useListsStore } from './listsStore'

export const useSettingsStore = defineStore('settingsStore', {
  state: () =>({
    alertsToShow: [] as AlertToShow[],

    appIsInitialized: false,
    optionsMenuIsOpen: false,

    // dialogs
    listsManageDialogIsOpen: false,
    purchasesManageDialog: {
      isOpen: false,
      listId: null as string | null,
    },
    profileDialogIsOpen: false,
    shareListDialog: {
      isOpen: false,
      listId: null as string | null,
    },
    shareListsRequestsDialogIsOpen: false,
    settingsDialogIsOpen: false,

    isAuthorized: false,
    user: null as UserData | null,
    userSettings: null as UserSettings | null,
    settingsFetchingStatuses: {
      userSettings: false,
      updateListOrder: false,
      toggleMinimizeList: false,
    }
  }),

  getters: {
    settingsDataIsFetching(): boolean {
      const settingsFetchingValues = Object.values(this.settingsFetchingStatuses)
      return settingsFetchingValues.includes(true)
    },

    anyDataIsFetching(): boolean {
      const listDataIsFetching = useListsStore().listsDataIsFetching
      return listDataIsFetching || this.settingsDataIsFetching
    }
  },

  actions: {
    async initApp() {
      this.checkLocalStorageAuth()
      if (this.isAuthorized) {
        const listsStore = useListsStore()

        await Promise.all([ this.getUserSettings(), listsStore.getLists() ])
      }
      this.appIsInitialized = true
    },

    openManagePurchasesDialog(listId: string) {
      this.purchasesManageDialog = {
        isOpen: true,
        listId,
      }
    },

    closePurchasesManageDialog() {
      this. purchasesManageDialog = {
        isOpen: false,
        listId: null,
      }
    },

    openShareListDialog(listId: string) {
      this.shareListDialog = {
        isOpen: true,
        listId,
      }
    },

    closeShareListDialog() {
      this.shareListDialog.isOpen = false
      setTimeout(() => { // remove list after popup will become invisible
        this.shareListDialog.listId = null
      }, 500)
    },


    // AUTH

    async login(username: string, password: string) {
      const res = await authApi.login(username, password) as AxiosResponse
      if (res.status === 200) {
        const { id, token } = res.data
        const userData = { username, id, token }
        this.user = userData
        LS.user = userData
        return true
      }
      return false
    },

    logout() {
      this.isAuthorized = false
      this.user = null
      LS.user = null
    },

    async register(username: string, password: string) {
      const res = await authApi.register(username, password) as AxiosResponse
      if (res.status === 200) {
        return true
      }
      return false
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const res = await authApi.changePassword(oldPassword, newPassword) as AxiosResponse
      if (res.status === 200) {
        return true
      }
      return res.statusText
    },

    checkLocalStorageAuth() {
      if (LS.user && LS.user.token) {
        this.isAuthorized = true
        this.user = LS.user
      }
    },

    // SETTINGS

    async getUserSettings() {
      this.settingsFetchingStatuses.userSettings = true
      const res = await settingsApi.getSettings() as AxiosResponse
      this.settingsFetchingStatuses.userSettings = false
      if (res.status === 200) {
        this.userSettings = res.data
      }
    },

    async updateListOrder(newListOrder: string[]) {
      const originalListOrder = this.userSettings?.listOrder || []
      let listOrderChanged = false

      newListOrder.forEach((nItem, idx) => {
        if (originalListOrder[idx] !== nItem) {
          listOrderChanged = true
        }
      })
      if (!listOrderChanged) {
        return
      }

      this.settingsFetchingStatuses.updateListOrder = true
      const res = await settingsApi.setSettings({ listOrder: newListOrder }) as AxiosResponse
      this.settingsFetchingStatuses.updateListOrder = false
      if (res.status === 200 && this.userSettings) {
        this.userSettings.listOrder = res.data.listOrder
      }
    },

    async toggleMinimizeList(listId: string) {
      if (!this.userSettings) {
        return
      }

      const minimizedLists = this.userSettings.minimizedLists
      if (minimizedLists.includes(listId)) {
        this.userSettings.minimizedLists = minimizedLists.filter(ml => ml !== listId)
      } else {
        this.userSettings.minimizedLists.push(listId)
      }

      this.settingsFetchingStatuses.toggleMinimizeList = true
      await settingsApi.setSettings({ minimizedLists: this.userSettings.minimizedLists })
      this.settingsFetchingStatuses.toggleMinimizeList = false
    },

    async getUserNames(ids: string[]) {
      const res = await settingsApi.getUsersNames(ids.join(',')) as AxiosResponse
      if (res.status === 200) {
        return res.data
      } else {
        return []
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
  id: string
  token: string
}
interface UserSettings {
  listOrder: string[]
  minimizedLists: string[]
  sharedListsRequests: {
    listId: string
    listName: string
    userName: string
  }[]
}
export interface UserSettingsUpdateObject {
  listOrder?: string[]
  minimizedLists?: string[]
  sharedListsRequests?: string[]
}
interface AlertToShow {
  id: string
  type: AlertTypes
  message: string
}
type AlertTypes = 'error' | 'info' | 'success'