import axios from "axios"
import { config } from "../index.js"


export function sendDiscordWebhook(title: string, message: string) {
  if (!config.notifications.discordWebhookUrl) return
  axios.post(config.notifications.discordWebhookUrl, {
    content: message,
    username: title
  }).catch(() => null)
}
