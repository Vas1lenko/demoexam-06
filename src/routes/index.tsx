import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const slides = [
  { src: '/slider/image06.jpg', alt: 'Изображение образовательного портала — слайд 1' },
  { src: '/slider/image07.jpg', alt: 'Изображение образовательного портала — слайд 2' },
  { src: '/slider/image08.webp', alt: 'Изображение образовательного портала — слайд 3' },
  { src: '/slider/image09.webp', alt: 'Изображение образовательного портала — слайд 4' },
]

function Home() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 3000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="container home-page">
      <section className="intro">
        <p className="eyebrow">Дополнительное профессиональное образование</p>
        <h1>Новые знания.<br />Новые возможности.</h1>
        <p className="muted">Корочки.есть — ваш первый шаг к освоению новой профессии. Программирование, веб-дизайн и базы данных.</p>
        <Link to="/register" className="button">Создать аккаунт</Link>
      </section>
      <section className="slider" aria-label="Образовательный портал: 4 слайда" aria-roledescription="карусель">
        <img src={slides[current].src} alt={slides[current].alt} width="1000" height="480" />
        <div className="slider-controls">
          <button type="button" aria-label="Предыдущий слайд" onClick={() => setCurrent((index) => (index - 1 + slides.length) % slides.length)}>←</button>
          <span>{current + 1} / {slides.length}</span>
          <button type="button" aria-label="Следующий слайд" onClick={() => setCurrent((index) => (index + 1) % slides.length)}>→</button>
        </div>
      </section>
      <section className="courses" aria-label="Направления обучения">
        {['Основы алгоритмизации и программирования', 'Основы веб-дизайна', 'Основы проектирования баз данных'].map((course, index) => (
          <article className="course" key={course}><span className="eyebrow">0{index + 1}</span><h2>{course}</h2></article>
        ))}
      </section>
    </main>
  )
}
