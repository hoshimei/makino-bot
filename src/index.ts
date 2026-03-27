import { DefaultGroupId } from './const'
import { sendLeagueReminder } from './league'
import { handleRequest, updateMakino } from './util'

export interface Env {
  MAKINO_KV: KVNamespace
  GROUP_IDS?: string
  GROUP_ID?: string
  BOT_TOKEN?: string
  SECURITY_TOKEN?: string
}

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    const groupIds =
      env.GROUP_IDS?.split(',') ??
      (env.GROUP_ID ? [env.GROUP_ID] : [DefaultGroupId])
    const botToken = env.BOT_TOKEN
    if (!botToken) {
      throw new Error('No bot token')
    }

    switch (event.cron) {
      case '0 * * * *': // Hourly - Do the Makino job
        for (const groupId of groupIds) {
          await updateMakino(botToken, groupId, false, env.MAKINO_KV).catch(
            console.error,
          )
        }
        break

      case '0 0 * * 2': // Monday at 00:00 - Weekly League reminder
        for (const groupId of groupIds) {
          await sendLeagueReminder(
            botToken,
            Number(groupId),
            env.MAKINO_KV,
          ).catch(console.error)
        }
        break
    }
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env)
  },
}
