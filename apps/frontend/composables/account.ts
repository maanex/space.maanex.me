

export type Account = {
  name: string
  sig: string
}

export const useAccount = () => useState<Account | null>('account', () => null)
