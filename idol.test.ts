import { assertEquals } from 'std/assert/mod.ts'
import { birthdayIdol } from './idol.ts'
import dayjs from 'dayjs/'

Deno.test('birthdayIdol 1', () => {
  const day = dayjs('2024-10-09T00:00:00+09:00')
  assertEquals(birthdayIdol(day)?.title, 'Happy Birthday 麻奈')
})

Deno.test('birthdayIdol 2', () => {
  const day = dayjs('2024-04-17T00:00:00+09:00')
  assertEquals(birthdayIdol(day)?.title, 'Happy Birthday 曜')
})

Deno.test('birthdayIdol 3', () => {
  const day = dayjs('2024-04-16T23:00:00+09:00')
  assertEquals(birthdayIdol(day)?.title, undefined)
})
