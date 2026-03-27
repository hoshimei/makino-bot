export async function addIdToEnrollment(
  userId: number,
  chatId: number,
  kv: KVNamespace,
): Promise<null> {
  const key = `enrollment:${chatId}`
  const currColl = ((await kv.get(key))?.value as number[]) ?? []
  if (currColl.includes(userId)) {
    throw Error('User already enrolled')
  }
  currColl.push(userId)
  await kv.put(key, JSON.stringify(currColl))
  return null
}

export async function removeIdFromEnrollment(
  userId: number,
  chatId: number,
  kv: KVNamespace,
): Promise<null> {
  const key = `enrollment:${chatId}`
  const currColl = ((await kv.get(key))?.value as number[]) ?? []
  if (!currColl.includes(userId)) {
    throw Error('User not enrolled')
  }
  await kv.put(key, JSON.stringify(currColl.filter((x) => x != userId)))
  return null
}

export async function getEnrollmentUserIds(
  chatId: number,
  kv: KVNamespace,
): Promise<number[]> {
  const key = `enrollment:${chatId}`
  const value = await kv.get(key)
  return value ? JSON.parse(value as string) : []
}
