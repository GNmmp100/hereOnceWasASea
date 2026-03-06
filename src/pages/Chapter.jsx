import { useParams, Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import chapters from '../data/chapters'

export default function Chapter() {
  const { id } = useParams()
  const chapter = chapters.find((c) => c.id === Number(id))

  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
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
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  function skip(seconds) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
    setCurrentTime(audio.currentTime)
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

      {/* Top bar */}
      <div className="chapter-topbar">
        <Link to="/" className="chapter-topbar__back" aria-label="Back to home">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All chapters
        </Link>
        <div className="chapter-topbar__location">
          <svg width="11" height="13" viewBox="0 0 24 28" fill="currentColor">
            <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          {chapter.subtitle}
        </div>
      </div>

      {/* Title block */}
      <div className="chapter-title-block">
        <div className="chapter-title-block__rule" />
        <h1 className="chapter-title-block__title">{chapter.title}</h1>
        <div className="chapter-title-block__rule--bottom" />
      </div>

      {/* Image */}
      <div className="chapter-image-wrap">
        <img
          src={chapter.image}
          alt={chapter.title}
          className="chapter-image"
        />
      </div>

      {/* Player */}
      <div className="chapter-player">
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}${chapter.audio}`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />

        {/* Scrubber */}
        <div className="player-progress">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div
            className="player-scrubber"
            onClick={handleSeek}
            onTouchStart={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
          >
            <div className="player-track">
              <div className="player-fill" style={{ width: `${progress}%` }} />
              <div className="player-thumb" style={{ left: `${progress}%` }} />
            </div>
          </div>
          <span className="player-time player-time--right">
            {loaded ? formatTime(duration) : '--:--'}
          </span>
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button
            className="player-skip-btn"
            onClick={() => skip(-10)}
            aria-label="Skip back 10 seconds"
          >
            <SkipBackIcon />
            <span className="player-skip-btn__label">10</span>
          </button>

          <button
            className="player-play-btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            className="player-skip-btn"
            onClick={() => skip(10)}
            aria-label="Skip forward 10 seconds"
          >
            <SkipForwardIcon />
            <span className="player-skip-btn__label">10</span>
          </button>
        </div>
      </div>

      {/* Chapter navigation */}
      <nav className="chapter-nav" aria-label="Chapter navigation">
        {prev ? (
          <Link to={`/chapter/${prev.id}`} className="chapter-nav__link chapter-nav__link--prev">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ) : <div />}
      </nav>

    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="4" height="16" rx="1" />
      <rect x="15" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function SkipBackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  )
}

function SkipForwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-.49-4.5" />
    </svg>
  )
}
