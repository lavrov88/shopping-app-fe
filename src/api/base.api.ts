import axios, { AxiosError } from "axios"
import { API_URL } from "../utils/constants";
import { LS } from "./localStorage";

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

export const get = async (url: string, noConfig: boolean = false) => {
  try {
    let response
    if (noConfig) {
      response = await instance.get(url)
    } else {
      response = await instance.get(url, getConfig())
    }
    return response
  } catch (e) {
    return handleAxiosError(e as AxiosError)
  }
}

export const post = async (url: string, payload?: any, noConfig: boolean = false) => {
  try {
    let response
    if (noConfig) {
      response = await instance.post(url, payload)
    } else {
      response = await instance.post(url, payload, getConfig())
    }
    return response
  } catch (e) {
    return handleAxiosError(e as AxiosError)
  }
}

export const put = async (url: string, payload?: any, noConfig: boolean = false) => {
  try {
    let response
    if (noConfig) {
      response = await instance.put(url, payload)
    } else {
      response = await instance.put(url, payload, getConfig())
    }
    return response
  } catch (e) {
    return handleAxiosError(e as AxiosError)
  }
}

export const del = async (url: string, noConfig: boolean = false) => {
  try {
    let response
    if (noConfig) {
      response = await instance.delete(url)
    } else {
      response = await instance.delete(url, getConfig())
    }
    return response
  } catch (e) {
    return handleAxiosError(e as AxiosError)
  }
}