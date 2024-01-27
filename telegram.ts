async function tg(
  botToken: string,
  path: string,
  formData?: FormData
): Promise<any> {
  const requestUrl = `https://api.telegram.org/bot${botToken}/${path}`
  const fetchBase =
    formData === undefined
      ? fetch(requestUrl)
      : fetch(requestUrl, {
          method: 'POST',
          body: formData,
        })
  return fetchBase
    .then((x) => x.json())
    .then((x) => {
      console.debug('TG request:', path)
      console.debug('TG response:', x)
      return x
    })
}

export function getChat(botToken: string, groupId: string): Promise<Chat> {
  return tg(botToken, `getChat?chat_id=${groupId}`).then((x) => {
    if (x.ok) {
      return x.result
    } else {
      throw new Error(x)
    }
  })
}

export function changeTitle(botToken: string, groupId: string, title: string) {
  return tg(
    botToken,
    `setChatTitle?chat_id=${groupId}&title=${encodeURIComponent(title)}`
  )
}

export function setupWebhook(
  botToken: string,
  url: string,
  secretToken: string
) {
  return tg(
    botToken,
    `setWebhook?url=${encodeURIComponent(
      url
    )}&secret_token=${encodeURIComponent(secretToken)}`
  )
}

export async function changeAvatar(
  botToken: string,
  groupId: string,
  avatarUrl: string
) {
  const photo = await fetch(avatarUrl).then((x) => x.blob())
  const formData = new FormData()
  formData.set('chat_id', groupId)
  formData.set('photo', photo)
  return tg(botToken, 'setChatPhoto', formData)
}

export async function deleteMessage(
  botToken: string,
  chatId: string,
  messageId: string
) {
  return tg(botToken, `deleteMessage?chat_id=${chatId}&message_id=${messageId}`)
}
