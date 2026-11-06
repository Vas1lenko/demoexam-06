import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Корочки.есть — онлайн-образование' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><HeadContent /></head>
      <body>
        <header className="site-header"><div className="container header-inner">
          <Link to="/" className="brand">Корочки.есть</Link>
          <nav className="header-nav"><Link to="/login" className="header-link">Вход</Link><Link to="/register" className="header-link">Регистрация</Link></nav>
        </div></header>
        {children}
        <footer>Корочки.есть · Дополнительное профессиональное образование</footer>
        <Scripts />
      </body>
    </html>
  )
}

