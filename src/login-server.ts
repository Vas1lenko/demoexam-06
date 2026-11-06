import { createServerFn } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'

// Сессия запоминает вошедшего пользователя между запросами.
function getSession() {
  return useSession<{ userId: number; login: string }>({
    name: 'demo-session',
    password: process.env.SESSION_SECRET!,
    maxAge: 60 * 60 * 24,
    cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
  })
}

export const loginUser = createServerFn({ method: 'POST' })
  .inputValidator((data: { login: string; password: string }) => data)
  .handler(async ({ data }) => {
    if (!data.login.trim() || !data.password) {
      return { error: 'Введите логин и пароль.' }
    }

    try {
      const { prisma } = await import('./db')
      const user = await prisma.user.findUnique({ where: { login: data.login } })
      if (!user || user.password !== data.password) {
        return { error: 'Неверный логин или пароль.' }
      }

      const session = await getSession()
      await session.update({ userId: user.id, login: user.login })
      return { error: '' }
    } catch {
      return { error: 'Не удалось войти. Проверьте подключение к базе данных.' }
    }
  })

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session.data.userId) return null
  return { id: session.data.userId, login: session.data.login }
})

export const logoutUser = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await getSession()
  await session.clear()
})
