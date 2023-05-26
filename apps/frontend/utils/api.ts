import axios, { AxiosRequestConfig, AxiosResponse } from "axios"


export type ErrorData = { error: string }

const isDev = computed(() => useRuntimeConfig().public.isDev)

function getBaseUrl(): string {
  return isDev.value
    ? 'http://localhost:5050/rest'
    : 'https://maanexspace-prod-eu01.tude.network/rest'
}

function getSocketHost(): string {
  return isDev.value
    ? 'localhost:5050'
    : 'maanexspace-prod-eu01.tude.network'
}

function getToken(): string {
  return localStorage.getItem('token') + ''
}

function buildConf(headers?: any, body?: any): AxiosRequestConfig {
  headers = headers || {}
  headers.Authorization = getToken()
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
      message: 'Unable to connect to servers. Please try again.'
    },
    error: 'Unable to connect to servers. Please try again.'
  })
}

function handleResponseUpdateCall(data: any) {
  if (!data) return

  if (data.token) localStorage.setItem('token', data.token)
  if (data.account) useAccount().value = data.account
  if (data.pos) usePosition().value = data.pos
  if (data.props) useProps().value = data.props
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
    handleResponseUpdateCall(res.data?.$update)
    if (res.data)
      delete res.data.$update
    return res
  } catch (ex) {
    return buildConnRefError()
  }
}

//

export const useApi = () => ({

  getBaseUrl,
  getSocketHost,
  getToken,

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
