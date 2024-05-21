export async function addIdToEnrollment(userId: number, chatId: number) {
  const kv = await Deno.openKv()
  const key = [chatId]
  const currColl = ((await kv.get(key)).value as number[]) ?? []
  if (currColl.includes(userId)) {
    throw Error('User already enrolled')
  }
  currColl.push(userId)
  await kv.set(key, currColl)
  return null
}

export async function removeIdFromEnrollment(userId: number, chatId: number) {
  const kv = await Deno.openKv()
  const key = [chatId]
  const currColl = ((await kv.get(key)).value as number[]) ?? []
  if (!currColl.includes(userId)) {
    throw Error('User not enrolled')
  }
  await kv.set(
    key,
    currColl.filter((x) => x != userId)
  )
  return null
}
