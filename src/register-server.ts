import { createServerFn } from '@tanstack/react-start'

export const registerUser = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    login: string
    password: string
    fullname: string
    phone: string
    email: string
  }) => data)
  .handler(async ({ data }) => {
    // Проверяем поля перед сохранением.
    if (!/^[A-Za-z0-9]{6,}$/.test(data.login)) {
      return { error: 'Логин: минимум 6 символов, только латиница и цифры.' }
    }
    if (data.password.length < 8) {
      return { error: 'Пароль должен содержать минимум 8 символов.' }
    }
    if (!/^[А-Яа-яЁё ]+$/.test(data.fullname) || !data.fullname.trim()) {
      return { error: 'ФИО должно содержать кириллицу и пробелы.' }
    }
    if (!/^8\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(data.phone)) {
      return { error: 'Телефон должен быть в формате 8(999)123-45-67.' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { error: 'Введите корректный email.' }
    }

    try {
      const { prisma } = await import('./db')
      const user = await prisma.user.findUnique({ where: { login: data.login } })
      if (user) return { error: 'Этот логин уже занят.' }

      // Учебный вариант, как в исходном репозитории.
      await prisma.user.create({ data })
      return { error: '' }
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        return { error: 'Этот логин уже занят.' }
      }
      return { error: 'Не удалось сохранить пользователя. Проверьте подключение к базе.' }
    }
  })
