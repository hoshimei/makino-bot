import {
  addIdToEnrollment,
  removeIdFromEnrollment,
  getEnrollmentUserIds,
} from './kv.ts'
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

export async function sendLeagueReminder(botToken: string, groupId: number) {
  console.log(`Fetch the list for group ${groupId}`)
  const userIds = await getEnrollmentUserIds(groupId)
  console.log(
    `Sending league reminder to group ${groupId}: ${userIds.join(',')}`
  )
  const titleText = "Don't forget to setup the League unit!"
  const mentionText = userIds
    .map((id, index) => `<a href="tg://user?id=${id}">${index + 1}</a>`)
    .join(', ')
  const footerText = 'To unenroll, use /unenroll in this group.'
  await sendMessage(
    botToken,
    groupId,
    [titleText, mentionText, footerText].join('<br>')
  )
}
