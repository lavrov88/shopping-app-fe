import { ListUpdateObject, PurchaseItem } from './../stores/listsStore';
import axios, { AxiosError } from "axios";
import { API_URL } from "./constants";
import { LS } from './localStorage';

const instance = axios.create({
  // withCredentials: true,
  baseURL: API_URL,
})

const getConfig = () => {
  const userData = LS.user
  const token = userData.token || ''

  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const handleAxiosError = (e: AxiosError) => {
  const status = e.response?.status || 0
  const statusText = e.response?.statusText || e.message
  return { status, statusText }
}

export const authApi = {
  async login(username: string, password: string) {
    try {
      const response = await instance.post(
        `/auth/login`,
        { username, password }
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  }
}

export const listsApi = {

  // LISTS

  async getLists() {
    try {
      const response = await instance.get(
        `/lists`,
        getConfig()
      )
      return response
    } catch (e) {
      return handleAxiosError(e as AxiosError)
    }
  },

  async editList(payload: ListUpdateObject) {
    try {
      const response = await instance.put(
        `/lists`,
        payload,
        getConfig()
      )
      return response
    } catch (e) {
      return handleAxiosError(e as AxiosError)
    }
  },

  async createList(payload: { name: string, color: string }) {
    try {
      const response = await instance.post(
        `/lists`,
        payload,
        getConfig()
      )
      return response
    } catch (e) {
      return handleAxiosError(e as AxiosError)
    }
  },

  async deleteList(listId: string) {
    try {
      const response = await instance.delete(
        `/lists/${listId}`,
        getConfig()
      )
      return response
    } catch (e) {
      return handleAxiosError(e as AxiosError)
    }
  },

  // PURCHASES

  async addNewPurchases(listId: string, purchaseNames: string[]) {
    try {
      const response = await instance.post(
        `/lists/${listId}`,
        purchaseNames,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  },

  async editPurchases(listId: string, purchases: PurchaseItem[]) {
    try {
      const response = await instance.put(
        `/lists/${listId}`,
        purchases,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  },

  async deletePurchases(listId: string, purchaseIds: string[]) {
    const purchasesStr = purchaseIds.join(',')
    try {
      const response = await instance.delete(
        `/lists/${listId}/${purchasesStr}`,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  },
}

export const settingsApi = {
  async getSettings() {
    try {
      const response = await instance.get(
        `/user/settings`,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  }
}