import { encode, stringify } from 'querystring'
import Axios from 'axios'
import { config } from '../index'


/* eslint-disable camelcase */
export interface DiscordUserObject {
  id: string,
  username: string,
  avatar: string,
  discriminator: string,
  public_flags: number,
  flags: number,
  locale: string,
  mfa_enabled: boolean,
  email: string,
  verified: boolean
}

export interface GithubUserObject {
  login: string,
  id: number,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: false,
  name: string,
  company: string,
  blog: string,
  location: string,
  email: string,
  hireable: boolean,
  bio: string,
  twitter_username: string,
  public_repos: number,
  public_gists: number,
  followers: number,
  following: number,
  created_at: string,
  updated_at: string,
  private_gists: number,
  total_private_repos: number,
  owned_private_repos: number,
  disk_usage: number,
  collaborators: number,
  two_factor_authentication: boolean,
  plan?: {
    name: string,
    space: number,
    collaborators: number,
    private_repos: number
  },
  emails: {
    email: string,
    primary: boolean,
    verified: boolean
  }[]
}

export type UnifiedUserObject = {
  username: string,
  uuid: string,
  avatar?: string,
  locale?: string,
  email?: string,
  email_verified?: boolean,
  discord_id?: string,
  github_id?: number
} & (
  { platform: 'discord', discord_id: string, data: DiscordUserObject } |
  { platform: 'github', github_id: number, data: GithubUserObject }
)

export default class OAuthStrat {

  public static DISCORD_SCOPE = config.auth.requireEmail ? 'email identify' : 'identify'
  public static DISCORD_REDIRECT = config.auth.callbackUrl + '/discord'
  public static DISCORD_URL = 'https://discord.com/oauth2/authorize?' + encode({
    response_type: 'code',
    client_id: config.auth.discord.client_id,
    redirect_uri: OAuthStrat.DISCORD_REDIRECT,
    scope: OAuthStrat.DISCORD_SCOPE
  })

  public static GITHUB_SCOPE = config.auth.requireEmail ? 'read:user user:email' : 'read:user'
  public static GITHUB_REDIRECT = config.auth.callbackUrl + '/github'
  public static GITHUB_URL = 'https://github.com/login/oauth/authorize?' + encode({
    client_id: config.auth.github.client_id,
    redirect_uri: OAuthStrat.GITHUB_REDIRECT,
    scope: OAuthStrat.GITHUB_SCOPE
  })

  //

  public static async discordCallback(code: string): Promise<UnifiedUserObject | { error: string }> {
    const { data, status } = await Axios.post('https://discord.com/api/oauth2/token', stringify({
      client_id: config.auth.discord.client_id,
      client_secret: config.auth.discord.client_secret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.DISCORD_REDIRECT
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    })

    if (status !== 200)
      return { error: 'bad_code' }

    const { data: user, status: status2 }: { data: DiscordUserObject, status: number } = await Axios.get('https://discordapp.com/api/v8/users/@me', {
      headers: {
        Authorization: `${data.token_type} ${data.access_token}`
      },
      validateStatus: () => true
    })

    if (status2 !== 200)
      return { error: 'bad_gateway' }

    if (config.auth.requireEmail && !user.email)
      return { error: 'no_email' }
    if (config.auth.requireEmail && !user.verified)
      return { error: 'unverified' }

    const out: UnifiedUserObject = {
      username: user.username,
      uuid: `discord:${user.id}`,
      avatar: user.avatar,
      locale: user.locale,
      email: user.email ?? '',
      email_verified: user.verified ?? false,
      platform: 'discord',
      discord_id: user.id,
      data: user
    }

    return out
  }

  public static async githubCallback(code: string): Promise<UnifiedUserObject | { error: string }> {
    const { data, status } = await Axios.post('https://github.com/login/oauth/access_token', {
      client_id: config.auth.github.client_id,
      client_secret: config.auth.github.client_secret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.GITHUB_REDIRECT
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      validateStatus: () => true
    })

    if (status !== 200)
      return { error: 'bad_code' }

    const { data: user, status: status2 }: { data: GithubUserObject, status: number } = await Axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `${data.token_type} ${data.access_token}`
      },
      validateStatus: () => true
    })

    if (status2 !== 200)
      return { error: 'bad_gateway' }

    if (config.auth.requireEmail) {
      const { data: emails, status: status3 } = await Axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `${data.token_type} ${data.access_token}`
        },
        validateStatus: () => true
      })

      if (status3 !== 200)
        return { error: 'bad_gateway' }

      user.emails = emails
      const primary = user.emails.find(e => e.primary)
      if (!primary.email)
        return { error: 'no_email' }
      if (!primary.verified)
        return { error: 'unverified' }
    }

    const out: UnifiedUserObject = {
      username: user.login || user.name,
      uuid: `github:${user.id}`,
      avatar: user.avatar_url,
      locale: null,
      email: user.emails?.find(e => e.primary).email ?? '',
      email_verified: user.emails?.find(e => e.primary).verified ?? false,
      platform: 'github',
      github_id: user.id,
      data: user
    }

    return out
  }

}