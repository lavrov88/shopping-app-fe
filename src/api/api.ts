import { ListUpdateObject, PurchaseItem, PurchaseUpdateObject } from '../stores/listsStore';
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

  // PURCHASES
  addNewPurchases: async (listId: string, purchaseNames: string[]) => post(`/lists/${listId}`, purchaseNames),
  editPurchases: async (listId: string, purchases: PurchaseItem[] | PurchaseUpdateObject[]) => put( `/lists/${listId}`, purchases),
  deletePurchases: async (listId: string, purchasesStr: string) => del( `/lists/${listId}/${purchasesStr}`),
}

export const settingsApi = {
  getSettings: async () => get(`/user/settings`),
  setSettings: async (payload: UserSettingsUpdateObject) => put(`/user/settings`, payload),
}