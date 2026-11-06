import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { registerUser } from '../register-server'

export const Route = createFileRoute('/register')({ component: Register })

function Register() {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setError('')
    setMessage('')
    setPending(true)

    try {
      const result = await registerUser({
        data: {
          login: form.get('login') as string,
          password: form.get('password') as string,
          fullname: form.get('fullname') as string,
          phone: form.get('phone') as string,
          email: form.get('email') as string,
        },
      })
      if (result.error) {
        setError(result.error)
      } else {
        setMessage('Пользователь зарегистрирован!')
        formElement.reset()
      }
    } catch {
      setError('Не удалось связаться с сервером.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="container form-page">
      <Link to="/" className="back-link">← На главную</Link>
      <section className="card">
        <h1>Регистрация</h1>
        <p>Все поля обязательны.</p>
        <form onSubmit={handleSubmit} onInvalid={(event) => {
          const input = event.target as HTMLInputElement
          setError(input.validationMessage)
          setMessage('')
        }}>
          <div className="field">
            <label htmlFor="login">Логин</label>
            <input id="login" name="login" type="text" minLength={6}
              pattern="[A-Za-z0-9]+" title="Латиница и цифры, минимум 6 символов" required />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div className="field">
            <label htmlFor="fullname">ФИО</label>
            <input id="fullname" name="fullname" type="text"
              pattern="[А-Яа-яЁё ]+" title="Кириллица и пробелы" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Телефон</label>
            <input id="phone" name="phone" type="tel" placeholder="8(999)123-45-67"
              pattern="8\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}"
              title="Формат: 8(999)123-45-67" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <p className="error" role="alert">{error}</p>
          <p className="success" role="status">{message}</p>
          <button className="button" type="submit" disabled={pending}>
            {pending ? 'Сохранение…' : 'Зарегистрироваться'}
          </button>
          <p className="form-link"><Link to="/login">Уже зарегистрированы? Войти</Link></p>
        </form>
      </section>
    </main>
  )
}

