import dayjs from 'dayjs/'
import { AutoConfigPath, BotUsername, ImgBasePath } from './const.ts'
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

export async function updateMakino(botToken: string, groupId: string) {
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
  const { title, image } = result as Result
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
    // update the title
    await updateMakino(botToken, m.chat.id)
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

  const requestUrl = new URL(r.url)
  const pathname = requestUrl.pathname
  switch (pathname) {
    case AutoConfigPath: {
      await setupWebhook(botToken, requestUrl.origin + HookPath)
      break
    }
    case HookPath: {
      await handleUpdate(await r.json())
      break
    }
    default: {
      return new Response(null, {
        status: 404,
      })
    }
  }

  console.log('Setup completed.')
  return new Response(`Setup OK: ${requestUrl.origin}`, {
    status: 200,
  })
}
