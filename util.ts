import dayjs from 'dayjs/'
import {
  AutoConfigPath,
  BotUsername,
  Characters,
  DebugGroupId,
  ImgBasePath,
} from './const.ts'
import type { Result } from './types.ts'
import { birthdayIdol, randomIdol } from './idol.ts'
import {
  changeAvatar,
  changeTitle,
  deleteMessage,
  getChat,
  setupWebhook,
} from './telegram.ts'
import { HookPath } from './const.ts'

export async function updateMakino(
  botToken: string,
  groupId: string,
  debugIndex?: number
) {
  const lastChat = await getChat(botToken, groupId)
  const lastTitle = lastChat.title
  const now = dayjs()
  let result = birthdayIdol(now)
  if (result && lastTitle == result.title) {
    return
  }
  if (result === null) {
    for (let i = 0; i < 5; i++) {
      result = randomIdol()
      if (result.title !== lastTitle) break
    }
  }
  let { title, image } = result as Result
  if (debugIndex) {
    const debugItem = Characters[debugIndex]
    title = `D+${debugItem.name}`
    image = debugItem.image
  }
  console.log(`Updating chat ${groupId} to ${title}`)
  await Promise.all([
    changeTitle(botToken, groupId, title),
    changeAvatar(botToken, groupId, ImgBasePath + image),
  ])
}

async function handleMessage(m: any) {
  const botToken = Deno.env.get('BOT_TOKEN') ?? ''

  if (m.from.username === BotUsername) {
    // clean up bot's own message
    await deleteMessage(botToken, m.chat.id, m.message_id)
    return
  }

  if (m.text && m.text.startsWith('/change_title')) {
    const debugIndex =
      m?.chat?.id === DebugGroupId
        ? Number(m.text.match(/d\+(\d+)/)?.[1])
        : undefined
    // update the title
    await updateMakino(botToken, m.chat.id, debugIndex)
    return
  }
}

async function handleUpdate(u: any) {
  if (u.message) {
    console.log('Handling message:', u.message)
    await handleMessage(u.message)
  }
}

export async function handleRequest(r: Request): Promise<Response> {
  const botToken = Deno.env.get('BOT_TOKEN')
  if (!botToken) {
    return new Response('No bot token', { status: 500 })
  }

  const secToken = Deno.env.get('SECURITY_TOKEN') ?? ''

  const requestUrl = new URL(r.url)
  const pathname = requestUrl.pathname
  switch (pathname) {
    case AutoConfigPath: {
      if (secToken) {
        const requestAuthToken =
          r.headers.get('Authorization')?.replace('Bearer ', '') ??
          requestUrl.searchParams.get('key')
        if (requestAuthToken !== secToken) {
          return new Response('Bad token', {
            status: 403,
          })
        }
      }
      await setupWebhook(botToken, requestUrl.origin + HookPath, secToken)
      console.log('Setup completed.')
      return new Response(`Setup OK: ${requestUrl.origin}`, {
        status: 200,
      })
    }
    case HookPath: {
      if (r.method !== 'POST') {
        return new Response(null, { status: 405 })
      }
      if (
        secToken !== '' &&
        r.headers.get('X-Telegram-Bot-Api-Secret-Token') !== secToken
      ) {
        return new Response(null, { status: 403 })
      }
      await handleUpdate(await r.json()).catch((e) => {
        console.error('Handleing update:', e)
      })
      return new Response('ok', { status: 200 })
    }
  }
  return new Response(null, {
    status: 404,
  })
}
