import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { listsApi } from '../utils/api'

export const useListsStore = defineStore('listsStore', {
  state: () => ({
    lists: [] as ListItem[],
    listsAreFetching: false
  }),
  actions: {
    async getLists() {
      this.listsAreFetching = true
      const res = await listsApi.getLists() as AxiosResponse
      if (res.status === 200) {
        this.lists = res.data
      }
      this.listsAreFetching = false
    },

    async addNewPurchases(listId: string, purchaseNames: string[]) {
      const res = await listsApi.addNewPurchases(listId, purchaseNames) as AxiosResponse
      if (res.status === 200) {
        this.getLists()
      }
    },

    async editPurchases(listId: string, purchases: PurchaseItem[]) {
      const res = await listsApi.editPurchases(listId, purchases) as AxiosResponse
      if (res.status === 200) {
        // this.getLists()
        const listIdx = this.lists.findIndex(list => list.id === listId)
        if (listIdx >= 0) {
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