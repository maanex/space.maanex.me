import axios, { AxiosRequestConfig, AxiosResponse } from "axios"


export type ErrorData = { error: string }

const isDev = computed(() => useRuntimeConfig().public.isDev)

function getBaseUrl(): string {
  return isDev.value
    ? 'http://localhost:5050/v1'
    : 'TODO'
}

function buildConf(headers?: any, body?: any): AxiosRequestConfig {
  headers = headers || {}
  headers.Authorization = localStorage.getItem('token')
  const conf: AxiosRequestConfig = {
    headers,
    validateStatus: null
  }
  if (body) conf.data = body
  return conf
}

async function buildConnRefError(): Promise<AxiosResponse & ErrorData> {
  return Promise.resolve({
    status: 999,
    statusText: 'connection refused',
    headers: {},
    request: {},
    config: {} as any,
    data: {
      success: false,
      error: 'connection refused',
      message: 'Unable to connect to FreeStuff servers. Please try again.'
    },
    error: 'Unable to connect to FreeStuff servers. Please try again.'
  })
}

async function rawRequest(method: 'get' | 'post' | 'patch' | 'put' | 'delete', url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
  try {
    const res: any = await axios.request({
      method,
      url: getBaseUrl() + url,
      ...buildConf(headers, body)
    })
    if (res.status < 200 || res.status >= 300)
      res.error = res.data.error ?? `http ${res.status}`
    return res
  } catch (ex) {
    return buildConnRefError()
  }
}

//

export const useApi = () => ({

  makeAuthCallback(provider: string, code: string) {
    return rawRequest('post', `/auth/code/${provider.toLowerCase()}`, { code })
  },

  makeAuthProbe() {
    return rawRequest('get', '/auth/me')
  },

  makeLoginRequest(provider: string) {
    return rawRequest('get', `/auth/login/${provider.toLowerCase()}`)
  },

})