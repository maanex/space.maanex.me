

export type Account = {
  name: string
}

export const useAccount = () => useState<Account | null>('account', () => null)
