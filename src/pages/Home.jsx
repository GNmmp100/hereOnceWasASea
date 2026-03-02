import { Link } from 'react-router-dom'
import chapters from '../data/chapters'

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header__eyebrow">An Audio Art Work</div>
        <h1 className="home-header__title">Here Once<br />Was A Sea</h1>
        <p className="home-header__description">
          The Aral Sea was once the fourth largest lake on Earth. Between 1960 and 2000,
          Soviet-era irrigation diverted the rivers that fed it. Today, 90% of its water is gone.
          This is a listening journey through what remains — and what does not.
        </p>
        <p className="home-header__instruction">
          Select a chapter below, or scan the QR code for each location.
        </p>
      </header>

      <nav className="chapter-list" aria-label="Chapters">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/chapter/${chapter.id}`}
            className="chapter-card"
          >
            <div className="chapter-card__image-wrap">
              <img
                src={chapter.image}
                alt={chapter.title}
                className="chapter-card__image"
                loading="lazy"
              />
              <div className="chapter-card__overlay" />
            </div>
            <div className="chapter-card__body">
              <span className="chapter-card__eyebrow">{chapter.subtitle}</span>
              <h2 className="chapter-card__title">{chapter.title}</h2>
            </div>
          </Link>
        ))}
      </nav>

      <footer className="home-footer">
        <p>Use headphones for the best experience.</p>
      </footer>
    </div>
  )
}
