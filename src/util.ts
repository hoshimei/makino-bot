import dayjs from 'dayjs'
import dayjsTimezone from 'dayjs/plugin/timezone'
import {
  AutoConfigPath,
  BotUsername,
  Characters,
  DebugGroupId,
  ImgBasePath,
} from './const'
import type { Result } from './types'
import { birthdayIdol, randomIdol } from './idol'
import {
  changeAvatar,
  changeTitle,
  deleteMessage,
  getChat,
  sendMessage,
  setupWebhook,
} from './telegram'
import { HookPath } from './const'
import {
  enrollLeagueAlert,
  sendLeagueReminder,
  unenrollLeagueAlert,
} from './league'

dayjs.extend(dayjsTimezone)

export async function updateMakino(
  botToken: string,
  groupId: string,
  forced: boolean,
  kv: KVNamespace,
  debugIndex?: number,
) {
  const lastChat = await getChat(botToken, groupId)
  const lastTitle = lastChat.title
  const now = dayjs().tz('Asia/Tokyo')
  const mmdd = now.format('MM/DD')
  let result = specialDateOffer(mmdd) ?? birthdayIdol(mmdd)
  if (result && lastTitle == result.title) {
    if (forced) {
      // Don't update title but try to update image
      const { image } = result
      await Promise.all([changeAvatar(botToken, groupId, ImgBasePath + image)])
    }
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

async function handleMessage(m: any, env: any) {
  const botToken = env.BOT_TOKEN ?? ''

  if (m.from.username === BotUsername) {
    // clean up bot's own message
    await deleteMessage(botToken, m.chat.id, m.message_id)
    return
  }

  if (m.text && m.text.startsWith('/change_title')) {
    const debugIndex =
      String(m?.chat?.id) === DebugGroupId
        ? Number(m.text.match(/d\+(\d+)/)?.[1])
        : undefined
    // update the title
    await updateMakino(botToken, m.chat.id, true, env.MAKINO_KV, debugIndex)
    return
  }

  if (m.text && m.text.startsWith('/enroll')) {
    await enrollLeagueAlert(
      botToken,
      m.message_id,
      m.chat.id,
      m.from,
      env.MAKINO_KV,
    )
    return
  }

  if (m.text && m.text.startsWith('/unenroll')) {
    await unenrollLeagueAlert(
      botToken,
      m.message_id,
      m.chat.id,
      m.from,
      env.MAKINO_KV,
    )
    return
  }

  if (m.chat.title.includes('#test')) {
    if (m.text && m.text.startsWith('/debug_reminder')) {
      await sendLeagueReminder(botToken, m.chat.id, env.MAKINO_KV)
      return
    }

    if (m.text && m.text.startsWith('/id')) {
      await sendMessage(
        botToken,
        m.chat.id,
        `Chat ID: ${m.chat.id}\nUser ID: ${m.from.id}`,
        m.message_id,
      )
      return
    }
  }
}

async function handleUpdate(u: any, env: any) {
  if (u.message) {
    console.log('Handling message:', u.message)
    await handleMessage(u.message, env)
  }
}

export async function handleRequest(r: Request, env: any): Promise<Response> {
  const botToken = env.BOT_TOKEN
  if (!botToken) {
    return new Response('No bot token', { status: 500 })
  }

  const secToken = env.SECURITY_TOKEN ?? ''
  if (!secToken) {
    return new Response('No sec token', { status: 500 })
  }

  const requestUrl = new URL(r.url)
  const pathname = requestUrl.pathname
  switch (pathname) {
    case AutoConfigPath: {
      const requestAuthToken =
        r.headers.get('Authorization')?.replace('Bearer ', '') ??
        requestUrl.searchParams.get('key')
      if (requestAuthToken !== secToken) {
        return new Response('Bad token', {
          status: 403,
        })
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
      await handleUpdate(await r.json(), env).catch((e) => {
        console.error('Handleing update:', e)
      })
      return new Response('ok', { status: 200 })
    }
  }
  return new Response(null, {
    status: 404,
  })
}

function specialDateOffer(date: string): Result | null {
  switch (date) {
    case '04/01': {
      return randomIdol(Characters.filter((x) => x.isAprilOffer))
    }
  }

  return null
}
