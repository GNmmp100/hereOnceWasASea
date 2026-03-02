import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This shore does not exist.</p>
      <Link to="/" className="btn-back">Return to the beginning</Link>
    </div>
  )
}
