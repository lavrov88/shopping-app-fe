import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { listsApi } from '../api/api'
import { useSettingsStore } from './settingsStore'

export const useListsStore = defineStore('listsStore', {
  state: () => ({
    lists: [] as ListItem[],
    listsAreFetching: false
  }),

  getters: {
    sortedLists() {
      const lists = [ ...this.lists ] as ListItem[]
      const userSettings = useSettingsStore().userSettings
      if (!userSettings || !userSettings.listOrder) {
        return lists
      }
      const listsOrder = userSettings.listOrder

      return lists.sort((a, b) => {
        let aIndex = listsOrder.findIndex(lId => lId === a.id)
        let bIndex = listsOrder.findIndex(lId => lId === b.id)

        if (aIndex === -1) aIndex = 1000
        if (bIndex === -1) bIndex = 1000

        return aIndex - bIndex
      })
    }
  },

  actions: {

    // LISTS

    async getLists() {
      this.listsAreFetching = true
      const res = await listsApi.getLists() as AxiosResponse
      if (res.status === 200) {
        this.lists = res.data
        this.listsAreFetching = false
      } else {
        const settingsStore = useSettingsStore()
        settingsStore.addAlert(res.statusText, 'error')
      }
      this.listsAreFetching = false
    },

    // sortLists() {
    //   const userSettings = useSettingsStore().userSettings
    //   if (!userSettings || !userSettings.listOrder) {
    //     return
    //   }
    //   const listsOrder = userSettings.listOrder

    //   this.lists.sort((a, b) => {
    //     let aIndex = listsOrder.findIndex(lId => lId === a.id)
    //     let bIndex = listsOrder.findIndex(lId => lId === b.id)

    //     if (aIndex === -1) aIndex = 1000
    //     if (bIndex === -1) bIndex = 1000

    //     return aIndex - bIndex
    //   })
    // },

    async editList({ id, name, color }: ListUpdateObject) {
      const data = { id } as ListUpdateObject
      if (name) data.name = name
      if (color) data.color = color

      const res = await listsApi.editList(data) as AxiosResponse
      if (res.status === 200) {
        this.lists = this.lists.map(list => {
          if (list.id === id) {
            return res.data.list
          }
          return list
        })
      }
    },

    async createList(payload: { name: string, color: string }) {
      const res = await listsApi.createList(payload)
      if (res.status === 200) {
        this.getLists()
      }
    },

    async deleteList(listId: string) {
      const res = await listsApi.deleteList(listId)
      if (res.status === 200) {
        this.lists = this.lists.filter(list => list.id !== listId)
      }
    },

    updateListsChanges(temporaryLists: ListUpdateObject[]) {
      const keysToCompare = [ 'name', 'color' ] as ('name' | 'color')[]

      const changedLists = temporaryLists.filter(tl => {
        let hasChanges = false
        const originalList = this.lists.find(ol => ol.id === tl.id)
        if (!originalList) {
          return
        }

        keysToCompare.forEach(key => {
          if (tl[key] !== originalList[key]) {
            hasChanges = true
          }
        })
        return hasChanges
      })

      const newLists = temporaryLists.filter(tl => {
        const originalLists = this.lists
        return !originalLists.find(ol => ol.id === tl.id)
      })

      const listsToDelete = temporaryLists.filter(tl => {
        return tl.toDelete
      })

      changedLists.forEach(cl => {
        this.editList(cl)
      })
      newLists.forEach(nl => {
        this.createList(({ name: nl.name, color: nl.color }) as { name: string, color: string })
      })
      listsToDelete.forEach(ltd => {
        this.deleteList(ltd.id)
      })
    },

    // PURCHASES

    async addNewPurchases(listId: string, purchaseNames: string[]) {
      const res = await listsApi.addNewPurchases(listId, purchaseNames) as AxiosResponse
      if (res.status === 200) {
        const listIdx = this.lists.findIndex(list => list.id === listId)
        if (listIdx > -1) {
          this.lists[listIdx].items = res.data.items
        }
      }
    },

    async editPurchases(listId: string, purchases: PurchaseItem[]) {
      const res = await listsApi.editPurchases(listId, purchases) as AxiosResponse
      if (res.status === 200) {
        const listIdx = this.lists.findIndex(list => list.id === listId)
        if (listIdx > -1) {
          this.lists[listIdx].items = res.data.items
        }
      }
    },

    async deletePurchases(listId: string, purchases: PurchaseItem[]) {
      const purchaseIds = purchases.map(p => p.id)
      const purchasesStr = purchaseIds.join(',')

      const res = await listsApi.deletePurchases(listId, purchasesStr) as AxiosResponse
      if (res.status === 200) {
        const listIdx = this.lists.findIndex(list => list.id === listId)
        if (listIdx > -1) {
          this.lists[listIdx].items = res.data.items
        }
      }
    },
  },
})

export interface ListItem {
  color: string
  dateCreated: string
  dateModified: string
  id: string
  items: PurchaseItem[]
  name: string
  users: {
    owner: string
    sharedUsers: string[]
  }
}
export interface PurchaseItem {
  id: string
  name: string
  checked: boolean
  sortRate: number
  dateCreated: string
  dateModified: string
}
export interface ListUpdateObject {
  id: string
  name?: string
  color?: string
  toDelete?: boolean
}