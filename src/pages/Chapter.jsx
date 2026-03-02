import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import chapters from '../data/chapters'

export default function Chapter() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chapter = chapters.find((c) => c.id === Number(id))

  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Reset state when chapter changes
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setLoaded(false)
  }, [id])

  if (!chapter) {
    return (
      <div className="not-found">
        <p>Chapter not found.</p>
        <Link to="/" className="btn-back">Return home</Link>
      </div>
    )
  }

  const prev = chapters.find((c) => c.id === chapter.id - 1)
  const next = chapters.find((c) => c.id === chapter.id + 1)

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime)
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration)
    setLoaded(true)
  }

  function handleEnded() {
    setPlaying(false)
    setCurrentTime(0)
  }

  function handleSeek(e) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    audio.currentTime = ratio * duration
    setCurrentTime(audio.currentTime)
  }

  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="chapter-page">
      {/* Hero image */}
      <div className="chapter-hero">
        <img
          src={chapter.image}
          alt={chapter.title}
          className="chapter-hero__image"
        />
        <div className="chapter-hero__gradient" />
        <Link to="/" className="chapter-hero__back" aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All chapters
        </Link>
        <div className="chapter-hero__text">
          <span className="chapter-hero__eyebrow">{chapter.subtitle}</span>
          <h1 className="chapter-hero__title">{chapter.title}</h1>
        </div>
      </div>

      {/* Description */}
      <div className="chapter-content">
        <p className="chapter-description">{chapter.description}</p>

        {/* Audio player */}
        <div className="audio-player">
          <audio
            ref={audioRef}
            src={chapter.audio}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="metadata"
          />

          {/* Play / pause button */}
          <button
            className={`audio-player__play-btn ${playing ? 'audio-player__play-btn--playing' : ''}`}
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              /* Pause icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              /* Play icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Scrubber + times */}
          <div className="audio-player__right">
            <div
              className="audio-player__scrubber"
              onClick={handleSeek}
              onTouchStart={handleSeek}
              role="slider"
              aria-label="Seek"
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
            >
              <div className="audio-player__track">
                <div
                  className="audio-player__fill"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="audio-player__thumb"
                  style={{ left: `${progress}%` }}
                />
              </div>
            </div>
            <div className="audio-player__times">
              <span>{formatTime(currentTime)}</span>
              <span>{loaded ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Chapter navigation */}
        <nav className="chapter-nav" aria-label="Chapter navigation">
          {prev ? (
            <Link to={`/chapter/${prev.id}`} className="chapter-nav__link chapter-nav__link--prev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>
                <small>Previous</small>
                {prev.title}
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/chapter/${next.id}`} className="chapter-nav__link chapter-nav__link--next">
              <span>
                <small>Next</small>
                {next.title}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </div>
  )
}
