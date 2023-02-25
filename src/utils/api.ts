import { PurchaseItem } from './../stores/listsStore';
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
  async getLists() {
    try {
      const response = await instance.get(
        `/lists`,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  },


  // PURCHASES

  async addNewPurchases(listId: string, puchasesNames: string[]) {
    try {
      const response = await instance.post(
        `/lists/${listId}`,
        puchasesNames,
        getConfig()
      )
      return response
    } catch (e) {
      return (e as AxiosError).response
    }
  },

  async editPurchases(listId: string, puchases: PurchaseItem[]) {
    try {
      const response = await instance.put(
        `/lists/${listId}`,
        puchases,
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