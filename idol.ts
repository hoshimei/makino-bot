import dayjs from 'dayjs/'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { Characters } from './const.ts'
import type { Result } from './types.ts'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

export function birthdayIdol(): Result | null {
  const now = dayjs().tz('Asia/Tokyo')
  const mmdd = now.format('MM/DD')
  const bdCharacters = Characters.find((x) => x.birthday == mmdd)
  if (!bdCharacters) {
    return null
  }
  return {
    title: `Happy Birthday ${bdCharacters.name.split(' ').reverse()[0]}`,
    image: bdCharacters.image,
  }
}

export function randomIdol(): Result {
  const item = Characters[Math.floor(Math.random() * Characters.length)]
  return { title: `${item.name.replace(/ /g, '')}かわいい`, image: item.image }
}
