

export type Account = {
  name: string
  sig: string
  tos: boolean
}

export const useAccount = () => useState<Account | null>('account', () => ({
  name: '',
  sig: '',
  tos: false
}))
