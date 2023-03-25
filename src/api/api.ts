import { ListUpdateObject, PurchaseItem, PurchaseUpdateObject, ShareListObject } from '../stores/listsStore';
import { UserSettingsUpdateObject } from '../stores/settingsStore';
import { del, get, post, put } from './base.api';

export const authApi = {
  login: async (username: string, password: string) => post(`/auth/login`, { username, password }, true)
}

export const listsApi = {

  // LISTS
  getLists: async () => get(`/lists`),
  editList: async (payload: ListUpdateObject) => put(`/lists`, payload),
  createList: async (payload: { name: string, color: string }) => post(`/lists`, payload),
  deleteList: async (listId: string) => del(`/lists/${listId}`),

  // LISTS SHARING
  shareList: async (payload: ShareListObject) => post(`/user/share`, payload),
  acceptListShare: async (listId: string) => post(`user/share/accept/${listId}`),
  rejectListShare: async (listId: string) => del(`user/share/reject/${listId}`),
  removeUserFromShared: async (listId: string, userId: string) => {
    return del(`/lists/remove-shared-user?list=${listId}&user=${userId}`)
  },

  // PURCHASES
  addNewPurchases: async (listId: string, purchaseNames: string[]) => post(`/lists/${listId}`, purchaseNames),
  editPurchases: async (listId: string, purchases: PurchaseItem[] | PurchaseUpdateObject[]) => {
    return put(`/lists/${listId}`, purchases)
  },
  deletePurchases: async (listId: string, purchasesStr: string) => {
    if (!purchasesStr) {
      throw new Error('Empty string with purchases items gotten!')
    }
    return del(`/lists/${listId}/${purchasesStr}`)
  },
}

export const settingsApi = {
  getSettings: async () => get(`/user/settings`),
  setSettings: async (payload: UserSettingsUpdateObject) => put(`/user/settings`, payload),

  getUsersNames: async (ids: string) => get(`user/names/${ids}`),
}