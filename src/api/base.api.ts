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

const handleAxiosError = (e: AxiosError<{ message?: string }>) => {
  return {
    status: e.response?.status || 0,
    statusText: e.response?.data.message || e.response?.statusText || e.message,
  }
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
    return handleAxiosError(e as AxiosError<OptionalErrorMessage>)
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
    return handleAxiosError(e as AxiosError<OptionalErrorMessage>)
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
    return handleAxiosError(e as AxiosError<OptionalErrorMessage>)
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
    return handleAxiosError(e as AxiosError<OptionalErrorMessage>)
  }
}

interface OptionalErrorMessage {
  message?: string
}