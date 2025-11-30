import dayjs from 'dayjs/'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { Characters } from './const.ts'
import type { CharacterInfo, Result } from './types.ts'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

export function birthdayIdol(mmdd: string): Result | null {
  const bdCharacters = Characters.find((x) => x.birthday == mmdd)
  if (!bdCharacters) {
    return null
  }
  return {
    title: `Happy Birthday ${bdCharacters.name.split(' ').reverse()[0]}`,
    image: bdCharacters.image,
  }
}

export function randomIdol(alternativeList?: CharacterInfo[]): Result {
  const list = alternativeList ?? Characters.filter((x) => !x.isAprilOffer)
  const item = list[Math.floor(Math.random() * list.length)]
  return { title: `${item.name.replace(/ /g, '')}かわいい`, image: item.image }
}
