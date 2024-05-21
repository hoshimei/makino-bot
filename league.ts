import { addIdToEnrollment, removeIdFromEnrollment } from './kv.ts'
import { sendMessage } from './telegram.ts'
import type { User } from './types.ts'

export async function enrollLeagueAlert(
  botToken: string,
  messageId: number,
  chatId: number,
  user: User
) {
  const ret = await addIdToEnrollment(user.id, chatId).catch((x) => String(x))
  const message = ret ?? 'Done.'
  await sendMessage(botToken, chatId, message, messageId)
}

export async function unenrollLeagueAlert(
  botToken: string,
  messageId: number,
  chatId: number,
  user: User
) {
  const ret = await removeIdFromEnrollment(user.id, chatId).catch((x) =>
    String(x)
  )
  const message = ret ?? 'Done.'
  await sendMessage(botToken, chatId, message, messageId)
}
