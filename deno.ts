import { DefaultGroupId } from './const.ts'
import { sendLeagueReminder } from './league.ts'
import { handleRequest, updateMakino } from './util.ts'

Deno.cron('Do the Makino job', '0 * * * *', () => {
  const groupIds = Deno.env.get('GROUP_IDS')?.split(',') ??
    ([Deno.env.get('GROUP_ID')] as string[]) ?? [DefaultGroupId]
  const botToken = Deno.env.get('BOT_TOKEN')
  if (!botToken) {
    throw new Error('No bot token')
  }
  for (const i of groupIds) {
    updateMakino(botToken, i).catch(console.error)
  }
})

Deno.cron('Weekly League reminder', '0 0 * * 1', () => {
  const groupIds = Deno.env.get('GROUP_IDS')?.split(',') ??
    ([Deno.env.get('GROUP_ID')] as string[]) ?? [DefaultGroupId]
  const botToken = Deno.env.get('BOT_TOKEN')
  if (!botToken) {
    throw new Error('No bot token')
  }
  for (const i of groupIds) {
    sendLeagueReminder(botToken, Number(i)).catch(console.error)
  }
})

Deno.serve(handleRequest)
