import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getCurrentUser, loginUser, logoutUser } from '../login-server'

export const Route = createFileRoute('/login')({
  component: Login,
  loader: () => getCurrentUser(),
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
})

function Login() {
  const user = Route.useLoaderData()
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = new FormData(event.currentTarget)
    setError('')
    setPending(true)
    try {
      const result = await loginUser({
        data: {
          login: form.get('login') as string,
          password: form.get('password') as string,
        },
      })
      if (result.error) setError(result.error)
      else await router.invalidate()
    } catch {
      setError('Не удалось связаться с сервером.')
    } finally {
      setPending(false)
    }
  }

  async function handleLogout() {
    setError('')
    setPending(true)
    try {
      await logoutUser()
      await router.invalidate()
    } catch {
      setError('Не удалось выйти. Попробуйте ещё раз.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="container form-page">
      <Link to="/" className="back-link">← На главную</Link>
      <section className="card">
        <h1>{user ? 'Вы вошли в аккаунт' : 'Вход'}</h1>
        {user ? (
          <div>
            <p>Ваш логин: {user.login}</p>
            <button className="button" onClick={handleLogout} disabled={pending}>Выйти</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} onInvalid={(event) => {
            const input = event.target as HTMLInputElement
            setError(input.validationMessage)
          }}>
            <div className="field">
              <label htmlFor="login">Логин</label>
              <input id="login" name="login" type="text" autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="password">Пароль</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <button className="button" type="submit" disabled={pending}>
              {pending ? 'Входим…' : 'Войти'}
            </button>
            <p className="form-link"><Link to="/register">Еще не зарегистрированы? Регистрация</Link></p>
          </form>
        )}
        <p className="error" role="alert">{error}</p>
      </section>
    </main>
  )
}
