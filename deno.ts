import { DefaultGroupId } from './const.ts'
import { handleRequest, updateMakino } from './util.ts'

Deno.cron('Do the Makino job', '0 * * * *', () => {
  const groupIds = Deno.env.get('GROUP_IDS')?.split(',') ?? [
      Deno.env.get('GROUP_ID'),
    ] ?? [DefaultGroupId]
  const botToken = Deno.env.get('BOT_TOKEN')
  if (!botToken) {
    throw new Error('No bot token')
  }
  for (const i of groupIds) {
    updateMakino(botToken, i)
  }
})

Deno.serve(handleRequest)
